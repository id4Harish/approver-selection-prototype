# ApproverComboBoxPersona - Component States

Component: `src/components/ApproverComboBoxPersona.tsx`
Alignment: Fluent UI v9 Combobox with filtering pattern

---

## Props

| Prop               | Type                                  | Default   | Description                          |
|--------------------|---------------------------------------|-----------|--------------------------------------|
| label              | string                                | -         | Field label (e.g., "FieldSales approver") |
| roleDescription    | string                                | -         | Role context shown in label parentheses |
| required           | boolean                               | false     | Shows red asterisk next to label     |
| stepNumber         | number                                | -         | Number displayed in the step badge   |
| approvers          | IApprover[]                           | -         | List of available approvers          |
| currentUser        | IApprover                             | -         | Currently logged-in user (optional)  |
| selectedApprover   | IApprover \| undefined                | -         | Controlled selected value            |
| onApproverSelected | (approver: IApprover \| undefined) => void | -    | Selection change callback            |
| disabled           | boolean                               | false     | Disables all interaction             |

---

## States

### 1. Empty / Default

- **Input:** Empty, placeholder text visible: "Search by approver name or email"
- **Dropdown:** Closed
- **Border:** 1px solid neutral secondary
- **Chevron:** Visible, neutral color
- **Step badge:** Blue rounded square with step number
- **Label:** Bold text with role description in parentheses, red asterisk if required

### 2. Focused (no selection)

- **Input:** Empty or with existing text, cursor active
- **Dropdown:** Open, showing all approvers
- **Border:** 2px solid theme primary (blue) — thicker focus indicator
- **Each row:** Avatar (initials) + Name + Email, 44px min height
- **Hover:** Light gray background on hovered row
- **Keyboard highlight:** Gray background on the active row (arrow key navigation)

### 3. Typing / Filtering

- **Input:** User-typed text visible
- **Dropdown:** Open, filtered list based on query
- **Filter logic:** Matches approver name parts (startsWith) or email prefix
- **First result:** Auto-highlighted (index 0) when text is non-empty
- **Selection state:** Cleared as soon as user types text that differs from the selected display value

### 4. Filtered - No Results

- **Input:** User-typed text that matches no approvers
- **Dropdown:** Open, showing single message row: "No approvers match your search."
- **Message style:** Neutral secondary color, normal weight (not italic), same padding and height as option rows — matching Fluent v9

### 5. Option Hovered

- **Hovered row:** Light gray background (`neutralLighterAlt`)
- **Cursor:** Pointer
- **Other rows:** Default white background

### 6. Option Highlighted (Keyboard)

- **Highlighted row:** Gray background (`#f3f2f1`)
- **Navigation:** ArrowDown/ArrowUp cycles through filtered list (wraps around)
- **Enter:** Selects the highlighted option
- **Escape:** Closes dropdown without selection

### 7. Selected

- **Input:** Shows `Name(email)` format (e.g., "Alex Morgan(alexmorgan@microsoft.com)")
- **Dropdown:** Closed after selection
- **Parent callback:** `onApproverSelected(approver)` fired with the selected IApprover
- **Query state:** Set to the display text — this is the single source of truth

### 8. Selected + Chevron Opened

- **Input:** Still shows `Name(email)` display text
- **Dropdown:** Open, showing only the selected approver (filtered by display text)
- **Selected row:** Black checkmark icon on the left side (before avatar), subtle selected background
- **Clicking the selected item:** Re-selects it (no toggle deselect) — closes dropdown
- **Behavior note:** Unlike showing the full list, v9 filters the display text against options, so only the matching item appears

### 9. Clearing Selection

- **How to clear:** User clicks into the input and uses backspace/delete to modify or remove the display text
- **On text change:** Selection is cleared (`onApproverSelected(undefined)`) when the input value no longer matches the selected display text
- **After full clear:** Input is empty, placeholder reappears, dropdown shows all approvers
- **No toggle:** Clicking the selected item in the dropdown does NOT deselect — user must edit the input text

### 10. Disabled

- **Input:** Not interactive, cursor changes to `default`
- **Background:** `neutralLighter` (light gray fill)
- **Border:** `neutralLighter` (blends with background)
- **Chevron:** Visible but non-interactive
- **Dropdown:** Never opens
- **Click/Focus:** No response

---

## Keyboard Interactions

| Key        | State              | Behavior                                      |
|------------|--------------------|-----------------------------------------------|
| ArrowDown  | Closed             | Opens dropdown, highlights first item         |
| ArrowDown  | Open               | Moves highlight to next item (wraps to top)   |
| ArrowUp    | Open               | Moves highlight to previous item (wraps to bottom) |
| Enter      | Highlighted item   | Selects the highlighted approver              |
| Escape     | Open               | Closes dropdown, clears highlight             |
| Backspace  | Selected           | Edits display text, clears selection when text changes |
| Any typing | Any                | Opens dropdown, filters list, clears selection if active |

---

## Visual Specifications

| Element          | Property          | Value                              |
|------------------|-------------------|------------------------------------|
| Step badge       | Size              | 24x24px, border-radius 4px        |
| Step badge       | Colors            | Background: themeLighter, Text: themePrimary |
| Input wrapper    | Height            | 32px minimum                       |
| Input wrapper    | Border radius     | 4px                                |
| Input wrapper    | Focus border      | 2px solid themePrimary             |
| Dropdown         | Max height        | 320px (scrollable)                 |
| Dropdown         | Shadow            | 0 2px 8px rgba(0,0,0,0.15)        |
| Dropdown         | Border radius     | 4px                                |
| Persona row      | Height            | 44px minimum                       |
| Avatar           | Size              | 32px circle                        |
| Avatar           | Background        | rgb(79, 107, 237)                  |
| Avatar           | Text              | Initials, 13px, semibold, white    |
| Name text        | Font              | 14px, regular weight               |
| Email text       | Font              | 12px, regular weight, neutral secondary |
| Checkmark        | Size              | 12px                               |
| Checkmark        | Color             | neutralPrimary (black)             |
| Checkmark        | Position          | Left side, before avatar           |
