import {PayAdapter, PayResult} from "./types";

/**
 * 微信支付适配器
 */
export class WechatPayAdapter implements PayAdapter{
	constructor(){
		console.log('WechatPayAdapter');
	}

	// 支付的方法
	pay(amount: number): Promise<PayResult>{
		console.log('WechatPayAdapter pay', amount);
		return Promise.resolve({
			code: 0,
			data: {},
			message: 'success'
		});
	}

	// 退款的方法
	refund(amount: number): Promise<PayResult>{
		console.log('WechatPayAdapter refund', amount);
		return Promise.resolve({
			code: 0,
			data: {},
			message: 'success'
		});
	}

	// 查询的方法
	query(orderId: string): Promise<PayResult>{
		console.log('WechatPayAdapter query', orderId);
		return Promise.resolve({
			code: 0,
			data: {},
			message: 'success'
		});
	}
}
