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
import { fetch } from '@artiefuzzz/lynx'

const response = await fetch('https://jsonplaceholder.typicode.com/todos/1').send()

console.log(response.json)
```

Simple `POST` request:

```js
import { fetch, SendAs, Methods } from '@artiefuzzz/lynx'

const response = await fetch('https://jsonplaceholder.typicode.com/posts', Methods.Get)
		.body({
			title: 'Hello World!',
			body: 'foobar',
			userId: 101
		}, SendAs.JSON)
		.send()

console.log(response.json)
``` 
