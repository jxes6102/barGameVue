import request from '@/api/index'

export const getHistory = (data) => {
  const url = '/api/gethistory'
  const method = 'get'
  return request({
    method,
    url,
    data,
  })
}

export const getTime = (data) => {
  const url = '/api/getTime'
  const method = 'get'
  return request({
    method,
    url,
    data,
  })
}

export const getTest = (data) => {
  const url = '/api'
  const method = 'get'
  return request({
    method,
    url,
    data,
  })
}

export const getLotteryList = (data) => {
  const url = '/taiwanlottery/TLCAPIWeB/Lottery/BingoResult' + addToUrl(data)
  const method = 'get'
  return request({
    method,
    url,
    data,
  })
}

export const getLotteryLatest = (data) => {
  const url = '/taiwanlottery/TLCAPIWeB/Lottery/LatestBingoResult'
  const method = 'get'
  return request({
    method,
    url,
    data,
  })
}

export const getAdvertise = () => {
  const url = '/apiv2/api/advertising/front'
  const method = 'get'
  return request({
    method,
    url,
  })
}

const addToUrl = (payload) => {
  let str = '?'
  for(let key in payload){
      str += key + '=' + payload[key] + '&'
  }
  str = str.substring(0,str.length-1)
  return str
}