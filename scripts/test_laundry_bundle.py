"""Focused executable contract checks for the 90-minute laundry bundle API."""
from __future__ import annotations

import sys
import tempfile
from datetime import timedelta
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from fastapi import HTTPException


def expects_status(expected: int, action) -> None:
    try:
        action()
    except HTTPException as error:
        assert error.status_code == expected, error.detail
    else:
        raise AssertionError(f"Expected HTTP {expected}")


def main() -> None:
    import app as application

    with tempfile.TemporaryDirectory() as directory:
        application.DB = Path(directory) / "bundle-test.db"
        application.init_database()
        resident = {"id": 2, "role": "RESIDENTE", "name": "Residente", "cedula": "1034657945"}
        admin = {"id": 1, "role": "ADMINISTRADOR", "name": "Diana", "cedula": "1034657946"}
        tomorrow = application.now().date() + timedelta(days=1)
        start = f"{tomorrow.isoformat()}T15:00:00"
        payload = application.LaundryBundleRequest(starts_at=start)

        created = application.reserve_laundry_bundle(payload, resident)
        assert created["label"] == "Lavado + secado"
        assert created["duration_minutes"] == 90
        assert str(created["ends_at"]).endswith("16:30:00")
        assert created["resources"] == ["Lavadora", "Secadora"]

        expects_status(409, lambda: application.reserve_laundry_bundle(payload, resident))
        expects_status(409, lambda: application.reserve_laundry_bundle(application.LaundryBundleRequest(starts_at=f"{tomorrow.isoformat()}T15:30:00"), resident))
        expects_status(403, lambda: application.mark_laundry_paid(int(created["id"]), resident))
        marked = application.mark_laundry_paid(int(created["id"]), admin)
        assert marked["status"] == "PAGADO"
        history = application.laundry_reservation_history(admin)["data"]
        stored = next(item for item in history if item["id"] == created["id"] and not item.get("legacy"))
        assert stored["status"] == "PAGADO"

    print("laundry bundle checks: PASS")


if __name__ == "__main__":
    main()
