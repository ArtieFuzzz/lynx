import Lynx from './LynxRequest'

const request = (url: string, method = 'GET') => new Lynx(url, method)

export default request
