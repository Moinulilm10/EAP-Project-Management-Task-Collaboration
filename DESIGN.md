---
name: Kinetic Enterprise
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#464555'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#005338'
  on-tertiary: '#ffffff'
  tertiary-container: '#006e4b'
  on-tertiary-container: '#67f4b7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style

The design system is engineered for high-velocity project management where clarity meets sophistication. The brand personality is **Professional, Efficient, and Collaborative**, aimed at enterprise teams who require a tool that feels both powerful and invisible.

The visual style is **Corporate Modern with Glassmorphic Accents**. It balances the reliability of a structured grid with the depth of translucent overlays. The interface leverages heavy whitespace to reduce cognitive load, ensuring that complex data visualizations and dense task lists remain digestible. The emotional response should be one of "controlled momentum"—a sense that the user is organized, ahead of schedule, and supported by a precision instrument.

## Colors

This design system utilizes a high-contrast palette to distinguish between interactive elements and structural containers.

- **Primary (Deep Indigo):** Reserved for primary actions, active navigation states, and brand-defining moments.
- **Secondary (Slate):** Used for supporting text, icons, and non-primary UI controls to maintain a professional hierarchy.
- **Semantic Palette:** Emerald for "Success/Complete," Amber for "Warning/On-Hold," and Rose for "Danger/Overdue." These are used sparingly to ensure immediate visual communication of task urgency.
- **Backgrounds:** A clean, cool-toned gray (`#F8FAFC`) serves as the canvas in light mode to reduce eye strain, while a deep charcoal (`#0F172A`) provides the foundation for the dark mode environment.

## Typography

The design system exclusively uses **Inter** to ensure maximum legibility across dense data sets. 

- **Headlines:** Use tight letter-spacing and bold weights for dashboard titles to create a strong visual anchor.
- **Task Metadata:** Utilize `label-md` for status badges and tags, applying uppercase styling to distinguish metadata from user-generated content.
- **Readability:** Body text is optimized at 14px and 16px with generous line-height to maintain comfort during long periods of work.

## Layout & Spacing

The design system follows a strict **8px Grid System** to ensure mathematical harmony across all components.

- **Grid Model:** A 12-column fluid grid is used for the main dashboard content, while the sidebar remains fixed at 280px.
- **Breakpoints:**
  - **Mobile (<768px):** 4-column grid, 16px margins. Sidebars collapse into bottom sheets or hidden drawers.
  - **Tablet (768px - 1280px):** 8-column grid, 24px margins. Sidebar transitions to a condensed icon-only rail.
  - **Desktop (>1280px):** 12-column grid, 32px margins. Max-width of 1600px for content containers to prevent line lengths from becoming unreadable.
- **Spacing Philosophy:** Use "Generous" spacing (`md` and `lg`) between major sections like KPI cards and Kanban columns to emphasize the modern, breathable aesthetic.

## Elevation & Depth

Hierarchy is established through a combination of **Ambient Shadows** and **Glassmorphism**.

1.  **Level 0 (Surface):** The main background (`#F8FAFC`). No shadow.
2.  **Level 1 (Cards/Tables):** Submarine shadows—very diffused, low-opacity (4-8% alpha) with a subtle Indigo tint to prevent the UI from looking "muddy."
3.  **Level 2 (Modals/Overlays):** Glassmorphic surfaces. Use a backdrop blur of 12px-20px with a semi-transparent white (or charcoal) fill at 70% opacity. Add a thin, 1px high-contrast border to define edges.
4.  **Level 3 (Popovers/Context Menus):** Sharp, tight shadows to indicate immediate proximity to the cursor/action point.

Motion plays a key role: when hovering over cards, they should "lift" (y-axis shift of -4px) and the shadow should expand slightly to simulate physical elevation.

## Shapes

The shape language is friendly yet structured.
- **Cards & Modals:** Use `rounded-lg` (16px) to create a soft, modern container.
- **Inputs & Buttons:** Use `rounded-md` (8px) for a more precise, functional feel.
- **Status Badges/Chips:** Use full pill-shaped rounding to distinguish them as distinct, "draggable" or "clickable" meta-objects.
- **Images/Avatars:** Circular clips for team members to contrast against the rectangular grid of the system.

## Components

- **KPI Cards:** Large `headline-lg` values centered. Small sparkline charts in the background (low opacity) to show trend without cluttering the foreground.
- **Kanban Boards:** Columns have subtle grey backgrounds (`#F1F5F9`). Individual task cards use Level 1 elevation and 12px padding.
- **Interactive Sidebar:** Uses a transparent background with a 1px border on the right. Active states use a "squircle" highlight in Primary Indigo with white text.
- **Tables:** No vertical borders. Horizontal borders are 1px thick in a very light slate. Header row uses `label-md` typography.
- **Buttons:**
  - **Primary:** Solid Indigo with white text. 40ms transition on hover to a slightly darker shade.
  - **Secondary:** Transparent with an Indigo 1px border. 
  - **Ghost:** Minimal padding, used for utility actions (e.g., "Archive").
- **Inputs:** Focus states must utilize a 2px outer glow in Primary Indigo to provide clear accessibility feedback.
- **Transitions:** Use `cubic-bezier(0.4, 0, 0.2, 1)` for all layout shifts and entrance fades to ensure a "snappy" but fluid user experience.
