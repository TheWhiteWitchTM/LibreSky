#!/usr/bin/env python3
"""Remember a LibreSky changelog heading.

The morning release note posts each new heading once. After a note goes out
from this repo, mark that heading so the morning note does not repeat it.

Usage: mark-release-seen.py 22 October 2026
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

STATE = Path.home() / ".local" / "state" / "thewhitewitch" / "bsky-bot.json"


def main() -> int:
    heading = " ".join(sys.argv[1:]).strip()
    if not heading or heading.startswith("-"):
        raise SystemExit("Usage: mark-release-seen.py 22 October 2026")
    key = f"libresky\t{heading}"
    data = {}
    if STATE.is_file():
        try:
            loaded = json.loads(STATE.read_text(encoding="utf-8"))
            if isinstance(loaded, dict):
                data = loaded
        except json.JSONDecodeError:
            data = {}
    release = data.get("release")
    if not isinstance(release, dict):
        release = {}
    seen = [str(item) for item in (release.get("seen") or [])]
    if key not in seen:
        seen.append(key)
    release["baselined"] = True
    release["seen"] = seen
    data["release"] = release
    STATE.parent.mkdir(parents=True, exist_ok=True)
    STATE.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")
    print(key)
    return 0


if __name__ == "__main__":
    sys.exit(main())
