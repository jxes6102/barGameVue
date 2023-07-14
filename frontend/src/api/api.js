import request from '@/api/index'

export const getHistory = (data) => {
  const url = '/gethistory'
  const method = 'get'
  return request({
    method,
    url,
    data,
  })
}

export const getTime = (data) => {
  const url = '/getTime'
  const method = 'get'
  return request({
    method,
    url,
    data,
  })
}

export const getTest = (data) => {
  const url = '/'
  const method = 'get'
  return request({
    method,
    url,
    data,
  })
}
