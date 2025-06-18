import { BridgeAdapter } from './types';

export abstract class BaseBridgeAdapter implements BridgeAdapter {
	// 实现基础能力
	async getVersion(): Promise<string> {
		return '1.0.0';
	}

	async getDeviceInfo(): Promise<Record<string, any>> {
		return {
			platform: this.getPlatform(),
			// ... 其他通用设备信息
		};
	}

	// 供子类实现的抽象方法
	protected abstract getPlatform(): string;

	// 通用工具方法
	protected async invokeNative(method: string, params?: any): Promise<any> {
		// 实现与原生通信的基础逻辑
		console.log(`Invoking native method: ${method}，params: ${JSON.stringify(params)}`);
		return Promise.resolve();
	}
}
