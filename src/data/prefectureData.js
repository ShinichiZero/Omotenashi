import { hokkaidoTohokuData } from './regions/hokkaidoTohoku.js'
import { kantoData } from './regions/kanto.js'
import { chubuData } from './regions/chubu.js'
import { kansaiData } from './regions/kansai.js'
import { chugokuShikokuData } from './regions/chugokuShikoku.js'
import { kyushuOkinawaData } from './regions/kyushuOkinawa.js'

export const regionalPrefectureData = {
  ...hokkaidoTohokuData,
  ...kantoData,
  ...chubuData,
  ...kansaiData,
  ...chugokuShikokuData,
  ...kyushuOkinawaData,
}

export const flattenedPrefectures = Object.entries(regionalPrefectureData).flatMap(
  ([region, prefectures]) => prefectures.map((prefecture) => ({ ...prefecture, region })),
)

export const regionsList = [
  'Hokkaido',
  'Tohoku',
  'Kanto',
  'Chubu',
  'Kansai',
  'Chugoku',
  'Shikoku',
  'Kyushu',
  'Okinawa',
]
