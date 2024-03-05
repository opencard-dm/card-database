/**
 * npm run ts tools/exportCardnames.ts
 */
import { getAll } from '../scraping/database';
import { writeFileSync } from 'fs'

main()

async function main() {
  const cardRecords = await getAll(
    'SELECT id, name from cards'
    + ' WHERE name IS NOT NULL'
    + ' ORDER BY name'
  )
  const cardNameIdMap = {}
  for (const record of cardRecords) {
    if (record.name in cardNameIdMap) {
      cardNameIdMap[record.name].push(record.id)
    } else {
      cardNameIdMap[record.name] =[ record.id ]
    }
  }
  writeFileSync('cardnames.json', JSON.stringify(cardNameIdMap, null, 2));
}
