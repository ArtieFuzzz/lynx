export default class LynxResponse {
	protected data: string
	constructor(data: string) {
		this.data = data
	}

	get json() {
		return JSON.parse(this.data)
	}

	get text() {
		return this.data
	}

	get buffer() {
		return Buffer.from(this.data)
	}
}
