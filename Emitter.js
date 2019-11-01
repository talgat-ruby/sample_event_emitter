class Emitter {
	#events = {};

	constructor() {
		this.addListener = this.on.bind(this);
	}

	on(name, listener) {
		if (!Array.isArray(this.#events[name])) {
			this.removeAllListeners(name);
		}
		this.#events[name].push(listener);

		return this;
	}

	once(name, listener) {
		if (!Array.isArray(this.#events[name])) {
			this.removeAllListeners(name);
		}

		const func = (...args) => {
			listener(...args);
			this.removeListener(name, func);
		};
		this.#events[name].push(func);

		return this;
	}

	emit(name, ...args) {
		const listeners = this.#events[name] || [];
		for (const listener of listeners) {
			listener(...args);
		}

		return this;
	}

	removeListener(name, listener) {
		const listeners = this.#events[name].filter(l => listener !== l);
		this.#events[name] = listeners;

		return this;
	}

	removeAllListeners(name) {
		if (!name) {
			this.#events = {};
		} else {
			this.#events[name] = [];
		}

		return this;
	}
}

module.exports = Emitter;
