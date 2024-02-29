import { test, expect } from '@playwright/test';

// https://dm.takaratomy.co.jp/card/detail/?id=dm23ex3-OR1
const firstCardId = 'dm23ex3-OR1'
https://dm.takaratomy.co.jp/card/?v=%7B%22suggest%22:%22on%22,%22keyword_type%22:%5B%22card_name%22,%22card_ruby%22,%22card_text%22%5D,%22culture_cond%22:%5B%22%E5%8D%98%E8%89%B2%22,%22%E5%A4%9A%E8%89%B2%22%5D,%22pagenum%22:%221%22,%22samename%22:%22show%22,%22sort%22:%22release_new%22%7D
test('has title', async ({ page }) => {
  await page.goto('https://dm.takaratomy.co.jp/card/');
  await page.locator('#cardlist').first()
  const lastPage = Number(await page.getByText('最後のページ').getAttribute('data-page'))
  console.log('最後のページ：', lastPage)
  const cardIds = await page.evaluate(async () => {
    const cardIds: string[] = []
    document.querySelectorAll('#cardlist li a').forEach((e) => {
      const link = e as HTMLAnchorElement
      const cardId = new URLSearchParams(link.search).get('id') as string
      cardIds.push(cardId)
    })
    return cardIds
  });
  // console.log(cardIds)
  // Expect a title "to contain" a substring.
});

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });
