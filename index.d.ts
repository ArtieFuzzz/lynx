import type { Client, Dispatcher } from 'undici'
import type { SendAs } from './src/types'

declare namespace Lynx {
	class LynxRequest<T> {
		private reqBody?
		private url
		private userAgent
		private reqHeaders
		private client
		private method
		constructor(url: string, method: Dispatcher.HttpMethod)
		query(obj: {
			[K: string]: string
		}): this
		query(name: string, value: any): this
		headers(obj: {
			[K: string]: any
		}): this
		headers(name: string, value: any): this
		body(data: Record<string, any> | Buffer, sendAs: SendAs): this
		agent(ua: string): this
		send(): Promise<LynxResponse<T>>
	}

	class LynxResponse<T = unknown> {
		protected data: Buffer
		protected client: any
		protected headers: {
			[k: string]: any
		}
		code: number
		constructor(client: Client)
		pushChunck(chunk: Uint8Array[] | Buffer[]): Buffer
		parseHeaders(headers: string[]): void
		get json(): T
		get text(): string
		get buffer(): Buffer
	}
}

declare const request: <T = unknown>(url: string, method?: Dispatcher.HttpMethod) => Lynx.LynxResponse<T>

export = request
export as namespace Lynx
