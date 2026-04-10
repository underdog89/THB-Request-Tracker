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

interface TypeLimitChartProps {
  typeName: string;
  unitData: { name: string; count: number }[];
  contractData: { name: string; count: number }[];
}

const COLORS = [
  "#3b82f6","#8b5cf6","#06b6d4","#10b981","#f59e0b","#ef4444","#ec4899",
];

export function TypeLimitChart({ typeName, unitData, contractData }: TypeLimitChartProps) {
  const [view, setView] = useState<"unit" | "contract">("unit");

  const hasUnit = unitData.length > 0;
  const hasContract = contractData.length > 0;

  if (!hasUnit && !hasContract) return null;

  const activeData = view === "unit" ? unitData : contractData;
  const activeLabel = view === "unit" ? "Unit" : "Contract";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{typeName} — Actual Count</CardTitle>
          {hasUnit && hasContract && (
            <div className="flex items-center gap-1 rounded-md border border-gray-200 bg-gray-50 p-0.5">
              <button
                onClick={() => setView("unit")}
                className={cn(
                  "px-2 py-1 text-xs rounded transition-colors",
                  view === "unit" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                )}
              >
                By Unit
              </button>
              <button
                onClick={() => setView("contract")}
                className={cn(
                  "px-2 py-1 text-xs rounded transition-colors",
                  view === "contract" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                )}
              >
                By Contract
              </button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {activeData.length === 0 ? (
          <p className="text-sm text-gray-400 py-8 text-center">No {typeName} items by {activeLabel.toLowerCase()}</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={activeData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {activeData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
