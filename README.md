# CARD DATABASE

## 新弾追加時にやること

**公式のカード検索から新しいカードデータの取得**

```
npm run fetch:cards
npm run fetch:cardDetails
npx tsx tools/fromSqliteToFirebase.ts
```

**cardnames.jsonを更新**

1. `npx tsx tools/exportCardnames.ts`
2. mainにcardnames.jsonの変更をプッシュ
3. https://www.jsdelivr.com/tools/purge で、`https://cdn.jsdelivr.net/gh/opencard-dm/card-database/cardnames.json`のキャッシュを消す
4. リポジトリdeck-simulatorで、`tools/getCardNames.ts`を実行する

