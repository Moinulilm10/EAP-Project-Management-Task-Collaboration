# ProSync Task Management System — Design System

> **Source:** Stitch Project `projects/1946346439500980898` ("ProSync Task Management System")
> **Design Theme:** Kinetic Enterprise · Corporate Modern with Glassmorphic Accents
> **Last Synced:** 2026-06-03

---

## Table of Contents

- [Brand & Style](#brand--style)
- [Color System](#color-system)
- [Typography](#typography)
- [Spacing & Grid](#spacing--grid)
- [Border Radius / Shapes](#border-radius--shapes)
- [Elevation & Depth](#elevation--depth)
- [Glassmorphism](#glassmorphism)
- [Motion & Transitions](#motion--transitions)
- [Components](#components)
- [Screen Blueprints](#screen-blueprints)
  - [Login & Authentication](#1-login--authentication)
  - [Executive Dashboard](#2-executive-dashboard)
  - [Project Management](#3-project-management)
- [All Screens Index](#all-screens-index)

---

## Brand & Style

| Property        | Value                                                    |
| --------------- | -------------------------------------------------------- |
| **Brand Name**  | ProjectFlow                                              |
| **Personality** | Professional, Efficient, Collaborative                   |
| **Visual Style**| Corporate Modern with Glassmorphic Accents               |
| **Color Mode**  | Light (with Dark mode support via `.dark` class)         |
| **Font Family** | Inter                                                    |
| **Device**      | Desktop-first, responsive                                |
| **Roundness**   | ROUND_EIGHT                                              |

The visual style balances a structured grid with translucent glassmorphic overlays. Heavy whitespace reduces cognitive load. The emotional response is **"controlled momentum"** — organized, ahead of schedule, supported by precision tooling.

---

## Color System

### Core Palette

| Token                      | Hex       | Usage                                      |
| -------------------------- | --------- | ------------------------------------------ |
| `primary`                  | `#3525cd` | Primary actions, active nav, brand moments  |
| `primary-container`        | `#4f46e5` | Primary container / hover states            |
| `on-primary`               | `#ffffff` | Text/icons on primary                       |
| `on-primary-container`     | `#dad7ff` | Text on primary-container                   |
| `on-primary-fixed`         | `#0f0069` | Deep primary text                           |
| `on-primary-fixed-variant` | `#3323cc` | Primary button hover                        |
| `primary-fixed`            | `#e2dfff` | Light primary fills                         |
| `primary-fixed-dim`        | `#c3c0ff` | Dimmed primary fills                        |
| `inverse-primary`          | `#c3c0ff` | Primary in dark contexts                    |

### Secondary (Slate)

| Token                         | Hex       | Usage                                   |
| ----------------------------- | --------- | --------------------------------------- |
| `secondary`                   | `#505f76` | Supporting text, icons, non-primary UI  |
| `secondary-container`         | `#d0e1fb` | Secondary container fills               |
| `on-secondary`                | `#ffffff` | Text on secondary                       |
| `on-secondary-container`      | `#54647a` | Text on secondary-container             |
| `secondary-fixed`             | `#d3e4fe` | Fixed secondary fills                   |
| `secondary-fixed-dim`         | `#b7c8e1` | Dimmed secondary                        |
| `on-secondary-fixed`          | `#0b1c30` | Deep secondary text                     |
| `on-secondary-fixed-variant`  | `#38485d` | Secondary variant text                  |

### Tertiary (Emerald / Success)

| Token                         | Hex       | Usage                                   |
| ----------------------------- | --------- | --------------------------------------- |
| `tertiary`                    | `#005338` | Success/complete indicators             |
| `tertiary-container`          | `#006e4b` | Tertiary container / status badges      |
| `on-tertiary`                 | `#ffffff` | Text on tertiary                        |
| `on-tertiary-container`       | `#67f4b7` | Text on tertiary-container              |
| `tertiary-fixed`              | `#6ffbbe` | Light success fills                     |
| `tertiary-fixed-dim`          | `#4edea3` | Trend indicators (↑ green)              |
| `on-tertiary-fixed`           | `#002113` | Deep tertiary text                      |
| `on-tertiary-fixed-variant`   | `#005236` | Tertiary variant text                   |

### Error (Rose / Danger)

| Token                | Hex       | Usage                                       |
| -------------------- | --------- | ------------------------------------------- |
| `error`              | `#ba1a1a` | Danger, overdue, destructive actions         |
| `error-container`    | `#ffdad6` | Error container fills                        |
| `on-error`           | `#ffffff` | Text on error                                |
| `on-error-container` | `#93000a` | Text on error-container                      |

### Surfaces & Backgrounds

| Token                       | Hex       | Usage                                      |
| --------------------------- | --------- | ------------------------------------------ |
| `background`                | `#f7f9fb` | Main canvas background                     |
| `on-background`             | `#191c1e` | Text on background                         |
| `surface`                   | `#f7f9fb` | Card/panel surfaces                        |
| `surface-bright`            | `#f7f9fb` | Bright surface variant                     |
| `surface-dim`               | `#d8dadc` | Dimmed surface                             |
| `surface-container-lowest`  | `#ffffff` | Lightest container (forms, modals)         |
| `surface-container-low`     | `#f2f4f6` | Low-emphasis containers                    |
| `surface-container`         | `#eceef0` | Default containers                         |
| `surface-container-high`    | `#e6e8ea` | High-emphasis containers (progress bars)   |
| `surface-container-highest` | `#e0e3e5` | Highest-emphasis containers                |
| `surface-variant`           | `#e0e3e5` | Variant surface                            |
| `surface-tint`              | `#4d44e3` | Surface tint overlay                       |
| `on-surface`                | `#191c1e` | Primary text color                         |
| `on-surface-variant`        | `#464555` | Secondary/muted text                       |
| `inverse-surface`           | `#2d3133` | Dark surface (tooltips, dark mode)         |
| `inverse-on-surface`        | `#eff1f3` | Text on inverse surface                    |

### Outlines & Borders

| Token             | Hex       | Usage                                         |
| ----------------- | --------- | --------------------------------------------- |
| `outline`         | `#777587` | Default borders                               |
| `outline-variant` | `#c7c4d8` | Subtle borders, dividers (often at 20-30% α)  |

### Override Colors (Semantic Shorthand)

| Name      | Hex       | Role           |
| --------- | --------- | -------------- |
| Primary   | `#4f46e5` | Brand indigo   |
| Secondary | `#64748b` | Slate neutral  |
| Tertiary  | `#10b981` | Emerald accent |
| Neutral   | `#f8fafc` | Canvas white   |

---

## Typography

**Font Family:** `Inter` (all weights: 400, 500, 600, 700, 800, 900)
**Google Fonts URL:** `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap`

| Token                  | Size  | Weight | Line Height | Letter Spacing | Usage                        |
| ---------------------- | ----- | ------ | ----------- | -------------- | ---------------------------- |
| `display-lg`           | 48px  | 700    | 56px        | -0.02em        | KPI hero numbers             |
| `headline-lg`          | 32px  | 700    | 40px        | -0.01em        | Page titles, dashboard heads |
| `headline-lg-mobile`   | 24px  | 700    | 32px        | —              | Mobile page titles           |
| `headline-md`          | 24px  | 600    | 32px        | —              | Section headings             |
| `title-md`             | 18px  | 600    | 24px        | —              | Card titles, panel headers   |
| `body-lg`              | 16px  | 400    | 24px        | —              | Primary body text            |
| `body-md`              | 14px  | 400    | 20px        | —              | Secondary body text          |
| `label-md`             | 12px  | 600    | 16px        | 0.05em         | Buttons, badges, nav labels  |
| `label-sm`             | 11px  | 500    | 14px        | —              | Timestamps, micro-metadata   |

### Usage Guidelines
- **Headlines:** Tight letter-spacing + bold weights for dashboard titles (strong visual anchor)
- **Task Metadata:** `label-md` with UPPERCASE for status badges/tags
- **Body Text:** 14px–16px with generous line-height for long work sessions

---

## Spacing & Grid

### Spacing Scale (8px Base Grid)

| Token            | Value | Usage                                 |
| ---------------- | ----- | ------------------------------------- |
| `base`           | 8px   | Base unit                             |
| `xs`             | 4px   | Tight gaps (icon padding)             |
| `sm`             | 12px  | Small gaps (nav items, card padding)  |
| `md`             | 24px  | Medium gaps (sections, card padding)  |
| `lg`             | 40px  | Large gaps (major section spacing)    |
| `xl`             | 64px  | Extra-large (page-level spacing)      |
| `gutter`         | 24px  | Grid gutter width                     |
| `margin-mobile`  | 16px  | Mobile edge margins                   |
| `margin-desktop` | 32px  | Desktop edge margins                  |

### Grid System

| Breakpoint          | Columns | Margins | Sidebar       | Max Width |
| ------------------- | ------- | ------- | ------------- | --------- |
| Mobile (`<768px`)   | 4       | 16px    | Hidden/drawer | Fluid     |
| Tablet (`768-1280`) | 8       | 24px    | Icon rail     | Fluid     |
| Desktop (`>1280`)   | 12      | 32px    | 280px fixed   | 1600px    |

---

## Border Radius / Shapes

| Token     | Value    | Usage                                  |
| --------- | -------- | -------------------------------------- |
| `DEFAULT` | 0.25rem  | Subtle rounding                        |
| `sm`      | 0.25rem  | Small elements                         |
| `md`      | 0.75rem  | Inputs, buttons                        |
| `lg`      | 0.5rem   | Cards, modals → actual 16px used       |
| `xl`      | 1.5rem   | Large panels, login container (24px)   |
| `full`    | 9999px   | Pill badges, avatars, search inputs    |

### Shape Guidelines
- **Cards & Modals:** `rounded-xl` (24px) for modern, soft containers
- **Inputs & Buttons:** `rounded-lg` (8px) for functional precision
- **Status Badges/Chips:** `rounded-full` (pill shape)
- **Avatars:** Circular clips for team members

---

## Elevation & Depth

| Level | Surface                 | Shadow / Effect                                                           |
| ----- | ----------------------- | ------------------------------------------------------------------------- |
| 0     | Background (`#f7f9fb`)  | No shadow                                                                 |
| 1     | Cards / Tables          | `0 4px 24px -4px rgba(53,37,205,0.05)` — ambient indigo-tinted shadow     |
| 2     | Modals / Overlays       | Glassmorphic: `backdrop-blur(16px)` + 70% white fill + 1px border         |
| 3     | Popovers / Context      | `0 10px 15px -3px rgba(53,37,205,0.08)` — sharp, close proximity shadow   |

### Card Hover Effect
```css
.card-hover {
    transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1),
                box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1);
}
.card-hover:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(53, 37, 205, 0.08),
                0 4px 6px -2px rgba(53, 37, 205, 0.04);
}
```

---

## Glassmorphism

```css
.glass-panel {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(199, 196, 216, 0.3);  /* outline-variant at 30% */
    box-shadow: 0 4px 24px rgba(53, 37, 205, 0.06);  /* primary tint */
}
```

---

## Motion & Transitions

| Effect           | Duration | Easing                              | Usage                      |
| ---------------- | -------- | ----------------------------------- | -------------------------- |
| Card hover lift  | 200ms    | `cubic-bezier(0.4, 0, 0.2, 1)`     | Cards, interactive items   |
| Fade-in entrance | 600ms    | `cubic-bezier(0.4, 0, 0.2, 1)`     | Page section stagger       |
| Color transition | 200ms    | `ease`                              | Buttons, nav hover states  |
| Button hover     | 40ms     | `linear`                            | Primary button shade       |
| Scale transform  | 150ms    | `ease`                              | Active nav item scale-95   |

### Animated Background Gradient (Login page)
```css
.bg-animated-gradient {
    background: linear-gradient(-45deg, #f7f9fb, #e2dfff, #d0e1fb, #f7f9fb);
    background-size: 400% 400%;
    animation: gradientBG 15s ease infinite;
}
```

### Input Focus Glow
```css
.input-glow:focus {
    outline: none;
    box-shadow: 0 0 0 2px #3525cd;  /* 2px primary ring */
    border-color: transparent;
}
```

---

## Components

### Buttons

| Variant     | Background      | Text          | Border                | Hover                          |
| ----------- | --------------- | ------------- | --------------------- | ------------------------------ |
| **Primary** | `#3525cd`       | `#ffffff`     | None                  | `#3323cc` + translateY(-2px)   |
| **Secondary** | Transparent   | `#3525cd`     | 1px `outline-variant` | `surface-container-low` bg     |
| **Ghost**   | Transparent     | `#505f76`     | None                  | `primary/5` bg                 |
| **CTA**     | `#4f46e5`       | `#ffffff`     | None                  | `primary-container` bg         |

### Navigation
- **Sidebar:** Fixed 280px, `surface-container-lowest/70` + `backdrop-blur-xl`, 1px right border
- **Active item:** `primary-container/20` bg, primary text, bold, `scale-95`
- **Inactive item:** `secondary` text, hover → primary text + `surface-container-high/50` bg
- **Top bar:** Fixed, `surface/80` + `backdrop-blur-md`, 1px bottom border

### Cards (KPI)
- Glass panel with `rounded-xl`, `p-md`
- Decorative circle: `absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full` with group hover scale
- Value: `display-lg` (48px bold)
- Label: `label-md` uppercase tracking-wider
- Trend badge: colored bg/text with icon + `label-sm`

### Inputs
- `border border-outline-variant rounded-lg bg-surface`
- Icon prefix: `material-symbols-outlined` in `outline` color
- Focus: 2px primary ring glow
- Typography: `body-md`

### Status Badges
- Pill shape (`rounded-full`)
- Active: `bg-tertiary-container/10 text-tertiary-container border-tertiary-container/20`
- Completed: `bg-secondary-container/30 text-on-secondary-container border-secondary-container`
- Error/Overdue: `border-error/20 bg-error-container/10`

### Progress Bars
- Track: `bg-surface-container-high h-2 rounded-full`
- Fill: `bg-primary h-full rounded-full` with width percentage

---

## Screen Blueprints

### 1. Login & Authentication

**Screen ID:** `b1c85a75abb04ef397c9a5c3dfbfef32`
**Dimensions:** 2560 × 2048 (Desktop)

#### Layout Structure
```
┌──────────────────────────────────────────────┐
│  Animated gradient background                │
│  ┌──────────────┬──────────────────────────┐  │
│  │  LEFT PANEL  │     RIGHT PANEL          │  │
│  │  (bg-primary)│  (surface-container-     │  │
│  │              │   lowest)                │  │
│  │  Logo +      │                          │  │
│  │  Brand name  │  "Welcome back"          │  │
│  │              │  Subtitle                │  │
│  │  Hero text:  │                          │  │
│  │  "Master     │  [Email input]           │  │
│  │   your       │  [Password input]        │  │
│  │   momentum." │                          │  │
│  │              │  Remember me / Forgot    │  │
│  │  Decorative  │                          │  │
│  │  illustration│  [Sign In button]        │  │
│  │              │  ─── Or continue with ── │  │
│  │  Team avatars│  [Quick Demo Login]      │  │
│  │  "10K+ teams"│                          │  │
│  │              │  Don't have account?     │  │
│  │              │  Request Access link     │  │
│  └──────────────┴──────────────────────────┘  │
└──────────────────────────────────────────────┘
```

#### Key Design Details
- **Container:** `max-w-[1200px] min-h-[600px] max-h-[800px] rounded-[24px]` with `shadow-2xl`
- **Left panel:** Hidden on mobile (`hidden md:flex`), `w-1/2`, `bg-primary`, decorative background image at 20% opacity
- **Right panel:** `w-full md:w-1/2`, `bg-surface-container-lowest`
- **Form width:** `max-w-[400px]` centered
- **Animated gradient background** on the outer container
- **Mobile:** Shows only the right panel with a compact branding header

---

### 2. Executive Dashboard

**Screen ID:** `767685d111e14d0384f05bb385346290`
**Dimensions:** 2560 × 2644 (Desktop)

#### Layout Structure
```
┌───────┬──────────────────────────────────────────┐
│       │  TOP NAV BAR (fixed)                     │
│       │  [Search] ─────── [Create Task] [🔔][🌙][👤] │
│ SIDE  ├──────────────────────────────────────────┤
│ NAV   │                                          │
│ 280px │  Page Header: "Executive Overview"       │
│       │  Subtitle + [Last 30 Days] [Export]      │
│ Logo  │                                          │
│ ──    │  ┌─────┬─────┬─────┬─────┬─────┐        │
│ Dash* │  │ KPI │ KPI │ KPI │ KPI │ KPI │        │
│ Proj  │  │ 12  │ 48  │32/48│ 16  │  3  │        │
│ Tasks │  └─────┴─────┴─────┴─────┴─────┘        │
│ Team  │                                          │
│ Analy │  ┌────────────────────┬──────────┐       │
│ Sett  │  │  Task Status       │ High     │       │
│ ──    │  │  Distribution      │ Priority │       │
│ Upgr  │  │  (Bar Chart)       │ Tasks    │       │
│ Help  │  ├────────────────────┤──────────┤       │
│ Log   │  │  Active Project    │ Recent   │       │
│ Out   │  │  Progress          │ Activity │       │
│       │  │  (Progress Bars)   │ Timeline │       │
│       │  └────────────────────┴──────────┘       │
└───────┴──────────────────────────────────────────┘
```

#### Key Design Details
- **Sidebar:** Fixed `w-72` (280px), glassmorphic (`backdrop-blur-xl`), 6 nav items + bottom actions
- **Top nav:** Fixed, `h-16`, search bar (pill-rounded), Create Task CTA, notification bell, dark mode toggle, avatar
- **KPI Grid:** `grid-cols-5` on desktop, `grid-cols-3` on tablet, `grid-cols-1` on mobile
  - Each card: glass-panel, decorative hover circle, display-lg value, trend badge
  - Completed card has progress bar
  - Overdue card has error styling
- **Main content:** `12-col grid` — 8 cols for charts/progress, 4 cols for priority/activity
- **Staggered fade-in** animation with 0.1s, 0.2s, 0.3s delays
- **Max content width:** 1600px

---

### 3. Project Management

**Screen ID:** `023e67dd49304914b8f271ef0b03993b`
**Dimensions:** 2560 × 2048 (Desktop)

#### Layout Structure
```
┌───────┬──────────────────────────────────────────┐
│       │  TOP NAV BAR (fixed)                     │
│       │  [Search projects] ─── [🔔][🌙][+ Task][👤] │
│ SIDE  ├──────────────────────────────────────────┤
│ NAV   │                                          │
│ 280px │  "All Projects"                          │
│       │  Subtitle + [Filter ▼] [+ New Project]   │
│ Proj* │                                          │
│       │  ┌──────────┬──────────┬──────────┐      │
│       │  │ Card 1   │ Card 2   │ Card 3   │      │
│       │  │ Active   │ Active   │ Completed│      │
│       │  │ Q3 Mktg  │ Client   │ Server   │      │
│       │  │ Campaign │ Portal   │ Migration│      │
│       │  │          │ Redesign │ V2       │      │
│       │  │ 80% ████ │ 92% ████ │ 100% ███ │      │
│       │  │ Oct 15   │ ⚠Tmrw   │ ✓ Sep 01 │      │
│       │  └──────────┴──────────┴──────────┘      │
└───────┴──────────────────────────────────────────┘
```

#### Key Design Details
- **Same sidebar/topnav** as Dashboard (Projects tab is active)
- **Page header:** Headline + subtitle + filter dropdown + New Project CTA
- **Card grid:** `grid-cols-3` (xl), `grid-cols-2` (md), `grid-cols-1` (mobile)
- **Project cards:**
  - Glass-panel, `rounded-xl`, `p-md`, ambient shadow
  - Status badge (pill) top-left
  - Edit/Delete actions on hover (opacity transition)
  - Title (`title-md`) + description (2-line clamp)
  - Progress bar with percentage
  - Date/deadline with icon
  - Completed cards: `opacity-75 hover:opacity-100`
  - Near-deadline: error-styled date indicator

---

## All Screens Index

| Screen Title                         | Screen ID                              | Dimensions     |
| ------------------------------------ | -------------------------------------- | -------------- |
| Login & Authentication               | `b1c85a75abb04ef397c9a5c3dfbfef32`     | 2560 × 2048    |
| Executive Dashboard                  | `767685d111e14d0384f05bb385346290`     | 2560 × 2644    |
| Project Management                   | `023e67dd49304914b8f271ef0b03993b`     | 2560 × 2048    |
| Team Management                      | `5c85f642ace544179d8e493cbe8395b3`     | 2560 × 2048    |
| Analytics & Productivity Insights    | `a76ac8d8443d49c3afb2b5c00dd5f810`     | 2560 × 2048    |
| System Settings                      | `60acc59b413e4e52a47f8750b5168f64`     | 2560 × 2958    |
| Project Management App               | `5ce9cd2f040b45e9aa07a7c809207732`     | 1280 × 1024    |

---

## Tailwind CSS Configuration (Ready-to-Use)

```javascript
// tailwind.config.js — extend section
{
  colors: {
    "primary":                  "#3525cd",
    "primary-container":        "#4f46e5",
    "on-primary":               "#ffffff",
    "on-primary-container":     "#dad7ff",
    "on-primary-fixed":         "#0f0069",
    "on-primary-fixed-variant": "#3323cc",
    "primary-fixed":            "#e2dfff",
    "primary-fixed-dim":        "#c3c0ff",
    "inverse-primary":          "#c3c0ff",

    "secondary":                   "#505f76",
    "secondary-container":         "#d0e1fb",
    "on-secondary":                "#ffffff",
    "on-secondary-container":      "#54647a",
    "secondary-fixed":             "#d3e4fe",
    "secondary-fixed-dim":         "#b7c8e1",
    "on-secondary-fixed":          "#0b1c30",
    "on-secondary-fixed-variant":  "#38485d",

    "tertiary":                    "#005338",
    "tertiary-container":          "#006e4b",
    "on-tertiary":                 "#ffffff",
    "on-tertiary-container":       "#67f4b7",
    "tertiary-fixed":              "#6ffbbe",
    "tertiary-fixed-dim":          "#4edea3",
    "on-tertiary-fixed":           "#002113",
    "on-tertiary-fixed-variant":   "#005236",

    "error":              "#ba1a1a",
    "error-container":    "#ffdad6",
    "on-error":           "#ffffff",
    "on-error-container": "#93000a",

    "background":                "#f7f9fb",
    "on-background":             "#191c1e",
    "surface":                   "#f7f9fb",
    "surface-bright":            "#f7f9fb",
    "surface-dim":               "#d8dadc",
    "surface-container-lowest":  "#ffffff",
    "surface-container-low":     "#f2f4f6",
    "surface-container":         "#eceef0",
    "surface-container-high":    "#e6e8ea",
    "surface-container-highest": "#e0e3e5",
    "surface-variant":           "#e0e3e5",
    "surface-tint":              "#4d44e3",
    "on-surface":                "#191c1e",
    "on-surface-variant":        "#464555",
    "inverse-surface":           "#2d3133",
    "inverse-on-surface":        "#eff1f3",

    "outline":         "#777587",
    "outline-variant": "#c7c4d8",
  },
  borderRadius: {
    DEFAULT: "0.25rem",
    lg:      "0.5rem",
    xl:      "0.75rem",
    full:    "9999px",
  },
  spacing: {
    base:             "8px",
    xs:               "4px",
    sm:               "12px",
    md:               "24px",
    lg:               "40px",
    xl:               "64px",
    gutter:           "24px",
    "margin-mobile":  "16px",
    "margin-desktop": "32px",
  },
  fontFamily: {
    sans: ["Inter", "sans-serif"],
  },
  fontSize: {
    "display-lg":        ["48px", { lineHeight: "56px",  fontWeight: "700", letterSpacing: "-0.02em" }],
    "headline-lg":       ["32px", { lineHeight: "40px",  fontWeight: "700", letterSpacing: "-0.01em" }],
    "headline-lg-mobile":["24px", { lineHeight: "32px",  fontWeight: "700" }],
    "headline-md":       ["24px", { lineHeight: "32px",  fontWeight: "600" }],
    "title-md":          ["18px", { lineHeight: "24px",  fontWeight: "600" }],
    "body-lg":           ["16px", { lineHeight: "24px",  fontWeight: "400" }],
    "body-md":           ["14px", { lineHeight: "20px",  fontWeight: "400" }],
    "label-md":          ["12px", { lineHeight: "16px",  fontWeight: "600", letterSpacing: "0.05em" }],
    "label-sm":          ["11px", { lineHeight: "14px",  fontWeight: "500" }],
  },
}
```

---

## Icon System

**Library:** Material Symbols Outlined (variable weight/fill)
**CDN:** `https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap`

**Fill setting for active/sidebar icons:**
```css
.material-symbols-outlined {
    font-variation-settings: 'FILL' 1;
}
```

### Key Icons Used
| Context           | Icon Name         | Size  |
| ----------------- | ----------------- | ----- |
| Dashboard nav     | `dashboard`       | 24px  |
| Projects nav      | `folder`          | 24px  |
| Tasks nav         | `assignment`      | 24px  |
| Team nav          | `group`           | 24px  |
| Analytics nav     | `analytics`       | 24px  |
| Settings nav      | `settings`        | 24px  |
| Logo              | `layers`          | 24px  |
| Search            | `search`          | 24px  |
| Add/Create        | `add`             | 18px  |
| Notifications     | `notifications`   | 24px  |
| Dark mode         | `dark_mode`       | 24px  |
| Help              | `help`            | 18px  |
| Logout            | `logout`          | 18px  |
| Email (input)     | `mail`            | 20px  |
| Password (input)  | `lock`            | 20px  |
| Trending up       | `trending_up`     | 14px  |
| Warning           | `warning`         | 18px  |
| Check             | `check`/`check_circle` | 16-18px |
| Flag (priority)   | `flag`            | 24px  |
| Calendar          | `calendar_month`  | 18px  |
| Schedule/Clock    | `schedule`        | 12px  |
| Download          | `download`        | 18px  |
| Edit              | `edit`            | 18px  |
| Delete            | `delete`          | 18px  |
| Filter            | `filter_list`     | 18px  |
| More options      | `more_horiz`      | 24px  |
| Bolt (demo)       | `bolt`            | 20px  |
