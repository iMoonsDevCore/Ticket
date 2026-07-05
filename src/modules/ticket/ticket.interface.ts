export enum TicketStatus {
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    RESOLVED = 'RESOLVED',
    CLOSED = 'CLOSED'
}

export enum TicketPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    CRITICAL = 'CRITICAL'
}

export enum TicketCategory {
    HARDWARE = 'HARDWARE',
    SOFTWARE = 'SOFTWARE',
    NETWORK = 'NETWORK',
    SECURITY = 'SECURITY',
    OTHER = 'OTHER'
}

export interface Ticket {
    id?: string,
    title: string,
    description: string,
    status: TicketStatus,
    assignedTo?: string,
    priority: TicketPriority,
    category: TicketCategory,
    createdBy: string,
    createdAt?: Date,
    updatedAt?: Date,
    closedAt?: Date,
    resolvedAt?: Date,
}