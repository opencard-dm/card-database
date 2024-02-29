/**
 * npm run ts scraping/get-card.ts
 */
import { chromium } from 'playwright-core';
import { getAll, runSql } from './database';

const sampleCardId = 'dm23ex3-OR1'

function getCardDetail() {
  // カード名からパック名を取り除く
  const packname = document.querySelector('.cardname .packname')
  if (packname) {
    packname.remove()
  }
  const card = {}
  card.name = document.querySelector('.cardname').textContent.trim()
  card.types = document.querySelector('.typetxt').textContent.split('/')
    .map(t => t.trim())
  card.civilizations = document.querySelector('.civtxt').textContent.split('/')
    .map(t => t.trim())
  card.power = document.querySelector('.powertxt').textContent.trim()
  card.cost = parseInt(document.querySelector('.costtxt').textContent.trim())
  card.races = document.querySelector('.racetxt').textContent.split('/')
    .map(t => t.trim())
  card.text = Array.from(document.querySelectorAll('.abilitytxt li')).map(li => {
    return li.textContent.trim()
  }).join('\n')
  return card
}

function getCardDetailUrl(cardId: string) {
  // https://dm.takaratomy.co.jp/card/detail/?id=dm23ex3-OR1
  return `https://dm.takaratomy.co.jp/card/detail/?id=${cardId}`
}

(async () => {
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  })
  const page = await browser.newPage()

  await page.goto('https://dm.takaratomy.co.jp/card/');
  const notScrapedCardIds = (await getAll('select id from cards where name is NULL')).map(row => row.id)

  // 100件にしておく
  for (const cardId of notScrapedCardIds.slice(0, 100)) {
    await page.goto(getCardDetailUrl(cardId))
    const card = await page.evaluate(getCardDetail)
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
  browser.close()
})();
