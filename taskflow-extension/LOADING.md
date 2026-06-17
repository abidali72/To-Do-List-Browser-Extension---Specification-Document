# TaskFlow - To-Do List Extension

## Loading the Extension in Chrome / Edge

### Method 1: Developer Mode (Recommended for development)

1. **Open Extension Management**
   - **Chrome:** Navigate to `chrome://extensions/`
   - **Edge:** Navigate to `edge://extensions/`

2. **Enable Developer Mode**
   - Toggle the **"Developer mode"** switch in the top-right corner

3. **Load the Extension**
   - Click the **"Load unpacked"** button
   - Browse to and select the `taskflow-extension` folder
   - Click **Select Folder** (or **Open**)

4. **Pin the Extension** (Optional)
   - Click the puzzle piece icon (Extensions) in your browser toolbar
   - Find "TaskFlow - To-Do List" and click the pin icon

### Method 2: Packaged Extension

1. **Pack the Extension**
   - In `chrome://extensions/`, enable Developer Mode
   - Click **"Pack extension"**
   - Select the `taskflow-extension` folder
   - Leave the key field blank
   - Click **Pack Extension**

2. **Load the Packed Extension**
   - A `.crx` file will be created in the parent folder
   - Drag and drop the `.crx` file onto the extensions page

---

## Using the Extension

### Features

- **Add Tasks:** Click "Add Task" button or use the input form
- **Edit Tasks:** Hover over a task and click the edit icon
- **Delete Tasks:** Hover over a task and click the delete icon
- **Complete Tasks:** Click the circular checkbox
- **Filter by Category:** Use the category pills (All, Work, Personal, Study)
- **Search Tasks:** Type in the search bar to filter
- **Drag & Drop:** Reorder tasks by dragging them
- **Theme Toggle:** Click the sun/moon icon to switch light/dark mode

### Data Storage

All tasks are automatically saved to your browser's local storage and will persist across browser restarts.

---

## File Structure

```
taskflow-extension/
├── manifest.json      # Extension manifest (V3)
├── popup.html         # Main popup UI
├── popup.js           # Extension logic
├── style.css          # Styling with dark/light themes
├── background.js      # Service worker
├── icons/
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── LOADING.md         # This file
```

---

## Troubleshooting

**Extension not loading:**
- Make sure Developer Mode is enabled
- Check for any errors in the console (F12 → Console)
- Verify all files are in the correct locations

**Tasks not saving:**
- Check browser storage permissions
- Try clearing extension storage and re-adding

**Icons not showing:**
- Verify icons folder contains all 4 PNG files
- Try reloading the extension

---

## Credits

Built with vanilla HTML, CSS, and JavaScript using Manifest V3.