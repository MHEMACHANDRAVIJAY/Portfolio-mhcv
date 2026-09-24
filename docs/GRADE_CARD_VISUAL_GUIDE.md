# Grade Card Viewer - Visual Guide

## 📸 What You'll See

### Education Page - B.Tech Card

When you visit the Education page, you'll see the B.Tech card with a new section at the bottom:

```
┌─────────────────────────────────────────────────────────────┐
│  COLLEGE                                    🎓               │
│  2022 - 2026                                                 │
│                                                              │
│  B.Tech in Information Technology                           │
│  Kalasalingam Academy                                       │
│                                                              │
│  MY GRADE                                                    │
│  7.18 CGPA                                                   │
│                                                              │
│  Focusing on data analytics, cloud solutions...             │
│                                                              │
│  KEY FOCUS                                                   │
│  ✓ Data Structures  ✓ Cloud Architecture  ✓ Programming    │
│                                                              │
│  ─────────────────────────────────────────────────────────  │
│                                                              │
│  📄 ACADEMIC RECORDS                                         │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ 📄       │  │ 📄       │  │ 📄       │  │ 📄       │   │
│  │Semester 1│  │Semester 2│  │Semester 3│  │Semester 4│   │
│  │2022-2023 │  │2022-2023 │  │2023-2024 │  │2023-2024 │   │
│  │View Card→│  │View Card→│  │View Card→│  │View Card→│   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ 📄       │  │ 📄       │  │ 📄       │  │ 📄       │   │
│  │Semester 5│  │Semester 6│  │Semester 7│  │Semester 8│   │
│  │2024-2025 │  │2024-2025 │  │2025-2026 │  │2025-2026 │   │
│  │View Card→│  │View Card→│  │View Card→│  │View Card→│   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🖱️ Interaction Flow

### Step 1: Hover Over Semester Card
```
┌──────────────┐
│ 📄 (blue)    │  ← Icon turns white on blue background
│ Semester 1   │  ← Text turns blue
│ 2022-2023    │
│ View Card → →│  ← Arrow moves right
└──────────────┘
   ↑ Card lifts up slightly
   ↑ Border glows blue
```

### Step 2: Click on Card
```
Modal opens with smooth animation:
- Backdrop fades in (dark blur)
- Modal scales up from 90% to 100%
- Content fades in
```

### Step 3: View Grade Card
```
┌────────────────────────────────────────────────────────────┐
│  📄 Semester 1                          [−] 100% [+]  [X]  │
│     Academic Grade Card                                     │
├────────────────────────────────────────────────────────────┤
│                                                             │
│                                                             │
│              [Your Grade Card PDF/Image Here]              │
│                                                             │
│                  or                                         │
│                                                             │
│              📄                                             │
│         Grade Card Not Available                           │
│      This document will be uploaded soon                   │
│                                                             │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

### Step 4: Use Zoom Controls
```
Header Controls:
┌──────────────────────────────────────┐
│ [−]  100%  [+]  │  [X]              │
│  ↓    ↓     ↓       ↓                │
│ Zoom  %    Zoom   Close              │
│ Out       In                          │
└──────────────────────────────────────┘

Zoom Range: 50% → 100% → 200%
```

---

## 🎨 Visual States

### Semester Card States

#### Default State
```
┌──────────────┐
│ 📄 (light)   │
│ Semester 1   │ ← Dark text
│ 2022-2023    │ ← Gray text
│ View Card →  │ ← Blue text
└──────────────┘
  Light border
  Subtle shadow
```

#### Hover State
```
┌──────────────┐
│ 📄 (white)   │ ← Icon on blue bg
│ Semester 1   │ ← Blue text
│ 2022-2023    │ ← Gray text
│ View Card →→ │ ← Arrow moves
└──────────────┘
  Blue border
  Larger shadow
  Lifted up 5px
```

#### With File Available
```
┌──────────────┐
│ 📄  [AVAILABLE]│ ← Green badge
│ Semester 1   │
│ 2022-2023    │
│ View Card →  │
└──────────────┘
```

#### Without File
```
┌──────────────┐
│ 📄           │ ← No badge
│ Semester 1   │
│ 2022-2023    │
│ View Card →  │
└──────────────┘
```

---

## 🌓 Dark Mode vs Light Mode

### Light Mode
```
Background: White (#FFFFFF)
Text: Dark Slate (#1E293B)
Borders: Light Gray (#E2E8F0)
Accent: Blue (#3B82F6)
Shadows: Soft black shadows
```

### Dark Mode
```
Background: Dark Slate (#0F172A)
Text: White (#F8FAFC)
Borders: Dark Gray (#334155)
Accent: Light Blue (#60A5FA)
Shadows: Deep black shadows
```

---

## 📱 Responsive Layouts

### Mobile (< 640px)
```
┌──────┐ ┌──────┐
│ Sem1 │ │ Sem2 │
└──────┘ └──────┘
┌──────┐ ┌──────┐
│ Sem3 │ │ Sem4 │
└──────┘ └──────┘
  (2 columns)
```

### Tablet (640px - 1024px)
```
┌──────┐ ┌──────┐ ┌──────┐
│ Sem1 │ │ Sem2 │ │ Sem3 │
└──────┘ └──────┘ └──────┘
  (3 columns)
```

### Desktop (> 1024px)
```
┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│ Sem1 │ │ Sem2 │ │ Sem3 │ │ Sem4 │
└──────┘ └──────┘ └──────┘ └──────┘
  (4 columns)
```

---

## 🎭 Animations

### Card Hover Animation
```
Duration: 500ms
Effect: Translate Y -5px
Easing: Ease-in-out
```

### Modal Open Animation
```
Backdrop:
  Opacity: 0 → 1
  Duration: 300ms

Modal:
  Scale: 0.9 → 1
  Opacity: 0 → 1
  Duration: 300ms
  Easing: Cubic bezier
```

### Icon Transition
```
Background: Light → Blue
Color: Blue → White
Duration: 500ms
```

---

## 🎯 User Flow Diagram

```
Education Page
      ↓
B.Tech Card
      ↓
Academic Records Section
      ↓
8 Semester Cards (Grid)
      ↓
User Hovers → Card Lifts + Border Glows
      ↓
User Clicks → Modal Opens
      ↓
┌─────────────────────────────┐
│ If file exists:             │
│   → Display PDF/Image       │
│   → Enable zoom controls    │
│                             │
│ If file is null:            │
│   → Show placeholder        │
│   → "Not Available" message │
└─────────────────────────────┘
      ↓
User Zooms/Views Document
      ↓
User Clicks X or Outside
      ↓
Modal Closes → Back to Education Page
```

---

## 🎨 Color Palette

### Primary Colors
```
Accent Blue:     #3B82F6 (Light) / #60A5FA (Dark)
Background:      #FFFFFF (Light) / #0F172A (Dark)
Card Surface:    #FFFFFF (Light) / #1E293B (Dark)
```

### Text Colors
```
Primary Text:    #1E293B (Light) / #F8FAFC (Dark)
Secondary Text:  #64748B (Light) / #94A3B8 (Dark)
Accent Text:     #3B82F6 (Light) / #60A5FA (Dark)
```

### Border Colors
```
Default:         #E2E8F0 (Light) / #334155 (Dark)
Hover:           #3B82F6/40 (Light) / #60A5FA/40 (Dark)
```

### Status Colors
```
Available Badge: #10B981 (Green)
```

---

## 📐 Spacing & Sizing

### Card Dimensions
```
Padding: 24px (1.5rem)
Border Radius: 16px
Min Height: Auto
Gap between cards: 16px
```

### Modal Dimensions
```
Max Width: 1152px (6xl)
Max Height: 70vh
Border Radius: 24px
Padding: 24px
```

### Icons
```
Document Icon: 20px × 20px
Zoom Icons: 16px × 16px
Close Icon: 20px × 20px
```

---

## ✨ Special Effects

### Hover Glow
```
Border: 1px solid accent/40
Shadow: 0 10px 30px rgba(0,0,0,0.1)
Transform: translateY(-5px)
```

### Backdrop Blur
```
Background: rgba(0,0,0,0.8)
Backdrop Filter: blur(24px)
```

### Smooth Transitions
```
All properties: 500ms ease-in-out
Transform: 300ms cubic-bezier
Opacity: 300ms ease
```

---

## 🔍 Zoom Behavior

### Zoom Levels
```
Minimum: 50%
Default: 100%
Maximum: 200%
Step: 10%
```

### Zoom Controls
```
[−] Button: Decreases by 10%
[+] Button: Increases by 10%
Display: Shows current percentage
```

### Transform Origin
```
PDF: Top Center
Image: Center
```

---

## 🎬 Complete Interaction Example

```
1. User scrolls to Education page
   └─→ Sees B.Tech card

2. User scrolls down within card
   └─→ Sees "Academic Records" section
   └─→ Sees 8 semester cards in grid

3. User hovers over "Semester 1"
   └─→ Card lifts up
   └─→ Border glows blue
   └─→ Icon background turns blue
   └─→ Text turns blue

4. User clicks "Semester 1"
   └─→ Modal fades in
   └─→ Modal scales up
   └─→ Shows header with title
   └─→ Shows zoom controls
   └─→ Shows document or placeholder

5. User clicks [+] to zoom in
   └─→ Zoom increases to 110%
   └─→ Document scales up
   └─→ Display updates to "110%"

6. User clicks [X] to close
   └─→ Modal scales down
   └─→ Modal fades out
   └─→ Returns to Education page

7. User clicks another semester
   └─→ Process repeats
```

---

## 🎯 Key Visual Elements

### Section Header
```
📄 ACADEMIC RECORDS
↑   ↑
Icon  Title (uppercase, tracked)
```

### Semester Card
```
┌────────────────┐
│ 📄    [BADGE]  │ ← Icon + Optional badge
│                │
│ Semester 1     │ ← Title (bold)
│ 2022-2023      │ ← Year (smaller)
│                │
│ View Card →    │ ← CTA (blue)
└────────────────┘
```

### Modal Header
```
┌─────────────────────────────────────────┐
│ 📄 Semester 1        [−] 100% [+]  [X] │
│    Academic Grade Card                  │
└─────────────────────────────────────────┘
```

---

This visual guide helps you understand exactly what the grade card viewer looks like and how it behaves!
