
import React from "react";

export default function ProgressBar({ step, total }: { step: number; total: number }) {
  const percent = Math.round((step / total) * 100);
  return (
    <div className="w-full bg-gray-200 dark:bg-blue-950/60 h-2 mb-0">
      <div
        className="bg-gradient-to-r from-blue-400 via-blue-600 to-indigo-500 dark:from-blue-900 dark:via-blue-700 dark:to-indigo-600 h-2 transition-all"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
