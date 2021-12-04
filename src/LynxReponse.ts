import { Blob } from 'buffer'

export default class LynxResponse<T> {
	protected data: Array<Buffer>
	constructor(data: Array<Buffer>) {
		this.data = data
	}

	get json(): T {
		return JSON.parse(this.data.toString())
	}

	get text() {
		return this.data.toString()
	}

	get buffer() {
		return Buffer.from(this.data.toString())
	}

	get blob() {
		return new Blob(this.data)
	}
}
