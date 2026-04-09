"use client";

import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ContractBreakdownProps {
  data: { name: string; count: number }[];
  chargeableData: { name: string; count: number }[];
}

const COLORS = ["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];
const CHARGEABLE_COLORS = ["#22c55e", "#16a34a", "#4ade80", "#86efac", "#bbf7d0"];

export function ContractBreakdown({ data, chargeableData }: ContractBreakdownProps) {
  const [chargeableOnly, setChargeableOnly] = useState(false);
  const active = chargeableOnly ? chargeableData : data;
  const colors = chargeableOnly ? CHARGEABLE_COLORS : COLORS;

  if (data.length === 0) return null;

  const chartData = active.map((d) => ({ name: d.name, value: d.count }));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Breakdown by Contract</CardTitle>
          <div className="flex items-center gap-1 rounded-md border border-gray-200 bg-gray-50 p-0.5">
            <button
              onClick={() => setChargeableOnly(false)}
              className={cn(
                "px-2 py-1 text-xs rounded transition-colors",
                !chargeableOnly ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              All
            </button>
            <button
              onClick={() => setChargeableOnly(true)}
              className={cn(
                "px-2 py-1 text-xs rounded transition-colors",
                chargeableOnly ? "bg-white text-green-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              Chargeable only
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="text-sm text-gray-400 py-8 text-center">No chargeable items by contract</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={colors[i % colors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [v, "Items"]} />
              <Legend iconType="circle" iconSize={10} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
