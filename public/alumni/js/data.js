const alumniData = [
  {
    id: 1,
    name: "Rahul Sharma",
    company: "Google",
    role: "SDE-2",
    batch: 2019,
    location: "Bangalore",
    about: "Backend engineer working on scalable systems.",
    skills: ["React", "Node", "System Design"],
    connections: [],
    connectionRequests: [],
    availability: "Available", // Available | Busy | Not Accepting
    profileViews: 12,
    referralsGiven: 3,
    badges: ["Top Mentor"],
    bookmarks: [],
    messages: [],
    
    eventsHosting: [],
    mockSlots: [
  { id: 1, date: "2025-03-28", time: "6:00 PM", bookedBy: null },
  { id: 2, date: "2025-03-29", time: "4:00 PM", bookedBy: null }
],
    referralRequests: [
  {
    company: "Google",
    status: "In Review" // Requested | In Review | Shortlisted | Rejected
  }
],
    posts: [
      {
        id: Date.now(),
        content: "Hiring Backend Developers at Google. DM for referral.",
        likes: 2,
        likedByCurrentUser: false,
        comments: [],
        savedBy: [],
        shares: 0,
      },
      {
        id: Date.now() + 1,
        content:
          "Happy to mentor 3rd year students preparing for placements. Comment 'Mentor' below.",
        likes: 5,
        likedByCurrentUser: false,
        comments: ["Interested!", "Mentor please"],
      },
      {
        id: Date.now() + 2,
        content:
          "System Design Mock Session this Sunday at 6PM. Limited seats!",
        likes: 8,
        likedByCurrentUser: false,
        comments: [],
        savedBy: [],
        shares: 0,
      },
    ],
  },
  {
    id: 2,
    name: "Ananya Verma",
    company: "Amazon",
    role: "Backend Engineer",
    batch: 2018,
    location: "Hyderabad",
    about: "Cloud engineer helping students with referrals.",
    skills: ["AWS", "DSA"],
    connections: [],
    connectionRequests: [],
    availability: "Busy", // Available | Busy | Not Accepting
    profileViews: 16,
    referralsGiven: 2,
    badges: ["Top Mentor"],
    bookmarks: [],
    messages: [],
    eventsHosting: [],
    mockSlots: [
  { id: 1, date: "2025-03-28", time: "6:00 PM", bookedBy: null },
  { id: 2, date: "2025-03-29", time: "4:00 PM", bookedBy: null }
],
    referralRequests: [
  {
    company: "Google",
    status: "In Review" // Requested | In Review | Shortlisted | Rejected
  }
],
    posts: [
      {
        id: Date.now() + 3,
        content:
          "Amazon is opening SDE Intern positions soon. Keep your resume ready!",
        likes: 4,
        likedByCurrentUser: false,
        comments: [],
        savedBy: [],
        shares: 0,
      },
      {
        id: Date.now() + 4,
        content:
          "Conducting free DSA mock interviews for final years. DM to book slot.",
        likes: 6,
        likedByCurrentUser: false,
        comments: [],
        savedBy: [],
        shares: 0,
      },
    ],
  },
];

  const eventsData = [
  {
    id: 1,
    title: "System Design Mock Session",
    description: "Live interactive mock with Q&A",
    hostId: 1,
    date: "2025-03-25",
    type: "Mock",
    attendees: []
  },
  {
    id: 2,
    title: "Resume Review Webinar",
    description: "How to build strong resume",
    hostId: 2,
    date: "2025-03-30",
    type: "Webinar",
    attendees: []
  }
];

const conversations = [];
