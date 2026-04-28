import type { ReactNode } from "react";

interface DataTableProps {
  head: ReactNode;
  children: ReactNode;
  className?: string;
}

const DataTable = ({ head, children, className = "" }: DataTableProps) => (
  <div className={`surface-card overflow-hidden ${className}`}>
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-white/5 text-ink-300 uppercase tracking-wider text-xs">
          {head}
        </thead>
        <tbody className="divide-y divide-white/5">{children}</tbody>
      </table>
    </div>
  </div>
);

export default DataTable;