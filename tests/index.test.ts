import { StopWatch } from '@artiefuzzz/utils';
import { equal } from 'assert';
import { request, SendAs } from '../src/index';

export async function UserAgent() {
  const watch = new StopWatch(2);
  const _res = await request<HttparrotGetReponse>('https://httparrot.herokuapp.com/get')
    .agent('Lynx HTTP Client Test (github.com/ArtieFuzzz/lynx)')
    .send()
  const res = _res.json

  equal(res.headers['user-agent'], 'Lynx HTTP Client Test (github.com/ArtieFuzzz/lynx)')

  console.log(`User Agent: ${watch.stop()}`)
}

export async function Headers() {
  const watch = new StopWatch(2);
  const _res = await request<HttparrotGetReponse>('https://httparrot.herokuapp.com/get')
    .headers('lynx', true)
    .send()
  const res = _res.json

  equal(res.headers['lynx'], 'true')

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

  const res = await request<TypicodePostsReponse>('https://jsonplaceholder.typicode.com/posts', 'POST')
    .body({
      title: 'hello world!',
      body: 'foobar',
      userId: 1
    }, SendAs.JSON)
    .send()

  equal(typeof res.json, 'object')
  console.log(`Post: ${watch.stop()}`)

}

export interface HttparrotGetReponse {
  args: Args;
  headers: { [key: string]: string };
  url: string;
  origin: string;
}

export interface Args {
}

interface TypicodePostsReponse {
  title: string,
  body: string
  userId: number
}
