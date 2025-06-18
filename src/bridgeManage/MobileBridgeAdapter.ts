import { BaseBridgeAdapter } from './BaseBridgeAdapter';
import { MobileBridgeAdapter as IMobileBridgeAdapter } from './types';

export class MobileBridgeAdapter extends BaseBridgeAdapter implements IMobileBridgeAdapter {
  protected getPlatform(): string {
    return 'mobile';
  }

  // 移动端特有方法实现
  async scanQRCode(): Promise<string> {
    return this.invokeNative('scanQRCode');
  }

  // 其他移动端特有方法...
}
