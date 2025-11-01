import { ChevronRight } from "lucide-react";

interface TransactionSummaryProps {
  spendAmount: string;
  spendDescription?: string;
  receiveAmount: string;
  receiveDescription?: string;
  feeAmount: string;
  showViewSources?: boolean;
  showViewBreakdown?: boolean;
}

export function TransactionSummary({
  spendAmount,
  spendDescription = "1 asset on 3 chains",
  receiveAmount,
  receiveDescription = "On hyperliquid perps",
  feeAmount,
  showViewSources = true,
  showViewBreakdown = true,
}: TransactionSummaryProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className="flex flex-col w-40">
          <h3 className="text-sm font-medium">You spend</h3>
          <p className="text-xs text-white/50">{spendDescription}</p>
        </div>
        <div className="flex flex-col items-end">
          <h3 className="text-sm font-medium">{spendAmount}</h3>
          {showViewSources && (
            <button className="text-xs text-white/50 flex items-center gap-1 transition-colors duration-200 ease hover:text-white/80 group">
              View Sources
              <ChevronRight className="w-2 h-2 text-white/50 transition-all duration-200 ease group-hover:text-white/80 group-hover:translate-x-0.5 relative" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-start justify-between">
        <div className="flex flex-col w-40">
          <h3 className="text-sm font-medium">You receive</h3>
        </div>
        <div className="flex flex-col items-end">
          <h3 className="text-sm font-medium">{receiveAmount}</h3>
          <p className="text-xs text-white/50 flex items-center gap-1">
            {receiveDescription}
          </p>
        </div>
      </div>

      <div className="flex items-start justify-between">
        <div className="flex flex-col w-40">
          <h3 className="text-sm font-medium">Total Fees</h3>
        </div>
        <div className="flex flex-col items-end">
          <h3 className="text-sm font-medium">{feeAmount}</h3>
          {showViewBreakdown && (
            <button className="text-xs text-white/50 flex items-center gap-1 transition-colors duration-200 ease hover:text-white/80 group">
              View breakdown
              <ChevronRight className="w-2 h-2 text-white/50 transition-all duration-200 ease group-hover:text-white/80 group-hover:translate-x-0.5 relative" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}