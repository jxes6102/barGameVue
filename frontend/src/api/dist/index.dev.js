"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _callee;
exports.TIMEOUT = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var TIMEOUT = 10000; // const DEFAULT_CACHE_EXPIRY_TIME = 3000
// https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-391D3550-2FAB-43F0-AA4D-06929689EB22

exports.TIMEOUT = TIMEOUT;
var CONFIG = {
  // baseURL: 'http://127.0.0.1:5000',
  // baseURL: 'https://ttlinblog.com',
  timeout: TIMEOUT
};

var instance = _axios["default"].create(CONFIG);

instance.interceptors.request.use(function (config) {
  // before request is sent
  // console.log('interceptors.request config',config)
  return config;
}, function (error) {
  // console.log('interceptors.request error',error)
  // request error
  return Promise.reject(error);
});
instance.interceptors.response.use(function (response) {
  // Do something with response data
  // console.log('interceptors.response response',response)
  return response;
}, function (error) {
  // console.log('interceptors.response error',error)
  return Promise.reject(error);
});
/**
 * @param {string} method http的request methods
 * @param {string} url 同axios的url
 * @param {object} data axios收的params或data(依method決定)
 * @param {number} timeout(optional) 同axios config中的timeout
 * @param {number} noCache(optional) method為get 且傳入true時 不使用既有的快取
 */

function _callee(_ref) {
  var _ref$method, method, _ref$url, url, data, timeout, noCache, config;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _ref$method = _ref.method, method = _ref$method === void 0 ? '' : _ref$method, _ref$url = _ref.url, url = _ref$url === void 0 ? '' : _ref$url, data = _ref.data, timeout = _ref.timeout, noCache = _ref.noCache;
          // console.log('b')
          config = {
            timeout: timeout,
            noCache: noCache
          };
          method = method.toLowerCase();
          _context.t0 = method;
          _context.next = _context.t0 === 'get' ? 6 : _context.t0 === 'post' ? 7 : _context.t0 === 'delete' ? 8 : _context.t0 === 'put' ? 10 : _context.t0 === 'patch' ? 11 : 12;
          break;

        case 6:
          return _context.abrupt("return", instance.get(url, {
            params: data
          }, config));

        case 7:
          return _context.abrupt("return", instance.post(url, data, config));

        case 8:
          config.params = data;
          return _context.abrupt("return", instance["delete"](url, config));

        case 10:
          return _context.abrupt("return", instance.put(url, data, config));

        case 11:
          return _context.abrupt("return", instance.patch(url, data, config));

        case 12:
          return _context.abrupt("return", Promise.reject());

        case 13:
        case "end":
          return _context.stop();
      }
    }
  });
}