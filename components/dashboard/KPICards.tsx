interface Stats {
  total: number;
  live: number;
  pipeline: number;
  chargeableOpen: number;
  pendingCommercial: number;
}

interface KPICardsProps {
  stats: Stats;
}

const cards = [
  { label: "Total Items", key: "total" as const, color: "border-blue-200 bg-blue-50", textColor: "text-blue-700" },
  { label: "Live", key: "live" as const, color: "border-green-200 bg-green-50", textColor: "text-green-700" },
  { label: "In Pipeline", key: "pipeline" as const, color: "border-yellow-200 bg-yellow-50", textColor: "text-yellow-700" },
  { label: "Chargeable Open", key: "chargeableOpen" as const, color: "border-purple-200 bg-purple-50", textColor: "text-purple-700" },
  { label: "Pending Commercial Closure", key: "pendingCommercial" as const, color: "border-orange-200 bg-orange-50", textColor: "text-orange-700" },
];

export function KPICards({ stats }: KPICardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map(({ label, key, color, textColor }) => (
        <div
          key={key}
          className={`rounded-lg border p-4 ${color}`}
        >
          <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
          <p className={`text-2xl font-bold ${textColor}`}>{stats[key]}</p>
        </div>
      ))}
    </div>
  );
}
