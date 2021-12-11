import type { Client } from "undici"

export default class LynxResponse<T = unknown> {
  protected data!: Buffer
  protected client: any
  protected headers: { [k: string]: any }
  public code: number
  constructor(client: Client) {
    this.code = 0
    this.client = client
    this.headers = {}
  }

  pushChunck(chunk: Uint8Array[] | Buffer[]) {
    const length = this.headers['content-length'] as string
    return this.data = Buffer.concat(chunk, length !== undefined ? Number(length) : undefined)
  }

  parseHeaders(headers: string[]) {
    for (let i = 0; i < headers.length; i += 2) {
      const key = headers[i]
      const value = headers[i + 1] as unknown as Buffer

      let val = this.headers[key]

      if (val !== undefined) {
        if (!Array.isArray(val)) {
          val = [val]
          this.headers[key] = val
        }

        val.push(headers[i])
      } else {
        this.headers[key] = value.toString('utf-8')
      }
    }
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
