# ✅ TaskFlow — To-Do List Browser Extension

A modern, feature-rich task management browser extension built with **Manifest V3** for Chrome and Edge. Manage your tasks with categories, priorities, due dates, and persistent storage — all without leaving your browser.

![Chrome](https://img.shields.io/badge/Chrome-Extension-4285F4?logo=googlechrome&logoColor=white)
![Edge](https://img.shields.io/badge/Edge-Extension-0078D7?logo=microsoftedge&logoColor=white)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-6366F1)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🚀 Features

| Feature | Description |
|---------|-------------|
| **Task CRUD** | Create, read, update, and delete tasks instantly |
| **Categories** | Organize tasks under **Work**, **Personal**, or **Study** |
| **Priority Levels** | Assign **Low**, **Medium**, or **High** priority with color indicators |
| **Due Dates** | Set optional due dates with overdue detection |
| **Search & Filter** | Real-time search and category-based filtering |
| **Dark / Light Theme** | Toggle between beautifully crafted dark and light modes |
| **Persistent Storage** | Tasks survive browser restarts via `chrome.storage.local` |
| **Smooth Animations** | Polished micro-animations for add, delete, and complete actions |
| **Undo Delete** | Toast notification with 3-second undo window |

---

## 🎨 Design Highlights

- **Glassmorphism-inspired** card design with layered shadows
- **Gradient accents** using an Indigo → Violet palette
- **Outfit** font family for premium typography
- **60 fps animations** — slide, fade, scale transitions
- Responsive popup at **380 × 560 px**

---

## 📁 Project Structure

```
taskflow-extension/
├── manifest.json       # Manifest V3 configuration
├── popup.html          # Extension popup UI
├── popup.js            # Core application logic
├── style.css           # Styling (light & dark themes)
├── background.js       # Service worker (badge updates)
├── LOADING.md          # Loading state documentation
└── icons/
    ├── icon16.png
    ├── icon32.png
    ├── icon48.png
    └── icon128.png
```

---

## 🛠️ Installation (Developer / Local)

1. **Clone the repository**
   ```bash
   git clone https://github.com/abidali72/To-Do-List-Browser-Extension---Specification-Document.git
   cd To-Do-List-Browser-Extension---Specification-Document
   ```

2. **Load in Chrome**
   - Navigate to `chrome://extensions/`
   - Enable **Developer mode** (top-right toggle)
   - Click **Load unpacked**
   - Select the `taskflow-extension/` folder

3. **Load in Edge**
   - Navigate to `edge://extensions/`
   - Enable **Developer mode** (left sidebar toggle)
   - Click **Load unpacked**
   - Select the `taskflow-extension/` folder

4. Click the extension icon in your toolbar — you're ready to go! 🎉

---

## 📋 Data Model

Each task is stored as a JSON object:

```json
{
  "id": "uuid-string",
  "title": "Task title",
  "category": "work | personal | study",
  "priority": "low | medium | high",
  "dueDate": "2025-12-31T00:00:00Z",
  "completed": false,
  "createdAt": 1700000000000,
  "updatedAt": 1700000000000,
  "order": 0
}
```

All tasks are persisted under the key `taskflow_tasks` in `chrome.storage.local`.

---

## 🧪 Acceptance Criteria

### Visual
- [x] Popup renders at 380 px width
- [x] Theme toggle switches between light / dark
- [x] Category filter pills highlight correctly
- [x] Task cards display title, category badge, priority dot, and due date
- [x] Smooth animations (no jank)
- [x] Empty state illustration when no tasks exist

### Functional
- [x] Add task with all fields
- [x] Edit existing task
- [x] Delete task (with undo)
- [x] Mark task complete / incomplete
- [x] Filter by category
- [x] Search tasks in real-time
- [x] Tasks persist across browser restarts

### Performance
- [x] Initial load < 200 ms
- [x] No visible re-renders during interactions
- [x] 60 fps animations

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Abid Ali**
- GitHub: [@abidali72](https://github.com/abidali72)

---

> Built with ❤️ for productivity enthusiasts.
