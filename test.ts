import { request, SendTypes } from './src/index';

(async () => {
	console.log((await request('https://jsonplaceholder.typicode.com/posts/1').send()).json)
})();

(async () => {
	const res = await request('https://jsonplaceholder.typicode.com/posts', 'POST')
		.body({
			title: 'hello world!',
			body: 'foobar',
			userId: 101
		}, SendTypes.JSON)
		.send()

	console.log(res.text)
})();
