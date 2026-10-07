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

- Abhaya Libre: landing section and card headings (700), 28–48px / 22–28px with 1.2 / 1.25 line height.
- ABeeZee: organization directory names.
- Poppins: landing navigation, controls, and metadata (15–16px controls; 14px metadata). Abril Fatface remains available outside the revised landing.
- Hind Madurai: landing paragraphs (16–18px, 1.75 line height, about 65 characters per line, left aligned).
- Alata: statistics and tabular numbers.
- Poppins and Playfair Display remain available for existing dashboard and detail pages.
- Decorative hero lettering that cannot be reproduced with an available licensed font should be exported from Figma as an image asset.

Headings use balanced wrapping and modest negative tracking. Body copy uses `text-wrap: pretty`. Existing font families are retained; the revised landing does not use script headings.

### Spacing and shape

- Base spacing unit: 8px.
- Page gutters: 20px mobile, 32px tablet, 48px desktop.
- Content width: maximum 1200px, shared by the landing content, landing header, and landing footer.
- Standard component radius: 4px.
- Explicit Figma shells may use 24–60px radii: floating navigation, major section shells, media frames, and pill CTAs.
- Shadows are cool-neutral and diffused; avoid generic black drop shadows.

## Landing structure

1. Floating dark pill navigation with an orange active item.
2. Kabinet Dipanegara hero using the exported Figma illustration.
3. Editorial welcome section on white with dark headings and restrained orange accents. The welcome heading spans the row with a maximum width of 960px. Two paragraphs form two columns at 1024px and stack below; the closing declarations sit below a divider. Neutral 4:3 vision and mission media cards sit in a group up to 960px wide below, stacking below 768px, with explicit empty states until media is available. This revised direction supersedes the original orange welcome panel.
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
- Wide `≥ 1440px`: match the 1440px Figma composition while preserving the 1200px content boundary.

Use `clamp()` for display type and fluid media. Do not copy absolute Figma coordinates into responsive code. Decorative assets may overlap, but meaningful content must remain in normal document flow.

## Components and states

- Primary dark control: `#344054`, white text.
- Landing accent control: `#FD853A`, dark `#171717` text; hover `#BB3F17` with white text.
- Secondary control: transparent, `#D9D9D9` border, `#171717` text.
- Controls have a minimum 44px target, visible focus ring, pressed feedback, and 200–300ms transitions.
- Cards use either a surface fill or elevation—not a border, fill, and heavy shadow simultaneously.
- Links must have real destinations; do not ship `href="#"`.

## Media and motion

- Commit exported Figma assets under `public/assets/landing`; MCP asset URLs are temporary.
- Use `next/image` with correct dimensions and responsive `sizes`.
- Non-hero images load lazily.
- Revised landing uses Motion for React (`motion/react`) instead of mounting GSAP MotionScene. Reveals enhance visible server-rendered content once, with 12px maximum translation, 400ms duration, and 150ms maximum stagger. Hover lift is at most 4px, image zoom at most 1.025. Drawer and news transitions use Motion; no scroll pinning or word-by-word body animation.
- Respect `prefers-reduced-motion` and keep hero content visible on first paint.

## Accessibility

- Meet WCAG AA contrast for text and controls.
- Use semantic landmarks and heading order.
- Provide a skip link, descriptive alt text for meaningful images, and empty alt text for decorative artwork.
- Carousel controls require labels, keyboard access, 44×44px targets, and no autoplay. Show one item below 768px and two above, retaining the active item across breakpoint changes. All items, including odd final items, must remain reachable. A no-JavaScript link list provides access to every item.
- Landing drawer traps focus, restores it to the trigger, closes on Escape and desktop resize, and scrolls internally on short screens.
- Long Indonesian names and CMS content must wrap without causing horizontal overflow.

## Revised landing compatibility

- Section padding is 64px mobile, 88px tablet (768px), and 112px desktop (1024px); internal gaps are 24–48px.
- Hero retains its original illustration and follows intrinsic media height; its accessible H1 is visually hidden.
- Header and Footer expose an optional `variant="landing"`; default variants and non-landing pages keep their existing appearance.
- Landing-only CSS must not change global body typography, dashboard styles, or public page tokens.
- Anchor targets reserve 104px for fixed navigation. Body paragraphs stay left aligned.
- Data failures remain independent: failed statistics show “—”, distinct from valid zero values, and failed lists show a retry message.
- User-approved existing fonts, Motion, preserved content, and modest interaction supersede the gpt-taste requirements for random font swaps, GSAP, and cinematic pinning.
