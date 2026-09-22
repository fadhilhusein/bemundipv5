# Website BEM UNDIP 2026 — Design System

## Direction

The website follows the `website bem undip new` Figma file. The landing page should feel editorial, youthful, and institutional without resembling a SaaS template. Figma node `1:897` is the visual source of truth for composition and art direction; this document defines the reusable implementation rules.

## Tokens

### Color

- `--ink: #344054` — primary text and dark controls.
- `--charcoal: #171717` — navigation and footer.
- `--background: #FFFFFF` — page canvas.
- `--surface: #F2F4F7` — contained sections and neutral cards.
- `--line: #D9D9D9` — borders and dividers.
- `--muted: #ADA4A4` — secondary text.
- `--accent: #FD853A` — landing-page CTA and active navigation.
- `--accent-deep: #BB3F17` — accent hover and high-emphasis detail.
- `#FFF3A8` — supporting highlight only.

Use a single accent per interaction. Do not introduce new blues, purples, or gradients as CTA colors.

### Typography

- Abhaya Libre: landing navigation, headings, and editorial labels.
- ABeeZee: organization directory names.
- Abril Fatface: large display headings and footer statement.
- Hind Madurai: long-form landing copy.
- Alata: statistics and tabular numbers.
- Poppins and Playfair Display remain available for existing dashboard and detail pages.
- Decorative hero lettering that cannot be reproduced with an available licensed font should be exported from Figma as an image asset.

Large headings use tight leading and negative tracking. Body copy should stay below roughly 70 characters per line and use `text-wrap: pretty`.

### Spacing and shape

- Base spacing unit: 8px.
- Page gutters: 20px mobile, 32px tablet, 48px desktop.
- Content width: maximum 1298px.
- Standard component radius: 4px.
- Explicit Figma shells may use 24–60px radii: floating navigation, major section shells, media frames, and pill CTAs.
- Shadows are cool-neutral and diffused; avoid generic black drop shadows.

## Landing structure

1. Floating dark pill navigation with an orange active item.
2. Kabinet Dipanegara hero using the exported Figma illustration.
3. Orange welcome, vision, and mission panel.
4. Editorial organization directory driven by database records.
5. Two-up latest-news carousel driven by publication records.
6. Company-profile media section.
7. Dynamic organization statistics.
8. Three real service routes: directory, publications, and agenda.
9. Dark contact footer with official social destinations.

Figma template content such as portfolio project names, fictional authors, and question-mark statistics must never ship. Replace it with real BEM data or a composed empty state.

## Responsive behavior

- Mobile `< 768px`: single-column sections, 20px gutters, one news item at a time, drawer navigation, stacked statistics.
- Tablet `768–1023px`: two-column content where space permits and reduced decorative scale.
- Desktop `1024–1439px`: full navigation and two-column directory/news layout.
- Wide `≥ 1440px`: match the 1440px Figma composition while preserving the 1298px content boundary.

Use `clamp()` for display type and fluid media. Do not copy absolute Figma coordinates into responsive code. Decorative assets may overlap, but meaningful content must remain in normal document flow.

## Components and states

- Primary dark control: `#344054`, white text.
- Accent control: `#FD853A`, white text; hover `#BB3F17`.
- Secondary control: transparent, `#D9D9D9` border, `#171717` text.
- Controls have a minimum 44px target, visible focus ring, pressed feedback, and 200–300ms transitions.
- Cards use either a surface fill or elevation—not a border, fill, and heavy shadow simultaneously.
- Links must have real destinations; do not ship `href="#"`.

## Media and motion

- Commit exported Figma assets under `public/assets/landing`; MCP asset URLs are temporary.
- Use `next/image` with correct dimensions and responsive `sizes`.
- Non-hero images load lazily.
- Motion is limited to subtle reveal, hover lift, and decorative drift using transforms and opacity.
- Respect `prefers-reduced-motion` and keep hero content visible on first paint.

## Accessibility

- Meet WCAG AA contrast for text and controls.
- Use semantic landmarks and heading order.
- Provide a skip link, descriptive alt text for meaningful images, and empty alt text for decorative artwork.
- Carousel controls require labels, keyboard access, and no autoplay.
- Long Indonesian names and CMS content must wrap without causing horizontal overflow.
