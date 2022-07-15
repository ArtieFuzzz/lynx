import { StopWatch } from '@artiefuzzz/utils'
import { equal } from 'assert/strict'
import { IMiddleware, request, SendAs, StatusCode } from '../src/index'

const helloware: IMiddleware = {
  name: 'hello',
  onResponse(_client, res) {
    if (res.code === StatusCode.OK) {
      console.log('OK')
      
      return
    }
    return
  }
}

export async function Middleware() {
  const watch = new StopWatch(2)
  await request('https://httparrot.herokuapp.com/get')
    .use(helloware)
    .agent('Lynx HTTP Client Test (github.com/ArtieFuzzz/lynx)')
    .send()

  console.log(`Middleware: ${watch.stop()}`)
}

export async function UserAgent() {
  const watch = new StopWatch(2);
  const _res = await request<HttparrotGetResponse>('https://httparrot.herokuapp.com/get')
    .agent('Lynx HTTP Client Test (github.com/ArtieFuzzz/lynx)')
    .send()
  const res = _res.json

  equal(res?.headers['user-agent'], 'Lynx HTTP Client Test (github.com/ArtieFuzzz/lynx)')

  console.log(`User Agent: ${watch.stop()}`)
}

export async function Headers() {
  const watch = new StopWatch(2);
  const _res = await request<HttparrotGetResponse>('https://httparrot.herokuapp.com/get')
    .headers('lynx', true)
    .send()
  const res = _res.json

  equal(res?.headers['lynx'], 'true')

  console.log(`Headers: ${watch.stop()}`)
}

export async function Get() {
  const watch = new StopWatch(2)
  const res = await request('https://jsonplaceholder.typicode.com/todos/1').send()

  equal(typeof res.json, 'object')

  console.log(`Get: ${watch.stop()}`)
}

export async function Post() {
  const watch = new StopWatch(2)

  const res = await request<TypicodePostsResponse>('https://jsonplaceholder.typicode.com/posts', 'POST')
    .body({
      title: 'hello world!',
      body: 'foobar',
      userId: 1
    }, SendAs.JSON)
    .send()

  equal(typeof res.json, 'object')
  console.log(`Post: ${watch.stop()}`)

}

export interface HttparrotGetResponse {
  args: unknown
  headers: { [key: string]: string }
  url: string
  origin: string
}

interface TypicodePostsResponse {
  title: string
  body: string
  userId: number
}
