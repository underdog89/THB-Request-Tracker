"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { COMMERCIAL_STAGE_OPTIONS } from "@/lib/enums";

interface CommercialFunnelProps {
  data: { name: string; count: number }[];
}

const STAGE_COLORS = [
  "#e2e8f0",
  "#fde68a",
  "#93c5fd",
  "#c4b5fd",
  "#a5b4fc",
  "#6ee7b7",
  "#94a3b8",
];

export function CommercialFunnel({ data }: CommercialFunnelProps) {
  // Sort by stage order
  const stageIndex = (name: string) => COMMERCIAL_STAGE_OPTIONS.indexOf(name);
  const sorted = [...data].sort((a, b) => stageIndex(a.name) - stageIndex(b.name));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Commercial Stage Funnel (Chargeable Items)</CardTitle>
      </CardHeader>
      <CardContent>
        {sorted.length === 0 ? (
          <p className="text-sm text-gray-400 py-8 text-center">No chargeable items yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={sorted}
              layout="vertical"
              margin={{ top: 4, right: 8, left: 8, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={130} />
              <Tooltip />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {sorted.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={STAGE_COLORS[index % STAGE_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
