/**
 * 使用 Promise + setTimeout 实现的 sleep 函数
 * 这是最常用的方法，返回一个在指定时间后 resolve 的 Promise
 * @param ms 休眠时间（毫秒）
 * @returns Promise，在指定时间后 resolve
 */
function sleep(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 使用 async/await 包装的 sleep 函数
 * 可以作为示例函数展示如何使用 sleep
 * @param ms 休眠时间（毫秒）
 */
async function sleepExample(ms: number): Promise<void> {
	console.log('开始休眠');
	await sleep(ms);
	console.log(`休眠 ${ms} 毫秒后继续执行`);
}

/**
 * 使用 Promise.race 实现带超时的 sleep 函数
 * 可以在等待的同时设置一个超时时间
 * @param ms 休眠时间（毫秒）
 * @param timeoutMs 超时时间（毫秒）
 * @returns Promise，在指定时间后 resolve，或在超时后 reject
 */
function sleepWithTimeout(ms: number, timeoutMs: number): Promise<void> {
	return Promise.race([
		sleep(ms),
		new Promise<void>((_, reject) =>
			setTimeout(() => reject(new Error('Sleep timeout')), timeoutMs)
		)
	]);
}

/**
 * 使用生成器函数实现 sleep
 * 适合在生成器中使用
 * @param ms 休眠时间（毫秒）
 */
function* sleepGenerator(ms: number): Generator<Promise<void>, void, unknown> {
	yield new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 使用回调函数实现 sleep
 * 适合在不支持 Promise 的环境中使用
 * @param ms 休眠时间（毫秒）
 * @param callback 休眠后执行的回调函数
 */
function sleepCallback(ms: number, callback: () => void): void {
	setTimeout(callback, ms);
}

/**
 * 使用 Web Worker 实现 sleep（浏览器环境）
 * 避免阻塞主线程
 * @param ms 休眠时间（毫秒）
 * @returns Promise，在指定时间后 resolve
 */
function sleepWithWorker(ms: number): Promise<void> {
	return new Promise(resolve => {
		// 创建一个内联的 Web Worker
		const blob = new Blob([
			`self.onmessage = function(e) {
        setTimeout(() => self.postMessage('done'), e.data);
      }`
		], { type: 'application/javascript' });

		const url = URL.createObjectURL(blob);
		const worker = new Worker(url);

		worker.onmessage = () => {
			worker.terminate();
			URL.revokeObjectURL(url);
			resolve();
		};

		worker.postMessage(ms);
	});
}

/**
 * 使用 requestAnimationFrame 实现 sleep（浏览器环境）
 * 适合在动画场景中使用，会在浏览器下一次重绘前执行
 * @param ms 休眠时间（毫秒）
 * @returns Promise，在指定时间后 resolve
 */
function sleepWithRAF(ms: number): Promise<void> {
	const startTime = performance.now();
	return new Promise(resolve => {
		function check(timestamp: number) {
			if (timestamp - startTime >= ms) {
				resolve();
			} else {
				requestAnimationFrame(check);
			}
		}
		requestAnimationFrame(check);
	});
}

/**
 * 使用 Date 对象实现同步阻塞的 sleep（不推荐在生产环境使用）
 * 会阻塞 JavaScript 主线程
 * @param ms 休眠时间（毫秒）
 */
function sleepSync(ms: number): void {
	const start = Date.now();
	while (Date.now() - start < ms) {
		// 空循环，阻塞主线程
	}
}

// 导出所有 sleep 函数
export {
	sleep,
	sleepExample,
	sleepWithTimeout,
	sleepGenerator,
	sleepCallback,
	sleepWithWorker,
	sleepWithRAF,
	sleepSync
};

// 使用示例
// 异步 Promise 风格
// sleep(1000).then(() => console.log('睡眠1秒后执行'));

// 异步 async/await 风格
// async function demo() {
//   console.log('开始');
//   await sleep(2000);
//   console.log('2秒后');
// }
// demo();

// 带超时的 sleep
// sleepWithTimeout(3000, 2000)
//   .then(() => console.log('不会执行到这里'))
//   .catch(err => console.error(err.message)); // 输出 "Sleep timeout"

// 回调风格
// sleepCallback(1000, () => console.log('回调方式：1秒后执行'));

// 生成器风格
// function* example() {
//   console.log('生成器开始');
//   yield* sleepGenerator(1000);
//   console.log('生成器1秒后');
// }
// const it = example();
// it.next().value.then(() => it.next());
