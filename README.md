# Nepali School LMS & Management System (नेपाली विद्यालय व्यवस्थापन प्रणाली)

A modern, localized School Management & Learning Management Platform developed with **Next.js (App Router)** and **MongoDB**, specially tailored for schools and students in Nepal (Nursery to Class 10 / SEE / +2).

---

## 🌟 Comprehensive Feature Set

### 1. 👥 Class-Based Student Dashboard (`/students`)
* **Class & Section Filtering**: Quick filter by grade (`Class 10 (SEE)`, `Class 9`, `Class 8`, etc.) and section (`A`, `B`, `C`).
* **Fee Status Badges**: Real-time indicators for `Paid` 🟢, `Unpaid / Pending` 🔴, and `Partial` 🟡.
* **Search & Student Dossier**: Search by student name, roll number, or guardian; click to open full profile dossier with Nepali name, address, date of birth (BS), and blood group.
* **New Student Admission Form**: Directly enroll new students into MongoDB.

### 2. 👨‍🏫 Teacher Section & Faculty Directory (`/teachers`)
* **Faculty Directory**: Complete listing of teachers, qualifications, joined date (BS), email, and phone contact.
* **Subject Specialization**: Visual tags for subjects taught (Mathematics, Science, Nepali, Computer, Social Studies).
* **Class Teacher Designation**: Assign class teachers to specific classes and sections (e.g. Class 10-A Class Teacher).
* **Faculty Registration**: Modal form to onboard new teaching staff.

### 3. 💳 Fees & Billing Ledger (`/fees`)
* **Nepali Academic Calendar (BS)**: Month-by-month billing from *Baisakh* to *Chaitra* (२०८१ B.S.).
* **Payment Collection Engine**: Accept and record payments via Cash, eSewa, Khalti, or Bank Transfer, automatically updating student balances.
* **Printable Fee Receipt**: Formatted school receipt slip with breakdown of tuition, computer, and exam fees, printable directly via browser print/PDF.

### 4. 📋 Daily Student Attendance Tracker (`/attendance`)
* **Teacher Roll Call Register**: Select Class, Section, and Nepali Date (BS) to mark daily attendance.
* **Flexible Statuses**: Mark each student as **Present**, **Absent**, **Leave** (Sick/Personal), or **Late**, with optional remarks.
* **1-Click "Mark All Present"**: Speeds up daily roll call.
* **Attendance Analytics**: Real-time counter of total students, present, absent, and percentage rate (%).

### 5. 📢 LMS: Digital Notice Board & Study Materials (`/lms`)
* **Digital Notice Board (सूचना पाटी)**:
  * Official school announcements, festival holiday alerts (Dashain, Tihar, Chhath), exam schedules, and sports events.
  * Category filters (`Notice`, `Holiday`, `Exam`, `Event`) and pinned priority announcements.
  * "Publish Notice" form to broadcast new alerts.
* **Study Materials & Question Bank (अध्ययन सामग्री)**:
  * Class and subject-wise notes, CDC syllabus materials, and past SEE question papers.
  * Direct download/view links.
  * "Upload Material" form for faculty.

### 6. 🌙 Dark & Light Mode
* Seamless toggle between dark and light themes with a Sun/Moon icon in the navigation bar.
* Persistent preference saved in `localStorage`.
* Full high-contrast dark palette across all pages, tables, cards, and modals.

### 7. 📑 Collapsible Icon-Only Left Sidebar
* Click the toggle button in the sidebar header or navbar to collapse the sidebar from `w-64` to `w-20`.
* In collapsed mode, only navigation icons are displayed with hover tooltips to maximize screen workspace.
* State persists across page reloads.

### 8. ⚡ 1-Click Nepali Sample Data Seeder
* Top navigation **"Seed Sample Data"** button (`/api/seed`) instantly populates realistic Nepali student records, faculty profiles, invoices, notices, and study materials.

---

## 🛠️ Tech Stack

* **Framework**: Next.js 14 (App Router, Server Actions, API Routes)
* **Language**: TypeScript
* **Styling**: Tailwind CSS with custom Nepali theme tokens & dark mode
* **Database**: MongoDB with Mongoose ODM
* **Icons**: Lucide React

---

## 🚀 Getting Started

### 1. Prerequisites
* **Node.js**: v18.18+ or v20+
* **MongoDB**: Running locally or via MongoDB Atlas

### 2. Environment Variables
Verify [`.env.local`](.env.local):
```env
MONGODB_URI=mongodb://127.0.0.1:27017/nepali_school_lms
NEXT_PUBLIC_SCHOOL_NAME="Himalayan Secondary English Boarding School"
NEXT_PUBLIC_SCHOOL_ADDRESS="Kathmandu, Bagmati, Nepal"
NEXT_PUBLIC_CURRENT_YEAR_BS="2081"
```

### 3. Run Development Server
```powershell
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

Click the **"Seed Sample Data"** button in the top navigation bar to populate realistic sample records.
