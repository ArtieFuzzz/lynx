import type { ClientRequest } from 'http'
import * as http from 'http'
import * as https from 'https'
import { URL } from 'url'
import * as zlib from 'zlib'
import { Methods } from '.'
import LynxResponse from './LynxReponse'
import { SendAs } from './types'

class Lynx<T> {
	private compression: boolean
	private reqBody?: string | Record<string, unknown>
	private url: URL
	private method: string
	private userAgent: string
	private reqHeaders: Record<string, string | number>
	constructor(url: string, method = Methods.Get) {
		this.compression = false
		this.url = new URL(url)
		this.method = method
		this.userAgent = 'Lynx/v1'
		this.reqBody = undefined
		this.reqHeaders = {
			"User-Agent": this.userAgent
		}
	}

	public compress() {
		this.compression = true

		return this
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

			let req: ClientRequest

			const Handler = (res: http.IncomingMessage) => {
				const data = new LynxResponse<T>(res)
				const chunks: Buffer[] | Uint8Array[] = []

				if (this.compression) {
					if (res.headers['Content-Encoding'] === 'gzip') res.pipe(zlib.createGzip())
					if (res.headers['Content-Encoding'] === 'deflate') res.pipe(zlib.createDeflate())
				}
				res.on('error', (err) => err)
				res.on('data', (d) => chunks.push(d))
				res.on('end', () => {
					data.pushChunck(chunks)

					return resolve(data)
				})
			}

			if (this.url.protocol === 'http:') {
				req = http.request({
					method: this.method,
					hostname: this.url.hostname,
					port: this.url.port,
					protocol: this.url.protocol,
					path: this.url.pathname + this.url.search,
					headers: this.reqHeaders
				}, Handler)
			} else if (this.url.protocol === 'https:') {
				req = https.request({
					method: this.method,
					hostname: this.url.hostname,
					port: this.url.port,
					protocol: this.url.protocol,
					path: this.url.pathname + this.url.search,
					headers: this.reqHeaders
				}, Handler)
			} else {
				throw Error('Protocol must be http:// or https://')
			}

			req.on('error', (err) => {
				reject(err.message)
			})

			if (this.reqBody) req.write(this.reqBody)

			return req.end()
		})
	}
}

function isObject(obj: any): boolean {
	if (!Object.keys(obj).length) return false

	return true
}

export const request = <T = unknown>(url: string, method = Methods.Get) => new Lynx<T>(url, method)
