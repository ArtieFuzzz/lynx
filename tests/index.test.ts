import { StopWatch } from '@artiefuzzz/utils';
import { equal } from 'assert';
import { Methods, request, SendAs } from '../src/index';

export async function Get() {
	const watch = new StopWatch(2)
	const res = await request('https://jsonplaceholder.typicode.com/todos/1').send()

	equal(typeof res.json, 'object')

	console.log(`Get: ${watch.stop()}`)
}

export async function Post() {
	const watch = new StopWatch(2)

	const res = await request<TypicodePostsReponse>('https://jsonplaceholder.typicode.com/posts', Methods.Post)
		.body({
			title: 'hello world!',
			body: 'foobar',
			userId: 101
		}, SendAs.JSON)
		.send()

	equal(typeof res.json, 'object')
	console.log(`Post: ${watch.stop()}`)

}

interface TypicodePostsReponse {
	title: string,
	body: string
	userId: number
}
