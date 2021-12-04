import request from './src/index'

(async () => {
	console.log((await request('htts://rt-03.s3.ap-southeast-2.amazonaws.com/animals/2EPZuYEwkU.jpg').send()).buffer)
})()
