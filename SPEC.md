# To-Do List Browser Extension - Specification Document

## 1. Project Overview

**Project Name:** TaskFlow - To-Do List Extension
**Project Type:** Chrome/Edge Browser Extension (Manifest V3)
**Core Functionality:** A feature-rich task management extension with categories, priorities, due dates, and persistent storage
**Target Users:** Productivity-focused users who want quick task management without leaving their browser

---

## 2. UI/UX Specification

### Layout Structure

**Popup Dimensions:**
- Width: 380px
- Height: 560px (dynamic based on content)
- Min-height: 400px

**Page Sections:**
1. **Header** - App title, theme toggle, add button
2. **Filter Bar** - Category filters, search input
3. **Task Input Area** - Expandable form with all task fields
4. **Task List** - Scrollable list of task cards
5. **Stats Footer** - Task count summary

### Visual Design

**Color Palette:**

*Light Theme:*
- Background: `#F8FAFC` (cool white)
- Card Background: `#FFFFFF`
- Primary Accent: `#6366F1` (indigo)
- Secondary Accent: `#8B5CF6` (violet)
- Success: `#10B981` (emerald)
- Warning: `#F59E0B` (amber)
- Danger: `#EF4444` (red)
- Text Primary: `#1E293B`
- Text Secondary: `#64748B`
- Border: `#E2E8F0`

*Dark Theme:*
- Background: `#0F172A` (slate 900)
- Card Background: `#1E293B` (slate 800)
- Primary Accent: `#818CF8` (indigo 400)
- Secondary Accent: `#A78BFA` (violet 400)
- Success: `#34D399`
- Warning: `#FBBF24`
- Danger: `#F87171`
- Text Primary: `#F1F5F9`
- Text Secondary: `#94A3B8`
- Border: `#334155`

**Typography:**
- Font Family: `'Outfit', 'Segoe UI', sans-serif`
- Header Title: 20px, weight 600
- Section Headers: 14px, weight 600
- Body Text: 14px, weight 400
- Small Text: 12px, weight 400

**Spacing System:**
- Base unit: 4px
- XS: 4px
- SM: 8px
- MD: 16px
- LG: 24px
- XL: 32px

**Visual Effects:**
- Card shadow: `0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)`
- Hover shadow: `0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)`
- Border radius (cards): 12px
- Border radius (buttons): 8px
- Border radius (inputs): 8px
- Transition duration: 200ms ease-out
- Gradient accent: `linear-gradient(135deg, #6366F1, #8B5CF6)`

### Components

**1. Header Component**
- App logo/icon (gradient)
- App title "TaskFlow"
- Theme toggle button (sun/moon icon)
- Add task button (gradient background, + icon)

**2. Filter Bar Component**
- Category pills: All, Work, Personal, Study
- Active state: filled with primary accent
- Inactive state: outlined
- Search input with magnifying glass icon

**3. Task Input Form**
- Collapsed: Single "Add task..." placeholder
- Expanded fields:
  - Task title input (required)
  - Category dropdown (Work/Personal/Study)
  - Priority selector (Low/Medium/High with color indicators)
  - Due date picker
  - Save/Cancel buttons

**4. Task Card Component**
- Checkbox (circular, animated)
- Task title (strikethrough when completed)
- Category badge
- Priority indicator (colored dot)
- Due date (with overdue styling)
- Edit/Delete action buttons (visible on hover)
- Drag handle (for reordering)

**Component States:**
- Default: Normal appearance
- Hover: Elevated shadow, slight scale (1.01)
- Active/Pressed: Reduced shadow, scale (0.99)
- Completed: Muted colors, strikethrough text
- Overdue: Red date badge, warning indicator
- Disabled: 50% opacity, no interactions

### Animations

**Add Task Animation:**
- Slide down + fade in (150ms)

**Delete Task Animation:**
- Slide out right + fade out (150ms)

**Complete Task Animation:**
- Checkbox fill animation (300ms)
- Text strikethrough animation (200ms)
- Card color transition (200ms)

**Hover Transitions:**
- Card lift: translateY(-2px), 200ms ease
- Button press: scale(0.97), 100ms ease

---

## 3. Functionality Specification

### Core Features

**1. Task Creation**
- Title input (required, max 200 chars)
- Category selection (default: Personal)
- Priority selection (default: Medium)
- Due date (optional)
- Timestamp auto-recorded

**2. Task Editing**
- Click edit icon to open edit mode
- All fields pre-populated
- Save/Cancel options
- Updates timestamp on save

**3. Task Deletion**
- Confirmation not required (instant delete)
- Undo option via toast notification (3 seconds)

**4. Task Completion**
- Toggle checkbox to mark complete
- Completed tasks move to bottom (optional toggle)
- Completed tasks shown with different styling

**5. Task Organization**
- Filter by category
- Search by title (real-time filter)
- Sort by: Date created, Due date, Priority

### Data Handling

**Data Model:**
```javascript
{
  id: string (UUID),
  title: string,
  category: 'work' | 'personal' | 'study',
  priority: 'low' | 'medium' | 'high',
  dueDate: string (ISO date) | null,
  completed: boolean,
  createdAt: timestamp,
  updatedAt: timestamp,
  order: number
}
```

**Storage:**
- Uses `chrome.storage.local` for persistence
- Key: `taskflow_tasks`
- Auto-save on every change

### Edge Cases

- Empty title: Show error, prevent save
- Very long title: Truncate with ellipsis in display
- No tasks: Show empty state illustration
- Due date in past: Mark as overdue
- Storage quota exceeded: Show warning
- Invalid stored data: Reset to empty array

---

## 4. Technical Implementation

### File Structure
```
taskflow-extension/
├── manifest.json
├── popup.html
├── popup.js
├── style.css
├── icons/
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── background.js (optional)
```

### Manifest V3 Configuration
- Permissions: storage
- Action: popup with default popup.html
- Icons: 16, 32, 48, 128px

---

## 5. Acceptance Criteria

### Visual Checkpoints
- [ ] Popup renders at 380px width
- [ ] Theme toggle switches between light/dark
- [ ] Category filters highlight correctly
- [ ] Task cards show all information (title, category, priority, date)
- [ ] Animations are smooth (no jank)
- [ ] Empty state displays when no tasks

### Functional Checkpoints
- [ ] Can add task with all fields
- [ ] Can edit existing task
- [ ] Can delete task
- [ ] Can mark task complete/incomplete
- [ ] Can filter by category
- [ ] Can search tasks
- [ ] Tasks persist after browser restart
- [ ] Data saves automatically

### Performance Checkpoints
- [ ] Initial load under 200ms
- [ ] No visible re-renders during interactions
- [ ] Smooth 60fps animations