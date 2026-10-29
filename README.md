# Nepali School LMS & Management System (नेपाली विद्यालय व्यवस्थापन प्रणाली)

A localized School Management & Learning Management Platform developed with **Next.js (App Router)** and **MongoDB**, specially tailored for schools, teachers, and students in Nepal (Nursery to Class 10 / SEE / +2).

---

## 🌟 Comprehensive Feature Set

### 1. 🔐 Teacher & Admin Authentication (`/login`)
* **Role-Based Login**:
  * **Teacher Login**: Sign in with **Employee ID** (e.g. `TCH-101`) or **Email** + Password (default: `teacher123`).
  * **Admin Login**: Sign in with administrator master password (default: `admin123`).
* **1-Click Demo Fast Sign-In**:
  * Instant switcher to preview the LMS as different faculty members:
    - *Ramesh Prasad Bhattarai* (`TCH-101`) — Math Teacher & Class 10-A Class Teacher
    - *Sarita Devi K.C.* (`TCH-102`) — Science Teacher & Class 9-A Class Teacher
    - *Hari Prasad Dahal* (`TCH-103`) — Nepali Teacher & Class 8-A Class Teacher
    - *School Principal / Administrator*

### 2. 👨‍🏫 Dedicated Teacher Dashboard (`/teacher/dashboard`)
* **Personalized Teacher Workspace**:
  * Tailored automatically to the logged-in teacher's assigned class, section, and subjects.
* **Teacher KPI Cards**:
  * Count of students in their assigned class.
  * Today's class roll call status (*Recorded* with attendance rate vs *Pending*).
  * Assigned subject list.
  * Uploaded study materials and model sets count.
* **Embedded Class Roll Call Register**:
  * Class teachers can take today's attendance directly from their dashboard with 1-click *Mark All Present*.
* **My Class Students Roster**:
  * Direct access to class student details, emergency guardian phones (`tel:` link), and blood groups.
* **Fast Study Material Uploader**:
  * Modal form pre-filled with the teacher's class and subject to instantly publish notes or model sets.

### 3. 👥 Class-Based Student Dashboard (`/students`)
* **Class & Section Filtering**: Quick filter by grade (`Class 10 (SEE)`, `Class 9`, `Class 8`, etc.) and section (`A`, `B`, `C`).
* **Fee Status Badges**: Real-time indicators for `Paid` 🟢, `Unpaid / Pending` 🔴, and `Partial` 🟡.
* **Search & Student Dossier**: Search by student name, roll number, or guardian; click to open full profile dossier with Nepali name, address, date of birth (BS), and blood group.
* **New Student Admission Form**: Directly enroll new students into MongoDB.

### 4. 👨‍🏫 Teacher Section & Faculty Directory (`/teachers`)
* **Faculty Directory**: Complete listing of teachers, qualifications, joined date (BS), email, and phone contact.
* **Subject Specialization**: Visual tags for subjects taught (Mathematics, Science, Nepali, Computer, Social Studies).
* **Class Teacher Designation**: Assign class teachers to specific classes and sections (e.g. Class 10-A Class Teacher).
* **Faculty Registration**: Modal form to onboard new teaching staff.

### 5. 💳 Fees & Billing Ledger (`/fees`)
* **Nepali Academic Calendar (BS)**: Month-by-month billing from *Baisakh* to *Chaitra* (२०८१ B.S.).
* **Payment Collection Engine**: Accept and record payments via Cash, eSewa, Khalti, or Bank Transfer, automatically updating student balances.
* **Printable Fee Receipt**: Formatted school receipt slip with breakdown of tuition, computer, and exam fees, printable directly via browser print/PDF with automatic white paper print styles.

### 6. 📋 Daily Student Attendance Tracker (`/attendance`)
* **Teacher Roll Call Register**: Select Class, Section, and Nepali Date (BS) to mark daily attendance.
* **Flexible Statuses**: Mark each student as **Present**, **Absent**, **Leave** (Sick/Personal), or **Late**, with optional remarks.
* **1-Click "Mark All Present"**: Speeds up daily roll call.
* **Attendance Analytics**: Real-time counter of total students, present, absent, and percentage rate (%).

### 7. 📢 LMS: Digital Notice Board & Study Materials (`/lms`)
* **Digital Notice Board (सूचना पाटी)**:
  * Official school announcements, festival holiday alerts (Dashain, Tihar, Chhath), exam schedules, and sports events.
  * Category filters (`Notice`, `Holiday`, `Exam`, `Event`) and pinned priority announcements.
* **Study Materials & Question Bank (अध्ययन सामग्री)**:
  * Class and subject-wise notes, CDC syllabus materials, and past SEE question papers with download links.

### 8. 🌙 Dark & Light Theme & Collapsible Icon Sidebar
* Seamless toggle between dark and light themes with a Sun/Moon icon in the navigation bar.
* Collapsible sidebar: toggles between `w-64` and `w-20` (icon-only mode with hover tooltips).

---

## 🛠️ Demo Logins

| Role | Identifier / Email | Password | Assigned Scope |
| :--- | :--- | :--- | :--- |
| **Class 10 Teacher** | `TCH-101` or `ramesh.bhattarai@school.edu.np` | `teacher123` | Class 10 (SEE) - A (Math) |
| **Class 9 Teacher** | `TCH-102` or `sarita.kc@school.edu.np` | `teacher123` | Class 9 - A (Science) |
| **Class 8 Teacher** | `TCH-103` or `hari.dahal@school.edu.np` | `teacher123` | Class 8 - A (Nepali/Social) |
| **Principal / Admin** | `admin` | `admin123` | All school portals & finance |

---

## 🚀 Running the Development Server

```powershell
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.
Visit **[http://localhost:3000/login](http://localhost:3000/login)** to sign in as any teacher or administrator.
