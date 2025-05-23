/*
 * @Author: zhanjiangyuan zhanjiangyuan@kuaishou.com
 * @Date: 2025-03-22 16:59:53
 * @LastEditors: zhanjiangyuan zhanjiangyuan@kuaishou.com
 * @LastEditTime: 2025-03-22 17:09:36
 * @FilePath: /codeLearningSandbox/src/handwrittenFunction.ts
 * @Description: 手写通用的函数
 */


/**
 * 手写reduce函数
 * 如果提供了initialValue时，则作为pre的初始值，index从0开始； 
 * 如果没有提供initialValue，找到数组中的第一个存在的值作为pre，下一个元素的下标作为index
 * @param fn
 * @param initialValue
 * @returns
 */
Array.prototype.myReduce = function(fn: any, initialValue: any) {
  let pre, index;
  let arr = this.slice();
  if (initialValue === undefined) {
    // 没有设置初始值
    for (let i = 0; i < arr.length; i++) {
      // 找到数组中第一个存在的元素，跳过稀疏数组中的空值
      if (!arr.hasOwnProperty(i)) continue;
      pre = arr[i]; // pre 为数组中第一个存在的元素
      index = i + 1; // index 下一个元素
      break; // 易错点：找到后跳出循环
    }
  } else {
    index = 0;
    pre = initialValue;
  }
  for (let i = index; i < arr.length; i++) {
    // 跳过稀疏数组中的空值
    if (!arr.hasOwnProperty(i)) continue;
    // 注意：fn函数接收四个参数，pre之前累计值、cur 当前值、 当前下标、 arr 原数组
    pre = fn.call(null, pre, arr[i], i, this);
  }
  return pre;
};
