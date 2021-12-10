export default class LynxResponse<T = unknown> {
  protected data!: Buffer
  protected client: any
  protected headers: Record<string, unknown | string[]>
  public code: number
  constructor(client: any) {
    this.code = 0
    this.client = client
    this.headers = {}
  }

  pushChunck(chunk: Uint8Array[] | Buffer[]) {
    const length = this.headers['content-length'] as string
    this.data = Buffer.concat(chunk, length !== undefined ? Number(length) : undefined)
  }

  parseHeaders(headers: string[]) {
    for (const header of headers) {
      let val = this.headers[header]

      if (val !== undefined) {
        if (!Array.isArray(val)) {
          val = [val]
          this.headers[header] = val
        }
        (val as any[]).push(header);
      } else {
        this.headers[header] = val;
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
