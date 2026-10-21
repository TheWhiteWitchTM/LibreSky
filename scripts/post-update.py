#!/usr/bin/env python3
"""Post one LibreSky note to Bluesky.

The text is the remaining arguments. It has to start with a siren and stay
within 300 characters. The picture is the repo banner, sent as a JPEG at
1200 by 630.

Credentials are read from ~/.config/thewhitewitch/bsky.env. The password
is never printed.
"""

from __future__ import annotations

import sys
from datetime import datetime, timezone
from pathlib import Path

BOT = Path.home() / "Projects" / "TheWhiteWitchTM.github.io" / "bot"
sys.path.insert(0, str(BOT))

from bsky_grok import (  # noqa: E402
    BANNER_ALT,
    ENTRYWAY,
    banner_jpeg,
    create_session,
    link_facets,
    load_env,
    pds_of,
    request,
    upload_image,
)

LINK = "https://thewhitewitchtm.github.io/LibreSky/"
LIMIT = 300


def scrub(message: str, password: str) -> str:
    if password:
        message = message.replace(password, "the password")
    return message


def main() -> int:
    text = " ".join(sys.argv[1:]).strip() if sys.argv[1:] else sys.stdin.read().strip()
    env = load_env()
    password = env.get("BSKY_PASSWORD") or ""
    try:
        if not text.startswith("🚨"):
            raise SystemExit("The post has to start with a siren.")
        if LINK not in text:
            raise SystemExit("The post is missing the LibreSky link.")
        if len(text) > LIMIT:
            raise SystemExit(f"The post is {len(text)} characters, over {LIMIT}.")
        session, token = create_session(env)
        did = session["did"]
        base = pds_of(session)
        image = banner_jpeg()
        try:
            blob = upload_image(base, token, image)
        except SystemExit:
            base = ENTRYWAY
            blob = upload_image(base, token, image)
        record = {
            "$type": "app.bsky.feed.post",
            "text": text,
            "createdAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z",
            "langs": ["en"],
            "embed": {
                "$type": "app.bsky.embed.images",
                "images": [
                    {
                        "alt": BANNER_ALT,
                        "image": blob,
                        "aspectRatio": {"width": 1200, "height": 630},
                    }
                ],
            },
        }
        facets = link_facets(text)
        if facets:
            record["facets"] = facets
        created = request(
            f"{base}/xrpc/com.atproto.repo.createRecord",
            token,
            {"repo": did, "collection": "app.bsky.feed.post", "record": record},
        )
        uri = created.get("uri", "")
        rkey = uri.rsplit("/", 1)[-1]
        handle = session.get("handle") or env.get("BSKY_HANDLE") or ""
        print(f"https://bsky.app/profile/{handle}/post/{rkey}")
        return 0
    except SystemExit as err:
        detail = scrub(str(err), password)
        if detail:
            print(detail, file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
