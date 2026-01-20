
export class CrmMessage {
    id?: string;
    name: string;
    phone: string;
    address: string;
    date: Date;
    email?: string; // Optional but good for saving
    notes?: string;

    constructor(data: Partial<CrmMessage>) {
        this.id = data.id;
        this.name = data.name || '';
        this.phone = data.phone || '';
        this.address = data.address || '';
        this.date = data.date || new Date();
        this.email = data.email;
        this.notes = data.notes;
    }
}
