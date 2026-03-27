"use client";

import * as React from "react";
import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { MonthlyRow } from "@/types";

interface DataEditorModalProps {
  data: MonthlyRow[];
  onSave: (rows: MonthlyRow[]) => void;
  onReset: () => void;
  trigger: React.ReactNode;
}

export function DataEditorModal({ data, onSave, onReset, trigger }: DataEditorModalProps) {
  const [open, setOpen] = React.useState(false);
  const [rows, setRows] = React.useState<MonthlyRow[]>(data);

  // Sync internal state whenever modal opens
  React.useEffect(() => {
    if (open) setRows(data);
  }, [open, data]);

  function updateCell(idx: number, key: keyof MonthlyRow, raw: string) {
    setRows((prev) =>
      prev.map((row, i) =>
        i === idx ? { ...row, [key]: key === "month" ? raw : parseFloat(raw) || 0 } : row
      )
    );
  }

  function addRow() {
    setRows((prev) => [
      ...prev,
      { month: "", salesOrders: 0, revenue: 0, grossProfit: 0, ebitda: 0 },
    ]);
  }

  function deleteRow(idx: number) {
    setRows((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleSave() {
    onSave(rows.filter((r) => r.month.trim() !== ""));
    setOpen(false);
  }

  function handleReset() {
    onReset();
    setOpen(false);
  }

  const numericKeys = ["salesOrders", "revenue", "grossProfit", "ebitda"] as const;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Data</DialogTitle>
        </DialogHeader>

        {/* Scrollable table area */}
        <div className="flex-1 overflow-auto -mx-6 px-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[120px]">Month</TableHead>
                <TableHead className="min-w-[120px]">Sales Orders ($M)</TableHead>
                <TableHead className="min-w-[110px]">Revenue ($M)</TableHead>
                <TableHead className="min-w-[120px]">Gross Profit ($M)</TableHead>
                <TableHead className="min-w-[110px]">EBITDA ($M)</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell className="p-1.5">
                    <Input
                      value={row.month}
                      onChange={(e) => updateCell(idx, "month", e.target.value)}
                      placeholder="Jan 2024"
                      className="h-9"
                    />
                  </TableCell>
                  {numericKeys.map((key) => (
                    <TableCell key={key} className="p-1.5">
                      <Input
                        type="number"
                        value={row[key]}
                        onChange={(e) => updateCell(idx, key, e.target.value)}
                        step="0.01"
                        min="0"
                        className="h-9"
                      />
                    </TableCell>
                  ))}
                  <TableCell className="p-1.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-muted-foreground hover:text-destructive min-h-[44px] min-w-[44px]"
                      onClick={() => deleteRow(idx)}
                      aria-label="Delete row"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="pt-1">
          <Button variant="outline" size="sm" onClick={addRow} className="gap-2">
            <Plus className="h-4 w-4" />
            Add month
          </Button>
        </div>

        <DialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:justify-between sm:gap-0 border-t pt-4 mt-2">
          <Button
            variant="ghost"
            onClick={handleReset}
            className="text-muted-foreground hover:text-foreground"
          >
            Reset to sample data
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save changes</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
