import { test, expect, Page } from '@playwright/test';
import { db, insertCardIds, getAll } from './database';
import { getCardDetail, getCardDetailUrl, setCardTypes } from './get-card';

// サイキック、ドラグハート、GR、オーラ は未対応
async function getCardFromPage(page: Page, cardId: string) {
    await page.goto(getCardDetailUrl(cardId))
    const card = await page.evaluate(getCardDetail)
    setCardTypes(card)
    return card
}

// npm test scraping/get-card.spec.ts -- -g "ツインパクト"
test('ツインパクト', async ({ page }) => {
    const cardId = 'dm23bd6-058'
    const card = await getCardFromPage(page, cardId)
    console.log(card)
    expect(card.name).toContain('/')
    expect(card.types).toEqual(expect.arrayContaining(['ツインパクト', 'クリーチャー']))
    expect(card.combined_card.subtypes).toEqual(expect.arrayContaining(['呪文']))
});

// npm test scraping/get-card.spec.ts -- -g "覚醒リンク"
test('覚醒リンク', async ({ page }) => {
    const cardId = 'dm23ex2-087' // 頂上龍素 サイクリタ
    const card = await getCardFromPage(page, cardId)
    console.log(card)
    expect(card.subtypes).toEqual(expect.arrayContaining(['サイキック・クリーチャー']))
    expect(card.types).toEqual(expect.arrayContaining(['サイキック', 'クリーチャー']))
    expect(card.transitions[0].subtypes).toEqual(expect.arrayContaining(['サイキック・スーパー・クリーチャー']))
});

// npm test scraping/get-card.spec.ts -- -g "3面ドラグハート"
test('3面ドラグハート', async ({ page }) => {
    const cardId = 'dmx22b-061' // 邪帝斧 ボアロアックス
    const card = await getCardFromPage(page, cardId)
    console.log(card)
    expect(card.subtypes).toEqual(expect.arrayContaining(['ドラグハート・ウエポン']))
    expect(card.types).toEqual(expect.arrayContaining(['ドラグハート', 'ウエポン']))
    expect(card.transitions[0].subtypes).toEqual(expect.arrayContaining(['ドラグハート・フォートレス']))
    expect(card.transitions[1].subtypes).toEqual(expect.arrayContaining(['ドラグハート・クリーチャー']))
});

// npm test scraping/get-card.spec.ts -- -g "超化獣"
test('超化獣', async ({ page }) => {
    const cardId = 'dm24rp1-Sec01a'
    const card = await getCardFromPage(page, cardId)
    console.log(card)
    expect(card.types).toEqual(['クリーチャー'])
    expect(card.combined_card.subtypes).toEqual(['クリーチャー'])
});
