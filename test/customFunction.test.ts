import { myCompose, getDataType, templateStr, myCurry, myDebounce, myThrottle } from '../src';
import { jest } from '@jest/globals';

describe('customFunction.ts', () => {
  describe('myCompose', () => {
    it('should compose multiple functions', () => {
      const add1 = (x: number) => x + 1;
      const multiply2 = (x: number) => x * 2;
      const square = (x: number) => x * x;

      const calculate = myCompose(square, multiply2, add1);
      expect(calculate(5)).toBe(144);
    });

    it('should handle single function', () => {
      const add1 = (x: number) => x + 1;
      const calculate = myCompose(add1);
      expect(calculate(5)).toBe(6);
    });

    it('should handle no functions', () => {
      const calculate = myCompose();
      expect(calculate(5)).toBe(5);
    });
  });

  describe('getDataType', () => {
    it('should return "string" for string', () => {
      expect(getDataType('hello')).toBe('string');
    });

    it('should return "number" for number', () => {
      expect(getDataType(123)).toBe('number');
    });

    it('should return "boolean" for boolean', () => {
      expect(getDataType(true)).toBe('boolean');
    });

    it('should return "object" for object', () => {
      expect(getDataType({ key: 'value' })).toBe('object');
    });

    it('should return "array" for array', () => {
      expect(getDataType([1, 2, 3])).toBe('array');
    });

    it('should return "function" for function', () => {
      expect(getDataType(() => {})).toBe('function');
    });

    it('should return "undefined" for undefined', () => {
      expect(getDataType(undefined)).toBe('undefined');
    });

    it('should return "null" for null', () => {
      expect(getDataType(null)).toBe('null');
    });

    it('should return "symbol" for symbol', () => {
      expect(getDataType(Symbol())).toBe('symbol');
    });

    it('should return "date" for date', () => {
      expect(getDataType(new Date())).toBe('date');
    });

    it('should return "regexp" for regexp', () => {
      expect(getDataType(/abc/)).toBe('regexp');
    });
  });

  describe('templateStr', () => {
    it('should replace simple variables in template strings', () => {
      const result = templateStr('Hello, ${name}!', { name: 'John' });
      expect(result).toBe('Hello, John!');
    });

    it('should handle expressions in template strings', () => {
      const result = templateStr('The answer is ${a + b}.', { a: 10, b: 32 });
      expect(result).toBe('The answer is 42.');
    });

    it('should handle multiple variables and expressions', () => {
      const result = templateStr('${name} is ${age} years old. In 5 years, ${name} will be ${age + 5}.',
        { name: 'Alice', age: 30 });
      expect(result).toBe('Alice is 30 years old. In 5 years, Alice will be 35.');
    });

    it('should handle nested properties', () => {
      const result = templateStr('${user.name} lives in ${user.address.city}', {
        user: { name: 'Bob', address: { city: 'New York' } }
      });
      expect(result).toBe('Bob lives in New York');
    });

    it('should handle undefined values', () => {
      const result = templateStr('Hello, ${name}!', {});
      expect(result).toBe('Hello, !');
    });

    it('should handle invalid expressions by keeping original text', () => {
      const result = templateStr('Result: ${nonExistentFunction()}', {});
      expect(result).toBe('Result: ${nonExistentFunction()}');
    });
  });

  describe('myCurry', () => {
    // 基本功能测试
    it('should curry a function with multiple parameters', () => {
      const add = (a: number, b: number, c: number) => a + b + c;
      const curriedAdd = myCurry(add);

      // 分别传入参数
      expect(curriedAdd(1)(2)(3)).toBe(6);

      // 混合传入参数
      expect(curriedAdd(1, 2)(3)).toBe(6);
      expect(curriedAdd(1)(2, 3)).toBe(6);
      expect(curriedAdd(1, 2, 3)).toBe(6);
    });

    it('should handle functions with single parameter', () => {
      const double = (x: number) => x * 2;
      const curriedDouble = myCurry(double);

      // 对于只有一个参数的函数，应该保持原样
      expect(curriedDouble(5)).toBe(10);
    });

    it('should handle functions with no parameters', () => {
      const getAnswer = () => 42;
      const curriedGetAnswer = myCurry(getAnswer);

      // 对于没有参数的函数，应该保持原样
      expect(curriedGetAnswer()).toBe(42);
    });

    it('should curry functions that return functions', () => {
      const createMultiplier = (a: number, b: number) => (c: number) => a * b * c;
      const curriedCreateMultiplier = myCurry(createMultiplier);

      const multiplyBy6 = curriedCreateMultiplier(2)(3);
      expect(multiplyBy6(4)).toBe(24);
    });

    it('should handle extra arguments', () => {
      const add = (a: number, b: number) => a + b;
      const curriedAdd = myCurry(add);

      // 额外的参数应该被忽略
      expect(curriedAdd(1)(2, 3, 4)).toBe(3);
    });

    it('should preserve the context of the original function', () => {
      const obj = {
        multiplier: 2,
        multiply: function(a: number, b: number) {
          return a * b * this.multiplier;
        }
      };

      // 绑定this上下文
      const boundMultiply = obj.multiply.bind(obj);
      const curriedMultiply = myCurry(boundMultiply);

      expect(curriedMultiply(3)(4)).toBe(24); // 3 * 4 * 2 = 24
    });

    it('should throw error for non-function arguments', () => {
      // @ts-ignore - 故意传入非函数参数进行测试
      expect(() => myCurry(123)).toThrow(TypeError);
      // @ts-ignore
      expect(() => myCurry(null)).toThrow(TypeError);
      // @ts-ignore
      expect(() => myCurry(undefined)).toThrow(TypeError);
    });
  });

  describe('myDebounce', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should debounce a function', () => {
      const func = jest.fn();
      const debouncedFunc = myDebounce(func, 1000);

      // 调用防抖函数
      debouncedFunc();
      expect(func).not.toBeCalled();

      // 等待 500ms，函数仍然不应该被调用
      jest.advanceTimersByTime(500);
      expect(func).not.toBeCalled();

      // 再等待 500ms，总共1000ms，函数应该被调用一次
      jest.advanceTimersByTime(500);
      expect(func).toBeCalledTimes(1);
    });

    it('should reset the timer when called again', () => {
      const func = jest.fn();
      const debouncedFunc = myDebounce(func, 1000);

      debouncedFunc();
      jest.advanceTimersByTime(500);

      // 再次调用，重置计时器
      debouncedFunc();
      jest.advanceTimersByTime(500);
      expect(func).not.toBeCalled();

      // 再等待 500ms，函数应该被调用一次
      jest.advanceTimersByTime(500);
      expect(func).toBeCalledTimes(1);
    });

    it('should support leading option', () => {
      const func = jest.fn();
      const debouncedFunc = myDebounce(func, 1000, { leading: true });

      // 立即执行一次
      debouncedFunc();
      expect(func).toBeCalledTimes(1);

      // 短时间内再次调用，不会再执行
      debouncedFunc();
      expect(func).toBeCalledTimes(1);

      // 等待时间结束，也不会再执行，因为是 leading edge
      jest.advanceTimersByTime(1000);
      expect(func).toBeCalledTimes(1);
    });

    it('should support trailing option', () => {
      const func = jest.fn();
      const debouncedFunc = myDebounce(func, 1000, { trailing: false, leading: true });

      // 立即执行一次
      debouncedFunc();
      expect(func).toBeCalledTimes(1);

      // 等待时间结束，不会再次执行，因为 trailing 设为 false
      jest.advanceTimersByTime(1000);
      expect(func).toBeCalledTimes(1);
    });

    it('should support cancel method', () => {
      const func = jest.fn();
      const debouncedFunc = myDebounce(func, 1000);

      debouncedFunc();
      debouncedFunc.cancel();

      // 等待时间结束，函数不应该被调用
      jest.advanceTimersByTime(1000);
      expect(func).not.toBeCalled();
    });

    it('should support flush method', () => {
      const func = jest.fn();
      const debouncedFunc = myDebounce(func, 1000);

      debouncedFunc();
      debouncedFunc.flush();

      // 函数应该被立即调用
      expect(func).toBeCalledTimes(1);

      // 等待时间结束，函数不会再次被调用
      jest.advanceTimersByTime(1000);
      expect(func).toBeCalledTimes(1);
    });

    it('should support pending method', () => {
      const func = jest.fn();
      const debouncedFunc = myDebounce(func, 1000);

      // 初始状态下不应该有待处理的调用
      expect(debouncedFunc.pending()).toBe(false);

      // 调用后应该有待处理的调用
      debouncedFunc();
      expect(debouncedFunc.pending()).toBe(true);

      // 等待时间结束后，不应该有待处理的调用
      jest.advanceTimersByTime(1000);
      expect(debouncedFunc.pending()).toBe(false);
    });

    it('should pass correct arguments to the original function', () => {
      const func = jest.fn();
      const debouncedFunc = myDebounce(func, 1000);

      debouncedFunc('a', 'b', 'c');
      jest.advanceTimersByTime(1000);

      expect(func).toHaveBeenCalledWith('a', 'b', 'c');
    });

    it('should maintain the correct context', () => {
      const context = { name: 'test' };
      const func = jest.fn(function(this: any) {
        return this.name;
      });

      const debouncedFunc = myDebounce(func, 1000);

      // 使用 apply 或 call 绑定上下文
      debouncedFunc.call(context);
      jest.advanceTimersByTime(1000);

      expect(func.mock.instances[0]).toBe(context);
    });
  });

  // 添加 myThrottle 的测试
  describe('myThrottle', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should throttle a function', () => {
      const func = jest.fn();
      const throttledFunc = myThrottle(func, 1000);

      // 调用节流函数
      throttledFunc();
      expect(func).toBeCalledTimes(1);

      // 等待 500ms，函数不应该被再次调用
      jest.advanceTimersByTime(500);
      throttledFunc();
      expect(func).toBeCalledTimes(1);

      // 再等待 500ms，总共1000ms，函数应该被调用一次
      jest.advanceTimersByTime(500);
      expect(func).toBeCalledTimes(2);
    });

    it('should support leading option', () => {
      const func = jest.fn();
      const throttledFunc = myThrottle(func, 1000, { leading: true, trailing: false });

      // 立即执行一次
      throttledFunc();
      expect(func).toBeCalledTimes(1);

      // 等待 1000ms，函数不应该被再次调用
      jest.advanceTimersByTime(1000);
      throttledFunc();
      expect(func).toBeCalledTimes(1);
    });

    it('should support trailing option', () => {
      const func = jest.fn();
      const throttledFunc = myThrottle(func, 1000, { leading: false, trailing: true });

      // 不立即执行
      throttledFunc();
      expect(func).not.toBeCalled();

      // 等待 1000ms，函数应该被调用一次
      jest.advanceTimersByTime(1000);
      expect(func).toBeCalledTimes(1);
    });

    it('should support both leading and trailing options', () => {
      const func = jest.fn();
      const throttledFunc = myThrottle(func, 1000, { leading: true, trailing: true });

      // 立即执行一次
      throttledFunc();
      expect(func).toBeCalledTimes(1);

      // 等待 1000ms，函数应该被调用一次
      jest.advanceTimersByTime(1000);
      expect(func).toBeCalledTimes(2);
    });

    it('should support cancel method', () => {
      const func = jest.fn();
      const throttledFunc = myThrottle(func, 1000);

      throttledFunc();
      throttledFunc.cancel();

      // 等待 1000ms，函数不应该被调用
      jest.advanceTimersByTime(1000);
      expect(func).not.toBeCalled();
    });

    it('should support pending method', () => {
      const func = jest.fn();
      const throttledFunc = myThrottle(func, 1000);

      // 初始状态下不应该有待处理的调用
      expect(throttledFunc.pending()).toBe(false);

      // 调用后应该有待处理的调用
      throttledFunc();
      expect(throttledFunc.pending()).toBe(true);

      // 等待 1000ms，不应该有待处理的调用
      jest.advanceTimersByTime(1000);
      expect(throttledFunc.pending()).toBe(false);
    });

    it('should pass correct arguments to the original function', () => {
      const func = jest.fn();
      const throttledFunc = myThrottle(func, 1000);

      throttledFunc('a', 'b', 'c');
      jest.advanceTimersByTime(1000);

      expect(func).toHaveBeenCalledWith('a', 'b', 'c');
    });

    it('should maintain the correct context', () => {
      const context = { name: 'test' };
      const func = jest.fn(function(this: any) {
        return this.name;
      });

      const throttledFunc = myThrottle(func, 1000);

      // 使用 apply 或 call 绑定上下文
      throttledFunc.call(context);
      jest.advanceTimersByTime(1000);

      expect(func.mock.instances[0]).toBe(context);
    });
  });
});
