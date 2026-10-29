import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Student } from "@/models/Student";
import { Teacher } from "@/models/Teacher";
import { FeeInvoice } from "@/models/FeeInvoice";
import { Notice } from "@/models/Notice";
import { StudyMaterial } from "@/models/StudyMaterial";
import { Attendance } from "@/models/Attendance";

export async function POST() {
  try {
    await connectDB();

    // Clear existing data
    await Student.deleteMany({});
    await Teacher.deleteMany({});
    await FeeInvoice.deleteMany({});
    await Notice.deleteMany({});
    await StudyMaterial.deleteMany({});
    await Attendance.deleteMany({});

    // Sample Teachers
    const teachersData = [
      {
        employeeId: "TCH-101",
        fullName: "Ramesh Prasad Bhattarai",
        email: "ramesh.bhattarai@school.edu.np",
        password: "teacher123",
        phone: "9841234567",
        subjects: ["Compulsory Mathematics", "Opt. Mathematics"],
        isClassTeacher: true,
        assignedClass: "Class 10 (SEE)",
        assignedSection: "A",
        qualification: "M.Sc. Mathematics, Tribhuvan University",
        joinedDateBS: "2075-01-15",
        status: "Active",
      },
      {
        employeeId: "TCH-102",
        fullName: "Sarita Devi K.C.",
        email: "sarita.kc@school.edu.np",
        password: "teacher123",
        phone: "9851098765",
        subjects: ["Science & Environment", "Health & Physical Education"],
        isClassTeacher: true,
        assignedClass: "Class 9",
        assignedSection: "A",
        qualification: "M.Sc. Physics, Kathmandu University",
        joinedDateBS: "2077-04-01",
        status: "Active",
      },
      {
        employeeId: "TCH-103",
        fullName: "Hari Prasad Dahal",
        email: "hari.dahal@school.edu.np",
        phone: "9860112233",
        subjects: ["Nepali (नेपाली)", "Social Studies (सामाजिक)"],
        isClassTeacher: true,
        assignedClass: "Class 8",
        assignedSection: "A",
        qualification: "M.A. Nepali Literature, TU",
        joinedDateBS: "2072-02-10",
        status: "Active",
      },
      {
        employeeId: "TCH-104",
        fullName: "Nirmala Tamang",
        email: "nirmala.tamang@school.edu.np",
        phone: "9818998877",
        subjects: ["English Literature", "Grammar"],
        isClassTeacher: true,
        assignedClass: "Class 7",
        assignedSection: "A",
        qualification: "M.A. English, TU",
        joinedDateBS: "2078-01-10",
        status: "Active",
      },
      {
        employeeId: "TCH-105",
        fullName: "Pradeep Kumar Shakya",
        email: "pradeep.shakya@school.edu.np",
        phone: "9849554433",
        subjects: ["Computer Science", "Coding & STEM"],
        isClassTeacher: false,
        qualification: "B.E. Computer Engineering, IOE Pulchowk",
        joinedDateBS: "2079-05-20",
        status: "Active",
      },
    ];

    const insertedTeachers = await Teacher.insertMany(teachersData);

    // Sample Students across classes
    const rawStudents = [
      // Class 10 (SEE) - Section A
      {
        studentId: "STD-2081-001",
        rollNo: 1,
        fullName: "Aarav Sharma",
        nepaliName: "आरभ शर्मा",
        gender: "Male",
        className: "Class 10 (SEE)",
        section: "A",
        guardianName: "Madan Sharma",
        guardianPhone: "9841555111",
        address: "Maitidevi, Kathmandu - 30",
        dateOfBirthBS: "2066-03-14",
        bloodGroup: "O+ve",
        feeStatus: "Paid",
        outstandingDue: 0,
      },
      {
        studentId: "STD-2081-002",
        rollNo: 2,
        fullName: "Ananya Shrestha",
        nepaliName: "अनन्या श्रेष्ठ",
        gender: "Female",
        className: "Class 10 (SEE)",
        section: "A",
        guardianName: "Rajendra Shrestha",
        guardianPhone: "9851444222",
        address: "Patan Dhoka, Lalitpur - 12",
        dateOfBirthBS: "2066-07-22",
        bloodGroup: "A+ve",
        feeStatus: "Pending",
        outstandingDue: 4500,
      },
      {
        studentId: "STD-2081-003",
        rollNo: 3,
        fullName: "Bibek Thapa",
        nepaliName: "विवेक थापा",
        gender: "Male",
        className: "Class 10 (SEE)",
        section: "A",
        guardianName: "Kul Bahadur Thapa",
        guardianPhone: "9841888333",
        address: "Kapan, Budhanilkantha - 10",
        dateOfBirthBS: "2065-11-05",
        bloodGroup: "B+ve",
        feeStatus: "Partial",
        outstandingDue: 2000,
      },
      {
        studentId: "STD-2081-004",
        rollNo: 4,
        fullName: "Sneha Rai",
        nepaliName: "स्नेहा राई",
        gender: "Female",
        className: "Class 10 (SEE)",
        section: "A",
        guardianName: "Dambar Rai",
        guardianPhone: "9803112244",
        address: "Chabahil, Kathmandu - 7",
        dateOfBirthBS: "2066-01-19",
        bloodGroup: "AB+ve",
        feeStatus: "Paid",
        outstandingDue: 0,
      },

      // Class 9 - Section A
      {
        studentId: "STD-2081-005",
        rollNo: 1,
        fullName: "Prashant Pokharel",
        nepaliName: "प्रशान्त पोखरेल",
        gender: "Male",
        className: "Class 9",
        section: "A",
        guardianName: "Dr. Dipak Pokharel",
        guardianPhone: "9851223344",
        address: "New Baneshwor, Kathmandu - 10",
        dateOfBirthBS: "2067-05-10",
        bloodGroup: "B+ve",
        feeStatus: "Paid",
        outstandingDue: 0,
      },
      {
        studentId: "STD-2081-006",
        rollNo: 2,
        fullName: "Rojina Maharjan",
        nepaliName: "रोजिना महर्जन",
        gender: "Female",
        className: "Class 9",
        section: "A",
        guardianName: "Babu Raja Maharjan",
        guardianPhone: "9841998811",
        address: "Sanepa, Lalitpur - 2",
        dateOfBirthBS: "2067-08-14",
        bloodGroup: "O+ve",
        feeStatus: "Pending",
        outstandingDue: 4200,
      },
      {
        studentId: "STD-2081-007",
        rollNo: 3,
        fullName: "Ayush Gurung",
        nepaliName: "आयुष गुरुङ",
        gender: "Male",
        className: "Class 9",
        section: "A",
        guardianName: "Hom Bahadur Gurung",
        guardianPhone: "9813556677",
        address: "Gongabu, Kathmandu - 26",
        dateOfBirthBS: "2067-02-28",
        bloodGroup: "A+ve",
        feeStatus: "Partial",
        outstandingDue: 1500,
      },

      // Class 8 - Section A
      {
        studentId: "STD-2081-008",
        rollNo: 1,
        fullName: "Kripa Poudel",
        nepaliName: "कृपा पौडेल",
        gender: "Female",
        className: "Class 8",
        section: "A",
        guardianName: "Narayan Poudel",
        guardianPhone: "9841334455",
        address: "Koteshwor, Kathmandu - 32",
        dateOfBirthBS: "2068-09-02",
        bloodGroup: "A+ve",
        feeStatus: "Paid",
        outstandingDue: 0,
      },
      {
        studentId: "STD-2081-009",
        rollNo: 2,
        fullName: "Sushant Adhikari",
        nepaliName: "सुशान्त अधिकारी",
        gender: "Male",
        className: "Class 8",
        section: "A",
        guardianName: "Kishor Adhikari",
        guardianPhone: "9851778899",
        address: "Thimi, Bhaktapur - 4",
        dateOfBirthBS: "2068-12-18",
        bloodGroup: "B+ve",
        feeStatus: "Pending",
        outstandingDue: 3800,
      },
      {
        studentId: "STD-2081-010",
        rollNo: 3,
        fullName: "Puja Chaudhary",
        nepaliName: "पूजा चौधरी",
        gender: "Female",
        className: "Class 8",
        section: "A",
        guardianName: "Ram Prasad Chaudhary",
        guardianPhone: "9808332211",
        address: "Kalanki, Kathmandu - 14",
        dateOfBirthBS: "2068-04-09",
        bloodGroup: "O+ve",
        feeStatus: "Paid",
        outstandingDue: 0,
      },

      // Class 7 - Section A
      {
        studentId: "STD-2081-011",
        rollNo: 1,
        fullName: "Nabin Magar",
        nepaliName: "नवीन मगर",
        gender: "Male",
        className: "Class 7",
        section: "A",
        guardianName: "Bishnu Magar",
        guardianPhone: "9849221144",
        address: "Swayambhu, Kathmandu - 15",
        dateOfBirthBS: "2069-06-25",
        bloodGroup: "AB+ve",
        feeStatus: "Pending",
        outstandingDue: 3500,
      },
      {
        studentId: "STD-2081-012",
        rollNo: 2,
        fullName: "Deepika Karki",
        nepaliName: "दीपिका कार्की",
        gender: "Female",
        className: "Class 7",
        section: "A",
        guardianName: "Surendra Karki",
        guardianPhone: "9851665544",
        address: "Balkhu, Kathmandu - 14",
        dateOfBirthBS: "2069-10-11",
        bloodGroup: "B+ve",
        feeStatus: "Paid",
        outstandingDue: 0,
      },
    ];

    const insertedStudents = await Student.insertMany(rawStudents);

    // Generate Month-wise Invoices for Kartik 2081
    const invoicesData = insertedStudents.map((std, idx) => {
      const items = [
        { title: "Monthly Tuition Fee", amount: 2500 },
        { title: "Computer Lab & Tech Fee", amount: 500 },
        { title: "Terminal Exam Fee", amount: 800 },
      ];
      if (std.className.includes("10") || std.className.includes("9")) {
        items.push({ title: "Practical Science Lab", amount: 700 });
      }

      const subtotal = items.reduce((acc, curr) => acc + curr.amount, 0);
      const discount = idx % 3 === 0 ? 500 : 0;
      const totalAmount = subtotal - discount;

      let paidAmount = 0;
      let balanceAmount = totalAmount;
      let status: "Paid" | "Pending" | "Partial" = "Pending";
      let paymentMethod: "Cash" | "eSewa" | "Khalti" | "Bank Transfer" | undefined;
      let paidAt: Date | undefined;
      let receiptNo: string | undefined;

      if (std.feeStatus === "Paid") {
        paidAmount = totalAmount;
        balanceAmount = 0;
        status = "Paid";
        paymentMethod = idx % 2 === 0 ? "eSewa" : "Cash";
        paidAt = new Date();
        receiptNo = `REC-2081-${1000 + idx}`;
      } else if (std.feeStatus === "Partial") {
        paidAmount = 2000;
        balanceAmount = totalAmount - paidAmount;
        status = "Partial";
        paymentMethod = "Khalti";
        paidAt = new Date();
        receiptNo = `REC-2081-${1000 + idx}`;
      }

      return {
        invoiceNo: `INV-2081-${2000 + idx}`,
        studentId: std.studentId,
        studentName: std.fullName,
        className: std.className,
        section: std.section,
        rollNo: std.rollNo,
        monthBS: "Kartik (कार्तिक)",
        yearBS: "2081",
        items,
        subtotal,
        discount,
        totalAmount,
        paidAmount,
        balanceAmount,
        status,
        paymentMethod,
        paidAt,
        receiptNo,
        remarks: status === "Paid" ? "Full payment received with gratitude." : "",
      };
    });

    const insertedInvoices = await FeeInvoice.insertMany(invoicesData);

    // Sample Notices
    const noticesData = [
      {
        title: "शुभ दिपावली तथा छठ पर्व २०८१ को पावन अवसरमा विदा सम्बन्धी सूचना",
        content:
          "सम्पूर्ण अभिभावक तथा विद्यार्थी वर्गमा जानकारी गराइन्छ कि नेपालीहरूको महान चाड तिहार तथा छठ पर्वको उपलक्ष्यमा मिति २०८१ कार्तिक १५ गतेदेखि कार्तिक २२ गतेसम्म विद्यालय बन्द रहनेछ। पुन: मिति २०८१ कार्तिक २३ गते शुक्रबारदेखि नियमित कक्षा सञ्चालन हुनेछ।",
        category: "Holiday",
        priority: "High",
        targetAudience: "All Students & Guardians",
        dateBS: "२०८१ कार्तिक १२",
        author: "Principal - Rameshwor Adhikari",
        isPinned: true,
      },
      {
        title: "द्वितीय त्रैमासिक परीक्षा (Second Terminal Examination) २०८१ समय तालिका",
        content:
          "कक्षा १ देखि १० सम्मका सम्पूर्ण विद्यार्थीहरूको द्वितीय त्रैमासिक परीक्षा आगामी २०८१ मंसिर १६ गते आइतबारदेखि सञ्चालन हुने भएकोले सम्पूर्ण विषयगत तयारी गर्न सूचित गरिन्छ। परीक्षा सम्बन्धी शुल्क कार्तिक मसान्तभित्र बुझाउन अनुरोध छ।",
        category: "Exam",
        priority: "High",
        targetAudience: "Class 1 to 10",
        dateBS: "२०८१ कार्तिक १४",
        author: "Examination Controller",
        isPinned: true,
      },
      {
        title: "कक्षा १० (SEE) को लागि अतिरिक्त गणित र विज्ञान कक्षा सञ्चालन बारे",
        content:
          "यस वर्षको SEE परीक्षालाई लक्षित गरी कक्षा १० का विद्यार्थीहरूका लागि बिहान ७:०० बजेदेखि ८:३० बजेसम्म अनिवार्य गणित र विज्ञान विषयको विशेष कोचिंग कक्षा सञ्चालन हुनेछ।",
        category: "Notice",
        priority: "Normal",
        targetAudience: "Class 10 (SEE)",
        dateBS: "२०८१ कार्तिक ०५",
        author: "Academic Coordinator",
        isPinned: false,
      },
    ];
    const insertedNotices = await Notice.insertMany(noticesData);

    // Sample Study Materials
    const materialsData = [
      {
        title: "Class 10 SEE Compulsory Mathematics - Formula Sheet & CDC Model Sets 2081",
        description:
          "Complete compilation of Mensuration, Geometry, Algebra, and Statistics formulas along with CDC new curriculum sample questions.",
        className: "Class 10 (SEE)",
        subject: "Compulsory Mathematics",
        fileType: "PDF",
        fileUrl: "https://moecdc.gov.np/storage/files/10-Math-Model-2081.pdf",
        uploadedBy: "Ramesh Bhattarai (HOD Math)",
        downloadsCount: 142,
      },
      {
        title: "Class 10 Science - Unit 1 to 5 Quick Revision Notes (Physics & Chemistry)",
        description:
          "Force, Pressure, Energy, Heat, and Chemical Reactions summarized with important numerical equations.",
        className: "Class 10 (SEE)",
        subject: "Science & Environment",
        fileType: "PDF",
        fileUrl: "https://moecdc.gov.np/storage/files/10-Science-Revision-2081.pdf",
        uploadedBy: "Sarita K.C. (Science Faculty)",
        downloadsCount: 98,
      },
      {
        title: "Class 9 Social Studies - Unit 3: Our Constitution & Civic Sense (नागरिक चेतना)",
        description:
          "Comprehensive notes on Constitutional Organs of Nepal and fundamental human rights.",
        className: "Class 9",
        subject: "Social Studies",
        fileType: "Document",
        fileUrl: "https://moecdc.gov.np/storage/files/9-Social-Notes.pdf",
        uploadedBy: "Hari Prasad Dahal",
        downloadsCount: 65,
      },
      {
        title: "Class 8 Computer Science - Basics of QBASIC Programming & Flowcharts",
        description:
          "Introductory control statements (IF-THEN, FOR-NEXT) with algorithm problem-solving samples.",
        className: "Class 8",
        subject: "Computer Science",
        fileType: "PDF",
        fileUrl: "https://moecdc.gov.np/storage/files/8-Computer-Qbasic.pdf",
        uploadedBy: "Pradeep Shakya (IT Head)",
        downloadsCount: 47,
      },
    ];
    const insertedMaterials = await StudyMaterial.insertMany(materialsData);

    // Sample Attendance for Class 10 - Section A
    const class10Students = insertedStudents.filter(
      (s) => s.className === "Class 10 (SEE)" && s.section === "A"
    );
    if (class10Students.length > 0) {
      await Attendance.create({
        dateBS: "2081-07-15",
        dateAD: new Date(),
        className: "Class 10 (SEE)",
        section: "A",
        takenBy: "Ramesh Prasad Bhattarai",
        records: class10Students.map((std, idx) => ({
          studentId: std.studentId,
          rollNo: std.rollNo,
          studentName: std.fullName,
          status: idx === 2 ? "Absent" : idx === 3 ? "Leave" : "Present",
          remarks: idx === 2 ? "Fever reported by parent" : "",
        })),
      });
    }

    return NextResponse.json({
      success: true,
      message: "Nepali School LMS Seed Data successfully loaded!",
      data: {
        teachersCount: insertedTeachers.length,
        studentsCount: insertedStudents.length,
        invoicesCount: insertedInvoices.length,
        noticesCount: insertedNotices.length,
        materialsCount: insertedMaterials.length,
      },
    });
  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to seed database" },
      { status: 500 }
    );
  }
}

