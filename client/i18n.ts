import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          "P": "P",
          "ProSync": "ProSync",
          "Enterprise": "Enterprise",
          "Dashboard": "Dashboard",
          "Projects": "Projects",
          "Tasks": "Tasks",
          "Team": "Team",
          "Analytics": "Analytics",
          "Settings": "Settings",
          "Upgrade Plan": "Upgrade Plan",
          "Help Center": "Help Center",
          "Log Out": "Log Out",
          "Search projects...": "Search projects...",
          "Create Task": "Create Task",
          "U": "U",
          "All Projects": "All Projects",
          "Manage and track your team's ongoing initiatives.": "Manage and track your team's ongoing initiatives.",
          "All Statuses": "All Statuses",
          "Active": "Active",
          "Completed": "Completed",
          "On Hold": "On Hold",
          "New Project": "New Project",
          "Q3 Marketing Campaign": "Q3 Marketing Campaign",
          "Executing the multi-channel marketing strategy for the new product launch across digital platforms.": "Executing the multi-channel marketing strategy for the new product launch across digital platforms.",
          "Oct 15": "Oct 15",
          "Client Portal Redesign": "Client Portal Redesign",
          "Overhauling the user interface and experience for the primary enterprise client dashboard.": "Overhauling the user interface and experience for the primary enterprise client dashboard.",
          "Tomorrow": "Tomorrow",
          "Server Migration V2": "Server Migration V2",
          "Migrated legacy databases to the new cloud infrastructure with zero downtime.": "Migrated legacy databases to the new cloud infrastructure with zero downtime.",
          "Sep 01": "Sep 01",
          // Login screen translations
          "Welcome back": "Welcome back",
          "Please enter your details to sign in.": "Please enter your details to sign in.",
          "Email Address": "Email Address",
          "Password": "Password",
          "Remember me": "Remember me",
          "Forgot password?": "Forgot password?",
          "Sign In": "Sign In",
          "Or continue with": "Or continue with",
          "Quick Demo Login": "Quick Demo Login",
          "Don't have an account?": "Don't have an account?",
          "Request Access": "Request Access",
          "Master your momentum.": "Master your momentum.",
          "Experience the clarity of enterprise-grade project management. Seamlessly align your team, track complex tasks, and deliver with precision.": "Experience the clarity of enterprise-grade project management. Seamlessly align your team, track complex tasks, and deliver with precision.",
          "Trusted by 10,000+ teams": "Trusted by 10,000+ teams",
          "ProjectFlow": "ProjectFlow",
          // Dashboard screen translations
          "Executive Overview": "Executive Overview",
          "Real-time metrics and project velocity.": "Real-time metrics and project velocity.",
          "Last 30 Days": "Last 30 Days",
          "Export Report": "Export Report",
          "Total Projects": "Total Projects",
          "Total Tasks": "Total Tasks",
          "Pending": "Pending",
          "Overdue": "Overdue",
          "Task Status Distribution": "Task Status Distribution",
          "Active Project Progress": "Active Project Progress",
          "High Priority Tasks": "High Priority Tasks",
          "Recent Activity Timeline": "Recent Activity Timeline",
          "No projects found matching the filter": "No projects found matching the filter",
          "Edit Project": "Edit Project",
          "Delete Project": "Delete Project",
          // Material Symbol Icons (Ligatures)
          "menu": "menu",
          "search": "search",
          "notifications": "notifications",
          "dark_mode": "dark_mode",
          "add": "add",
          "dashboard": "dashboard",
          "folder": "folder",
          "assignment": "assignment",
          "group": "group",
          "analytics": "analytics",
          "settings": "settings",
          "help": "help",
          "logout": "logout",
          "filter_list": "filter_list",
          "edit": "edit",
          "delete": "delete",
          "calendar_today": "calendar_today",
          "warning": "warning",
          "check_circle": "check_circle"
        }
      }
    },
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
