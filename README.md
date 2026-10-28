# Nepali School LMS & Management System (नेपाली विद्यालय व्यवस्थापन प्रणाली)

A localized School Management & Learning Platform developed with **Next.js (App Router)** and **MongoDB**, specially tailored for schools in Nepal (Nursery to Class 10 / SEE / +2).

---

## 🚀 Key Features Built

1. **Class-Based Student Dashboard (`/students`)**:
   - Filter roster by **Class / Grade** (`Class 10 (SEE)`, `Class 9`, `Class 8`, etc.) and **Section** (`A`, `B`, `C`).
   - Filter by **Fee Status** (`Paid`, `Unpaid / Pending`, `Partial`).
   - Real-time search by Student Name, Roll Number, or Guardian Phone.
   - Student Dossier modal with Nepali name, address, blood group, and emergency guardian info.
   - "New Student Admission" modal for enrolling students directly into MongoDB.

2. **Teacher Section (`/teachers`)**:
   - Teaching faculty directory with contact info, email, and phone.
   - Subject specialization tags (Mathematics, Science, Nepali, Social, STEM).
   - **Class Teacher Assignment** (e.g. Class 10-A Class Teacher).
   - Teacher registration form.

3. **Fees & Billing Ledger (`/fees`)**:
   - Localized for the **Nepali Academic Calendar** (Baisakh, Jestha, Ashadh... to Chaitra).
   - Month-wise fee tracking with color-coded badges (`Paid` 🟢, `Unpaid` 🔴, `Partial` 🟡).
   - **Fee Collection Modal**: Accepts cash, eSewa, Khalti, or Bank Transfer.
   - **Printable Fee Receipt**: Formatted school receipt slip with breakdown of Tuition, Lab, Exam, and Concessions ready to print (`window.print()`).

4. **1-Click Nepali Sample Data Seeder**:
   - Instant seed button in the top navigation bar (`/api/seed`) to populate realistic Nepali student profiles, faculty members, and invoices.

---

## 🛠️ Getting Started

### 1. Prerequisites
- **Node.js**: v18.18+ or v20+
- **MongoDB**: Local MongoDB server or MongoDB Atlas connection string.

### 2. Environment Configuration
Verify or update [.env.local](file:///c:/Users/vikas/LMS/.env.local):
```env
MONGODB_URI=mongodb://127.0.0.1:27017/nepali_school_lms
NEXT_PUBLIC_SCHOOL_NAME="Himalayan Secondary English Boarding School"
NEXT_PUBLIC_SCHOOL_ADDRESS="Kathmandu, Bagmati, Nepal"
NEXT_PUBLIC_CURRENT_YEAR_BS="2081"
```

### 3. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

Click the **"Seed Sample Data"** button in the top-right header to populate the database with realistic sample records.

