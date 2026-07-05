export enum TicketStatus {
    OPEN = 'open',
    IN_PROGRESS = 'in_progress',
    RESOLVED = 'resolved',
    CLOSED = 'closed'
}

export enum TicketPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    CRITICAL = 'critical'
}

export enum TicketCategory {
    HARDWARE = 'hardware',
    SOFTWARE = 'software',
    NETWORK = 'network',
    SECURITY = 'security',
    OTHER = 'other'
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