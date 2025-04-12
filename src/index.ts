/*
 * @Author: zhanjiangyuan zhanjiangyuan@kuaishou.com
 * @Date: 2025-03-22 16:52:28
 * @LastEditors: zhanjiangyuan zhanjiangyuan@kuaishou.com
 * @LastEditTime: 2025-03-22 17:05:57
 * @FilePath: /codeLearningSandbox/src/index.ts
 * @Description: 工具函数 代码
 */

export * from './handwrittenFunction';

/**
 * 求和计算函数
 * @param a 
 * @param b 
 * @returns 
 */
export const sum = (a: number, b: number) => {
  if ('development' === process.env.NODE_ENV) {
    console.log('boop');
  }
  return a + b;
};
