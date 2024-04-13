/**
 * npx tsx tools/fromSqliteToFirebase.ts
 */
import { FireStore } from './firestore'
import { getCardDetailFromRecord } from './helpers'
import { CardDetail } from '../types/CardDetail';

import { getAll, runSql } from '../scraping/database';
import { writeFileSync } from 'fs'

main()

const MAX_UPDATE_COUNTS = 5000

async function main() {
  const cardRecords = await getAll(
    'SELECT id, name, detail from cards'
    + " WHERE exported_at IS NULL OR datetime(updated_at) >= datetime(exported_at)"
  )
  console.log('更新対象のレコード数: ', cardRecords.length)
  for (const record of cardRecords.slice(0, MAX_UPDATE_COUNTS)) {
    const cardDetail = JSON.parse(record.detail) as CardDetail
    if (cardDetail === null) {
      console.error(record.id)
      continue
    }
    cardDetail.civilizations = cardDetail.civilizations
      .map(c => translateCivilization(c))
    if (cardDetail.combined_card) {
      cardDetail.combined_card.civilizations = cardDetail.combined_card.civilizations
        .map(c => translateCivilization(c))
    }
    cardDetail.transitions?.forEach((c) => {
      c.civilizations = cardDetail.civilizations
        .map(c => translateCivilization(c))
    })
    try {
      FireStore.db.doc(`/cards/${record.id}`).set(cardDetail)
      const updateQuery = 'update cards'
        + ' set exported_at = CURRENT_TIMESTAMP'
        + ' where id = ?'
      await runSql(updateQuery, [record.id])
      console.log(`updated: `, `${record.name} (${record.id})`)
    } catch (error) {
      console.error(record)
      throw error
    }
  }
}

function translateCivilization(civilization: string) {
  switch (civilization) {
    case '光':
      return 'light';
    case '水':
      return 'water';
    case '闇':
      return 'dark';
    case '火':
      return 'fire';
    case '自然':
      return 'nature';
    case 'ゼロ':
      return 'zero';
    default:
      return civilization
  }
}
