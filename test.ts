import request from './index'

(async () => {
	console.log(await (await request('https://jsonplaceholder.typicode.com/posts/1').send()).json)
})()
