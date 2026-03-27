"use client";

import * as React from "react";
import { CustomerBarChart } from "@/components/charts/CustomerBarChart";
import type { CustomerRow } from "@/types";
import type { ViewMode } from "@/lib/calculations";

interface CustomersTabProps {
  data: CustomerRow[];
  mode: ViewMode;
}

export function CustomersTab({ data, mode }: CustomersTabProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <CustomerBarChart
        data={data}
        metric="revenue"
        mode={mode}
        title="Revenue by Customer"
      />
      <CustomerBarChart
        data={data}
        metric="orders"
        mode={mode}
        title="Orders by Customer"
      />
    </div>
  );
}
