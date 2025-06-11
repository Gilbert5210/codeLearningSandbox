export class LazyMan {
	private readonly name: string;
	private task: Array<{ fn: () => void; delay?: number }> = [];

	constructor(name: string) {
		this.name = name;
		this.task.push({
			fn: () => {
				console.log("Hi " + this.name);
				this.next();
			},
		});

		// 重点：使用setTimeout宏任务，确保所有的任务都注册到task列表中
		setTimeout(() => {
			this.next();
		});
	}

	private next() {
		// 取出第一个任务并执行
		const task = this.task.shift();
		if (task) {
			if (task.delay) {
				setTimeout(task.fn, task.delay);
			} else {
				task.fn();
			}
		}
	}

	public sleepFirst(time: number): this {
		const fn = () => {
			console.log("SleepFirst " + time);
			setTimeout(() => {
				this.next();
			}, time);
		};
		// 插入到第一个
		this.task.unshift({ fn, delay: time });
		// 返回this 可以链式调用
		return this;
	}

	public sleep(time: number): this {
		const fn = () => {
			console.log("Sleep " + time);
			setTimeout(() => {
				this.next();
			}, time);
		};
		this.task.push({ fn, delay: time });
		return this;
	}

	public eat(something: string): this {
		const fn = () => {
			console.log("Eat " + something);
			this.next();
		};
		this.task.push({ fn });
		return this;
	}
}

// new LazyMan("王")
// 	.sleepFirst(3000)
// 	.eat("breakfast")
// 	.sleep(3000)
// 	.eat("dinner");
