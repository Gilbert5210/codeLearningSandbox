import {PAY_TYPE_MAP} from "./config";

export interface PayResult<T = any> {
	code: number;
	data: T;
	message: string;
}
export type PayType = typeof PAY_TYPE_MAP[keyof typeof PAY_TYPE_MAP];
/**
 * 支付适配器
 */
export interface PayAdapter {
	pay(amount: number): Promise<PayResult>;
	pay(amount: number, type: PayType): Promise<PayResult>;
	refund(amount: number): Promise<PayResult>;
	refund(amount: number, type: PayType): Promise<PayResult>;
	query(orderId: string): Promise<PayResult>;
	query(orderId: string, type: PayType): Promise<PayResult>;
}

/**
 * 支付配置
 */
export interface PayConfig {
	// 支持的支付方式
	payTypes: PayType[];
}
