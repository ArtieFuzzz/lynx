import type { Dispatcher } from 'undici'

declare const enum SendAs {
	JSON = 'json',
	Buffer = 'buffer',
	Form = 'form'
}

declare namespace Lynx {
  export class LynxClient<T> {
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

	export class LynxResponse<T = unknown> {
		protected data: Buffer
		protected headers: { [k: string]: any }
		public code: number
		constructor()
		// public pushChunk(chunk: Uint8Array[] | Buffer[]): Buffer
		// public parseHeaders(headers: string[]): void
		get json(): T
		get text(): string
		get buffer(): Buffer
	}
}

declare const request: <T = unknown>(url: string, method?: Dispatcher.HttpMethod) => Lynx.LynxRequest<T>

export interface IMiddleware {
  readonly name: string
  init?(): void
  onResponse<T>(client: Lynx.LynxClient<T>, res: LynxResponse<T>): void
  onFinish?(): void
}

export { request, SendAs }
export as namespace Lynx
