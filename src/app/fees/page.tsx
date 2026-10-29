"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  CreditCard,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  Printer,
  X,
  Calendar,
} from "lucide-react";
import { CLASSES, NEPALI_MONTHS } from "@/lib/constants";

interface InvoiceItem {
  title: string;
  amount: number;
}

interface InvoiceData {
  _id: string;
  invoiceNo: string;
  studentId: string;
  studentName: string;
  className: string;
  section: string;
  rollNo: number;
  monthBS: string;
  yearBS: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: "Paid" | "Pending" | "Partial";
  paymentMethod?: string;
  paidAt?: string;
  receiptNo?: string;
  remarks?: string;
}

function FeesContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialStatus = searchParams.get("status") || "All";

  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalBilled: 0,
    totalCollected: 0,
    totalPending: 0,
    paidCount: 0,
    unpaidCount: 0,
    partialCount: 0,
    totalCount: 0,
  });

  // Filters
  const [selectedClass, setSelectedClass] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>(initialStatus);
  const [selectedMonth, setSelectedMonth] = useState<string>("Kartik (कार्तिक)");
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);

  // Modals
  const [activePaymentInvoice, setActivePaymentInvoice] = useState<InvoiceData | null>(null);
  const [payingAmount, setPayingAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>("Cash");
  const [paymentRemarks, setPaymentRemarks] = useState<string>("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Printable Receipt Modal
  const [receiptInvoice, setReceiptInvoice] = useState<InvoiceData | null>(null);

  const fetchFees = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedClass !== "All") params.append("className", selectedClass);
      if (selectedStatus !== "All") params.append("status", selectedStatus);
      if (selectedMonth !== "All") params.append("monthBS", selectedMonth);

      const res = await fetch(`/api/fees?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setInvoices(json.data);
        if (json.summary) {
          setSummary(json.summary);
        }
      }
    } catch (err) {
      console.error("Error fetching fees:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, [selectedClass, selectedStatus, selectedMonth]);

  const openPaymentModal = (invoice: InvoiceData) => {
    setActivePaymentInvoice(invoice);
    setPayingAmount(invoice.balanceAmount);
    setPaymentMethod("Cash");
    setPaymentRemarks("");
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePaymentInvoice) return;
    setIsProcessingPayment(true);
    try {
      const res = await fetch("/api/fees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId: activePaymentInvoice._id,
          payingAmount,
          paymentMethod,
          remarks: paymentRemarks,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActivePaymentInvoice(null);
        fetchFees();
        // Automatically open the receipt modal
        setReceiptInvoice(data.data);
      } else {
        alert("Payment failed: " + data.error);
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Filter local invoices by search query if any
  const filteredInvoices = invoices.filter((inv) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      inv.studentName.toLowerCase().includes(q) ||
      inv.studentId.toLowerCase().includes(q) ||
      inv.invoiceNo.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-rose-600 dark:text-rose-400" />
            Fees & Billing Ledger (शुल्क तथा बक्यौता हिसाब)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track paid, unpaid, and partial tuition fee invoices by class and Nepali academic months.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Billed */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Total Billed (कुल बिल रकम)
          </span>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2">
            रु {summary.totalBilled.toLocaleString("en-IN")}
          </p>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            For {summary.totalCount} active student invoices
          </div>
        </div>

        {/* Total Collected */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              Total Collected (प्राप्त रकम)
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-2">
            रु {summary.totalCollected.toLocaleString("en-IN")}
          </p>
          <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            {summary.paidCount} Fully Paid • {summary.partialCount} Partial
          </div>
        </div>

        {/* Total Pending Dues */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-rose-200 dark:border-rose-800/60 bg-rose-50/20 dark:bg-rose-950/20 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
              Total Dues (बाँकी बक्यौता)
            </span>
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          </div>
          <p className="text-2xl font-bold text-rose-700 dark:text-rose-400 mt-2">
            रु {summary.totalPending.toLocaleString("en-IN")}
          </p>
          <div className="mt-2 text-xs text-rose-600 dark:text-rose-400 font-medium">
            {summary.unpaidCount} Students Unpaid
          </div>
        </div>
      </div>

      {/* Filter and Month Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        {/* Nepali Month Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="font-semibold text-slate-500 dark:text-slate-400 shrink-0 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" /> Month (महिना):
          </span>
          <button
            onClick={() => setSelectedMonth("All")}
            className={`px-3 py-1.5 rounded-lg font-medium shrink-0 transition-all ${
              selectedMonth === "All"
                ? "bg-slate-900 dark:bg-rose-600 text-white shadow-sm"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            All Months
          </button>
          {NEPALI_MONTHS.map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMonth(m)}
              className={`px-3 py-1.5 rounded-lg font-medium shrink-0 transition-all ${
                selectedMonth === m
                  ? "bg-rose-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {m.split(" ")[0]}
            </button>
          ))}
        </div>

        {/* Secondary Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          {/* Class Filter */}
          <div>
            <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">
              Class (कक्षा)
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              <option value="All">All Classes</option>
              {CLASSES.slice(6).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">
              Status (भुक्तानी स्थिति)
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              <option value="All">All Statuses (सबै)</option>
              <option value="Paid">Paid Only (भुक्तान भइसकेको)</option>
              <option value="Pending">Unpaid Only (बाँकी)</option>
              <option value="Partial">Partial Only (आंशिक)</option>
            </select>
          </div>

          {/* Search by Student */}
          <div>
            <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">
              Search Student
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              <input
                type="text"
                placeholder="Student name or roll..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>
            Showing <strong className="text-slate-800 dark:text-slate-100">{filteredInvoices.length}</strong> invoices
          </span>
          <span className="text-[11px] font-medium text-slate-400">
            Session २०८१ B.S.
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Invoice / Roll</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Billing Month</th>
                <th className="py-3 px-4 text-right">Total Bill</th>
                <th className="py-3 px-4 text-right">Paid</th>
                <th className="py-3 px-4 text-right">Balance Due</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 dark:text-slate-500">
                    Loading fee invoices...
                  </td>
                </tr>
              ) : filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 dark:text-slate-500">
                    No fee records found. Use "Seed Sample Data" to load realistic Nepali school fees.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    {/* Invoice No & Roll */}
                    <td className="py-3 px-4">
                      <div className="font-mono text-slate-800 dark:text-slate-200 font-medium">
                        {inv.invoiceNo}
                      </div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500">
                        Roll: {inv.rollNo}
                      </div>
                    </td>

                    {/* Student Name */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {inv.studentName}
                      </div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                        {inv.studentId}
                      </div>
                    </td>

                    {/* Class */}
                    <td className="py-3 px-4">
                      <span className="inline-flex px-2 py-0.5 rounded font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {inv.className} ({inv.section})
                      </span>
                    </td>

                    {/* Month */}
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{inv.monthBS}</div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500">{inv.yearBS} B.S.</div>
                    </td>

                    {/* Total Amount */}
                    <td className="py-3 px-4 text-right font-medium text-slate-800 dark:text-slate-200">
                      रु {inv.totalAmount.toLocaleString("en-IN")}
                    </td>

                    {/* Paid Amount */}
                    <td className="py-3 px-4 text-right font-medium text-emerald-600 dark:text-emerald-400">
                      रु {inv.paidAmount.toLocaleString("en-IN")}
                    </td>

                    {/* Balance */}
                    <td className="py-3 px-4 text-right font-bold">
                      {inv.balanceAmount > 0 ? (
                        <span className="text-rose-600 dark:text-rose-400">
                          रु {inv.balanceAmount.toLocaleString("en-IN")}
                        </span>
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400 font-normal">रु ०</span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4">
                      {inv.status === "Paid" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-3 h-3" />
                          Paid
                        </span>
                      )}
                      {inv.status === "Pending" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                          <AlertCircle className="w-3 h-3" />
                          Unpaid
                        </span>
                      )}
                      {inv.status === "Partial" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                          <Clock className="w-3 h-3" />
                          Partial
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {inv.balanceAmount > 0 ? (
                          <button
                            onClick={() => openPaymentModal(inv)}
                            className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white font-medium text-[11px] transition-colors"
                          >
                            Collect Fee
                          </button>
                        ) : (
                          <button
                            onClick={() => setReceiptInvoice(inv)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium text-[11px] transition-colors"
                          >
                            <Printer className="w-3 h-3" />
                            <span>Slip</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Collect Fee Modal */}
      {activePaymentInvoice && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-xl relative animate-in fade-in duration-200">
            <button
              onClick={() => setActivePaymentInvoice(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              Collect School Fee (शुल्क संकलन)
            </h3>

            <div className="mt-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Student:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {activePaymentInvoice.studentName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Class & Roll:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {activePaymentInvoice.className} ({activePaymentInvoice.section}) • Roll {activePaymentInvoice.rollNo}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Invoice Month:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {activePaymentInvoice.monthBS} {activePaymentInvoice.yearBS} B.S.
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-1 mt-1">
                <span className="text-rose-700 dark:text-rose-400 font-semibold">Total Outstanding Due:</span>
                <span className="font-bold text-rose-700 dark:text-rose-400 text-sm">
                  रु {activePaymentInvoice.balanceAmount.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <form onSubmit={handleRecordPayment} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Payment Amount to Collect (रु) *
                </label>
                <input
                  required
                  type="number"
                  min="100"
                  max={activePaymentInvoice.balanceAmount}
                  value={payingAmount}
                  onChange={(e) => setPayingAmount(Number(e.target.value))}
                  className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Payment Method (भुक्तानी माध्यम) *
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  <option value="Cash">Cash (नगद)</option>
                  <option value="eSewa">eSewa (ई-सेवा)</option>
                  <option value="Khalti">Khalti (खल्ती)</option>
                  <option value="Bank Transfer">Bank Transfer / ConnectIPS</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Remarks / Receipt Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. Received from parent with thanks"
                  value={paymentRemarks}
                  onChange={(e) => setPaymentRemarks(e.target.value)}
                  className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActivePaymentInvoice(null)}
                  className="px-4 py-2 font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessingPayment}
                  className="px-4 py-2 font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg inline-flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isProcessingPayment ? "Recording..." : "Record & Print Slip"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Fee Receipt Slip */}
      {receiptInvoice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setReceiptInvoice(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 print:hidden"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Receipt Content - Styled as physical paper voucher */}
            <div id="printable-receipt" className="border border-slate-300 p-5 rounded-xl bg-white text-slate-900 shadow-sm">
              {/* Receipt Header */}
              <div className="text-center border-b border-slate-300 pb-3">
                <h2 className="font-bold text-base uppercase tracking-wide text-slate-900">
                  Himalayan Sec. English Boarding School
                </h2>
                <p className="text-[11px] text-slate-600">
                  Kathmandu, Bagmati, Nepal • Reg No: 27/012/0045
                </p>
                <div className="inline-block px-3 py-0.5 rounded-full bg-slate-100 text-[11px] font-bold uppercase mt-1 tracking-wider border border-slate-300">
                  Fee Payment Receipt (शुल्क रसिद)
                </div>
              </div>

              {/* Receipt Meta */}
              <div className="mt-3 grid grid-cols-2 text-[11px] gap-1 pb-3 border-b border-slate-200">
                <div>
                  <span className="text-slate-500">Receipt No: </span>
                  <strong className="font-mono text-slate-900">{receiptInvoice.receiptNo || "REC-2081-AUTO"}</strong>
                </div>
                <div className="text-right">
                  <span className="text-slate-500">Billing Month: </span>
                  <strong className="text-slate-900">{receiptInvoice.monthBS} {receiptInvoice.yearBS}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Student: </span>
                  <strong className="text-slate-900">{receiptInvoice.studentName}</strong> ({receiptInvoice.studentId})
                </div>
                <div className="text-right">
                  <span className="text-slate-500">Class & Roll: </span>
                  <strong className="text-slate-900">{receiptInvoice.className} ({receiptInvoice.section}) • Roll {receiptInvoice.rollNo}</strong>
                </div>
              </div>

              {/* Items Breakdown */}
              <table className="w-full text-[11px] mt-3 border-collapse">
                <thead>
                  <tr className="border-b border-slate-300 text-slate-600 text-left">
                    <th className="py-1">Fee Particulars</th>
                    <th className="py-1 text-right">Amount (NPR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {receiptInvoice.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-1 text-slate-700">{item.title}</td>
                      <td className="py-1 text-right font-medium text-slate-900">रु {item.amount.toLocaleString("en-IN")}</td>
                    </tr>
                  ))}
                  {receiptInvoice.discount > 0 && (
                    <tr className="text-emerald-700 font-medium">
                      <td className="py-1">Scholarship / Fee Concession</td>
                      <td className="py-1 text-right">- रु {receiptInvoice.discount.toLocaleString("en-IN")}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Totals */}
              <div className="mt-3 pt-2 border-t border-slate-300 text-xs space-y-1">
                <div className="flex justify-between font-semibold text-slate-800">
                  <span>Total Billed:</span>
                  <span>रु {receiptInvoice.totalAmount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Paid Amount ({receiptInvoice.paymentMethod || "Cash"}):</span>
                  <span>रु {receiptInvoice.paidAmount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-rose-700 font-semibold border-t border-slate-200 pt-1">
                  <span>Remaining Balance:</span>
                  <span>रु {receiptInvoice.balanceAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Signatures */}
              <div className="mt-8 pt-4 flex justify-between text-[10px] text-slate-500">
                <div className="text-center">
                  <div className="w-24 border-t border-slate-400 mb-1"></div>
                  <span>Student / Guardian</span>
                </div>
                <div className="text-center">
                  <div className="w-28 border-t border-slate-400 mb-1"></div>
                  <span>Accountant / Cashier</span>
                </div>
              </div>
            </div>

            {/* Print & Close Buttons */}
            <div className="mt-4 flex justify-end gap-2 print:hidden">
              <button
                onClick={() => setReceiptInvoice(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 text-xs font-medium bg-slate-900 hover:bg-slate-800 dark:bg-rose-600 dark:hover:bg-rose-700 text-white rounded-lg inline-flex items-center gap-1.5 shadow"
              >
                <Printer className="w-4 h-4" />
                <span>Print Fee Slip (प्रिन्ट गर्नुहोस्)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FeesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-slate-400">
          Loading fee management ledger...
        </div>
      }
    >
      <FeesContent />
    </Suspense>
  );
}
