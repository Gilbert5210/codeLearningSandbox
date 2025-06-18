import {PayAdapter, PayConfig, PayResult, PayType} from "./types";

/**
 * 支付管理器
 */
export class PayManage implements PayAdapter {
	private payAdapter: Map<string, PayAdapter>;
	private readonly payConfig?: PayConfig;

	constructor(options?: PayConfig) {
		console.log('payManage init');
		// 初始化支付适配器
		this.payAdapter = new Map();

		if (options) {
			// 初始化支付配置
			this.payConfig = options;
			this.init()
		}
	}

	protected init () {
		// 注册支付适配器
		console.log('payManage init', this.payConfig);
	}

	register(name: string, adapter: PayAdapter) {
		this.payAdapter.set(name, adapter);
	}

	getAdapter(name: string): PayAdapter | undefined {
		if (!this.payAdapter.has(name)) {
			throw new Error(`PayAdapter ${name} not found`);
		}

		return this.payAdapter.get(name);
	}

	pay(amount: number, type?: PayType): Promise<PayResult> {
		if (!type) {
			throw new Error('pay method requires a type parameter');
		}
		const adapter = this.getAdapter(type);
		if (!adapter) {
			return Promise.reject(new Error(`PayAdapter ${type} not found`));
		}
		// 调用子adapter时只传递amount
		return adapter.pay(amount);
	}

	refund(amount: number, type?: PayType): Promise<PayResult> {
		if (!type) {
			throw new Error('refund method requires a type parameter');
		}

		const adapter = this.getAdapter(type);
		if (!adapter) {
			return Promise.reject(new Error(`PayAdapter ${type} not found`));
		}
		// 调用子adapter时只传递amount
		return adapter.refund(amount);
	}

	query(orderId: string, type?: PayType): Promise<PayResult> {
		if (!type) {
			throw new Error('pay method requires a type parameter');
		}

		const adapter = this.getAdapter(type);
		if (!adapter) {
			return Promise.reject(new Error(`PayAdapter ${type} not found`));
		}
		// 调用子adapter时只传递orderId
		return adapter.query(orderId);
	}
}

export default PayManage;

export * from './types';
