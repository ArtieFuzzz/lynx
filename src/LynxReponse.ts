import type * as http from 'http'

export default class LynxResponse<T = unknown> {
  protected data!: Buffer
  protected client: http.IncomingMessage
  constructor(res: http.IncomingMessage) {
    this.client = res
  }

  pushChunck(chunk: Uint8Array[] | Buffer[]) {
    const length = this.client.headers['content-length'] as string
    this.data = Buffer.concat(chunk, length !== undefined ? Number(length) : undefined)
  }

  get json(): T {
    return JSON.parse(this.data.toString('utf-8'))
  }

  get text() {
    return this.data.toString('utf-8')
  }

  get buffer() {
    return this.data
  }
}
