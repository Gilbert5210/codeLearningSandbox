/*
 * @Author: zhanjiangyuan zhanjiangyuan@kuaishou.com
 * @Date: 2025-03-22 17:24:33
 * @LastEditors: zhanjiangyuan zhanjiangyuan@kuaishou.com
 * @LastEditTime: 2025-03-22 17:25:54
 * @FilePath: /codeLearningSandbox/types/index.d.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 声明合并，扩展 Array 接口
declare global {
  interface Array<T> {
    myReduce<U>(
      fn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U,
      initialValue?: U
    ): U;
  }
}