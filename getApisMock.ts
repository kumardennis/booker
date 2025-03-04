const getUser = (id) => {
  // get user based on ID

  return {
    id: 1,
    name: "James Watson",
    club: "skfookus",
    clubId: 1,
    email: "whateverthefuck@gmail.com",
    phone: "+372-52989883",
    profileImage: "",
  };
};

const getClubs = (name, category, tags) => {
  // get clubs based on params
  // for now only fookus

  return [
    {
      id: 1,
      name: "SK Fookus",
      email: "info@skfookus.ee",
      phone: "+372-4439939",
      category: "Badminton",
      contactPerson: "Rainer Terras",
      addresses: [
        {
          address: "Sojakooli tn 10, Tallinn, Estonia",
          name: "Forus tennis place",
        },
      ],
    },
  ];
};

const getClubGroups = (club) => {
  // get trainings based on params
  // for now only fookus

  return [{
    Monday: [{
      id: 1,
      clubId: 1,
      address: {
        address: "",
        name: "",
      },
      maxOccupancy: 8,
      currentOccupancy: 4,
      time: "17:00",
      onceInNumberOfWeeks: 1, // once a week
      trainers: [
        { name: "", image: "", phone: "" },
      ],
    }],
  }];
};

const getTrainings = (groupId) => {
  // get all trainings
  // for now fookus only

  return [
    {
      id: 1,
      clubId: 1,
      address: {
        address: "",
        name: "",
      },
      maxOccupancy: 8,
      currentOccupancy: 4,
      groupId: 1,
      timestamp: 12312314423,
      trainers: [
        { name: "", image: "", phone: "" },
      ],
    },
  ];
};

const getPeopleInGroups = (groupId) => {
  // get all people in trainings
  // for now fookus only

  return {
    groupId: 1,
    users: [{
      id: 1,
      name: "James Watson",
      email: "whateerthefuck@gmail.com",
      phone: "",
    }],
  };
};

const getPeopleInTrainigs = (trainingId) => {
  // get all people in trainings
  // for now fookus only

  return {
    trainingId: 1,
    users: [{
      id: 1,
      name: "James Watson",
      email: "whateerthefuck@gmail.com",
      phone: "",
    }],
  };
};

const getHistoryOfTraining = (trainingId) => {
  // get all history events in trainings
  // for now fookus only

  return {
    trainingId: 1,
    events: [{
      id: 1,
      event: "James Watson died a tragic death",
    }],
  };
};

const getRequests = () => {
  return [
    {
      id: 1,
      fromUserId: 1,
      toClubId: 1,
      isPending: true,
      isAccepted: false,
      isRejected: false,
      comments: "",
    },
  ];
};
