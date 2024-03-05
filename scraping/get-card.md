
## スクレイピングが失敗したカード
https://dm.takaratomy.co.jp/card/detail/?id=dm27+1d-003
データベースに保存されたIDが「dm27+1d-003」ではなく「dm27 1d-003」とプラスが半角スペースになっていたことから、存在しないページにアクセスして、スクレイピングが失敗していた。
次のクエリで対応した。

```
UPDATE cards SET id = 'dm27+1d-003' WHERE id = 'dm27 1d-003'
```

同様の不具合があったID(`SELECT * from cards WHERE id like '% %'`)
- dm29 1d-001
- dm29 1d-002
- dm29 1d-003
