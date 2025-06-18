import { BaseBridgeAdapter } from './BaseBridgeAdapter';
import { PcBridgeAdapter as IPcBridgeAdapter } from './types';

export class PcBridgeAdapter extends BaseBridgeAdapter implements IPcBridgeAdapter {
  protected getPlatform(): string {
    return 'pc';
  }

  // PC特有方法实现
  async openWindow(url: string): Promise<void> {
    await this.invokeNative('openWindow', { url });
  }

  // 其他PC特有方法...
}
