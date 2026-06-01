"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

interface Props {
  onImportSuccess: () => void;
}

export default function ImportExportMenu({ onImportSuccess }: Props) {
  const [open, setOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setImporting(true);

    const toastId = toast.loading("Importing birthdays…");

    try {
      const res = await fetch("/api/birthdays/import", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Import failed", { id: toastId });
        return;
      }

      toast.success(
        `Imported ${data.imported} birthdays${data.skipped > 0 ? `, skipped ${data.skipped}` : ""}`,
        { id: toastId, duration: 4000 },
      );

      if (data.errors?.length > 0) {
        console.warn("Import warnings:", data.errors);
      }

      onImportSuccess();
    } catch {
      toast.error("Import failed", { id: toastId });
    } finally {
      setImporting(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleExport = async (format: "csv" | "excel" | "pdf") => {
    setOpen(false);
    const toastId = toast.loading(`Exporting as ${format.toUpperCase()}…`);

    try {
      const url =
        format === "pdf"
          ? "/api/birthdays/export-pdf"
          : `/api/birthdays/export?format=${format}`;

      const res = await fetch(url);
      if (!res.ok) {
        toast.error("Export failed", { id: toastId });
        return;
      }

      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download =
        format === "pdf"
          ? "pingwish-birthday-book.pdf"
          : format === "excel"
            ? "pingwish-birthdays.xlsx"
            : "pingwish-birthdays.csv";
      link.click();
      URL.revokeObjectURL(link.href);

      toast.success("Downloaded!", { id: toastId });
    } catch {
      toast.error("Export failed", { id: toastId });
    }
  };

  const triggerFileInput = () => {
    setOpen(false);
    // Delay so dropdown exit animation doesn't swallow the file dialog
    setTimeout(() => fileRef.current?.click(), 150);
  };

  const downloadTemplate = () => {
    setOpen(false);
    const csv =
      "Name,Date of Birth,Email,Reminder\nAlex Johnson,1995-06-15,alex@example.com,true\nPriya Sharma,2000-11-22,priya@gmail.com,true\n";
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "pingwish-template.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="relative">
      {/* Hidden file input — outside dropdown so it's always mounted */}
      <input
        ref={fileRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        className="hidden"
        onChange={handleImport}
      />

      {/* Trigger button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setOpen((o) => !o)}
        disabled={importing}
        className="flex items-center gap-2 text-sm font-display font-bold px-4 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-brand-300 dark:hover:border-brand-700 transition-all shadow-sm disabled:opacity-60"
      >
        {importing ? (
          <span className="inline-block w-4 h-4 border-2 border-neutral-300 border-t-brand-500 rounded-full animate-spin" />
        ) : (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        )}
        Import / Export
        <svg
          className={`w-3 h-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />

            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-60 z-20 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl overflow-hidden"
            >
              {/* ── Import ── */}
              <div className="px-3 pt-3 pb-2">
                <p className="text-xs font-display font-bold tracking-wider uppercase text-neutral-400 dark:text-neutral-500 px-1 mb-2">
                  Import
                </p>

                {/* Upload file — THE ACTUAL IMPORT BUTTON */}
                <button
                  onClick={triggerFileInput}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-left"
                >
                  <span className="text-lg">📥</span>
                  <div>
                    <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                      Upload CSV or Excel
                    </p>
                    <p className="text-xs text-neutral-400">.csv, .xlsx, .xls</p>
                  </div>
                </button>

                {/* Download template */}
                <button
                  onClick={downloadTemplate}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-left"
                >
                  <span className="text-base">📋</span>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                    Download template first
                  </p>
                </button>
              </div>

              <div className="h-px bg-neutral-100 dark:bg-neutral-800 mx-3" />

              {/* ── Export ── */}
              <div className="px-3 pt-2 pb-3">
                <p className="text-xs font-display font-bold tracking-wider uppercase text-neutral-400 dark:text-neutral-500 px-1 mb-2">
                  Export
                </p>
                <button
                  onClick={() => handleExport("csv")}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-left"
                >
                  <span className="text-lg">📄</span>
                  <div>
                    <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">CSV</p>
                    <p className="text-xs text-neutral-400">Spreadsheet compatible</p>
                  </div>
                </button>
                <button
                  onClick={() => handleExport("excel")}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-left"
                >
                  <span className="text-lg">📊</span>
                  <div>
                    <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Excel</p>
                    <p className="text-xs text-neutral-400">.xlsx format</p>
                  </div>
                </button>
                <button
                  onClick={() => handleExport("pdf")}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-left"
                >
                  <span className="text-lg">🎂</span>
                  <div>
                    <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Birthday Book</p>
                    <p className="text-xs text-neutral-400">Designed PDF</p>
                  </div>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}