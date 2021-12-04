import type { ClientRequest } from 'http'
import * as http from 'http'
import * as https from 'https'
import { URL } from 'url'
import * as zlib from 'zlib'
import LynxResponse from './LynxReponse'
import { SendAs } from './types'

class Lynx<T> {
	private compress: boolean
	private reqBody?: string | Record<string, unknown>
	private url: URL
	private method: string
	private userAgent: string
	private data: Array<Buffer>
	private reqHeaders: Record<string, string | number>
	constructor(url: string, method = 'GET') {
		this.compress = false
		this.url = new URL(url)
		this.method = method
		this.userAgent = 'Lynx/v1'
		this.data = []
		this.reqBody = undefined
		this.reqHeaders = {
			"User-Agent": this.userAgent
		}
	}

	public compression() {
		this.compress = true

		return this
	}

	public query(query: Record<string, string>) {
		Object.keys(query).forEach(key => {
			this.url.searchParams.append(key, query[key])
		})

		return this
	}

	public headers(headers: Record<string, string>) {
		Object.keys(headers).forEach(key => {
			Object.assign(this.reqHeaders, key)
		})

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
				if (this.compress) {
					if (res.headers['Content-Encoding'] === 'gzip') res.pipe(zlib.createGzip()) 
					if (res.headers['Content-Encoding'] === 'deflate') res.pipe(zlib.createDeflate())
				}
				res.on('error', (err) => err)
				res.on('data', (d) => this.data.push(d))
				res.on('end', () => {
					return resolve(new LynxResponse(this.data))
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

export const request = <T = unknown>(url: string, method = 'GET') => new Lynx<T>(url, method)
