const Emitter = require("./Emitter");

describe("test Emitter", () => {
	const EVENT_NAME = "test";
	const EVENT_NAME2 = "test2";
	const EVENT_NAME3 = "test3";

	describe("test eventListener and on", () => {
		test("should be able to add event via addListener", () => {
			const emitter = new Emitter();
			const result = [];
			const mockCb = jest.fn(() => result.push("first"));
			const mockCb2 = jest.fn(() => result.push("second"));

			emitter.addListener(EVENT_NAME, mockCb);
			emitter.addListener(EVENT_NAME, mockCb2);

			emitter.emit(EVENT_NAME);
			expect(mockCb.mock.calls.length).toBe(1);
			expect(mockCb2.mock.calls.length).toBe(1);
			expect(result).toEqual(["first", "second"]);

			emitter.emit(EVENT_NAME);
			expect(mockCb.mock.calls.length).toBe(2);
			expect(mockCb2.mock.calls.length).toBe(2);
			expect(result).toEqual(["first", "second", "first", "second"]);
		});

		test("should be able to add event via on", () => {
			const emitter = new Emitter();
			const result = [];
			const mockCb = jest.fn(() => result.push("first"));
			const mockCb2 = jest.fn(() => result.push("second"));

			emitter.on(EVENT_NAME, mockCb);
			emitter.on(EVENT_NAME, mockCb2);
			emitter.emit(EVENT_NAME);

			expect(mockCb.mock.calls.length).toBe(1);
			expect(mockCb2.mock.calls.length).toBe(1);
			expect(result).toEqual(["first", "second"]);

			emitter.emit(EVENT_NAME);
			expect(mockCb.mock.calls.length).toBe(2);
			expect(mockCb2.mock.calls.length).toBe(2);
			expect(result).toEqual(["first", "second", "first", "second"]);
		});

		test("should be able to emit event several times", () => {
			const emitter = new Emitter();
			const mockCb = jest.fn();

			emitter.addListener(EVENT_NAME, mockCb);
			emitter.on(EVENT_NAME2, mockCb);

			emitter.emit(EVENT_NAME);
			expect(mockCb.mock.calls.length).toBe(1);

			emitter.emit(EVENT_NAME);
			expect(mockCb.mock.calls.length).toBe(2);

			emitter.emit(EVENT_NAME);
			expect(mockCb.mock.calls.length).toBe(3);

			emitter.emit(EVENT_NAME2);
			expect(mockCb.mock.calls.length).toBe(4);

			emitter.emit(EVENT_NAME2);
			expect(mockCb.mock.calls.length).toBe(5);

			emitter.emit(EVENT_NAME2);
			expect(mockCb.mock.calls.length).toBe(6);
		});

		test("should send paramers down to listener", () => {
			const ARG1 = "arg1";
			const ARG2 = "arg2";
			const emitter = new Emitter();
			const mockCb = jest.fn();

			emitter.on(EVENT_NAME, mockCb);
			emitter.emit(EVENT_NAME, ARG1, ARG2);

			expect(mockCb.mock.calls[0][0]).toBe(ARG1);
			expect(mockCb.mock.calls[0][1]).toBe(ARG2);
		});
	});

	describe("test once", () => {
		test("should be able to call event only once", () => {
			const emitter = new Emitter();
			const result = [];
			const mockCb = jest.fn(() => result.push("first"));
			const mockCb2 = jest.fn(() => result.push("second"));
			const mockCb3 = jest.fn(() => result.push("third"));

			emitter.once(EVENT_NAME, mockCb);
			emitter.once(EVENT_NAME, mockCb2);
			emitter.on(EVENT_NAME, mockCb3);

			emitter.emit(EVENT_NAME);
			expect(mockCb.mock.calls.length).toBe(1);
			expect(mockCb2.mock.calls.length).toBe(1);
			expect(mockCb3.mock.calls.length).toBe(1);
			expect(result).toEqual(["first", "second", "third"]);

			emitter.emit(EVENT_NAME);
			expect(mockCb.mock.calls.length).toBe(1);
			expect(mockCb2.mock.calls.length).toBe(1);
			expect(mockCb3.mock.calls.length).toBe(2);
			expect(result).toEqual(["first", "second", "third", "third"]);

			emitter.emit(EVENT_NAME);
			expect(mockCb.mock.calls.length).toBe(1);
			expect(mockCb2.mock.calls.length).toBe(1);
			expect(mockCb3.mock.calls.length).toBe(3);
			expect(result).toEqual(["first", "second", "third", "third", "third"]);
		});

		test("should be able to pass paramers throw once", () => {
			const ARG1 = "arg1";
			const ARG2 = "arg2";
			const emitter = new Emitter();
			const mockCb = jest.fn();
			const mockCb2 = jest.fn();

			emitter.once(EVENT_NAME, mockCb);
			emitter.once(EVENT_NAME, mockCb2);

			emitter.emit(EVENT_NAME, ARG1, ARG2);
			expect(mockCb.mock.calls[0][0]).toBe(ARG1);
			expect(mockCb.mock.calls[0][1]).toBe(ARG2);
			expect(mockCb2.mock.calls[0][0]).toBe(ARG1);
			expect(mockCb2.mock.calls[0][1]).toBe(ARG2);
		});
	});

	describe("test remove listener", () => {
		test("should be able to remove specific listener", () => {
			const emitter = new Emitter();
			const mockCb = jest.fn();
			const mockCb2 = jest.fn();
			const mockCb3 = jest.fn();

			emitter.on(EVENT_NAME, mockCb);
			emitter.on(EVENT_NAME, mockCb2);
			emitter.on(EVENT_NAME, mockCb3);

			emitter.emit(EVENT_NAME);
			expect(mockCb.mock.calls.length).toBe(1);
			expect(mockCb2.mock.calls.length).toBe(1);
			expect(mockCb3.mock.calls.length).toBe(1);

			emitter.removeListener(EVENT_NAME, mockCb2);

			emitter.emit(EVENT_NAME);
			expect(mockCb.mock.calls.length).toBe(2);
			expect(mockCb2.mock.calls.length).toBe(1);
			expect(mockCb3.mock.calls.length).toBe(2);

			emitter.removeListener(EVENT_NAME, mockCb3);

			emitter.emit(EVENT_NAME);
			expect(mockCb.mock.calls.length).toBe(3);
			expect(mockCb2.mock.calls.length).toBe(1);
			expect(mockCb3.mock.calls.length).toBe(2);
		});
	});

	describe("test remove all listeners", () => {
		test("should be able to remove all events", () => {
			const emitter = new Emitter();
			const mockCb = jest.fn();
			const mockCb2 = jest.fn();
			const mockCb3 = jest.fn();

			emitter.on(EVENT_NAME, mockCb);
			emitter.on(EVENT_NAME2, mockCb2);
			emitter.on(EVENT_NAME3, mockCb3);

			emitter.emit(EVENT_NAME);
			expect(mockCb.mock.calls.length).toBe(1);
			emitter.emit(EVENT_NAME2);
			expect(mockCb2.mock.calls.length).toBe(1);
			emitter.emit(EVENT_NAME3);
			expect(mockCb3.mock.calls.length).toBe(1);

			emitter.removeAllListeners();

			emitter.emit(EVENT_NAME);
			expect(mockCb.mock.calls.length).toBe(1);
			emitter.emit(EVENT_NAME2);
			expect(mockCb2.mock.calls.length).toBe(1);
			emitter.emit(EVENT_NAME3);
			expect(mockCb3.mock.calls.length).toBe(1);
		});

		test("should be able to remove specific event", () => {
			const emitter = new Emitter();
			const mockCb = jest.fn();
			const mockCb2 = jest.fn();
			const mockCb3 = jest.fn();

			emitter.on(EVENT_NAME, mockCb);
			emitter.on(EVENT_NAME, mockCb2);
			emitter.on(EVENT_NAME2, mockCb3);

			emitter.emit(EVENT_NAME);
			expect(mockCb.mock.calls.length).toBe(1);
			expect(mockCb2.mock.calls.length).toBe(1);
			emitter.emit(EVENT_NAME2);
			expect(mockCb3.mock.calls.length).toBe(1);

			emitter.removeAllListeners(EVENT_NAME);

			emitter.emit(EVENT_NAME);
			expect(mockCb.mock.calls.length).toBe(1);
			expect(mockCb2.mock.calls.length).toBe(1);
			emitter.emit(EVENT_NAME2);
			expect(mockCb3.mock.calls.length).toBe(2);

			emitter.removeAllListeners(EVENT_NAME2);

			emitter.emit(EVENT_NAME);
			expect(mockCb.mock.calls.length).toBe(1);
			expect(mockCb2.mock.calls.length).toBe(1);
			emitter.emit(EVENT_NAME2);
			expect(mockCb3.mock.calls.length).toBe(2);
		});
	});

	describe("test chain methods", () => {
		test("case 1", () => {
			const emitter = new Emitter();
			const mockCb = jest.fn();
			const mockCb2 = jest.fn();
			const mockCb3 = jest.fn();

			emitter
				.on(EVENT_NAME, mockCb)
				.once(EVENT_NAME, mockCb2)
				.on(EVENT_NAME2, mockCb3)
				.emit(EVENT_NAME)
				.emit(EVENT_NAME2)
				.removeListener(EVENT_NAME2, mockCb3)
				.emit(EVENT_NAME)
				.emit(EVENT_NAME2)
				.removeAllListeners()
				.emit(EVENT_NAME)
				.emit(EVENT_NAME2);

			expect(mockCb.mock.calls.length).toBe(2);
			expect(mockCb2.mock.calls.length).toBe(1);
			expect(mockCb3.mock.calls.length).toBe(1);
		});
	});
});
