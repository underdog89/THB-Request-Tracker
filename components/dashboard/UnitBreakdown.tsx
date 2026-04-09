"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface UnitBreakdownProps {
  data: { name: string; count: number }[];
  chargeableData: { name: string; count: number }[];
}

const COLORS = [
  "#3b82f6","#8b5cf6","#06b6d4","#10b981","#f59e0b","#ef4444","#ec4899",
];

export function UnitBreakdown({ data, chargeableData }: UnitBreakdownProps) {
  const [chargeableOnly, setChargeableOnly] = useState(false);
  const active = chargeableOnly ? chargeableData : data;

  if (data.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Breakdown by Unit / Hospital</CardTitle>
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
        {active.length === 0 ? (
          <p className="text-sm text-gray-400 py-8 text-center">No chargeable items by unit</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={active} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {active.map((_, i) => (
                  <Cell key={i} fill={chargeableOnly ? "#22c55e" : COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
