import type { ClientRequest } from 'http'
import * as http from 'http'
import * as https from 'https'
import { URL } from 'url'
import LynxResponse from './LynxReponse'
import { SendTypes } from './types'

class Lynx {
	private reqBody?: string | Record<string, unknown>
	private url: URL
	private method: string
	private userAgent: string
	private data: Array<Buffer>
	private reqHeaders: Record<string, string | number>
	constructor(url: string, method = 'GET') {
		this.url = new URL(url)
		this.method = method
		this.userAgent = 'Lynx/v1'
		this.data = []
		this.reqBody = undefined
		this.reqHeaders = {
			"User-Agent": this.userAgent
		}
	}
	
	public query (query: Record<string, string>) {
		Object.keys(query).forEach(key => {
			this.url.searchParams.append(key, query[key])
		})

		return this
	}

	public headers (headers: Record<string, string>) {
		Object.keys(headers).forEach(key => {
			Object.assign(this.reqHeaders, key)
		})

		return this
	}

	public body (data: Record<string, string | number>, sendAs: SendTypes) {
		if (sendAs === SendTypes.JSON) {
			this.reqHeaders['Content-Type'] = 'application/json'
			this.reqBody = JSON.stringify(data)
		}

		if (sendAs === SendTypes.Buffer) {
			this.reqHeaders['Content-Type'] = 'application/octet-stream'
			this.reqBody = data
		}

		return this
	}

	public async send(): Promise<LynxResponse> {
		return new Promise((resolve, reject) => {
			if (this.reqBody) {
				if (!this.reqHeaders['Content-Length']) this.reqHeaders['Content-Length'] = Buffer.byteLength(this.reqBody.toString())
			}
			let req: ClientRequest

			if (this.url.protocol  === 'http:') {
				req = http.request({
					method: this.method,
					hostname: this.url.hostname,
					port: this.url.port,
					protocol: this.url.protocol,
					path: this.url.pathname + this.url.search,
					headers: this.reqHeaders
				}, (res) => {
					res.on('error', (err) => reject(err))
					res.on('data', (d) => this.data.push(d))
					res.on('end', () => {
						return resolve(new LynxResponse(this.data.toString()))
					})
				})

				if (this.reqBody) req.write(this.reqBody)

				return req.end()
			} else if (this.url.protocol === 'https:') {
				req = https.request({
					method: this.method,
					hostname: this.url.hostname,
					port: this.url.port,
					protocol: this.url.protocol,
					path: this.url.pathname + this.url.search,
					headers: this.reqHeaders
				}, (res) => {
					res.on('error', (err) => reject(err))
					res.on('data', (d) => this.data.push(d))
					res.on('end', () => {
						return resolve(new LynxResponse(this.data.toString()))
					})
				})

				if (this.reqBody) req.write(this.reqBody)

				return req.end()
			} else {
				throw Error('Invalid protocol')
			}
		})
	}
}

export const request = (url: string, method = 'GET') => new Lynx(url, method)
