/**
 * npm run ts tools/exportCardnames.ts
 */
import { getAll } from '../scraping/database';
import { writeFileSync } from 'fs'

main()

async function main() {
  const cardRecords = await getAll(
    'SELECT max(id) as id, name from cards'
    + ' WHERE name IS NOT NULL'
    + ' GROUP BY name'
    + " HAVING name != ''"
  )
  const cardNameIdMap = {}
  for (const record of cardRecords) {
    cardNameIdMap[record.name] = record.id
  }
  writeFileSync('cardnames.json', JSON.stringify(cardNameIdMap, null, 2));
}
