from __future__ import annotations

import os
import secrets
import sqlite3
from datetime import date, datetime, timedelta, timezone
from pathlib import Path
from zoneinfo import ZoneInfo

from fastapi import Cookie, Depends, FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, field_validator

DB = Path("eblock.db")
SESSION_COOKIE = "eblock_session"
SESSION_DAYS = 30

app = FastAPI(title="E-block API", version="1.3.0")
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def now() -> datetime:
    return datetime.now(timezone.utc)


def business_today() -> date:
    return datetime.now(ZoneInfo("America/Bogota")).date()


def con() -> sqlite3.Connection:
    connection = sqlite3.connect(DB)
    connection.row_factory = sqlite3.Row
    return connection



def init_database() -> None:
    connection = con()
    connection.executescript(
        """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            username TEXT UNIQUE,
            password TEXT NOT NULL,
            role TEXT NOT NULL,
            name TEXT NOT NULL,
            cedula TEXT UNIQUE
        );
        CREATE TABLE IF NOT EXISTS kitchen_reservations (
            id INTEGER PRIMARY KEY,
            user_id INTEGER NOT NULL,
            starts_at TEXT NOT NULL,
            ends_at TEXT NOT NULL,
            status TEXT NOT NULL,
            FOREIGN KEY(user_id) REFERENCES users(id)
        );
        CREATE TABLE IF NOT EXISTS sessions (
            token TEXT PRIMARY KEY,
            user_id INTEGER NOT NULL,
            expires_at TEXT NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY(user_id) REFERENCES users(id)
        );
        CREATE TABLE IF NOT EXISTS activity (
            id INTEGER PRIMARY KEY,
            user_id INTEGER NOT NULL,
            event_type TEXT NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY(user_id) REFERENCES users(id)
        );
        CREATE TABLE IF NOT EXISTS rent_status (
            id INTEGER PRIMARY KEY,
            user_id INTEGER UNIQUE NOT NULL,
            amount_cop INTEGER NOT NULL,
            due_date TEXT NOT NULL,
            status TEXT NOT NULL,
            FOREIGN KEY(user_id) REFERENCES users(id)
        );
        CREATE TABLE IF NOT EXISTS payment_settings (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            bancolombia_account TEXT,
            nequi_number TEXT
        );
        CREATE TABLE IF NOT EXISTS machines (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL UNIQUE,
            state TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS reservations (
            id INTEGER PRIMARY KEY,
            user_id INTEGER NOT NULL,
            machine_id INTEGER NOT NULL,
            starts_at TEXT NOT NULL,
            ends_at TEXT NOT NULL,
            status TEXT NOT NULL,
            FOREIGN KEY(user_id) REFERENCES users(id),
            FOREIGN KEY(machine_id) REFERENCES machines(id)
        );
        CREATE TABLE IF NOT EXISTS laundry_bundles (
            id INTEGER PRIMARY KEY,
            user_id INTEGER NOT NULL,
            starts_at TEXT NOT NULL,
            ends_at TEXT NOT NULL,
            status TEXT NOT NULL,
            amount_cop INTEGER NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY(user_id) REFERENCES users(id)
        );
        CREATE TABLE IF NOT EXISTS laundry_bundle_resources (
            bundle_id INTEGER NOT NULL,
            machine_id INTEGER NOT NULL,
            PRIMARY KEY(bundle_id, machine_id),
            FOREIGN KEY(bundle_id) REFERENCES laundry_bundles(id) ON DELETE CASCADE,
            FOREIGN KEY(machine_id) REFERENCES machines(id)
        );
        CREATE INDEX IF NOT EXISTS idx_laundry_bundle_time ON laundry_bundles(starts_at, ends_at);
        CREATE INDEX IF NOT EXISTS idx_laundry_bundle_resource ON laundry_bundle_resources(machine_id, bundle_id);
        """
    )
    # Migration for databases created by the first local prototype.
    columns = {row["name"] for row in connection.execute("PRAGMA table_info(users)")}
    if "cedula" not in columns:
        connection.execute("ALTER TABLE users ADD COLUMN cedula TEXT")
    if "floor" not in columns:
        connection.execute("ALTER TABLE users ADD COLUMN floor INTEGER")
    if "room" not in columns:
        connection.execute("ALTER TABLE users ADD COLUMN room TEXT")

    connection.execute(
        "INSERT OR IGNORE INTO users(id, username, password, role, name, cedula) VALUES(1, ?, ?, ?, ?, ?)",
        ("diana", "not-used", "ADMINISTRADOR", "Diana", "1034657946"),
    )
    connection.execute(
        "INSERT OR IGNORE INTO users(id, username, password, role, name, cedula) VALUES(2, ?, ?, ?, ?, ?)",
        ("residente", "not-used", "RESIDENTE", "Residente", "1034657945"),
    )
    connection.execute("UPDATE users SET cedula = ? WHERE id = 1", ("1034657946",))
    connection.execute("UPDATE users SET cedula = ? WHERE id = 2", ("1034657945",))
    connection.execute("UPDATE users SET name = ? WHERE id = 1", ("Diana",))
    connection.execute("UPDATE users SET name = ? WHERE id = 2", ("Residente",))
    connection.execute("UPDATE users SET floor = ?, room = ? WHERE id = 2", (3, "304"))
    connection.execute(
        "INSERT OR IGNORE INTO rent_status(user_id, amount_cop, due_date, status) VALUES(2, 500000, ?, 'PENDIENTE')",
        (now().date().replace(day=5).isoformat(),),
    )
    # The earliest prototype had no unique constraint on machine names.
    connection.execute("DELETE FROM machines WHERE id NOT IN (SELECT MIN(id) FROM machines GROUP BY name)")
    connection.execute("CREATE UNIQUE INDEX IF NOT EXISTS idx_machines_name ON machines(name)")
    for machine in ("Lavadora 1", "Lavadora 2", "Secadora"):
        connection.execute(
            "INSERT OR IGNORE INTO machines(name, state) VALUES(?, 'DISPONIBLE')", (machine,)
        )
    # Reservations created before the bundle model remain in the legacy table and are
    # included in availability/history below. The old demo-only rows are replaced by
    # idempotent 90-minute bundle seeds, so a preview never shows duplicate bookings.
    demo_day = business_today().isoformat()
    demo_starts = tuple(f"{demo_day}T{slot}:00" for slot in ("08:00", "11:00", "14:00"))
    placeholders = ", ".join("?" for _ in demo_starts)
    connection.execute(
        f"DELETE FROM reservations WHERE user_id = 2 AND status = 'PENDIENTE' AND starts_at IN ({placeholders})",
        demo_starts,
    )
    washer = connection.execute("SELECT id FROM machines WHERE name = 'Lavadora 1'").fetchone()
    dryer = connection.execute("SELECT id FROM machines WHERE name = 'Secadora'").fetchone()
    for starts_at in demo_starts:
        existing = connection.execute(
            "SELECT id FROM laundry_bundles WHERE starts_at = ? AND status != 'CANCELADA'",
            (starts_at,),
        ).fetchone()
        if not existing:
            starts = datetime.fromisoformat(starts_at)
            cursor = connection.execute(
                "INSERT INTO laundry_bundles(user_id, starts_at, ends_at, status, amount_cop, created_at) VALUES(?, ?, ?, 'PENDIENTE', ?, ?)",
                (2, starts.isoformat(), (starts + timedelta(minutes=90)).isoformat(), 10000, now().isoformat()),
            )
            connection.executemany(
                "INSERT INTO laundry_bundle_resources(bundle_id, machine_id) VALUES(?, ?)",
                ((cursor.lastrowid, washer["id"]), (cursor.lastrowid, dryer["id"])),
            )
    connection.commit()
    connection.close()


init_database()


class LoginRequest(BaseModel):
    cedula: str

    @field_validator("cedula")
    @classmethod
    def validate_cedula(cls, value: str) -> str:
        clean = "".join(character for character in value if character.isdigit())
        if not 7 <= len(clean) <= 12:
            raise ValueError("Ingresá una cédula válida.")
        return clean


class ReservationRequest(BaseModel):
    machine_id: int
    starts_at: str
    ends_at: str


class LaundryBundleRequest(BaseModel):
    starts_at: str


def profile(row: sqlite3.Row) -> dict[str, str | int]:
    return {
        "id": row["id"],
        "cedula": row["cedula"],
        "role": row["role"],
        "name": row["name"],
    }


def current_user(eblock_session: str | None = Cookie(default=None)) -> dict[str, str | int]:
    if not eblock_session:
        raise HTTPException(status_code=401, detail="Sesión requerida.")
    connection = con()
    row = connection.execute(
        """
        SELECT users.id, users.cedula, users.role, users.name, sessions.expires_at
        FROM sessions JOIN users ON users.id = sessions.user_id
        WHERE sessions.token = ?
        """,
        (eblock_session,),
    ).fetchone()
    if not row:
        connection.close()
        raise HTTPException(status_code=401, detail="Sesión requerida.")
    if datetime.fromisoformat(row["expires_at"]) <= now():
        connection.execute("DELETE FROM sessions WHERE token = ?", (eblock_session,))
        connection.commit()
        connection.close()
        raise HTTPException(status_code=401, detail="Tu sesión venció. Ingresá de nuevo.")
    connection.close()
    return profile(row)


def require_admin(user: dict[str, str | int]) -> None:
    if user["role"] != "ADMINISTRADOR":
        raise HTTPException(status_code=403, detail="No tenés permiso para consultar este panel.")


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/auth/login")
def login(payload: LoginRequest, response: Response) -> dict[str, dict[str, str | int]]:
    connection = con()
    row = connection.execute(
        "SELECT id, cedula, role, name FROM users WHERE cedula = ?", (payload.cedula,)
    ).fetchone()
    if not row:
        connection.close()
        raise HTTPException(status_code=401, detail="No encontramos una cuenta con esa cédula.")

    token = secrets.token_urlsafe(32)
    expires_at = now() + timedelta(days=SESSION_DAYS)
    connection.execute(
        "INSERT INTO sessions(token, user_id, expires_at, created_at) VALUES(?, ?, ?, ?)",
        (token, row["id"], expires_at.isoformat(), now().isoformat()),
    )
    connection.execute(
        "INSERT INTO activity(user_id, event_type, created_at) VALUES(?, 'LOGIN', ?)",
        (row["id"], now().isoformat()),
    )
    connection.commit()
    connection.close()
    response.set_cookie(
        key=SESSION_COOKIE,
        value=token,
        httponly=True,
        samesite="lax",
        max_age=SESSION_DAYS * 24 * 60 * 60,
        secure=os.getenv("APP_ENV") == "production",
    )
    return {"user": profile(row)}


@app.get("/api/auth/me")
def me(user: dict[str, str | int] = Depends(current_user)) -> dict[str, dict[str, str | int]]:
    return {"user": user}


@app.post("/api/auth/logout")
def logout(response: Response, eblock_session: str | None = Cookie(default=None)) -> dict[str, bool]:
    if eblock_session:
        connection = con()
        session = connection.execute("SELECT user_id FROM sessions WHERE token = ?", (eblock_session,)).fetchone()
        connection.execute("DELETE FROM sessions WHERE token = ?", (eblock_session,))
        if session:
            connection.execute(
                "INSERT INTO activity(user_id, event_type, created_at) VALUES(?, 'LOGOUT', ?)",
                (session["user_id"], now().isoformat()),
            )
        connection.commit()
        connection.close()
    response.delete_cookie(SESSION_COOKIE)
    return {"ok": True}


@app.get("/api/rent/status")
def rent_status(user: dict[str, str | int] = Depends(current_user)) -> dict[str, object]:
    connection = con()
    rent = connection.execute(
        "SELECT amount_cop, due_date, status FROM rent_status WHERE user_id = ?", (user["id"],)
    ).fetchone()
    settings = connection.execute(
        "SELECT bancolombia_account, nequi_number FROM payment_settings WHERE id = 1"
    ).fetchone()
    connection.close()
    if not rent:
        return {"status": "SIN_REGISTRO", "payment_link_status": "PROXIMAMENTE", "methods": []}
    return {
        "status": rent["status"],
        "amount_cop": rent["amount_cop"],
        "due_date": rent["due_date"],
        "payment_link_status": "PROXIMAMENTE",
        "methods": [
            {
                "type": "BANCLOMBIA",
                "label": "Cuenta Bancolombia",
                "value": settings["bancolombia_account"] if settings and settings["bancolombia_account"] else "Pendiente de configurar por administración",
            },
            {
                "type": "NEQUI",
                "label": "Nequi",
                "value": settings["nequi_number"] if settings and settings["nequi_number"] else "Pendiente de configurar por administración",
            },
        ],
    }


@app.get("/api/dashboard")
def dashboard(user: dict[str, str | int] = Depends(current_user)) -> dict[str, object]:
    require_admin(user)
    return {
        "dayStats": {"paidRent": 32, "pendingPayments": 18, "laundryToday": 24, "openReports": 5},
        "floors": [{"floor": floor, "rooms": 10, "paid": 10 - floor} for floor in range(1, 5)],
    }


@app.get("/api/laundry/machines")
def machines(user: dict[str, str | int] = Depends(current_user)) -> dict[str, list[dict[str, object]]]:
    connection = con()
    rows = connection.execute("SELECT id, name, state FROM machines ORDER BY id").fetchall()
    connection.close()
    return {"data": [dict(row) for row in rows]}


@app.get("/api/kitchen/availability")
def kitchen_availability(day: str, user: dict[str, str | int] = Depends(current_user)) -> dict[str, object]:
    try:
        selected_day = date.fromisoformat(day)
    except ValueError as error:
        raise HTTPException(status_code=422, detail="La fecha debe tener formato AAAA-MM-DD.") from error
    if selected_day < business_today() or selected_day > business_today() + timedelta(days=6):
        raise HTTPException(status_code=422, detail="Elegí un día de esta semana.")
    connection = con()
    rows = connection.execute(
        "SELECT starts_at FROM kitchen_reservations WHERE starts_at >= ? AND starts_at < ? AND status != 'CANCELADA'",
        (selected_day.isoformat(), (selected_day + timedelta(days=1)).isoformat()),
    ).fetchall()
    connection.close()
    return {"day": selected_day.isoformat(), "slots": [f"{hour:02d}:00" for hour in range(8, 21)], "booked": [datetime.fromisoformat(row["starts_at"]).strftime("%H:%M") for row in rows]}


@app.get("/api/kitchen/reservations")
def kitchen_history(user: dict[str, str | int] = Depends(current_user)) -> dict[str, list[dict[str, object]]]:
    connection = con()
    query = "SELECT kitchen_reservations.id, kitchen_reservations.starts_at, kitchen_reservations.ends_at, kitchen_reservations.status, users.name AS resident_name FROM kitchen_reservations JOIN users ON users.id = kitchen_reservations.user_id"
    params: tuple[object, ...] = ()
    if user["role"] != "ADMINISTRADOR":
        query += " WHERE kitchen_reservations.user_id = ?"
        params = (user["id"],)
    query += " ORDER BY kitchen_reservations.starts_at DESC"
    rows = connection.execute(query, params).fetchall()
    connection.close()
    return {"data": [dict(row) for row in rows]}


@app.post("/api/kitchen/reservations", status_code=201)
def reserve_kitchen(payload: ReservationRequest, user: dict[str, str | int] = Depends(current_user)) -> dict[str, object]:
    if user["role"] != "RESIDENTE":
        raise HTTPException(status_code=403, detail="Sólo residentes pueden reservar.")
    connection = con()
    conflict = connection.execute("SELECT 1 FROM kitchen_reservations WHERE status != 'CANCELADA' AND starts_at < ? AND ends_at > ?", (payload.ends_at, payload.starts_at)).fetchone()
    if conflict:
        connection.close()
        raise HTTPException(status_code=409, detail="Ese horario de cocina ya no está disponible.")
    cursor = connection.execute("INSERT INTO kitchen_reservations(user_id, starts_at, ends_at, status) VALUES(?, ?, ?, 'RESERVADA')", (user["id"], payload.starts_at, payload.ends_at))
    connection.commit()
    reservation_id = cursor.lastrowid
    connection.close()
    return {"id": reservation_id, "status": "RESERVADA"}


@app.get("/api/laundry/availability")
def laundry_availability(day: str, user: dict[str, str | int] = Depends(current_user)) -> dict[str, object]:
    try:
        selected_day = date.fromisoformat(day)
    except ValueError as error:
        raise HTTPException(status_code=422, detail="La fecha debe tener formato AAAA-MM-DD.") from error
    if selected_day < business_today() or selected_day > business_today() + timedelta(days=6):
        raise HTTPException(status_code=422, detail="Elegí un día de esta semana.")

    day_start = datetime.combine(selected_day, datetime.min.time())
    day_end = day_start + timedelta(days=1)
    connection = con()
    bundles = connection.execute(
        """
        SELECT laundry_bundles.starts_at, laundry_bundles.ends_at
        FROM laundry_bundles
        WHERE laundry_bundles.status != 'CANCELADA'
          AND laundry_bundles.starts_at < ? AND laundry_bundles.ends_at > ?
        """,
        (day_end.isoformat(), day_start.isoformat()),
    ).fetchall()
    legacy = connection.execute(
        """
        SELECT starts_at, ends_at FROM reservations
        WHERE status != 'CANCELADA' AND starts_at < ? AND ends_at > ?
        """,
        (day_end.isoformat(), day_start.isoformat()),
    ).fetchall()
    connection.close()
    occupied = [dict(row) for row in bundles] + [dict(row) for row in legacy]
    slots = []
    candidate = day_start.replace(hour=8)
    closing = day_start.replace(hour=20)
    while candidate + timedelta(minutes=90) <= closing:
        ends = candidate + timedelta(minutes=90)
        slots.append({
            "time": candidate.strftime("%H:%M"),
            "ends_at": ends.strftime("%H:%M"),
            "available": not any(
                datetime.fromisoformat(item["starts_at"]) < ends
                and datetime.fromisoformat(item["ends_at"]) > candidate
                for item in occupied
            ),
        })
        candidate = ends
    return {
        "day": selected_day.isoformat(),
        "bundle": {"label": "Lavado + secado", "duration_minutes": 90, "includes": ["Una lavadora", "Secadora compartida"]},
        "slots": slots,
    }


@app.post("/api/laundry/reservations", status_code=201)
def reserve_laundry_bundle(payload: LaundryBundleRequest, user: dict[str, str | int] = Depends(current_user)) -> dict[str, object]:
    if user["role"] != "RESIDENTE":
        raise HTTPException(status_code=403, detail="Sólo residentes pueden reservar.")
    try:
        starts_at = datetime.fromisoformat(payload.starts_at)
    except ValueError as error:
        raise HTTPException(status_code=422, detail="La hora de inicio no es válida.") from error
    if starts_at.tzinfo is not None:
        starts_at = starts_at.replace(tzinfo=None)
    if starts_at.minute not in (0, 30) or starts_at.second != 0:
        raise HTTPException(status_code=422, detail="Elegí una franja disponible de la aplicación.")
    if starts_at.date() < business_today() or starts_at.date() > business_today() + timedelta(days=6):
        raise HTTPException(status_code=422, detail="Elegí un día de esta semana.")
    ends_at = starts_at + timedelta(minutes=90)
    if starts_at.hour < 8 or ends_at.time() > datetime.strptime("20:00", "%H:%M").time():
        raise HTTPException(status_code=422, detail="La lavandería opera de 08:00 a 20:00.")

    connection = con()
    try:
        connection.execute("BEGIN IMMEDIATE")
        dryer = connection.execute("SELECT id FROM machines WHERE name = 'Secadora' AND state = 'DISPONIBLE'").fetchone()
        washers = connection.execute("SELECT id FROM machines WHERE name LIKE 'Lavadora %' AND state = 'DISPONIBLE' ORDER BY id").fetchall()
        if not dryer or not washers:
            raise HTTPException(status_code=409, detail="No hay equipo disponible para completar lavado y secado.")
        resource_ids = [dryer["id"], *[washer["id"] for washer in washers]]
        placeholders = ", ".join("?" for _ in resource_ids)
        conflict = connection.execute(
            f"""
            SELECT 1
            FROM laundry_bundles b
            JOIN laundry_bundle_resources r ON r.bundle_id = b.id
            WHERE b.status != 'CANCELADA'
              AND r.machine_id IN ({placeholders})
              AND b.starts_at < ? AND b.ends_at > ?
            LIMIT 1
            """,
            (*resource_ids, ends_at.isoformat(), starts_at.isoformat()),
        ).fetchone()
        legacy_conflict = connection.execute(
            f"""
            SELECT 1 FROM reservations
            WHERE status != 'CANCELADA' AND machine_id IN ({placeholders})
              AND starts_at < ? AND ends_at > ?
            LIMIT 1
            """,
            (*resource_ids, ends_at.isoformat(), starts_at.isoformat()),
        ).fetchone()
        if conflict or legacy_conflict:
            raise HTTPException(status_code=409, detail="Ese bloque de lavado y secado ya no está disponible.")
        washer = washers[0]
        cursor = connection.execute(
            "INSERT INTO laundry_bundles(user_id, starts_at, ends_at, status, amount_cop, created_at) VALUES(?, ?, ?, 'PENDIENTE', ?, ?)",
            (user["id"], starts_at.isoformat(), ends_at.isoformat(), 10000, now().isoformat()),
        )
        connection.executemany(
            "INSERT INTO laundry_bundle_resources(bundle_id, machine_id) VALUES(?, ?)",
            ((cursor.lastrowid, washer["id"]), (cursor.lastrowid, dryer["id"])),
        )
        connection.commit()
        return {
            "id": cursor.lastrowid,
            "label": "Lavado + secado",
            "starts_at": starts_at.isoformat(),
            "ends_at": ends_at.isoformat(),
            "duration_minutes": 90,
            "amountCop": 10000,
            "status": "PENDIENTE",
            "resources": ["Lavadora", "Secadora"],
        }
    except HTTPException:
        connection.rollback()
        raise
    finally:
        connection.close()


@app.get("/api/laundry/reservations")
def laundry_reservation_history(user: dict[str, str | int] = Depends(current_user)) -> dict[str, list[dict[str, object]]]:
    connection = con()
    bundle_where = "" if user["role"] == "ADMINISTRADOR" else "WHERE b.user_id = ?"
    legacy_where = "" if user["role"] == "ADMINISTRADOR" else "WHERE r.user_id = ?"
    params: tuple[object, ...] = () if user["role"] == "ADMINISTRADOR" else (user["id"],)
    bundles = connection.execute(
        f"""
        SELECT b.id, b.user_id, b.starts_at, b.ends_at, b.status, b.amount_cop,
               'Lavado + secado' AS bundle_label, users.name AS resident_name,
               GROUP_CONCAT(machines.name, ' + ') AS resource_names
        FROM laundry_bundles b
        JOIN users ON users.id = b.user_id
        JOIN laundry_bundle_resources rsrc ON rsrc.bundle_id = b.id
        JOIN machines ON machines.id = rsrc.machine_id
        {bundle_where}
        GROUP BY b.id
        """,
        params,
    ).fetchall()
    legacy = connection.execute(
        f"""
        SELECT r.id, r.user_id, r.starts_at, r.ends_at, r.status, 10000 AS amount_cop,
               'Reserva histórica' AS bundle_label, users.name AS resident_name, machines.name AS resource_names
        FROM reservations r
        JOIN users ON users.id = r.user_id
        JOIN machines ON machines.id = r.machine_id
        {legacy_where}
        """,
        params,
    ).fetchall()
    connection.close()
    data = [dict(row) for row in bundles] + [dict(row) | {"legacy": True} for row in legacy]
    data.sort(key=lambda item: item["starts_at"], reverse=True)
    return {"data": data}


@app.post("/api/laundry/reservations/{reservation_id}/mark-paid")
def mark_laundry_paid(reservation_id: int, user: dict[str, str | int] = Depends(current_user)) -> dict[str, object]:
    require_admin(user)
    connection = con()
    reservation = connection.execute("SELECT id, status FROM laundry_bundles WHERE id = ?", (reservation_id,)).fetchone()
    if not reservation:
        connection.close()
        raise HTTPException(status_code=404, detail="Reserva de lavado y secado no encontrada.")
    if reservation["status"] == "PAGADO":
        connection.close()
        return {"id": reservation_id, "status": "PAGADO"}
    connection.execute("UPDATE laundry_bundles SET status = 'PAGADO' WHERE id = ?", (reservation_id,))
    connection.execute("INSERT INTO activity(user_id, event_type, created_at) VALUES(?, ?, ?)", (user["id"], f"LAUNDRY_PAYMENT_MARKED:{reservation_id}", now().isoformat()))
    connection.commit()
    connection.close()
    return {"id": reservation_id, "status": "PAGADO"}


app.mount("/", StaticFiles(directory="frontend/app/dist", html=True), name="frontend")

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", "8000")))



