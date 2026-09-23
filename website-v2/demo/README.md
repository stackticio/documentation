# Demo page — putting the Wix videos in

A Wix video is a Wix **page element**. It cannot be pasted inside an HTML embed.
So there are two ways to get the videos onto this page — pick one.

---

## Option A — one embed, three video URLs  ·  `demo.html`

The full scrolling page, exactly like home / solution / product / vision:
one file, one full-width Wix embed.

In Wix: **Media Manager → the video → ⋮ → Copy URL**
(the URL looks like `https://video.wixstatic.com/video/<id>/1080p/mp4/file.mp4`).

Open `demo.html`, find the block at the top of the `<script>`, paste three URLs:

```js
const VIDEOS = {
  1: 'https://video.wixstatic.com/video/…/mp4/file.mp4',   // ai framework
  2: 'https://video.wixstatic.com/video/…/mp4/file.mp4',   // topology · ops · security
  3: 'https://video.wixstatic.com/video/…/mp4/file.mp4',   // validation by metadata
};
```

That is the only edit. Each slot also accepts a full `<iframe …>` embed code
instead of a URL, and `POSTERS` takes an optional still image per video.
A slot left as `''` keeps its placeholder frame.
Videos pause automatically when their scene scrolls off screen.

**Use this if** the videos are already uploaded to the Wix Media Manager.

---

## Option B — three separate blocks  ·  `demo-01/02/03.html`

Three short embeds, each sized to its own content — no internal scrolling.
Stack them down a normal Wix page and place a **native Wix video element**
directly under each one.

Leave `const VIDEO = '';` untouched in each file: the video frame is removed
and the copy goes full width, so the Wix video player sits underneath with
nothing to collide with.

Each file also reports its height to the parent page via `postMessage`
(`{type:'stacktic-embed-height'}`) if you want the embeds to auto-size.

**Use this if** you want the real Wix player — chapters, thumbnails,
its own analytics — rather than a plain HTML5 video.

---

## What is where

| file | what it is |
|---|---|
| `demo.html` | full page: intro → 3 demos → CTA |
| `demo-01.html` | block: the AI framework, explained |
| `demo-02.html` | block: topology, operations & security, by hand |
| `demo-03.html` | block: validation by metadata |

All of them use the site background `#2A2847`, Fira Code, and panels that
lift off the background (`--panel:#3A3663`) — never darker than the page.
