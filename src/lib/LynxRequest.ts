import { isObject } from '@artiefuzzz/utils'
import { Client, Dispatcher } from 'undici'
import { URL } from 'url'
import { SendAs } from '../types'
import LynxResponse from './LynxResponse'

const { version } = require('../../package.json')

class Lynx<T> {
  private reqBody?: string | Record<string, unknown> | unknown[] | Buffer
  private url: URL
  private userAgent: string
  private reqHeaders: Record<string, any>
  private client: Client
  private method: Dispatcher.HttpMethod
  constructor(url: string, method: Dispatcher.HttpMethod) {
    this.method = method
    this.reqBody = undefined
    this.url = new URL(url)
    this.userAgent = `@artiefuzzz/lynx (v${version}, https://github.com/ArtieFuzzz/Lynx)`
    this.client = new Client(this.url.origin)
    this.reqHeaders = {}
  }

  query(obj: { [K: string]: string }): this
  query(name: string, value: any): this
  public query(name: string | { [K: string]: string }, value?: string) {
    if (typeof name === 'string') {
      if (this.url.searchParams.has(name.toLowerCase())) return this

      this.url.searchParams.append(name, value!)
    } else if (isObject(name)) {
      for (const [key, value] of Object.entries(name)) {
        if (this.url.searchParams.has(key)) continue

        return this.url.searchParams.append(key, value)
      }
    } else {
      throw Error(`Expected query to be a string or object but instead got ${typeof name === 'object' ? 'array/null' : typeof name}`)
    }

    return this
  }

  headers(obj: { [K: string]: any }): this
  headers(name: string, value: any): this
  public headers(name: string | { [K: string]: any }, value?: any) {
    if (typeof name === 'string') {
      if (this.reqHeaders.hasOwnProperty(name)) return this

      this.reqHeaders[name.toLowerCase()] = value
    } else if (isObject(name)) {
      for (const [key, value] of Object.entries(name)) {
        if (this.reqHeaders.hasOwnProperty(key)) continue;

        this.reqHeaders[key.toLowerCase()] = value
      }
    } else {
      throw Error(`Expected headers to be a string or object but instead got ${typeof name === 'object' ? 'array/null' : typeof name}`)
    }

    return this
  }

  public body(data: Record<string, any> | Buffer, sendAs: SendAs) {
    if (sendAs === SendAs.JSON) {
      if (!this.reqHeaders.hasOwnProperty('content-type')) this.headers('content-type', 'application/json')
      this.reqBody = data
    }

    if (sendAs === SendAs.Buffer) {
      if (!this.reqHeaders.hasOwnProperty('content-type')) this.headers('content-type', 'application/octet-stream')
      this.reqBody = data
    }

    return this
  }

  public agent(ua: string) {
    this.userAgent = ua

    return this
  }

  public async send(): Promise<LynxResponse<T>> {
    return new Promise((resolve, reject) => {
      this.headers('User-Agent', this.userAgent)
      
      const options: Dispatcher.RequestOptions = {
        method: this.method,
        path: this.url.pathname + this.url.search,
        headers: this.reqHeaders,
        body: this.reqBody instanceof Buffer ? this.reqBody : typeof this.reqBody === 'object' ? JSON.stringify(this.reqBody) : this.reqBody
      }

      const res = new LynxResponse<T>(this.client)
      const data: Uint8Array[] | Buffer[] = []

      this.client.dispatch(options, {
        onData(chunk) {
          data.push(chunk)
          return true
        },
        onError(err) {
          return reject(err)
        },
        onHeaders(status, headers, resume) {
          res.code = status
          res.parseHeaders(headers ?? [])
          resume()

          return true
        },
        onComplete: () => {
          this.client.close()

          res.pushChunck(data)

          return resolve(res)
        },
        onConnect: () => null,
        onUpgrade: () => null
      })
    })
  }
}

export const request = <T = unknown>(url: string, method: Dispatcher.HttpMethod = 'GET') => new Lynx<T>(url, method)