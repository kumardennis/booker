export type Club = {
    id: number;
    created_at: Date;
    name: string;
    email: string;
    phone: string;
    contact_person: string;
    category_id: number;
    image: string;
};

export type ClubGroup = {
    id: number;
    created_at: Date;
    club_id: number;
    address_id: number;
    max_occupancy: number;
    start_time: string;
    once_in_number_of_weeks: number;
    day: string;
    end_time: string;
    clubs: Club[];
    addresses: Address[];
    users: UserElementGroup[];
    trainers: TrainerElement[];
    requests: JoinGroupRequest[];
    level: number;
};

export type Address = {
    id: number;
    name: string;
    address: string;
    club_id: number;
    created_at: Date;
};

export type TrainerElement = {
    id: number;
    trainer: User;
};

export type User = {
    id: number;
    email: string;
    phone: string;
    userId: string;
    club_id: number;
    last_name: string;
    created_at: Date;
    first_name: string;
    is_trainer: boolean;
    is_club_admin: boolean;
    profile_image: string;
};

export type UserElement = {
    is_active: any;
    id: number;
    user: User;
};

export type UserElementGroup = UserElement & {
    is_active: Boolean;
};

export type UserElementTraining = UserElement & {
    marked_absent: Boolean;
    marked_absent_timestamp: string;
    promo_code_id: number;
};

export type JoinGroupRequest = UserElement & {
    created_at: Date;
    is_accepted: boolean;
    is_rejected: boolean;
    comments?: string;
};

export type JoinTrainingRequest = UserElement & {
    created_at: Date;
    is_accepted: boolean;
    is_rejected: boolean;
    comments?: string;
};

export type GroupTraining = {
    id: number;
    created_at: Date;
    group_id: number;
    club_id: number;
    max_occupancy: number;
    start_timestamp: Date;
    end_timestamp: Date;
    club_groups: ClubGroup;
    users: UserElementTraining[];
    trainers: TrainerElement[];
    requests: JoinTrainingRequest[];
};

export type HistoryEvent = {
    id: number;
    created_at: Date;
    event: string;
    event_type: EventType;
    group_id?: number;
    training_id?: number;
};

export type Notice = {
    id: number;
    created_at: Date;
    notice: string;
    group_id?: number;
    training_id?: number;
    user_id?: number;
    user?: User;
};

export enum GroupEventType {
    GROUP_USER_JOIN_REQUEST = "GROUP_USER_JOIN_REQUEST",
    GROUP_USER_JOIN_REQUEST_DELETE = "GROUP_USER_JOIN_REQUEST_DELETE",
    GROUP_USER_JOIN = "GROUP_USER_JOIN",
    // GROUP_USER_LEAVE_REQUEST = "GROUP_USER_LEAVE_REQUEST",
    GROUP_USER_LEAVE = "GROUP_USER_LEAVE",
    GROUP_USER_WAITING_LIST = "GROUP_USER_WAITING_LIST",
    GROUP_TIME_CHANGE = "GROUP_TIME_CHANGE",
    GROUP_OCCUPANCY_CHANGE = "GROUP_OCCUPANCY_CHANGE",
    GROUP_ARCHIVED = "GROUP_ARCHIVED",
    GROUP_OTHERS = "GROUP_OTHERS",
    GROUP_GENERATE_TRAINING = "GROUP_GENERATE_TRAINING",
}

export enum TrainingEventType {
    TRAINING_USER_JOIN_REQUEST = "TRAINING_USER_JOIN_REQUEST",
    TRAINING_USER_JOIN_REQUEST_DELETE = "TRAINING_USER_JOIN_REQUEST_DELETE",
    TRAINING_USER_JOIN = "TRAINING_USER_JOIN",
    TRAINING_USER_LEAVE = "TRAINING_USER_LEAVE",
    TRAINING_USER_WAITING_LIST = "TRAINING_USER_WAITING_LIST",
    TRAINING_TIME_CHANGE = "TRAINING_TIME_CHANGE",
    TRAINING_OCCUPANCY_CHANGE = "TRAINING_OCCUPANCY_CHANGE",
    TRAINING_ARCHIVED = "TRAINING_ARCHIVED",
    TRAINING_OTHERS = "TRAINING_OTHERS",
}

export type EventAffectsPeople = {
    others: number[] | boolean;
    self: boolean;
};

export const EventTypeCombined = Object.assign(
    {},
    GroupEventType,
    TrainingEventType,
);

export type EventType = keyof typeof EventTypeCombined;

export enum CRUDType {
    CREATE = "CREATE",
    READ = "READ",
    UPDATE = "UPDATE",
    DELETE = "DELETE",
}

export type Permission = {
    crud: CRUDType;
    forPeople: EventAffectsPeople;
};

export type EventTypePermission = {
    event_type: EventType;
    crudAllowed: Permission[];
};
