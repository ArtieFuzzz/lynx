import { equal } from 'assert';
import { request, SendTypes } from '../src/index';

export async function Get() {
	const res = await request('https://jsonplaceholder.typicode.com/todos/1').send()

	equal(typeof res.json, 'object')
}

export async function Post() {
	const res = await request<TypicodePostsReponse>('https://jsonplaceholder.typicode.com/posts', 'POST')
		.body({
			title: 'hello world!',
			body: 'foobar',
			userId: 101
		}, SendTypes.JSON)
		.send()

	equal(typeof res.json,'object')
}

interface TypicodePostsReponse {
	title: string,
	body: string
	userId: number
}
