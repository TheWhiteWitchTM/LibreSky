# LibreSky

LibreSky is a Bluesky client that runs in the browser. It uses your Bluesky account on the AT Protocol. Home, Discover, search, notifications, chat, bookmarks, feeds, lists, profiles, and posts all come from Bluesky.

GitHub Pages can host this folder as it is. No build step is required to open the site.

[https://thewhitewitchtm.github.io/LibreSky/](https://thewhitewitchtm.github.io/LibreSky/)

## Sign in

**Sign in with Bluesky** opens Bluesky’s own login page. Leave the handle empty to sign in with your email, or enter `you.bsky.social` to open that account. On this machine, open the app at `http://127.0.0.1` with a port, not `localhost`.

An app password also works. Create one at [Bluesky app passwords](https://bsky.app/settings/app-passwords). LibreSky stores that session in this browser.

`client-metadata.json` is the OAuth client id. Its `client_id` and `redirect_uris` must be the public address of this site. They match the Pages URL above. If you publish LibreSky somewhere else, change those URLs to the new address before you sign in.

## Pages

In the repository settings, set Pages to deploy from the `main` branch and the root folder. The site is the files in this directory.

## Local

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

Open http://127.0.0.1:4173/

`npm run build:auth` rebuilds the sign-in bundle in `js/vendor/auth.js` after `npm install`. The checked-in bundle is what the site loads.
