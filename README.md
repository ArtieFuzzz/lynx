# @artiefuzzz/lynx

> Lightweight HTTP client

## Installation

NPM:

```
npm install @artiefuzzz/lynx
```

Yarn:

```
yarn add @artiefuzzz/lynx
```

## Usage

**Note**: Although we are using `import { fetch } from '@artiefuzzz/lynx'` it still is the same as using `const { fetch } = require('@artiefuzzz/lynx')`

Simple `GET` request:

```js
import { request } from "@artiefuzzz/lynx";

const response = await request(
  "https://jsonplaceholder.typicode.com/todos/1"
).send();

console.log(response.json);
```

Simple `POST` request:

```js
import { request, SendAs } from "@artiefuzzz/lynx";

const response = await request(
  "https://jsonplaceholder.typicode.com/posts",
  "POST"
)
  .body(
    {
      title: "Hello World!",
      body: "foobar",
      userId: 101,
    },
    SendAs.JSON
  )
  .send();

console.log(response.json);
```

If you encounter an issue please open a Issue on the Repository [here](https://github.com/ArtieFuzzz/lynx/issues/new/choose)
