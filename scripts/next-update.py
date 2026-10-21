#!/usr/bin/env python3
"""Arm or run the next LibreSky update.

A daily timer calls this. The first run, or --arm, only writes the next time:
a random gap of three to five days. When that time has passed, this starts one
headless pass and then arms the following gap. A failed pass leaves the due
time in place so the next day can try again.
"""

from __future__ import annotations

import argparse
import json
import os
import random
import subprocess
import sys
from datetime import datetime, timedelta
from pathlib import Path
from zoneinfo import ZoneInfo

BERLIN = ZoneInfo("Europe/Berlin")
STATE_DIR = Path.home() / ".local" / "state" / "thewhitewitch"
STATE_PATH = STATE_DIR / "libresky-update.json"
LOG_PATH = STATE_DIR / "libresky-update.log"
ROOT = Path(__file__).resolve().parents[1]
PROMPT_PATH = ROOT / "scripts" / "next-update-prompt.txt"


def log(msg: str) -> None:
    STATE_DIR.mkdir(parents=True, exist_ok=True)
    line = f"{datetime.now(BERLIN).isoformat(timespec='seconds')} {msg}\n"
    with LOG_PATH.open("a", encoding="utf-8") as handle:
        handle.write(line)
    print(line, end="")


def load() -> dict:
    if not STATE_PATH.is_file():
        return {}
    try:
        data = json.loads(STATE_PATH.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return {}
    return data if isinstance(data, dict) else {}


def save(data: dict) -> None:
    STATE_DIR.mkdir(parents=True, exist_ok=True)
    STATE_PATH.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")


def next_gap(now: datetime) -> datetime:
    return now + timedelta(hours=random.randint(72, 120))


def arm(now: datetime, reason: str) -> None:
    data = load()
    data["next"] = next_gap(now).isoformat(timespec="seconds")
    data["armed"] = reason
    save(data)
    log(f"armed {reason} next {data['next']}")


def main() -> int:
    parser = argparse.ArgumentParser(description="Arm or run the next LibreSky update.")
    parser.add_argument("--arm", action="store_true", help="Set the next gap and do not start a pass.")
    args = parser.parse_args()
    now = datetime.now(BERLIN)
    if args.arm:
        arm(now, "manual")
        return 0
    data = load()
    raw = str(data.get("next") or "")
    if not raw:
        arm(now, "baseline")
        return 0
    try:
        due = datetime.fromisoformat(raw)
    except ValueError:
        arm(now, "bad-date")
        return 0
    if due.tzinfo is None:
        due = due.replace(tzinfo=BERLIN)
    if now < due:
        log(f"wait until {due.isoformat(timespec='seconds')}")
        return 0
    prompt = PROMPT_PATH.read_text(encoding="utf-8").strip()
    if not prompt:
        log("missing prompt")
        return 1
    grok = os.environ.get("GROK_BIN") or str(Path.home() / ".grok" / "bin" / "grok")
    log("start update")
    result = subprocess.run(
        [grok, "--no-plan", "--always-approve", "--no-auto-update", "-p", prompt],
        cwd=ROOT,
        check=False,
    )
    if result.returncode != 0:
        log(f"update failed {result.returncode}")
        return result.returncode or 1
    data = load()
    data["last"] = now.isoformat(timespec="seconds")
    data["next"] = next_gap(datetime.now(BERLIN)).isoformat(timespec="seconds")
    data["armed"] = "after-run"
    save(data)
    log(f"done next {data['next']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
