import React from 'react';
import { TrendingUp, AlertCircle } from 'lucide-react';

export const BorrowsTab: React.FC = () => {
  const mockBorrows = [
    {
      id: '1',
      asset: 'ETH',
      borrowed: 0.5,
      interestRate: 2.5,
      collateral: 1.2,
      utilization: 45.2,
    },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-6 px-4 py-3 text-[10px] text-white/40 uppercase font-bold border-b border-white/10">
        <span>Asset</span>
        <span className="text-right">Borrowed</span>
        <span className="text-right">Interest Rate</span>
        <span className="text-right">Collateral</span>
        <span className="text-right">Utilization</span>
        <span className="text-center">Action</span>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {mockBorrows.length === 0 ? (
          <div className="flex items-center justify-center h-full text-white/40 text-sm">
            No active borrows
          </div>
        ) : (
          mockBorrows.map((borrow) => (
            <div
              key={borrow.id}
              className="grid grid-cols-6 px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 items-center text-xs"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-[10px]">Ξ</div>
                <span className="font-bold text-white">{borrow.asset}</span>
              </div>
              <div className="text-right text-white/80">{borrow.borrowed}</div>
              <div className="text-right text-yellow-400 font-medium">{borrow.interestRate}%</div>
              <div className="text-right text-white/80">{borrow.collateral}</div>
              <div className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500"
                      style={{ width: `${borrow.utilization}%` }}
                    />
                  </div>
                  <span className="text-white/80 text-[10px]">{borrow.utilization}%</span>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <button className="px-3 py-1.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded text-[10px] font-bold hover:bg-blue-500/30 transition-colors">
                  Repay
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

