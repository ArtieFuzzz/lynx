import type { LynxClient } from './LynxRequest'
import type LynxResponse from './LynxResponse'

export interface IMiddleware {
  readonly name: string
  init?(): void
  onResponse<T>(client: LynxClient<T>, res: LynxResponse<T>): void
  onFinish?(): void
}
