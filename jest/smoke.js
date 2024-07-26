/* eslint-disable @typescript-eslint/no-var-requires */
const axios = require('axios')
const STAGING_URL = 'https://api.subquery.network/sq/centrifuge/pools-multichain__Y2Vud'

async function subql(query) {
  const response = await axios.post('/', { query }, { baseURL: STAGING_URL }).catch((err) => err.response.data)
  return response.data
}

global.subql = subql
