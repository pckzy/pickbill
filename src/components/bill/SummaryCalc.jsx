import { useState } from "react";

export default function SummaryCalc({ items, allParticipants, onFinalize }) {
  // State สำหรับเก็บชื่อบิล
  const [billName, setBillName] = useState("");

  const totalAmount = items.reduce((sum, item) => sum + item.price, 0);

  const breakdown = allParticipants.reduce((acc, person) => {
    acc[person] = 0;
    return acc;
  }, {});

  items.forEach(item => {
    const pCount = item.participants.length;
    if (pCount > 0) {
      const splitPrice = Math.ceil(item.price / pCount);
      item.participants.forEach(p => {
        if (breakdown[p] !== undefined) breakdown[p] += splitPrice;
      });
    }
  });

  const activeBreakdown = Object.entries(breakdown).filter(([_, amount]) => amount > 0);

  const handleFinalize = () => {
    // กำหนดชื่อ Default ถ้าไม่ได้กรอก
    const finalName = billName.trim() === "" ? "Untitled Session" : billName;
    onFinalize(finalName);
  };

  return (
    <div className="bg-surface-container border border-outline-variant rounded-xl p-lg sticky top-lg">
      <div className="flex items-center gap-sm mb-lg border-b border-outline-variant pb-sm">
        <span className="font-mono-code text-mono-code text-outline">03.</span>
        <h2 className="font-headline-sm text-headline-sm text-on-surface">// SUMMARY_CALC</h2>
      </div>

      <div className="mb-xl text-center pt-sm border-outline-variant/50">
        <div className="font-mono-label text-mono-label text-outline mb-xs">TOTAL_AMOUNT</div>
        <div className="font-display-lg text-display-lg text-secondary drop-shadow-[0_0_12px_rgba(68,226,205,0.2)]">
          {totalAmount.toFixed(2)} ฿
        </div>
      </div>

      <div className="space-y-sm">
        <div className="font-mono-code text-mono-code text-primary mb-sm">// BREAKDOWN</div>
        {activeBreakdown.length === 0 ? (
          <div className="text-outline text-mono-label text-center py-md">NO_DATA</div>
        ) : (
          activeBreakdown.map(([person, amount]) => (
            <div key={person} className="flex justify-between items-center border-b border-outline-variant border-dashed pb-xs">
              <span className="font-mono-label text-mono-label text-on-surface">{person}</span>
              <span className="font-mono-code text-mono-code text-on-surface-variant">{amount.toFixed(2)} ฿</span>
            </div>
          ))
        )}
      </div>

      {/* ช่องสำหรับใส่ชื่อบิล */}
      <div className="mt-lg ">
        <label className="font-mono-code text-mono-code text-primary block mb-sm uppercase">// BILL_NAME</label>
        <input
          type="text"
          className="w-full bg-surface-dim border border-outline-variant rounded px-sm py-sm text-body-md text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary font-mono-code transition-all placeholder:text-outline-variant"
          placeholder="e.g. The Moon"
          value={billName}
          onChange={(e) => setBillName(e.target.value)}
        />
      </div>

      <button
        onClick={handleFinalize}
        disabled={items.length === 0}
        className="w-full mt-xl bg-secondary text-on-secondary font-mono-label text-headline-sm py-md rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="material-symbols-outlined">send</span>
        FINALIZE_BILL
      </button>
    </div>
  );
}