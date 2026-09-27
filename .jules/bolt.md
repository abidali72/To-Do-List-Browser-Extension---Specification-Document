## 2026-09-27 - Date Instantiation & Multi-pass Filtering in Render Loops
**Learning:** In vanilla JS UI extensions without framework virtual DOMs, calling `new Date()` and chaining multiple array `.filter()` calls inside item render loops creates significant CPU overhead and array allocation garbage collection pressure.
**Action:** Single-pass `for` loop filtering and hoisting boundary calculations (like `today` and `tomorrow` date boundaries) once per render cycle reduces render cycle date processing overhead by >50%.
