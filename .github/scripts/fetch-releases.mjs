import { writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';

const UNITY_API_BASE = 'https://services.api.unity.com/unity/editor/release/v1/releases';
const MAX_LIMIT = 25;
const outputFile = process.env.OUTPUT_FILE || 'public/release_data/releases.json';

async function fetchAllReleases() {
  const allResults = [];
  let offset = 0;
  let total = Infinity;

  console.log('Fetching releases from Unity API...');

  while (offset < total) {
    const url = `${UNITY_API_BASE}?limit=${MAX_LIMIT}&offset=${offset}`;
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`Unity API error: ${res.status} at offset ${offset}`);
    }

    const data = await res.json();
    total = data.total || 0;
    const results = data.results || [];
    allResults.push(...results);

    console.log(`  Fetched ${allResults.length}/${total} releases`);

    if (results.length < MAX_LIMIT) break;
    offset += MAX_LIMIT;
  }

  return { total: allResults.length, results: allResults };
}

async function main() {
  try {
    const data = await fetchAllReleases();

    mkdirSync(dirname(outputFile), { recursive: true });
    writeFileSync(outputFile, JSON.stringify(data, null, 2));

    console.log(`Done. Saved ${data.results.length} releases to ${outputFile}`);
  } catch (err) {
    console.error('Failed to fetch releases:', err);
    process.exit(1);
  }
}

main();
