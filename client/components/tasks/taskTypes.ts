export type TaskPriority = "high" | "medium" | "low";
export type TaskStatus = "todo" | "in-progress" | "review" | "done";

export interface Task {
  id: string;
  title: string;
  description: string;
  project: string;
  projectId: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assignee: {
    id?: string;
    name: string;
    initials: string;
    avatarUrl?: string;
    bg: string;
  };
  tags: string[];
  subtasks: { id: string; title: string; done: boolean }[];
  teamId?: string | null;
  assigneeId?: string | null;
}

export const MOCK_TASKS: Task[] = [
  {
    id: "t1",
    title: "Review portal prototype feedback",
    description: "Gather all stakeholder feedback from the latest prototype demo and consolidate into action items for the design team.",
    project: "Client Portal Redesign",
    projectId: "2",
    status: "todo",
    priority: "high",
    dueDate: "Today",
    assignee: { name: "Jane Doe", initials: "JD", bg: "bg-primary text-on-primary" },
    tags: ["Design", "Review"],
    subtasks: [
      { id: "s1", title: "Collect survey results", done: true },
      { id: "s2", title: "Schedule review meeting", done: false },
    ],
  },
  {
    id: "t2",
    title: "Launch landing page assets",
    description: "Prepare and export all creative assets needed for the Q3 campaign landing page, including hero images, icons, and copy.",
    project: "Q3 Marketing Campaign",
    projectId: "1",
    status: "in-progress",
    priority: "high",
    dueDate: "Oct 10",
    assignee: { name: "Alex Miller", initials: "AM", bg: "bg-secondary-container text-on-secondary-container" },
    tags: ["Marketing", "Assets"],
    subtasks: [
      { id: "s3", title: "Export hero image variants", done: true },
      { id: "s4", title: "Write CTA copy", done: true },
      { id: "s5", title: "Review with brand team", done: false },
    ],
  },
  {
    id: "t3",
    title: "Final security audit check",
    description: "Perform the last round of security audits before the go-live date to ensure compliance with enterprise standards.",
    project: "Server Migration V2",
    projectId: "3",
    status: "review",
    priority: "medium",
    dueDate: "Sep 30",
    assignee: { name: "Sam Kumar", initials: "SK", bg: "bg-tertiary text-on-tertiary" },
    tags: ["Security", "DevOps"],
    subtasks: [
      { id: "s6", title: "Vulnerability scan", done: true },
      { id: "s7", title: "Pen test sign-off", done: true },
      { id: "s8", title: "Compliance documentation", done: false },
    ],
  },
  {
    id: "t4",
    title: "Update component library docs",
    description: "Sync the internal Storybook documentation with all new and modified components shipped in the last sprint.",
    project: "Client Portal Redesign",
    projectId: "2",
    status: "done",
    priority: "low",
    dueDate: "Sep 20",
    assignee: { name: "Elena Rodriguez", initials: "ER", bg: "bg-error-container text-on-error-container" },
    tags: ["Docs", "Frontend"],
    subtasks: [
      { id: "s9", title: "Write Button docs", done: true },
      { id: "s10", title: "Write FormField docs", done: true },
    ],
  },
  {
    id: "t5",
    title: "Set up CI/CD pipeline",
    description: "Configure automated testing and deployment workflows for the new microservices architecture using GitHub Actions.",
    project: "Server Migration V2",
    projectId: "3",
    status: "in-progress",
    priority: "high",
    dueDate: "Oct 05",
    assignee: { name: "Michael Chen", initials: "MC", bg: "bg-primary-container text-on-primary-container" },
    tags: ["DevOps", "Automation"],
    subtasks: [
      { id: "s11", title: "Configure staging environment", done: true },
      { id: "s12", title: "Write test pipeline", done: false },
      { id: "s13", title: "Production deploy config", done: false },
    ],
  },
  {
    id: "t6",
    title: "Social media content calendar",
    description: "Plan and schedule all social posts for October, including campaign teasers, product launch announcements, and engagement posts.",
    project: "Q3 Marketing Campaign",
    projectId: "1",
    status: "todo",
    priority: "medium",
    dueDate: "Oct 12",
    assignee: { name: "Sarah Jenkins", initials: "SJ", bg: "bg-secondary text-on-secondary" },
    tags: ["Marketing", "Content"],
    subtasks: [
      { id: "s14", title: "Draft post ideas", done: false },
      { id: "s15", title: "Get approvals", done: false },
    ],
  },
];
