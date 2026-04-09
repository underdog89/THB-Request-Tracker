import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FIELD_LABELS } from "@/lib/enums";
import { formatDate } from "@/lib/utils";
import type { StatusHistory } from "@prisma/client";

interface AuditLogProps {
  history: StatusHistory[];
}

export function AuditLog({ history }: AuditLogProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Change History</CardTitle>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">No changes recorded yet.</p>
        ) : (
          <div className="relative">
            <div className="absolute left-2 top-0 bottom-0 w-px bg-gray-100" />
            <div className="space-y-4 pl-7">
              {history.map((entry) => (
                <div key={entry.id} className="relative">
                  <div className="absolute -left-5 top-1.5 h-2 w-2 rounded-full bg-blue-400 ring-2 ring-white" />
                  <p className="text-xs text-gray-400 mb-0.5">
                    {formatDate(entry.changedAt)}
                    {entry.changedBy !== "System" && (
                      <span className="ml-2 font-medium text-gray-600">{entry.changedBy}</span>
                    )}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">{FIELD_LABELS[entry.field] ?? entry.field}</span>
                    {" changed from "}
                    <span className="font-medium text-gray-900">
                      {entry.oldValue ?? <em>empty</em>}
                    </span>
                    {" → "}
                    <span className="font-medium text-gray-900">
                      {entry.newValue ?? <em>empty</em>}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
