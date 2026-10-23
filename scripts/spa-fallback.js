// GitHub Pages has no server-side routing: a deep link like /Hakintoshbestmobile/explorer
// would 404. Pages serves 404.html for unknown paths, so make it a copy of the app shell
// and let React Router render the right page.
import { copyFileSync, writeFileSync } from 'node:fs';

copyFileSync('index.html', '404.html');
// Stop Jekyll from processing the build output.
writeFileSync('.nojekyll', '');
