// Removes the previous build from the repo root before `vite build` writes a new one,
// so stale hashed files in assets/ don't pile up.
import { rmSync } from 'node:fs';

for (const path of ['assets', 'index.html', '404.html']) {
    rmSync(path, { recursive: true, force: true });
}
