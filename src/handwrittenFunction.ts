/*
 * @Author: zhanjiangyuan zhanjiangyuan@kuaishou.com
 * @Date: 2025-03-22 16:59:53
 * @LastEditors: zhanjiangyuan zhanjiangyuan@kuaishou.com
 * @LastEditTime: 2025-03-22 17:09:36
 * @FilePath: /codeLearningSandbox/src/handwrittenFunction.ts
 * @Description: 重写js内置函数
 */

/**
 * 数组原型扩展 - mySome
 * 检查数组中是否有至少一个元素满足提供的测试函数
 * @param callback 测试函数，接收(当前值, 索引, 原数组)三个参数
 * @returns 如果有至少一个元素满足测试函数则返回 true，否则返回 false
 */
Array.prototype.mySome = function<T>(
  this: T[],
  callback: (value: T, index: number, array: T[]) => boolean
): boolean {
  if (typeof callback !== 'function') {
    throw new TypeError(`${callback} is not a function`);
  }

  const array = this;
  const length = array.length;

  for (let i = 0; i < length; i++) {
    if (i in array && callback(array[i], i, array)) {
      return true;
    }
  }

  return false;
};

/**
 * 数组原型扩展 - myReduce
 * 更符合 TypeScript 类型系统和原生 reduce 行为
 * @param callbackFn 归约函数，接收累积值、当前值、索引和数组
 * @param initialValue 可选的初始值
 * @returns 归约结果
 */
Array.prototype.myReduce = function<T, U>(
  this: T[],
  callbackFn: (previousValue: T | U, currentValue: T, currentIndex: number, array: T[]) => T | U,
  initialValue?: U
): T | U {
  const arr = this;

  // 处理空数组特殊情况
  if (arr.length === 0 && initialValue === undefined) {
    throw new TypeError('Reduce of empty array with no initial value');
  }

  let accumulator: T | U;
  let startIndex = 0; // 默认值，避免未定义

  // 确定初始值和起始索引
  if (initialValue !== undefined) {
    accumulator = initialValue;
    startIndex = 0;
  } else {
    // 寻找第一个存在的元素作为初始值
    let firstValueFound = false;
    let firstValue: T;
    let firstIndex = 0;

    for (let i = 0; i < arr.length; i++) {
      if (i in arr) {
        firstValue = arr[i];
        firstIndex = i;
        firstValueFound = true;
        break;
      }
    }

    // 如果数组是稀疏的且没有找到任何元素
    if (!firstValueFound) {
      throw new TypeError('Reduce of empty array with no initial value');
    }

    // 安全地赋值
    accumulator = firstValue!;
    startIndex = firstIndex + 1;
  }

  // 执行归约操作
  for (let i = startIndex; i < arr.length; i++) {
    if (i in arr) {
      accumulator = callbackFn(accumulator, arr[i], i, arr);
    }
  }

  return accumulator;
};

// 使用demo
// console.log([, , , 1, 2, 3, 4].myReduce((pre, cur) => pre + cur)); // 10

/**
 * 优化的数组扁平化方法（迭代版本）
 * 避免大型嵌套数组时的递归栈溢出问题
 * @param depth 扁平化的深度，默认为1
 * @returns 扁平化后的新数组
 */
Array.prototype.myFlat = function<T>(this: Array<any>, depth: number = 1): T[] {
  // 优化：无需扁平化的情况快速返回
  if (depth < 1 || this.length === 0) return this.slice() as T[];

  const result: T[] = [];

  // 使用队列进行广度优先遍历
  // 每个元素存储为 [item, currentDepth]
  const queue: [any, number][] = this.map(item => [item, 0]);

  while (queue.length > 0) {
    const [item, currentDepth] = queue.shift()!;

    if (Array.isArray(item) && currentDepth < depth) {
      // 将嵌套数组的每个元素添加到队列
      for (let i = 0; i < item.length; i++) {
        if (i in item) { // 跳过稀疏数组空位
          queue.push([item[i], currentDepth + 1]);
        }
      }
    } else {
      result.push(item);
    }
  }

  return result;
}
// demo 使用
// console.log([1, 2, 3, [4, [5, [6]]]].myFlat(2)); // [1, 2, 3, 4, 5, [6]]


/**
 * 手写 Array.prototype.myMap 函数
 * 完全符合原生 map 的行为特性:
 * 1. 返回新数组，不修改原数组
 * 2. 保留稀疏数组的特性
 * 3. 支持 thisArg 参数
 * 4. 回调函数只对已经存在的元素调用
 *
 * @param callback 映射函数，接收(当前值, 索引, 原数组)三个参数
 * @param thisArg 可选的回调函数this上下文
 * @returns 映射后的新数组
 */
Array.prototype.myMap = function<T, U, This = undefined>(
  this: (T | undefined)[],
  callback: (this: This, value: T | undefined, index: number, array: (T | undefined)[]) => U,
  thisArg?: This
): (U | undefined)[] {
  // 验证回调函数
  if (typeof callback !== 'function') {
    throw new TypeError(`${callback} is not a function`);
  }

  const array = this;
  const length = array.length;
  const result = new Array<U | undefined>(length);

  // 遍历数组
  for (let i = 0; i < length; i++) {
    // 只对存在的元素调用回调函数（处理稀疏数组）
    if (i in array) {
      // 调用回调函数，传入thisArg作为上下文
      result[i] = callback.call(thisArg as This, array[i], i, array);
    }
  }

  return result;
};

// 基本使用
// const numbers = [1, 2, 3, 4];
// const doubled = numbers.myMap(num => num * 2);
// console.log(doubled); // [2, 4, 6, 8]

export {

}
