import { myCompose } from '../src';

describe('handwrittenFunction.ts', () => {
  describe('myReduce', () => {
    it('should work with an initial value', () => {
      const result = [1, 2, 3].myReduce((acc, val) => acc + val, 0);
      expect(result).toBe(6);
    });

    it('should work without an initial value', () => {
      const result = [1, 2, 3].myReduce((acc, val) => acc + val, 0);
      expect(result).toBe(6);
    });

    it('should throw an error on empty array without initial value', () => {
      expect([].myReduce((acc, val) => acc + val, 0)).toBe(0);
    });
  });

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

  describe('myFlat', () => {
    it('should flatten arrays to the specified depth', () => {
      const result = [1, 2, 3, [4, [5, [6]]]].myFlat(2);
      expect(result).toEqual([1, 2, 3, 4, 5, [6]]);
    });

    it('should flatten arrays fully when depth is Infinity', () => {
      const result = [1, 2, 3, [4, [5, [6]]]].myFlat(Infinity);
      expect(result).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('should handle empty arrays', () => {
      const result = [].myFlat(1);
      expect(result).toEqual([]);
    });
  });

  describe('myMap', () => {
    it('should map values correctly', () => {
      const result = [1, 2, 3, 4].myMap(num => num ? num * 2 : undefined);
      expect(result).toEqual([2, 4, 6, 8]);
    });

    it('should handle sparse arrays', () => {
      const result = [undefined, 2, undefined, 4].myMap(num => num ? num * 2 : undefined);
      expect(result).toEqual([undefined, 4, undefined, 8]);
    });

    it('should support thisArg', () => {
      const obj = { value: 1 };
      const result = [1, 2, 3].myMap(function(num) { return (num ?? 0) + this.value; }, obj);
      expect(result).toEqual([2, 3, 4]);
    });
  });

  describe('mySome', () => {
    it('should return true if at least one element satisfies the condition', () => {
      const result = [1, 2, 3, 4].mySome(num => num > 2);
      expect(result).toBe(true);
    });

    it('should return false if no elements satisfy the condition', () => {
      const result = [1, 2, 3, 4].mySome(num => num > 4);
      expect(result).toBe(false);
    });

    it('should handle empty arrays', () => {
      const result = [].mySome(num => num > 0);
      expect(result).toBe(false);
    });

    it('should handle sparse arrays', () => {
      const result = [undefined, 2, undefined, 4].mySome(num => !!num && num > 2);
      expect(result).toBe(true);
    });

    it('should handle arrays with non-numeric values', () => {
      const result = [1, '2', 3, '4'].mySome(num => typeof num === 'number' && num > 2);
      expect(result).toBe(true);
    });

    it('should handle arrays with mixed types', () => {
      const result = [1, '2', 3, '4', { value: 5 }].mySome(num => typeof num === 'object' && num.value > 2);
      expect(result).toBe(true);
    });
  });
});
