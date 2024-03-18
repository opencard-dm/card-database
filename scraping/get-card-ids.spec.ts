import { test, expect } from '@playwright/test';
import { db, insertCardIds, getAll } from './database';

/**
 * カードは発売日の新しい順にならんでいる。
 * 新商品発売後には、最後に取得したカードの発売日以降のものを取得すればよいはず。
 */

// https://dm.takaratomy.co.jp/card/detail/?id=dm23ex3-OR1
const firstCardId = 'dm23ex3-OR1'

function getPageUrl(page: number) {
  return `https://dm.takaratomy.co.jp/card/?v=%7B%22suggest%22:%22on%22,%22keyword_type%22:%5B%22card_name%22,%22card_ruby%22,%22card_text%22%5D,%22culture_cond%22:%5B%22%E5%8D%98%E8%89%B2%22,%22%E5%A4%9A%E8%89%B2%22%5D,%22pagenum%22:%22${page}%22,%22samename%22:%22show%22,%22sort%22:%22release_new%22%7D`
}

test('insert card ids', async ({ page }) => {
  const existIds = (await getAll('select id from cards')).map(r => r.id)

  await page.goto('https://dm.takaratomy.co.jp/card/');
  await page.locator('#cardlist').first()
  const lastPage = Number(await page.getByText('最後のページ').getAttribute('data-page'))
  console.log('最後のページ：', lastPage)
  let cardIds: string[] = []
  for (let pageNum = 1; pageNum <= lastPage; pageNum++) {
    cardIds = []
    // if (pageNum >= 3) return // テスト時に使用
    await page.goto(getPageUrl(pageNum))
    // アクセス負荷軽減と、カードが表示されるのを待つのを兼ねる
    await page.waitForTimeout(1000)
    cardIds = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('#cardlist li a')).map((e) => {
        const link = e as HTMLAnchorElement
        const cardId = new URLSearchParams(link.search).get('id') as string
        return cardId
      })
    })
    cardIds = cardIds.filter(id => !existIds.includes(id))
    insertCardIds(cardIds)
    existIds.push(...cardIds)
    console.log(`${pageNum} / ${lastPage}`)
  }
});
