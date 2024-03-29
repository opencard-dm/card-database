/**
 * npm test scraping/get-card.main.spec.ts
 */
import { test, expect, Page } from '@playwright/test';
import { getAll, runSql } from './database';
import { getCardDetailUrl, setCardTypes, getCardDetail } from "./get-card";
import { CardDetail, civilization } from '../types/CardDetail';

const DRY_RUN = false
const MAX_CARDS = 1000

test('カードデータを取得', async ({ page }) => {
  await page.goto('https://dm.takaratomy.co.jp/card/');
  const notScrapedCardIds = (await getAll('select id from cards where name is NULL')).map(row => row.id)
  
  const totalTargetCards = Math.min(notScrapedCardIds.length, MAX_CARDS)
  let count = 0
  for (const cardId of notScrapedCardIds.slice(0, MAX_CARDS)) {
    /**
     * 2024/03/04 500/13.4m
     * 2024/03/04 500/23.2m 1秒の待ち時間を追加
     * 2024/03/04 1000/38.5m
     * 2024/03/04 1000/37.3m
     */
    count++
    await page.waitForTimeout(1000) // アクセス負荷軽減のため
    await page.goto(getCardDetailUrl(cardId))
    let card = null
    try {
      card = await page.evaluate(getCardDetail)
    } catch (error) {
      console.error(error)
      continue
    }
    setCardTypes(card)
    if (DRY_RUN) {
      console.log(card)
      return
    }
    const updateQuery = 'update cards'
      + ' set name = ?'
      + ' , detail = ?'
      + ' , updated_at = CURRENT_TIMESTAMP'
      + ' where id = ?'
    await runSql(updateQuery, [
      card.name,
      JSON.stringify(card),
      cardId,
    ])
    console.log(`updated(${count}/${totalTargetCards}): `, `${card.name} (${cardId})`)
  }
})
