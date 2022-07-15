import { StatusCode } from '../types'

export default class LynxResponse<T = unknown> {
  private data!: Buffer
  public headers: { [k: string]: any }
  public code: StatusCode
  constructor() {
    this.code = 0
    this.headers = {}
  }

  public pushChunk(chunk: Uint8Array[] | Buffer[]) {
    const length = this.headers['content-length'] as string
    return this.data = Buffer.concat(chunk, length !== undefined ? Number(length) : undefined)
  }

  public parseHeaders(headers: string[]) {
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

  /**
   * Returns the Response in JSON.
   * If the response code is 204 it will return an null.
   */
  get json(): T | null {
    if (this.code === StatusCode.NO_CONTENT) {
      return null
    }

    return JSON.parse(this.data.toString('utf-8'))
  }

  /**
   * Returns the Response in Text. (utf-8)
   */
  get text() {
    if (this.code === StatusCode.NO_CONTENT) {
      return null
    }

    return this.data.toString('utf-8')
  }

  /**
   * Returns the body as a Buffer. (Raw data)
   * This will enable you to serialize data yourself.
   */
  get buffer() {
    return this.data ?? null
  }
}
