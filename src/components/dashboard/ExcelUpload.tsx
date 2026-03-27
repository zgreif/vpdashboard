"use client";

import * as React from "react";
import { Upload } from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { MonthlyRow } from "@/types";

interface ExcelUploadProps {
  onUpload: (rows: MonthlyRow[]) => void;
}

export function ExcelUpload({ onUpload }: ExcelUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const buffer = new Uint8Array(ev.target?.result as ArrayBuffer);
        const workbook = XLSX.read(buffer, { type: "array" });

        const sheet = workbook.Sheets["Data"];
        if (!sheet) {
          toast.error("Sheet 'Data' not found", {
            description:
              "Your file needs a sheet named exactly 'Data' with columns: Month, Sales Orders, Revenue, Gross Profit, EBITDA",
          });
          return;
        }

        const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);
        const rows: MonthlyRow[] = json
          .map((row) => ({
            month: String(row["Month"] ?? ""),
            salesOrders: Number(row["Sales Orders"] ?? 0),
            revenue: Number(row["Revenue"] ?? 0),
            grossProfit: Number(row["Gross Profit"] ?? 0),
            ebitda: Number(row["EBITDA"] ?? 0),
          }))
          .filter((r) => r.month.trim() !== "");

        if (rows.length === 0) {
          toast.error("No data found", {
            description:
              "The 'Data' sheet must have at least one row with a Month value.",
          });
          return;
        }

        onUpload(rows);
        toast.success(`Loaded "${file.name}"`, {
          description: `${rows.length} month${rows.length === 1 ? "" : "s"} of data imported successfully.`,
        });
      } catch {
        toast.error("Failed to parse file", {
          description:
            "Expected an Excel file (.xlsx) with a sheet named 'Data' and columns: Month, Sales Orders, Revenue, Gross Profit, EBITDA",
        });
      }

      // Reset so the same file can be re-uploaded
      if (inputRef.current) inputRef.current.value = "";
    };

    reader.readAsArrayBuffer(file);
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls"
        className="sr-only"
        onChange={handleFile}
        aria-label="Upload Excel file"
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() => inputRef.current?.click()}
        className="gap-2 min-h-[44px]"
      >
        <Upload className="h-4 w-4" />
        Upload Excel
      </Button>
    </>
  );
}
