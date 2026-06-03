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
