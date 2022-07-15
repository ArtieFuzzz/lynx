# Middleware

> All of these examples are in TypeScript

With middleware, you can do whatever you'd like with the Response from a Request (You cannot modify data with middleware)

Example of a simple middle ware:

```ts
import { IMiddleware } from '@artiefuzzz/lynx'

const middleware: IMiddleware {
  name: '', // This is required 
  init() {}, // Called when we send our Request - Optional
  onFinish() {}, // Called when we finish our Request - Optional
  onResponse(client, res) {} // Called when we receive a Response - This is required
}
```
