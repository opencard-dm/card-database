/**
 * npm test scraping/get-card.main.spec.ts
 */
import { test, expect, Page } from '@playwright/test';
import { getAll, runSql } from './database';
import { getCardDetailUrl, setCardTypes, getCardDetail } from "./get-card";
import { CardDetail, civilization } from '../types/CardDetail';

const DRY_RUN = false
const MAX_CARDS = 500

test('カードデータを取得', async ({ page }) => {
  await page.goto('https://dm.takaratomy.co.jp/card/');
  const notScrapedCardIds = (await getAll('select id from cards where name is NULL')).map(row => row.id)

  let count = 0
  for (const cardId of notScrapedCardIds.slice(0, MAX_CARDS)) {
    /**
     * 2024/03/04 500/13.4m
     */
    count++
    await page.waitForTimeout(1000) // アクセス負荷軽減のため
    await page.goto(getCardDetailUrl(cardId))
    const card = await page.evaluate(getCardDetail)
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
    console.log(`updated(${count}/${MAX_CARDS}): `, `${card.name} (${cardId})`)
  }
})
