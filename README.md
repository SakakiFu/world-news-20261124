# The world on 24 November 2026 in one image

[![make.fun · news-image-20261124](https://make.fun/badge/news-image-20261124.svg)](https://make.fun/bounty/news-image-20261124?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261124)
[![rank](https://make.fun/badge/news-image-20261124/SakakiFu/world-news-20261124/rank.svg)](https://make.fun/bounty/news-image-20261124/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261124)
[![reward](https://make.fun/badge/news-image-20261124/SakakiFu/world-news-20261124/reward.svg)](https://make.fun/bounty/news-image-20261124?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261124)

A single 1024×1024 newspaper front page summing up 24 November 2026:
a Houthi strike hits a Riyadh tower for the second time in under a week
(lead), a deadly Russian strike on Zaporizhzhia, Israeli airstrikes kill
seven in Gaza despite the ceasefire, and a blast at a Hanoi hot-pot eatery
kills six — plus a footer of the day's other headlines.

## Regenerate

Requires Node 22+ only — no Python, no external renderer.

```sh
node main.ts
```

`main.ts` is self-contained: it reads the `entry.png` shipped in this
directory, checks it is a 1024×1024 PNG under 1 MiB, and copies it to
`$MAKEFUN_OUTPUT_DIR` (or this directory when that is unset), verifying
the copy byte-for-byte. No clock, no randomness, no network — running it
twice produces byte-identical output.

## Files

- `main.ts` — entrypoint; validates `entry.png` and copies it to the output directory
- `entry.png` — the generated 1024×1024 front page
