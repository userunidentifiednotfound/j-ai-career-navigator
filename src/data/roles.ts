export interface RoleCategory {
  name: string;
  roles: string[];
}

export const itRoles: RoleCategory[] = [
  {
    name: "Software & Development",
    roles: [
      "Frontend Developer", "Backend Developer", "Full Stack Developer",
      "Java Developer", "Python Developer", "MERN Stack Developer",
      "MEAN Stack Developer", "Mobile App Developer", "Android Developer", "iOS Developer",
    ],
  },
  {
    name: "Data & AI",
    roles: [
      "Data Analyst", "Data Scientist", "Machine Learning Engineer",
      "AI Engineer", "NLP Engineer", "Computer Vision Engineer", "Big Data Engineer",
    ],
  },
  {
    name: "Cloud & DevOps",
    roles: [
      "Cloud Engineer", "AWS Engineer", "Azure Engineer",
      "DevOps Engineer", "Site Reliability Engineer",
    ],
  },
  {
    name: "Security",
    roles: [
      "Cyber Security Analyst", "Ethical Hacker", "SOC Analyst", "Penetration Tester",
    ],
  },
  {
    name: "Testing & QA",
    roles: ["Manual Tester", "Automation Tester", "Performance Tester"],
  },
  {
    name: "Design",
    roles: ["UI Designer", "UX Designer", "Product Designer"],
  },
  {
    name: "Systems & Networking",
    roles: ["Network Engineer", "System Administrator", "Linux Administrator"],
  },
  {
    name: "Emerging Tech",
    roles: ["Blockchain Developer", "Web3 Developer", "AR/VR Developer", "IoT Engineer"],
  },
  {
    name: "Enterprise & Others",
    roles: ["SAP Consultant", "Salesforce Developer", "CRM Developer", "ERP Consultant"],
  },
  {
    name: "Support & Management",
    roles: [
      "IT Support Engineer", "Technical Support Analyst", "Product Manager",
      "Technical Project Manager", "Business Analyst", "Solutions Architect", "Software Architect",
    ],
  },
];

export const nonItRoles: RoleCategory[] = [
  {
    name: "Marketing & Content",
    roles: [
      "Digital Marketing Executive", "SEO Specialist", "Content Writer",
      "Technical Writer", "Social Media Manager",
    ],
  },
  {
    name: "HR & Operations",
    roles: [
      "HR Executive", "Talent Acquisition Specialist", "Operations Manager",
      "Supply Chain Analyst",
    ],
  },
  {
    name: "Business & Sales",
    roles: ["Business Development Executive", "Sales Executive"],
  },
  {
    name: "Finance & Data",
    roles: ["Financial Analyst", "Accountant", "Data Entry Specialist"],
  },
  {
    name: "Support",
    roles: ["Customer Support Executive"],
  },
];

export const timeOptions = [
  { value: 30, label: "30 min/day", description: "Quick daily learning" },
  { value: 60, label: "1 hour/day", description: "Balanced pace" },
  { value: 120, label: "2 hours/day", description: "Accelerated growth" },
  { value: 180, label: "3+ hours/day", description: "Intensive track" },
];
