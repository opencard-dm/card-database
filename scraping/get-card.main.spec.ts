/**
 * npm test scraping/get-card.main.spec.ts
 */
import { test, expect, Page } from '@playwright/test';
import { getAll, runSql } from './database';
import { getCardDetailUrl, setCardTypes, getCardDetail } from "./get-card";
import { CardDetail, civilization } from '../types/CardDetail';

const DRY_RUN = false

test('カードデータを取得', async ({ page }) => {
  await page.goto('https://dm.takaratomy.co.jp/card/');
  const notScrapedCardIds = (await getAll('select id from cards where name is NULL')).map(row => row.id)

  // 500件にしておく
  for (const cardId of notScrapedCardIds.slice(0, 500)) {
    // アクセス負荷軽減のため少し待つ
    await page.waitForTimeout(1000)
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
    console.log('updated: ', `${card.name} (${cardId})`)
  }
})
