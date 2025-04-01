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
    users: UserElement[];
    trainers: TrainerElement[];
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
    profile_image: string;
};

export type UserElement = {
    id: number;
    user: User;
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
    users: UserElement[];
    trainers: TrainerElement[];
};
