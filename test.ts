import request from './src/index'

(async () => {
	console.log((await request('https://jsonplaceholder.typicode.com/posts').send()).json)
})()
