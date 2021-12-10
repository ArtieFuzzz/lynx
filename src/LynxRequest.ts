import { isObject } from '@artiefuzzz/utils'
import { Client, Dispatcher } from 'undici'
import { URL } from 'url'
import LynxResponse from './LynxReponse'
import { SendAs } from './types'

class Lynx<T> {
	private reqBody?: string | Record<string, unknown>
	private url: URL
	private userAgent: string
	private reqHeaders: Record<string, string | number>
	private coreOptions: Dispatcher.RequestOptions
	private client: Client
	constructor(url: string, method: Dispatcher.HttpMethod) {
		this.url = new URL(url)
		this.userAgent = 'Lynx/v1'
		this.reqBody = undefined
		this.reqHeaders = {
			"User-Agent": this.userAgent
		}
		this.coreOptions = {
			method,
			path: this.url.pathname + this.url.searchParams
		}
		this.client = new Client(this.url.origin)
	}

	query(obj: { [K: string]: string }): this
	query(name: string, value: any): this
	public query(name: string | { [K: string]: string }, value?: string) {
		if (typeof name === 'string') {
			if (this.url.searchParams.has(name.toLowerCase())) return this

			this.url.searchParams.append(name, value!)
		} else if (isObject(name)) {
			for (const [key, value] of Object.entries(name)) {
				if (this.url.searchParams.has(key)) return this

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
			if (this.reqHeaders.hasOwnProperty(name.toLowerCase())) return this

			this.reqHeaders[name.toLowerCase()] = value
		} else if (isObject(name)) {
			Object.keys(name).forEach(key => {
				if (this.reqHeaders.hasOwnProperty(key.toLowerCase())) return this

				return this.reqHeaders[name.toLowerCase()] = value;
			})
		} else {
			throw Error(`Expected headers to be a string or object but instead got ${typeof name === 'object' ? 'array/null' : typeof name}`)
		}

		return this
	}

	public body(data: Record<string, string | number>, sendAs: SendAs) {
		if (sendAs === SendAs.JSON) {
			this.reqHeaders['Content-Type'] = 'application/json'
			this.reqBody = JSON.stringify(data)
		}

		if (sendAs === SendAs.Buffer) {
			this.reqHeaders['Content-Type'] = 'application/octet-stream'
			this.reqBody = data
		}

		return this
	}

	public async send(): Promise<LynxResponse<T>> {
		return new Promise((resolve, reject) => {
			if (this.reqBody) {
				if (!this.reqHeaders['Content-Length']) this.reqHeaders['Content-Length'] = Buffer.byteLength(this.reqBody.toString())
			}

			const res = new LynxResponse<T>(this.client)
			const data: Uint8Array[] | Buffer[] = []

			this.client.dispatch(this.coreOptions, {
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
