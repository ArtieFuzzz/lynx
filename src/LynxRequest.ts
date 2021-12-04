import type { ClientRequest } from 'http'
import * as http from 'http'
import * as https from 'https'
import { URL } from 'url'
import LynxResponse from './LynxReponse'

export default class Lynx {
	private body?: Record<string, unknown>
	private url: URL
	private method: string
	private userAgent: string
	private data: Array<Buffer>
	constructor(url: string, method = 'GET') {
		this.url = new URL(url)
		this.method = method
		this.userAgent = 'Lynx/v1'
		this.data = []
		this.body = undefined
	}

	public async send(): Promise<LynxResponse> {
		return new Promise((resolve, reject) => {
			let req: ClientRequest

			if (this.url.protocol === 'https:') {
				req = https.request({
					method: this.method,
					hostname: this.url.hostname,
					protocol: this.url.protocol,
					path: this.url.pathname + this.url.search,
					headers: {
						"User-Agent": this.userAgent
					}
				}, (res) => {
					res.on('error', (err) => reject(err))
					res.on('data', (d) => this.data.push(d))
					res.on('end', () => {
						return resolve(new LynxResponse(this.data.toString()))
					})
				})

				if (this.body) req.write(this.body)

				return req.end()
			}
			if (this.url.protocol  === 'http:') {
				req = http.request({
					method: this.method,
					hostname: this.url.hostname,
					protocol: this.url.protocol,
					path: this.url.search,
					headers: {
						"User-Agent": this.userAgent
					}
				}, (res) => {
					res.on('error', (err) => reject(err))
					res.on('data', (d) => this.data.push(d))
					res.on('end', () => {
						return resolve(new LynxResponse(this.data.toString()))
					})
				})

				if (this.body) req.write(this.body)

				return req.end()
			} else {
				throw Error('Invalid protocol')
			}
		})
	}
}
