# Grade Card Viewer - Setup Guide

## Overview
A professional semester grade card viewer has been successfully integrated into the Education page. This guide explains how to add your actual grade card files.

## Features Implemented

### ✅ Components Added
1. **GradeCardModal** - Full-screen professional viewer with zoom controls
2. **SemesterCard** - Clean card design for each semester
3. **Academic Records Section** - Integrated into B.Tech education card

### ✅ Design Features
- Enterprise-style card design with soft shadows
- Rounded corners (16-20px)
- Subtle borders and hover effects
- Calm accent color transitions
- Fully responsive (2-4 columns based on screen size)
- Dark and light mode support
- Professional zoom controls (50% - 200%)
- "Available" badge for uploaded documents

### ✅ User Experience
- Click any semester card to open the viewer
- Full-screen modal with backdrop blur
- Zoom in/out controls
- Close button (X) or click outside to close
- Smooth animations and transitions
- Read-only viewer (secure)

## How to Add Grade Card Files

### Step 1: Prepare Your Files
1. **Supported Formats**: PDF or images (JPG, PNG)
2. **Recommended**: Use PDF format for best quality
3. **File Naming**: Use clear names like `sem1.pdf`, `sem2.pdf`, etc.

### Step 2: Add Files to Your Project

#### Option A: Public Folder (Recommended)
1. Create a folder: `public/grades/`
2. Add your grade card files:
   ```
   public/
   └── grades/
       ├── sem1.pdf
       ├── sem2.pdf
       ├── sem3.pdf
       ├── sem4.pdf
       ├── sem5.pdf
       ├── sem6.pdf
       ├── sem7.pdf
       └── sem8.pdf
   ```

#### Option B: External Hosting
Upload files to cloud storage (Google Drive, Dropbox, etc.) and get public URLs.

### Step 3: Update the Education.jsx File

Open `src/pages/Education.jsx` and find the `gradeCards` array (around line 300):

```javascript
gradeCards: [
    { semester: "Semester 1", year: "2022-2023", file: null },
    { semester: "Semester 2", year: "2022-2023", file: null },
    // ... etc
]
```

**Replace `null` with your file paths:**

#### For Public Folder Files:
```javascript
gradeCards: [
    { semester: "Semester 1", year: "2022-2023", file: "/grades/sem1.pdf" },
    { semester: "Semester 2", year: "2022-2023", file: "/grades/sem2.pdf" },
    { semester: "Semester 3", year: "2023-2024", file: "/grades/sem3.pdf" },
    { semester: "Semester 4", year: "2023-2024", file: "/grades/sem4.pdf" },
    { semester: "Semester 5", year: "2024-2025", file: "/grades/sem5.pdf" },
    { semester: "Semester 6", year: "2024-2025", file: "/grades/sem6.pdf" },
    { semester: "Semester 7", year: "2025-2026", file: "/grades/sem7.pdf" },
    { semester: "Semester 8", year: "2025-2026", file: "/grades/sem8.pdf" }
]
```

#### For External URLs:
```javascript
gradeCards: [
    { 
        semester: "Semester 1", 
        year: "2022-2023", 
        file: "https://example.com/path/to/sem1.pdf" 
    },
    // ... etc
]
```

#### For Image Files:
```javascript
gradeCards: [
    { semester: "Semester 1", year: "2022-2023", file: "/grades/sem1.jpg" },
    { semester: "Semester 2", year: "2022-2023", file: "/grades/sem2.png" },
    // ... etc
]
```

### Step 4: Partial Upload (Optional)
You can add files gradually. Cards without files will show "Grade Card Not Available" message:

```javascript
gradeCards: [
    { semester: "Semester 1", year: "2022-2023", file: "/grades/sem1.pdf" },
    { semester: "Semester 2", year: "2022-2023", file: "/grades/sem2.pdf" },
    { semester: "Semester 3", year: "2023-2024", file: null }, // Not yet uploaded
    { semester: "Semester 4", year: "2023-2024", file: null }, // Not yet uploaded
    // ... etc
]
```

## Current Status

### ✅ Implemented
- Full viewer system with modal
- 8 semester cards (Semester 1-8)
- Professional enterprise styling
- Zoom controls
- Responsive grid layout
- Dark/light mode support
- "Available" badge indicator

### 📝 To Do (When Ready)
- Add actual grade card PDF/image files
- Update file paths in `gradeCards` array

## Customization Options

### Change Academic Years
Edit the `year` field for each semester:
```javascript
{ semester: "Semester 1", year: "2022-2023", file: null }
```

### Remove Semesters
Simply remove entries from the array if you have fewer semesters.

### Add More Semesters
Add more objects to the array if needed:
```javascript
{ semester: "Semester 9", year: "2026-2027", file: null }
```

## Technical Notes

### File Size Recommendations
- **PDF**: Keep under 5MB for fast loading
- **Images**: Optimize to 1-2MB per file

### Security
- Files in `public/` folder are publicly accessible
- For sensitive documents, consider password-protected PDFs
- Or use authenticated cloud storage with temporary URLs

### Browser Compatibility
- PDF viewer works in all modern browsers
- Image viewer has universal support
- Zoom controls work on desktop and mobile

## Troubleshooting

### PDF Not Displaying
1. Check file path is correct
2. Ensure file is in `public/grades/` folder
3. Try using absolute URL
4. Check browser console for errors

### Image Not Loading
1. Verify image format (JPG, PNG, WebP)
2. Check file path spelling
3. Ensure file exists in specified location

### Modal Not Opening
1. Check browser console for errors
2. Ensure React state is working
3. Verify click handler is attached

## Example: Complete Setup

```javascript
// In Education.jsx, around line 300
{
    year: "2022 - 2026",
    degree: "B.Tech in Information Technology",
    institution: "Kalasalingam Academy",
    details: "Focusing on data analytics...",
    grade: { value: "7.18", label: "CGPA" },
    type: "College",
    icon: GraduationCap,
    highlights: ["Data Structures", "Cloud Architecture", "Programming"],
    gradeCards: [
        { semester: "Semester 1", year: "2022-2023", file: "/grades/sem1.pdf" },
        { semester: "Semester 2", year: "2022-2023", file: "/grades/sem2.pdf" },
        { semester: "Semester 3", year: "2023-2024", file: "/grades/sem3.pdf" },
        { semester: "Semester 4", year: "2023-2024", file: "/grades/sem4.pdf" },
        { semester: "Semester 5", year: "2024-2025", file: "/grades/sem5.pdf" },
        { semester: "Semester 6", year: "2024-2025", file: "/grades/sem6.pdf" },
        { semester: "Semester 7", year: "2025-2026", file: "/grades/sem7.pdf" },
        { semester: "Semester 8", year: "2025-2026", file: "/grades/sem8.pdf" }
    ]
}
```

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify file paths are correct
3. Ensure files are accessible
4. Test with a single file first before adding all

---

**Status**: ✅ Grade Card Viewer System Fully Implemented
**Next Step**: Add your actual grade card files when ready
