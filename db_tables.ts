type User = {
  id: number;
  name: string;
  clubId: number | null;
  email: string;
  phone: string;
  profileImage: string;
};

type Club = {
  id: number;
  name: string;
  email: string;
  phone: string;
  contactPerson: string;
  category: Category;
  addresses: Address[];
};

type Address = {
  id: number;
  address: string;
  name: string;
};

type Category = {
  id: number;
  name: string;
};

enum Days {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
}

type ClubGroup = {
  id: number;
  club: Club;
  address: Address;
  maxOccupancy: number;
  currentOccupancy: number;
  time: string;
  frequency: number;
  day: Days;
  trainers: User[];
};

type Training = {
  id: number;
  club: Club;
  address: Address;
  maxOccupancy: number;
  currentOccupancy: number;
  timestamp: string;
  group: ClubGroup;
  trainers: User[];
};

type HistoryEvent = {
  trainingId: number;
  groupId: number;
  event: string;
};

type JoinGroupRequest = {
  id: number;
  user: User;
  club: Club;
  comments: string;
};

type JoinTrainingRequest = {
  id: number;
  user: User;
  club: Club;
  comments: string;
};

type Notice = {
  id: number;
  notice: string;
  trainingId: number | undefined;
  groupId: number | undefined;
};
