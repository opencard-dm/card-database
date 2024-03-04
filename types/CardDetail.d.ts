type civilization = 'light'
    | 'water'
    | 'dark'
    | 'fire'
    | 'nature'
    | 'zero'

type cardType = 'ツインパクト' // カード検索
    | 'クリーチャー'
    | '呪文'
    | '進化クリーチャー' // カード検索
    | 'サイキック' // カード検索
    | 'ドラグハート' // カード検索
    | 'フィールド'
    | '城'
    | 'クロスギア'
    | 'エグザイル・クリーチャー' // カード検索
    | 'GR' // カード検索
    | 'オレガ・オーラ'
    | 'タマシード'

/** https://dmwiki.net/進化クリーチャー */
type evolutionType = '進化クリーチャー'
    | 'S-MAX進化クリーチャー'
    | 'スター進化クリーチャー'

/** 
 * 総合ルールのカードタイプ
 * @link https://dmwiki.net/カードタイプ
 */
type comprehensiveCardType = 'クリーチャー'
    | '呪文'
    | 'クロスギア'
    | '城'
    | 'ウエポン'
    | 'フォートレス'
    | '鼓動' // その他
    | 'フィールド'
    | 'コア' // その他
    | 'オーラ'
    | '儀' // その他
    | '星雲' // その他
    | 'Artifact' // その他
    | '土地' // その他
    | 'ルール・プラス' // その他
    | 'タマシード'
    | 'セル'

export interface CardDetail {
    id: string
    main_card_id?: number
    imageUrl?: string
    backImageUrl?: string
    name: string
    name_ruby?: string
    image_paths?: string[]
    types: string[]
    subtypes: string[]
    power: string | null
    power_int?: number
    cost: number
    civilizations: civilization[]
    races?: string[]
    card_text: string
    combined_card?: CardDetail
    transitions?: CardDetail[]
}
