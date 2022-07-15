# Request Docs + Examples

> All of these examples are in TypeScript

## Simple `GET` Request

```ts
import { request } from '@artiefuzzz/lynx'

const response = await request(
  'https://jsonplaceholder.typicode.com/todos/1'
).send();

console.log(response.json);
```

## Simple `POST` Request

```ts
import { request, SendAs } from '@artiefuzzz/lynx'

const response = await request(
  'https://jsonplaceholder.typicode.com/posts,
  'POST'
)
  .body(
    {
      title: 'Hello World!',
      body: 'foobar',
      userId: 101,
    },
    SendAs.JSON
  )
  .send();

console.log(response.json);
```
