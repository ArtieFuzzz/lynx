import type { Client, Dispatcher } from 'undici'

declare const enum SendAs {
	JSON = 'json',
	Buffer = 'buffer',
	Form = 'form'
}

declare namespace Lynx {
	class LynxRequest<T> {
		private reqBody?
		private url
		private userAgent
		private reqHeaders
		private client
		private method
		constructor(url: string, method: Dispatcher.HttpMethod)
		public query(obj: { [K: string]: string }): this
		public query(name: string, value: any): this
		public headers(obj: { [K: string]: any }): this
		public headers(name: string, value: any): this
		public body(data: Record<string, any> | Buffer, sendAs: SendAs): this
		public agent(ua: string): this
		public send(): Promise<LynxResponse<T>>
	}

	class LynxResponse<T = unknown> {
		protected data: Buffer
		protected client: any
		protected headers: { [k: string]: any }
		public code: number
		constructor(client: Client)
		public pushChunck(chunk: Uint8Array[] | Buffer[]): Buffer
		public parseHeaders(headers: string[]): void
		get json(): T
		get text(): string
		get buffer(): Buffer
	}
}

declare const request: <T = unknown>(url: string, method?: Dispatcher.HttpMethod) => Lynx.LynxRequest<T>

export { request, SendAs }
export as namespace Lynx
