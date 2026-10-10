export class DeviceModel {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(model: string | undefined | null): DeviceModel {
        if (!model) {
            throw new Error('DeviceModel cannot be empty.');
        }

        const trimmed = model.trim();
        
        if (trimmed.length === 0) {
            throw new Error('DeviceModel cannot be empty.');
        }

        if (trimmed.toLowerCase() === 'equipo genérico' || trimmed.toLowerCase() === 'equipo generico') {
            throw new Error('DeviceModel cannot be a generic fallback like "Equipo Genérico".');
        }

        return new DeviceModel(trimmed);
    }

    public getValue(): string {
        return this.value;
    }
}
