/**
 * @author: gilbert
 * @date: 2020/12/10
 * @description: 使用示例
 */

import {BridgeManager} from '../src/'

const main = async () => {
	// 创建桥接管理器，指定默认平台为'pc'
	const bridge = new BridgeManager('pc');

	const version = await bridge.getVersion();
	const deviceInfo = await bridge.getDeviceInfo();
	console.log('bridge.getVersion()', version, deviceInfo);
}

main();

// // 如果需要临时切换平台
// bridge.setDefaultPlatform('mobile');
// bridge.someMethod();  // 现在会转发到mobile平台
//
// // 依然可以显式指定平台
// bridge.pc.specificPcMethod();
// bridge.mobile.specificMobileMethod();
