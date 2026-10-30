"""Fail fast when source encoding or unsafe theme overrides regress."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "frontend" / "app" / "src"
FORBIDDEN = ("\ufffd", "\u00c3", "\u00c2", "\u00f0")


def main() -> None:
    offenders: list[str] = []
    for path in SOURCE.rglob("*"):
        if path.suffix not in {".ts", ".tsx", ".css"}:
            continue
        text = path.read_text(encoding="utf-8")
        if any(character in text for character in FORBIDDEN):
            offenders.append(str(path.relative_to(ROOT)))
    css = (SOURCE / "index.css").read_text(encoding="utf-8")
    if "[class*=" in css:
        offenders.append("frontend/app/src/index.css contains an unsafe substring selector")
    if offenders:
        raise SystemExit("Source sanity failed:\n- " + "\n- ".join(offenders))
    print("PASS: UTF-8 UI strings and theme selectors are sane.")


if __name__ == "__main__":
    main()
