---
name: Luminous Intelligence
colors:
  surface: '#f9f9fb'
  surface-dim: '#d9dadc'
  surface-bright: '#f9f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f5'
  surface-container: '#eeeef0'
  surface-container-high: '#e8e8ea'
  surface-container-highest: '#e2e2e4'
  on-surface: '#1a1c1d'
  on-surface-variant: '#414753'
  inverse-surface: '#2f3132'
  inverse-on-surface: '#f0f0f2'
  outline: '#727784'
  outline-variant: '#c1c6d5'
  surface-tint: '#005cba'
  primary: '#004e9f'
  on-primary: '#ffffff'
  primary-container: '#0066cc'
  on-primary-container: '#dfe8ff'
  inverse-primary: '#aac7ff'
  secondary: '#5e5e63'
  on-secondary: '#ffffff'
  secondary-container: '#e0dfe4'
  on-secondary-container: '#626267'
  tertiary: '#883700'
  on-tertiary: '#ffffff'
  tertiary-container: '#af4900'
  on-tertiary-container: '#ffe3d6'
  error: '#FF3B30'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d7e3ff'
  primary-fixed-dim: '#aac7ff'
  on-primary-fixed: '#001b3e'
  on-primary-fixed-variant: '#00458e'
  secondary-fixed: '#e3e2e7'
  secondary-fixed-dim: '#c7c6cb'
  on-secondary-fixed: '#1a1b1f'
  on-secondary-fixed-variant: '#46464b'
  tertiary-fixed: '#ffdbcb'
  tertiary-fixed-dim: '#ffb692'
  on-tertiary-fixed: '#341100'
  on-tertiary-fixed-variant: '#793000'
  background: '#f9f9fb'
  on-background: '#1a1c1d'
  surface-variant: '#e2e2e4'
  system-background: '#FFFFFF'
  surface-secondary: '#F2F2F7'
  ink-primary: '#1D1D1F'
  ink-secondary: '#424245'
  glass-fill: rgba(255, 255, 255, 0.72)
  success: '#34C759'
  warning: '#FF9F0C'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 17px
    fontWeight: '400'
    lineHeight: '1.5'
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.03em
  headline-xl-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  margin-mobile: 20px
  margin-desktop: 48px
  gutter: 24px
  container-max: 1440px
---

## Brand & Style
The design system is engineered to evoke a sense of effortless intelligence and high-tier professional sophistication. It targets enterprise decision-makers who require complex data to be distilled into clear, actionable insights without cognitive overload.

The aesthetic follows a **Premium Minimalist** approach with heavy influences from **Glassmorphism**. It prioritizes extreme legibility, generous whitespace, and a high-end physical feel through depth and motion. The interface should feel less like a "tool" and more like a high-performance instrument—quiet when idle, but profoundly capable under interaction. 

Key principles:
- **Clarity over Density:** Avoid clutter; prioritize one primary action or insight per view.
- **Precision:** Every border-radius, margin, and alignment is calculated to feel intentional.
- **Fluidity:** Transitions should mimic physical inertia, providing a premium "Apple-like" tactile response.

## Colors
The palette is monochromatic and airy, designed to disappear into the background to let data and machine learning insights take center stage. 

- **Primary Blue:** Reserved strictly for primary calls to action, active states, and key navigational highlights.
- **Neutrals:** A tiered system of off-whites and light grays creates structural depth without the need for harsh lines.
- **Glassmorphism:** Surfaces utilize a 72% opacity white fill with a 20px-30px backdrop-blur to maintain context of the underlying layers while ensuring readability.

## Typography
The system uses **Hanken Grotesk** for display and headlines to provide a sharp, contemporary "San Francisco" feel with more character. **Inter** is utilized for body text and functional labels due to its exceptional legibility in data-heavy environments.

- **Weight usage:** Use SemiBold (600) for section headers and Medium (500) for interactive labels. Avoid weights below 400.
- **Scale:** High contrast between display sizes and body text is encouraged to create a clear hierarchy.
- **Alignment:** Headlines should generally be left-aligned to a strict grid.

## Layout & Spacing
This design system utilizes a **Fixed-Fluid Hybrid Grid**. Content is housed in a centered container with a maximum width of 1440px to ensure line lengths remain readable on ultrawide monitors.

- **Grid:** A 12-column grid for desktop, 8-column for tablet, and 4-column for mobile.
- **Spacing Rhythm:** Based on an 8px baseline. Large layouts should favor 48px or 64px padding between major sections to maintain the "spacious" premium feel.
- **Reflow:** On mobile, margins reduce to 20px, and large cards stack vertically with 16px gaps.

## Elevation & Depth
Depth is created through light and blur rather than darkness. This system avoids traditional heavy shadows in favor of **Ambient Diffusion**.

- **Level 1 (Base):** `#FFFFFF` or `#F5F5F7`.
- **Level 2 (Cards):** White background with a 1px inner stroke of `rgba(0,0,0,0.05)` and a very soft, large-radius shadow: `0px 10px 40px rgba(0,0,0,0.03)`.
- **Level 3 (Modals/Popovers):** Glassmorphic surfaces using `glass-fill` with a `backdrop-filter: blur(24px)`.
- **Layering:** Elements on higher planes should have slightly more rounded corners and subtle "glow" borders to distinguish them from the base.

## Shapes
The shape language is "Squircle-inspired," emphasizing friendly but professional continuity. 

- **Standard Containers:** Use 16px for secondary elements.
- **Large Insight Cards:** Use 24px to create a soft, framed appearance for complex charts.
- **Buttons:** 12px or fully rounded (pill) depending on the hierarchy.
- **Inputs:** 10px for a slightly sharper, more functional look within soft containers.

## Components

### Buttons
- **Primary:** Solid `#0066CC` with white text. High-gloss finish or subtle top-to-bottom gradient.
- **Secondary:** Light gray `#F2F2F7` with primary blue text. No border.
- **Tertiary:** Ghost style; text only with a slight gray hover state background.

### Cards & ML Insights
- Cards use the Level 2 elevation.
- ML Insights are distinguished by a subtle gradient border (e.g., primary blue to a lighter azure) to signify "intelligence" is active.

### Data Tables
- No vertical borders. Horizontal borders should be 1px `rgba(0,0,0,0.05)`.
- Header rows should use `label-sm` typography with increased letter spacing.
- Row hover states should use a subtle `#F5F5F7` fill with a 4px corner radius on the background.

### Input Fields
- Filled style: Light gray background that turns white on focus with a 2px primary blue border.
- Floating labels are encouraged for a cleaner aesthetic.

### Modern Charts
- Use a palette of primary blue, teal, and soft purple for data visualization.
- Lines should have a stroke width of 3px with smoothed (Bezier) curves.
- Tooltips must be glassmorphic.