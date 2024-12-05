import {
  MdHome,
  MdCheck,
  MdBarChart,
  MdGroup,
  MdPerson,
} from "react-icons/md";

const routes = [
  {
    name: "Dashboard",
    layout: "admin",
    path: "admin",
    icon: <MdHome className="h-6 w-6" />,
  },
  {
    name: "Students",
    layout: "admin/students",
    path: "admin/students",
    icon: <MdGroup className="h-6 w-6" />,
  },
  {
    name: "Finance",
    layout: "admin/finance",
    path: "admin/finance",
    icon: <MdCheck className="h-6 w-6" />,
  },
  {
    name: "Fees To Pay",
    layout: "admin/finance/payable",
    path: "admin/finance/payable",
    icon: <MdCheck className="h-6 w-6" />,
  },
  {
    name: "Fees Paid",
    layout: "admin/finance/collect",
    path: "admin/finance/collect",
    icon: <MdCheck className="h-6 w-6" />,
  },
  {
    name: "Tests/Tasks",
    layout: "admin/assignment",
    path: "admin/assignment",
    icon: <MdCheck className="h-6 w-6" />,
  },
  {
    name: "Create Test/Task",
    layout: "/admin/assignment/create",
    path: "/admin/assignment/create",
    icon: <MdCheck className="h-6 w-6" />,
  },
  {
    name: "Attendance",
    layout: "admin/attendance",
    path: "admin/attendance",
    icon: <MdCheck className="h-6 w-6" />,
  },
  {
    name: "Weekly Attendance",
    layout: "admin/attendance/student",
    path: "admin/attendance/student",
    icon: <MdCheck className="h-6 w-6" />,
  },
  {
    name: "QR Attendance",
    layout: "admin/attendance/qr",
    path: "admin/attendance/qr",
    icon: <MdCheck className="h-6 w-6" />,
  },
  {
    name: "W.E.L Attendance",
    layout: "admin/attendance/wel",
    path: "admin/attendance/wel",
    icon: <MdCheck className="h-6 w-6" />,
  },
  {
    name: "Learning Material",
    layout: "admin/uploads",
    path: "admin/uploads",
    icon: <MdBarChart className="h-6 w-6" />,
  },
  {
    name: "W.E.L",
    layout: "admin/well",
    path: "admin/well",
    icon: <MdBarChart className="h-6 w-6" />,
  },
  {
    name: "Admin",
    layout: "admin/settings",
    path: "admin/settings",
    icon: <MdBarChart className="h-6 w-6" />,
  },
  {
    name: "Change Student Intake Group",
    layout: "admin/admin/change-student-intakegroup",
    path: "admin/admin/change-student-intakegroup",
    icon: <MdBarChart className="h-6 w-6" />,
  },
  {
    name: "Capture Results",
    layout: "admin/results/capture",
    path: "admin/results/capture",
    icon: <MdBarChart className="h-6 w-6" />,
  },
  {
    name: "S.O.R",
    layout: "/admin/results/sor",
    path: "/admin/results/sor",
    icon: <MdBarChart className="h-6 w-6" />,
  },
  {
    name: "Accommodation",
    layout: "admin/accommodation",
    path: "admin/accommodation",
    icon: <MdBarChart className="h-6 w-6" />,
  },
  {
    name: "Mark Tests/Tasks",
    layout: "admin/assignment/mark",
    path: "admin/assignment/mark",
    icon: <MdBarChart className="h-6 w-6" />,
  },
  {
    name: "Duplicate Test/Task",
    layout: "/admin/assignment/duplicate",
    path: "/admin/assignment/duplicate",
    icon: <MdBarChart className="h-6 w-6" />,
  },
  {
    name: "Edit Test/Task",
    layout: "/admin/assignment/edit",
    path: "/admin/assignment/edit",
    icon: <MdBarChart className="h-6 w-6" />,
  },
  {
    name: "Finance Sheet",
    layout: " admin/finance/sheet",
    path: " admin/finance/sheet",
    icon: <MdBarChart className="h-6 w-6" />,
  },
  {
    name: "Staff",
    layout: "admin/settings/staff",
    path: "admin/settings/staff",
    icon: <MdBarChart className="h-6 w-6" />,
  },

  /////////////////////////////////////////////////
  {
    name: "Dashboard",
    layout: "student/dashboard",
    path: "student/dashboard",
    icon: <MdBarChart className="h-6 w-6" />,
  },
  {
    name: "Tests/Tasks",
    layout: "student/assignment",
    path: "student/assignment",
    icon: <MdBarChart className="h-6 w-6" />,
  },
  {
    name: "Write Tests/Tasks",
    layout: "student/assignment/test-list",
    path: "student/assignment/test-list",
    icon: <MdBarChart className="h-6 w-6" />,
  },
  {
    name: "Fees",
    layout: "student/fees",
    path: "student/fees",
    icon: <MdBarChart className="h-6 w-6" />,
  },
  {
    name: "Download Center",
    layout: "student/downloads",
    path: "student/downloads",
    icon: <MdBarChart className="h-6 w-6" />,
  },
  {
    name: "View Attendance",
    layout: "student/attendance",
    path: "student/attendance",
    icon: <MdBarChart className="h-6 w-6" />,
  },
  {
    name: "Add Attendance",
    layout: "student/attendance/qr",
    path: "student/attendance/qr",
    icon: <MdBarChart className="h-6 w-6" />,
  },
  {
    name: "W.E.L",
    layout: "student/well",
    path: "student/well",
    icon: <MdBarChart className="h-6 w-6" />,
  },
  {
    name: "Profile",
    layout: "student/profile",
    path: "student/profile",
    icon: <MdBarChart className="h-6 w-6" />,
  },

  /////////////////////////////////////////////////
  {
    name: "Dashboard",
    layout: "guardian/dashboard",
    path: "guardian/dashboard",
    icon: <MdBarChart className="h-6 w-6" />,
  },
  {
    name: "Tests/Tasks",
    layout: "guardian/assignment",
    path: "guardian/assignment",
    icon: <MdBarChart className="h-6 w-6" />,
  },
  {
    name: "Fees",
    layout: "guardian/fees",
    path: "guardian/fees",
    icon: <MdBarChart className="h-6 w-6" />,
  },
  {
    name: "Attendance",
    layout: "guardian/attendance",
    path: "guardian/attendance",
    icon: <MdBarChart className="h-6 w-6" />,
  },
  {
    name: "W.E.L",
    layout: "guardian/well",
    path: "guardian/well",
    icon: <MdBarChart className="h-6 w-6" />,
  },

];

export default routes;
