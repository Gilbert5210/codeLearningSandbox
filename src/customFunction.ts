/**
 * 自定义函数组合
 */

/**
 * 更通用的 myCompose 函数实现
 * 使用泛型支持任意数量的函数组合
 */
type AnyFunction<T = any> = (...args: any[]) => T;

function myCompose<R>(): AnyFunction<R>;
function myCompose<R>(fn1: (a: any) => R): (a: any) => R;
function myCompose<A, R>(fn1: (a: A) => R, fn2: AnyFunction<A>): AnyFunction<R>;
function myCompose<A, B, R>(fn1: (b: B) => R, fn2: (a: A) => B, fn3: AnyFunction<A>): AnyFunction<R>;
// 可以继续添加更多重载...

function myCompose(...fns: AnyFunction[]): AnyFunction {
	if (fns.length === 0) {
		return (arg) => arg;
	}

	if (fns.length === 1) {
		return fns[0];
	}

	return fns.reduce(
		(prevFn, nextFn) => (...args: any[]) => prevFn(nextFn(...args))
	);
}

/**
 * 获取数据类型的函数
 * @param data 要检测的数据
 * @returns 数据类型字符串
 */
function getDataType(data: any): string {
	if (data === null) {
		return 'null';
	}

	return Object.prototype.toString.call(data).slice(8, -1).toLowerCase();
}

// 使用示例
// console.log(getDataType('hello')); // 'string'
// console.log(getDataType(123)); // 'number'
// console.log(getDataType(true)); // 'boolean'
// console.log(getDataType({ key: 'value' })); // 'object'
// console.log(getDataType([1, 2, 3])); // 'array'
// console.log(getDataType(() => {})); // 'function'
// console.log(getDataType(undefined)); // 'undefined'
// console.log(getDataType(null)); // 'null'
// console.log(getDataType(new Date())); // 'date'
// console.log(getDataType(/abc/)); // 'regexp'

/**
 * 实现类似 ES6 模板字符串的函数
 * @param str 包含 ${...} 占位符的模板字符串
 * @param context 包含变量值的上下文对象
 * @returns 替换变量后的字符串
 */
function templateStr(str: string, context: Record<string, any> = {}): string {
  // 安全的变量替换，避免直接使用 eval
  return str.replace(/\$\{(.*?)\}/g, (match, expression) => {
    try {
      // 使用 Function 构造函数创建一个安全的求值环境
      // 将 context 对象中的所有属性作为变量传入
      const keys = Object.keys(context);
      const values = Object.values(context);

      // 创建一个函数，接收 context 对象的键作为参数，返回表达式计算结果
      const fn = new Function(...keys, `return ${expression}`);

      // 执行函数，传入 context 对象的值作为参数
      const result = fn(...values);

      // 处理 undefined 和 null 值
      return result === undefined || result === null ? '' : String(result);
    } catch (error) {
      console.warn(`Error evaluating expression: ${expression}`, error);
      return match; // 出错时保留原始表达式
    }
  });
}

/**
 * 函数柯里化（currying），将一个多参数函数转换为一系列单参数函数
 *
 * @template T 函数返回值类型
 * @param fn 要柯里化的函数
 * @returns 柯里化后的函数
 * @example
 * const add = (a, b, c) => a + b + c;
 * const curriedAdd = myCurry(add);
 * console.log(curriedAdd(1)(2)(3)); // 6
 * console.log(curriedAdd(1, 2)(3)); // 6
 * console.log(curriedAdd(1)(2, 3)); // 6
 */
function myCurry<T>(fn: (...args: any[]) => T): (...args: any[]) => any {
	if (typeof fn !== 'function') {
		throw new TypeError('myCurry requires a function argument');
	}

	const fnLength = fn.length;

	// 如果函数不接收参数或只接收1个参数，无需柯里化
	if (fnLength <= 1) return fn;

	// 辅助函数：收集参数并在参数足够时执行原函数
	function curried(collectedArgs: any[] = []) {
		return function(...args: any[]) {
			const allArgs = [...collectedArgs, ...args];

			// 如果参数数量足够，则执行原函数
			if (allArgs.length >= fnLength) {
				return fn(...allArgs);
			}
			// 否则继续收集参数
			return curried(allArgs);
		};
	}

	return curried();
}

// 使用示例
// const fn = (a, b, c, d) => a + b + c + d;
// const curriedFn = myCurry(fn);
// console.log(curriedFn(1)(2)(3)(4)); // 10


/**
 * 防抖函数返回值的类型，包括额外的控制方法
 */
export interface DebouncedFunction<T extends (...args: any[]) => any> {
	(...args: Parameters<T>): ReturnType<T> | undefined;
	cancel: () => void;
	flush: () => ReturnType<T> | undefined;
	pending: () => boolean;
}

/**
 * 实现防抖函数
 * @param fn 要防抖的函数
 * @param wait 等待时间，单位为毫秒
 * @param options 配置选项
 * @returns 防抖处理后的函数
 */
function myDebounce<T extends (...args: any[]) => any>(
  fn: T,
  wait: number = 0,
  options: {
    leading?: boolean;    // 是否在延迟开始前调用函数
    trailing?: boolean;   // 是否在延迟结束后调用函数
    maxWait?: number;     // 最大等待时间
  } = {}
): DebouncedFunction<T> {
  // 默认配置
  const {
    leading = false,   // 默认不在开始时立即执行
    trailing = true,   // 默认在结束时执行
    maxWait = undefined  // 默认无最大等待时间
  } = options;

  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastCallTime: number | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastThis: any = null;
  let result: ReturnType<T> | undefined;

  // 清除定时器
  const clearTimer = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  // 执行函数
  const invoke = () => {
    const args = lastArgs as Parameters<T>;
    const thisArg = lastThis;

    lastArgs = lastThis = null;
    result = fn.apply(thisArg, args);
    return result;
  };

  // 检查是否应该执行函数
  const shouldInvoke = (time: number) => {
    const timeSinceLastCall = lastCallTime === null ? 0 : time - lastCallTime;

    // 如果是第一次调用，或者已经超过了等待时间，或者超过了最大等待时间
    return (
      lastCallTime === null ||
      timeSinceLastCall >= wait ||
      (maxWait !== undefined && timeSinceLastCall >= maxWait)
    );
  };

  // 延迟执行函数
  const trailingEdge = () => {
    timer = null;

    // 只有设置了 trailing 且有参数时才执行
    if (trailing && lastArgs) {
      return invoke();
    }

    lastArgs = lastThis = null;
    return result;
  };

  // 安排延迟执行
  const remainingWait = (time: number) => {
    const timeSinceLastCall = time - (lastCallTime ?? 0);
    const timeWaiting = wait - timeSinceLastCall;

    return maxWait !== undefined
      ? Math.min(timeWaiting, maxWait - timeSinceLastCall)
      : timeWaiting;
  };

  // 实际返回的函数
  const debounced = function(this: ThisParameterType<T>, ...args: Parameters<T>): ReturnType<T> | undefined {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    // 保存最新的调用信息
    lastArgs = args;
    lastThis = this;
    lastCallTime = time;

    // 如果应该执行，且设置为立即执行
    if (isInvoking) {
      if (!timer && leading) {
        return invoke();
      }
    }

    // 清除之前的定时器
    clearTimer();

    // 设置新的定时器
    timer = setTimeout(
      trailingEdge,
      remainingWait(time)
    ) as unknown as ReturnType<typeof setTimeout>;

    return result;
  } as DebouncedFunction<T>;  // 使用类型断言确保TypeScript识别完整类型

  // 取消防安全防抖
  debounced.cancel = function() {
    clearTimer();
    lastCallTime = lastArgs = lastThis = null;
  };

  // 立即执行
  debounced.flush = function() {
    if (timer) {
      return trailingEdge();
    }
    return result;
  };

  // 判断是否还在等待中
  debounced.pending = function() {
    return timer !== null;
  };

  return debounced;
}

/**
 * 实现节流函数
 * @param fn 要节流的函数
 * @param wait 等待时间，单位为毫秒
 * @param options 配置选项
 * @returns 节流处理后的函数
 */
function myThrottle<T extends (...args: any[]) => any>(
  fn: T,
  wait: number = 0,
  options: {
    leading?: boolean;    // 是否在开始时立即执行
    trailing?: boolean;   // 是否在结束时执行
  } = {}
): DebouncedFunction<T> {
  // 默认配置
  const {
    leading = true,   // 默认在开始时立即执行
    trailing = true   // 默认在结束时执行
  } = options;

  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastCallTime: number | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastThis: any = null;
  let result: ReturnType<T> | undefined;

  // 清除定时器
  const clearTimer = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  // 执行函数
  const invoke = () => {
    const args = lastArgs as Parameters<T>;
    const thisArg = lastThis;

    lastArgs = lastThis = null;
    result = fn.apply(thisArg, args);
    return result;
  };

  // 实际返回的函数
  const throttled = function(this: ThisParameterType<T>, ...args: Parameters<T>): ReturnType<T> | undefined {
    const now = Date.now();

    if (lastCallTime === null) {
      lastCallTime = now;
    }

    const timeSinceLastCall = now - lastCallTime;

    // 保存最新的调用信息
    lastArgs = args;
    lastThis = this;

    if (timeSinceLastCall >= wait) {
      lastCallTime = now;
      return invoke();
    }

    if (!timer && trailing) {
      timer = setTimeout(() => {
        lastCallTime = leading ? null : now + wait - timeSinceLastCall;
        invoke();
        clearTimer();
      }, wait - timeSinceLastCall);
    }

    return result;
  } as DebouncedFunction<T>;  // 使用类型断言确保TypeScript识别完整类型

  // 取消节流
  throttled.cancel = function() {
    clearTimer();
    lastCallTime = lastArgs = lastThis = null;
  };

  // 判断是否还在等待中
  throttled.pending = function() {
    return timer !== null;
  };

  return throttled;
}

// html内容
// <img src="./loading.jpg" data-src="https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg">
// <img src="./loading.jpg" data-src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg">

/**
 * 图片懒加载
 * @param valueKey 图片的data-src属性
 */
function observerImg(valueKey: string = "data-src") {
  // 获取所有的图片元素
  let imgList = document.getElementsByTagName("img");
  let observer = new IntersectionObserver(list => {
    // 回调的数据是一个数组
    list.forEach(item => {
      // 判断元素是否出现在视口
      if (item.intersectionRatio > 0) {
        // 设置img的src属性
        // @ts-ignore
        item.target.src = item.target.getAttribute(valueKey);
        // 设置src属性后，停止监听
        observer.unobserve(item.target);
      }
    });
  });
  for (let i = 0; i < imgList.length; i++) {
    // 监听每个img元素
    observer.observe(imgList[i]);
  }
}

/**
 * 控制并发数的函数
 * @param tasks 任务数组
 * @param concurrency 并发数
 * @returns 一个 Promise，当所有任务完成时 resolve
 */
async function control<T>(tasks: (() => Promise<T>)[], concurrency: number): Promise<T[]> {
  if (concurrency <= 0) {
    throw new Error('Concurrency must be greater than 0');
  }

  const results: T[] = [];
  const runningTasks: Set<Promise<T>> = new Set();

  const next = async () => {
    while (tasks.length > 0 && runningTasks.size < concurrency) {
      const task = tasks.shift()!;
      const promise = task().then((result) => {
        results.push(result);
        return result;
      });

      runningTasks.add(promise);

      promise.finally(() => {
        runningTasks.delete(promise);
        next();
      });
    }
  };

  await next();
  return results;
}




// 导出所有函数
export { myCompose, getDataType, templateStr, myCurry, myDebounce, myThrottle, observerImg, control };
