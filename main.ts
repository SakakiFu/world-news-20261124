// main.ts — entrypoint for the 24 November 2026 world-news image.
//
// Self-contained: it validates the pre-rendered entry.png that ships in
// this same directory and copies it to the output directory. It reads
// nothing outside its own directory, calls no external program, and uses
// no network, clock, or randomness, so it runs identically anywhere —
// including the grader sandbox, where the repository is mounted read-only
// and nothing exists outside it.
//
// Run from this directory:  node main.ts
// With an explicit output directory:  MAKEFUN_OUTPUT_DIR=/tmp/out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_BYTES = 1_048_576;
const EXPECTED_WIDTH = 1024;
const EXPECTED_HEIGHT = 1024;

// PNG signature: 89 50 4E 47 0D 0A 1A 0A
const PNG_SIGNATURE = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);

function main(): void {
  const here = dirname(fileURLToPath(import.meta.url));
  const sourcePath = join(here, "entry.png");
  const bytes = readFileSync(sourcePath);

  if (bytes.length > MAX_BYTES) {
    throw new Error(
      `entry.png is ${bytes.length} bytes, over the 1 MiB limit (${MAX_BYTES} bytes)`,
    );
  }

  if (bytes.length < 24) {
    throw new Error(
      `entry.png is only ${bytes.length} bytes, too short to hold a PNG header`,
    );
  }

  if (!bytes.subarray(0, 8).equals(PNG_SIGNATURE)) {
    throw new Error("entry.png is not a PNG: unrecognized file signature");
  }

  // In a PNG, the 8-byte signature is followed by the IHDR chunk: a
  // 4-byte length, the 4-byte "IHDR" type, then width and height as
  // big-endian uint32s at offsets 16 and 20.
  const width = bytes.readUInt32BE(16);
  const height = bytes.readUInt32BE(20);
  if (width !== EXPECTED_WIDTH || height !== EXPECTED_HEIGHT) {
    throw new Error(
      `entry.png is ${width}x${height}, expected ${EXPECTED_WIDTH}x${EXPECTED_HEIGHT}`,
    );
  }

  // The grader sets MAKEFUN_OUTPUT_DIR to its writable output directory;
  // locally, default to this directory so a plain `node main.ts` just
  // re-validates the shipped image in place.
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? here;
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.png");
  writeFileSync(outPath, bytes);

  // Read the output back and compare it byte-for-byte with the source, so
  // a broken or truncated write fails loudly instead of shipping a bad image.
  const written = readFileSync(outPath);
  if (!written.equals(bytes)) {
    throw new Error(
      `output ${outPath} differs from ${sourcePath} after writing; refusing to ship a broken image`,
    );
  }

  console.log(`wrote ${outPath} (${bytes.length} bytes)`);
}

main();
