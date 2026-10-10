export class CustomerName {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(name: string | undefined | null): CustomerName {
        if (!name) {
            throw new Error('CustomerName cannot be empty.');
        }

        const trimmed = name.trim();
        
        if (trimmed.length === 0) {
            throw new Error('CustomerName cannot be empty.');
        }

        if (trimmed.toLowerCase() === 'cliente') {
            throw new Error('CustomerName cannot be a generic fallback like "Cliente".');
        }

        return new CustomerName(trimmed);
    }

    public getValue(): string {
        return this.value;
    }
}
