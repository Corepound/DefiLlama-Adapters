const { getChainTvl } = require('../helper/getUniSubgraphTvl');
const { get } = require('../helper/http');
const { getUniTVL } = require('../helper/unknownTokens');

const v2graph = getChainTvl({
  ethereum: 'A3Np3RQbaBA6oKJgiwDJeo5T3zrYfGHPWFYayMwtNDum'
})

module.exports = {
  misrepresentedTokens: true,
  methodology: `Counts the tokens locked on AMM pools, pulling the data from the 'ianlapham/uniswapv2' subgraph`,
  ethereum: {
    tvl: v2graph('ethereum'),
  },
}

const config = {
  // ethereum: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
  optimism: '0x0c3c1c532F1e39EdF36BE9Fe0bE1410313E074Bf',
  arbitrum: '0xf1D7CC64Fb4452F05c498126312eBE29f30Fbcf9',
  avax: '0x9e5A52f57b3038F1B8EeE45F28b3C1967e22799C',
  base: '0x8909dc15e40173ff4699343b6eb8132c65e18ec6',
  bsc: '0x8909Dc15e40173Ff4699343b6eB8132c65e18eC6',
  polygon: '0x9e5A52f57b3038F1B8EeE45F28b3C1967e22799C',
  celo: '0x79a530c8e2fA8748B7B40dd3629C0520c2cCf03f',
  zora: '0x0F797dC7efaEA995bB916f268D919d0a1950eE3C',
  unichain: '0x1F98400000000000000000000000000000000002',
}

Object.keys(config).forEach(chain => {
  const factory = config[chain]
  module.exports[chain] = {
    tvl: getUniTVL({ factory, useDefaultCoreAssets: true, })
  }
})

module.exports.isHeavyProtocol = true

const graphChains = ['base']
graphChains.forEach(chain => {
  module.exports[chain] = { tvl: tvlViaGraph }
})

async function tvlViaGraph(api) {
  const endpoint = `https://interface.gateway.uniswap.org/v2/uniswap.explore.v1.ExploreStatsService/ProtocolStats?connect=v1&encoding=json&message=%7B%22chainId%22%3A%22${api.chainId}%22%7D`
  const res = await get(endpoint, {
    headers: {
      'origin': 'https://app.uniswap.org',
    } 
  })
  const v2 = res.dailyProtocolTvl.v2
  const tvl = v2[v2.length - 1].value
  api.addUSDValue(tvl)
}