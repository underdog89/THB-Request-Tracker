"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ChargeablePieProps {
  data: { name: string; count: number }[];
}

const COLORS: Record<string, string> = {
  Yes: "#22c55e",
  No: "#94a3b8",
  TBD: "#f59e0b",
};

export function ChargeablePie({ data }: ChargeablePieProps) {
  const chartData = data.map((d) => ({ name: d.name, value: d.count }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chargeable Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
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
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[entry.name] ?? "#6366f1"}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [value, "Count"]} />
            <Legend iconType="circle" iconSize={10} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
