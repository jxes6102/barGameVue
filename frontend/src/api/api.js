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
