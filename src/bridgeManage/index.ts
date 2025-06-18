import {BridgeAdapter, BridgeManagerInterface} from "./types";
import { BaseBridgeAdapter } from "./BaseBridgeAdapter";
import { PcBridgeAdapter } from "./PcBridgeAdapter";
import { MobileBridgeAdapter } from "./MobileBridgeAdapter";

/**
 * 创建特定平台的桥接包装器
 * 允许直接调用方法，无需每次指定平台
 */
export class PlatformBridge<T extends BridgeAdapter = BridgeAdapter> {
	constructor(private manager: BridgeManager, private platform: string) {
	}

	// 使用Proxy捕获所有方法调用，自动转发到对应平台
	createProxy(): T {
		return new Proxy({} as T, {
			get: (_target, prop) => {
				// 返回一个函数，该函数将调用转发到底层适配器
				return (...args: any[]) => {
					return this.manager.invoke(this.platform, prop.toString(), ...args);
				};
			}
		});
	}
}

/**
 * 桥接管理器
 */
export class BridgeManager {
	private adapters: Map<string, BridgeAdapter>;
	private defaultPlatform: string;

	constructor(defaultPlatform: string) {
		this.adapters = new Map();
		this.defaultPlatform = defaultPlatform;
		this.init(defaultPlatform);
		// @ts-ignore
		return this.createManagerProxy();
	}

	private createManagerProxy(): BridgeManagerInterface {
		// 创建一个代理，使BridgeManager本身可以直接响应方法调用
		return new Proxy(this, {
			get: (target, prop) => {
				// 保留原有的属性和方法
				if (prop in target) {
					return (target as any)[prop];
				}

				// 如果是请求一个未定义的属性，则尝试将其作为方法调用转发到默认平台的适配器
				if (typeof prop === 'string' && !prop.startsWith('_')) {
					return (...args: any[]) => {
						return target.invoke(target.defaultPlatform, prop, ...args);
					};
				}

				return undefined;
			}
		}) as unknown as BridgeManagerInterface;
	}

	private init(platform: string) {
		// 初始化默认适配器
		switch (platform) {
			case 'pc':
				this.register('pc', new PcBridgeAdapter());
				break;
			case 'mobile':
				this.register('mobile', new MobileBridgeAdapter());
				break;
			default:
				throw new Error(`Unsupported platform: ${platform}`);
		}
	}

	register(name: string, adapter: BridgeAdapter) {
		this.adapters.set(name, adapter);
		return this;
	}

	getAdapter<T extends BridgeAdapter>(name: string): T | undefined {
		return this.adapters.get(name) as T;
	}

	/**
	 * 创建特定平台的桥接实例
	 */
	forPlatform<T extends BridgeAdapter>(platform: string): T {
		// 确保平台支持
		if (!this.adapters.has(platform)) {
			throw new Error(`Platform ${platform} not supported`);
		}

		return new PlatformBridge<T>(this, platform).createProxy();
	}

	/**
	 * 获取PC平台桥接实例的便捷方法
	 */
	get pc(): PcBridgeAdapter {
		return this.forPlatform<PcBridgeAdapter>('pc');
	}

	/**
	 * 获取移动平台桥接实例的便捷方法
	 */
	get mobile(): MobileBridgeAdapter {
		return this.forPlatform<MobileBridgeAdapter>('mobile');
	}

	// 便捷方法：直接转发到对应适配器
	async invoke(platform: string, method: string, ...args: any[]): Promise<any> {
		const adapter = this.getAdapter(platform);
		if (!adapter) {
			throw new Error(`Platform ${platform} not supported`);
		}

		const func = adapter[method as keyof BridgeAdapter];
		if (typeof func !== 'function') {
			throw new Error(`Method ${method} not found in ${platform} adapter`);
		}

		// @ts-ignore
		return func.call(adapter, ...args);
	}

	/**
	 * 设置默认平台
	 */
	setDefaultPlatform(platform: string) {
		if (!this.adapters.has(platform)) {
			throw new Error(`Platform ${platform} not supported`);
		}
		this.defaultPlatform = platform;
		return this;
	}

	/**
	 * 获取当前默认平台
	 */
	getDefaultPlatform(): string {
		return this.defaultPlatform;
	}
}

export {
	BaseBridgeAdapter,
	PcBridgeAdapter,
	MobileBridgeAdapter
};

// 重要：覆盖BridgeManager的导出类型
declare module './index' {
	export interface BridgeManager extends BridgeManagerInterface {}
}

export * from './types';
