import { readFile } from 'node:fs/promises';

const fileUrl = new URL('./notes/keynote-highlights.json', import.meta.url);

try {
  const content = await readFile(fileUrl, 'utf8');
  const data = JSON.parse(content);

  if (!Array.isArray(data.highlights)) {
    throw new Error('Field "highlights" harus berupa array.');
  }

  const grouped = new Map();

  for (const highlight of data.highlights) {
    if (!highlight.topic || !highlight.title) {
      throw new Error('Setiap highlight harus memiliki topic dan title.');
    }

    if (!grouped.has(highlight.topic)) {
      grouped.set(highlight.topic, []);
    }

    grouped.get(highlight.topic).push(highlight.title);
  }

  for (const [topic, titles] of grouped) {
    console.log(`\n${topic}`);
    for (const title of titles) {
      console.log(`  - ${title}`);
    }
  }
} catch (error) {
  console.error(`Gagal membaca keynote highlights: ${error.message}`);
  process.exitCode = 1;
}
