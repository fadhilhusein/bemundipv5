\# DESIGN.md



\# Kabinet BEM UNDIP 2026 — Design Specification



\## Overview



This document defines the design system, layout, typography, spacing, animations, component architecture, and implementation guidelines for recreating the Kabinet BEM UNDIP website.



This is \*\*NOT\*\* a generic landing page.



The design should feel like a combination of:



\- Editorial magazine

\- Modern university branding

\- Youth organization

\- Warm Indonesian aesthetic

\- Creative but professional



Avoid making it look like a SaaS dashboard or corporate template.



\---



\# Design Principles



The interface should communicate:



\- Warmth

\- Community

\- Student Movement

\- Creativity

\- Modern Editorial Design



Every section should breathe.



Use generous whitespace.



Decorative assets should support the content rather than overpower it.



\---



\# Responsive Strategy



Design Mobile First.



Breakpoints:



```

Mobile      <768px

Tablet      768px

Desktop     1024px

Wide        1440px

```



Desktop container:



```

max-width: 1200px;

margin: auto;

padding-inline: 32px;

```



Mobile padding:



```

20px

```



\---



\# Layout Structure



Page order:



```

Header



Hero



Welcome



Vision



Programs



Information Grid



Contact CTA



Footer

```



Every section should occupy nearly one viewport height.



Suggested vertical spacing:



```

120px Desktop



80px Tablet



64px Mobile

```



\---



\# Color Palette



Primary



```

\#D96A1C

```



Secondary



```

\#F4D2A5

```



Cream Background



```

\#FAF5EF

```



Dark Brown



```

\#402312

```



Light Brown



```

\#8D6543

```



Accent Red



```

\#B83935

```



White



```

\#FFFFFF

```



Light Divider



```

\#EFE4D6

```



Avoid using pure black.



Always use dark brown instead.



\---



\# Typography



Use Google Fonts.



Heading Font



Playfair Display



Weights



```

400

500

700

```



Body Font



Poppins



Weights



```

300

400

500

600

700

```



Typography Scale



Hero



```

96px Desktop

72px Tablet

52px Mobile

```



Section Heading



```

64px

48px

36px

```



Subheading



```

28px

24px

20px

```



Body



```

18px

16px

15px

```



Small Text



```

14px

```



Line Height



```

Heading

1.1



Paragraph

1.7

```



\---



\# Header



Height



```

80px Desktop



64px Mobile

```



Background



Transparent initially.



After scrolling:



```

backdrop-filter: blur(16px);



rgba(217,106,28,.9)

```



Layout



```

Logo



Navigation



Search



Login

```



Desktop Navigation



```

Beranda



Departemen



Publikasi



Layanan



Login

```



Mobile



Replace menu with hamburger.



Slide-in drawer from right.



\---



\# Hero Section



Full viewport height.



Background:



Warm gradient.



Large faded UNDIP seal watermark.



Center aligned.



Structure



```

Kabinet Logo



BEM UNDIP



Department Names



Decorative Assets

```



Decorative assets should float around the hero.



Do NOT align them rigidly.



\---



\# Decorative Assets



All illustrations will be located inside



```

assets/

```



Examples:



```

camera



cracker



cucumber



noodle



satay



etc.

```



Rules



Never stretch.



Use original proportions.



Use absolute positioning.



Random rotation



```

\-15°



8°



12°

```



Opacity



100%



Some can slightly overflow outside containers.



\---



\# Welcome Section



Large editorial heading



"Selamat Datang"



Layout



```

Heading



Paragraph



Three Motto Items

```



Paragraph width



```

700px max

```



Text centered.



\---



\# Motto Items



Display



Desktop



```

3 Columns

```



Mobile



```

Stack

```



Each item



```

Title



Small Description

```



No icons.



Minimal.



\---



\# Vision Section



Large faded



"BEM"



background typography.



Foreground



"Menyala Bersama"



Two-column desktop.



Single-column mobile.



Decorative camera asset on one side.



\---



\# Program Cards



Section title



"Berita"



Grid



Desktop



```

3 Columns

```



Tablet



```

2 Columns

```



Mobile



```

1 Column

```



Card



```

background:

\#FAF5EF



border:

2px solid #8D6543



radius:

12px



padding:

24px



gap:

20px

```



Image placeholder



```

16:9



background



\#DDD

```



Card content



```

Title



Image



Description

```



Entire card clickable.



Hover



```

translateY(-6px)



shadow



0 20px 40px rgba(0,0,0,.08)

```



Transition



```

250ms

```



\---



\# Information Section



Title



"Ruang Gerak"



Grid



Desktop



```

2 x 2

```



Mobile



```

1 Column

```



Items



```

Departemen



Layanan



Publikasi



Agenda

```



Each item



```

Large Title



Short Description



Simple divider

```



No card background.



Just typography.



\---



\# Contact Section



Orange background.



Two-column desktop.



Stack mobile.



Left



```

Heading



Social Icons

```



Right



```

Input



Button

```



Input



```

height:52px



radius:999px



padding:20px

```



Button



```

height:52px



radius:999px



background



\#402312



color:white

```



Hover



```

background:black

```



\---



\# Footer



Minimal.



Include



```

Copyright



Social



Navigation

```



\---



\# Images



Store everything inside



```

assets/

```



Suggested folders



```

assets/



images/



icons/



decorations/



logos/



backgrounds/

```



Use



```

loading="lazy"

```



for every non-hero image.



\---



\# Shadows



Cards



```

0 10px 25px rgba(0,0,0,.06)

```



Hover



```

0 25px 45px rgba(0,0,0,.08)

```



\---



\# Border Radius



Buttons



```

999px

```



Cards



```

12px

```



Inputs



```

999px

```



Images



```

12px

```



\---



\# Animation Guidelines



Keep animations subtle.



Hero



```

fade-up



600ms

```



Cards



```

fade-up



100ms stagger

```



Decorations



```

floating animation



duration:

8-12s



ease-in-out



infinite

```



Hover



```

scale(1.03)

```



Avoid excessive motion.



\---



\# Scroll Animations



Use Intersection Observer.



Reveal animation



```

opacity:

0 → 1



translateY



30px → 0

```



Duration



```

600ms

```



\---



\# Buttons



Primary



```

Orange



White text



Rounded pill

```



Secondary



```

Transparent



2px border



Brown text

```



Hover



```

Darken background



Lift 2px

```



\---



\# Icons



Use Lucide Icons.



Size



```

20px

```



Social icons



```

32px

```



Circular buttons.



\---



\# Accessibility



Minimum contrast



WCAG AA.



All images



```

alt=""

```



Keyboard focus visible.



Buttons



```

cursor:pointer

```



Animations



Respect



```

prefers-reduced-motion

```



\---



\# Suggested Tech Stack



\- Next.js (App Router)

\- React

\- TypeScript

\- TailwindCSS

\- Framer Motion

\- Lucide React



\---



\# Folder Structure



```

app/

&#x20;   page.tsx



components/

&#x20;   Header.tsx

&#x20;   Hero.tsx

&#x20;   Welcome.tsx

&#x20;   Vision.tsx

&#x20;   Programs.tsx

&#x20;   Information.tsx

&#x20;   Contact.tsx

&#x20;   Footer.tsx



components/ui/

&#x20;   Button.tsx

&#x20;   Card.tsx

&#x20;   Container.tsx

&#x20;   SectionTitle.tsx



assets/

&#x20;   logos/

&#x20;   decorations/

&#x20;   backgrounds/

&#x20;   icons/

&#x20;   images/



public/



styles/

```



\---



\# Implementation Notes



\- Build reusable components; avoid duplicating markup.

\- Every section should use a shared `Container` component for consistent widths.

\- Decorative assets should be absolutely positioned and configurable via props.

\- Use semantic HTML (`header`, `main`, `section`, `nav`, `footer`).

\- Optimize images using the framework's image component where available.

\- Maintain consistent spacing using a design token scale (8px base unit).

\- Keep the UI lightweight, with smooth performance on mobile devices.



The final result should feel like a polished editorial website for a modern university student organization: warm, creative, elegant, and highly responsive while preserving the visual identity provided by the assets in the `assets/` folder.

