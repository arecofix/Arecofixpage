import { Observable } from 'rxjs';
import { CustomerDevice, DeviceModel } from '../entities/customer-device.entity';

export abstract class ICustomerDeviceRepository {
  /**
   * Ensures a device model exists by slug. If it doesn't exist, it creates one.
   * Returns the model ID.
   */
  abstract ensureModelExists(name: string, slug: string, brandId?: string | null): Observable<string | null>;

  /**
   * Creates or updates a customer device based on the provided data.
   * If `deviceId` is provided, it updates the existing device.
   * If not, it creates a new device linked to `userId`.
   */
  abstract upsertDevice(payload: {
    deviceId?: string | null;
    userId: string;
    modelId: string | null;
    type?: string | null;
    imei?: string | null;
    passcode?: string | null;
  }): Observable<string | null>;
}
