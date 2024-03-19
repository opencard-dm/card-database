import { CardDetail, cardType, civilization } from '../types/CardDetail';

/**
 * ブラウザ環境でのみ動く関数
 */
export function getCardDetail() {
  function getCardDetailFromElement(element: Element): CardDetail {
    // カード名からパック名を取り除く
    const packname = element.querySelector('.cardname .packname')
    if (packname) {
      packname.remove()
    }
    const subtypes = element.querySelector('.typetxt').textContent.split('/')
      .map(t => t.trim())
    const card: CardDetail = {
      id: new URLSearchParams(location.search).get('id'),
      name: element.querySelector('.cardname').textContent.trim(),
      types: [],
      subtypes: subtypes,
      civilizations: element.querySelector('.civtxt').textContent.split('/')
      .map(t => t.trim()) as civilization[],
      power: element.querySelector('.powertxt').textContent.trim(),
      cost: parseInt(element.querySelector('.costtxt').textContent.trim()),
      races: element.querySelector('.racetxt').textContent.split('/')
        .map(t => t.trim()),
        card_text: Array.from(element.querySelectorAll('.abilitytxt li')).map(li => {
          return li.textContent.trim()
        }).join('\n'),
    }
    return card
  }
  const details = document.querySelectorAll('.cardPopupDetail')
  const card = getCardDetailFromElement(details[0])
  for (const subtype of card.subtypes) {
    if (subtype.includes('ドラグハート')) {
      card.transitions = Array.from(details).slice(1).map(d => {
        return getCardDetailFromElement(d)
      })
      return card
    }
    if (subtype.includes('サイキック')) {
      card.transitions = [getCardDetailFromElement(details[1])]
      return card
    }
  }
  // ツインパクトの場合は、cardPopupDetail が２つある
  if (details.length == 2) {
    card.subtypes.push('ツインパクト')
    card.combined_card = getCardDetailFromElement(details[1])
  }
  return card
}

function getCardTypes(subtypes: string[]) {
  // https://dmwiki.net/カードタイプ
  const typesMap: {[key in cardType]: string} = {} as any
  for (const subtype of subtypes) {
    // 総合ルールのカードタイプ
    if (subtype.includes('クリーチャー')) {
      typesMap['クリーチャー'] = ''
    }
    if (subtype.includes('呪文')) {
      typesMap['呪文'] = ''
    }
    if (subtype.includes('クロスギア')) {
      typesMap['クロスギア'] = ''
    }
    if (subtype.includes('城')) {
      typesMap['城'] = ''
    }
    if (subtype.includes('ウエポン')) {
      typesMap['ウエポン'] = ''
    }
    if (subtype.includes('フォートレス')) {
      typesMap['フォートレス'] = ''
    }
    if (subtype.includes('フィールド')) {
      typesMap['フィールド'] = ''
    }
    if (subtype.includes('オーラ')) {
      typesMap['オーラ'] = ''
    }
    if (subtype.includes('タマシード')) {
      typesMap['タマシード'] = ''
    }
    if (subtype.includes('セル')) {
      typesMap['セル'] = ''
    }
    // 公式のカード検索のカードタイプ
    if (subtype.includes('ツインパクト')) {
      typesMap['ツインパクト'] = ''
    }
    if (subtype.includes('進化')) {
      typesMap['進化クリーチャー'] = ''
    }
    if (subtype.includes('サイキック')) {
      typesMap['サイキック'] = ''
    }
    if (subtype.includes('ドラグハート')) {
      typesMap['ドラグハート'] = ''
    }
    if (subtype.includes('エグザイル・クリーチャー')) {
      typesMap['エグザイル・クリーチャー'] = ''
    }
    if (subtype.includes('GR')) {
      typesMap['GR'] = ''
    }
  }
  return Object.keys(typesMap)
}

export function setCardTypes(card: CardDetail) {
  card.types = getCardTypes(card.subtypes)
  if (card.combined_card) {
    setCardTypes(card.combined_card)
  }
  if (Array.isArray(card.transitions)) {
    card.transitions.forEach(c => {
      setCardTypes(c)
    })
  }
}

export function getCardDetailUrl(cardId: string) {
  // https://dm.takaratomy.co.jp/card/detail/?id=dm23ex3-OR1
  // cardIdにスペースが含まれることがあるため、+に変換する。
  // URLエンコードではうまくいかなかった。
  return `https://dm.takaratomy.co.jp/card/detail/?id=${cardId.replace(' ', '+')}`
}
