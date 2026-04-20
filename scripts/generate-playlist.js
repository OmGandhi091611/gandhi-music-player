import { readdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const audioDir = join(root, 'public', 'audio');
const manualPath = join(root, 'src', 'data', 'manual.js');
const outputPath = join(root, 'src', 'data', 'index.js');

function parseFilename(filename) {
  let name = filename.replace(/\.mp3$/i, '');

  // Strip leading "Lyrical", "LYRICAL_", "Full Audio" prefixes from YouTube titles
  name = name.replace(/^(lyrical[_:\s–-]*|full\s+audio\s*)/i, '').trim();

  const sections = name.split(/\s{2,}/);
  let title = sections[0]
    .replace(/\s*\([^)]*\)/g, '')   // remove (Full video song) etc
    .replace(/\s*\[[^\]]*\]/g, '')  // remove [Full Song] etc
    .trim();

  // Find first non-generic section as artist
  const artistSection = sections.slice(1).find(
    (s) => !/^(full\s+(audio|video|song)|official|audio\s+only|music\s+video|hd$|lyrical)/i.test(s.trim())
  );
  const artist = artistSection?.trim() || '';

  return { title: title || name, artist };
}

async function main() {
  const { songs: manual } = await import(pathToFileURL(manualPath).href + '?t=' + Date.now());

  const manualSrcs = new Set(manual.map((s) => s.src));

  let files = [];
  try {
    files = readdirSync(audioDir)
      .filter((f) => /\.mp3$/i.test(f))
      .sort();
  } catch {
    console.warn('Could not read audio directory:', audioDir);
  }

  const songs = [...manual];
  let autoId = 1000;

  for (const file of files) {
    const src = `/audio/${file}`;
    if (!manualSrcs.has(src)) {
      const { title, artist } = parseFilename(file);
      songs.push({ id: `auto-${autoId++}`, title, artist, src });
    }
  }

  const entries = songs.map((s) => {
    const fields = [
      `    id: ${JSON.stringify(s.id)}`,
      `    title: ${JSON.stringify(s.title)}`,
      `    artist: ${JSON.stringify(s.artist)}`,
      `    src: ${JSON.stringify(s.src)}`,
    ];
    if (s.cover) fields.push(`    cover: ${JSON.stringify(s.cover)}`);
    if (s.album) fields.push(`    album: ${JSON.stringify(s.album)}`);
    return `  {\n${fields.join(',\n')},\n  }`;
  });

  const output =
    `// Auto-generated — do not edit directly.\n` +
    `// Curated entries live in src/data/manual.js.\n` +
    `// New mp3 files in public/audio/ are added automatically on next dev/build.\n` +
    `export const songs = [\n${entries.join(',\n')},\n];\n`;

  writeFileSync(outputPath, output);

  const autoCount = songs.length - manual.length;
  console.log(
    `✓ Playlist generated: ${songs.length} songs` +
    ` (${manual.length} curated + ${autoCount} auto-discovered)`
  );
}

main().catch((err) => {
  console.error('generate-playlist failed:', err);
  process.exit(1);
});
