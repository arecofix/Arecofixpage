/**
 * Message Entity
 * Represents a contact message from the website
 */
export interface Message {
    id: string;
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
    is_read: boolean;
    created_at: string;
}

/**
 * Message creation DTO
 */
export interface CreateMessageDto {
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
}
