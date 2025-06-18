// 基础桥接方法接口
export interface BridgeAdapter {
	// 基础能力
	getVersion(): Promise<string>;
	getDeviceInfo(): Promise<Record<string, any>>;
	// ... 其他通用方法
}

// PC端特有方法接口
export interface PcBridgeAdapter extends BridgeAdapter {
	openWindow?(url: string): Promise<void>;
	// ... 其他PC特有方法
}

// 移动端特有方法接口
export interface MobileBridgeAdapter extends BridgeAdapter {
	scanQRCode?(): Promise<string>;
	// ... 其他移动端特有方法
}

// 创建一个更完整的类型来表示BridgeManager及其代理
export interface BridgeManagerInterface extends BridgeAdapter {
	// BridgeManager原有方法
	register(name: string, adapter: BridgeAdapter): BridgeManagerInterface;
	getAdapter<T extends BridgeAdapter>(name: string): T | undefined;
	forPlatform<T extends BridgeAdapter>(platform: string): T;
	invoke(platform: string, method: string, ...args: any[]): Promise<any>;
	setDefaultPlatform(platform: string): BridgeManagerInterface;
	getDefaultPlatform(): string;

	// 平台特定属性
	readonly pc: PcBridgeAdapter;
	readonly mobile: MobileBridgeAdapter;
}
