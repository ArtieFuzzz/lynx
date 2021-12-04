import { equal } from 'assert';
import { request, SendAs } from '../src/index';

export async function Get() {
	console.time('Get')
	const res = await request('https://jsonplaceholder.typicode.com/todos/1').send()

	equal(typeof res.json, 'object')
	console.timeEnd('Get')
}

export async function Post() {
	console.time('Post')
	const res = await request<TypicodePostsReponse>('https://jsonplaceholder.typicode.com/posts', 'POST')
		.body({
			title: 'hello world!',
			body: 'foobar',
			userId: 101
		}, SendAs.JSON)
		.send()

	equal(typeof res.json,'object')
	console.timeEnd('Post')
}

interface TypicodePostsReponse {
	title: string,
	body: string
	userId: number
}
