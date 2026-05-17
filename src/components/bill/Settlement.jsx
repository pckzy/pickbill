import { useState, useRef, useEffect } from "react";

export default function Settlement() {
  const [billData, setBillData] = useState(() => {
    const savedData = localStorage.getItem("historyData");
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    if (billData) {
      localStorage.setItem("historyData", JSON.stringify(billData));
    } else {
      localStorage.removeItem("historyData");
    }
  }, [billData]);

  const fileInputRef = useRef(null);

  const toggleStatus = (index) => {
    const newData = { ...billData };
    newData.participants[index].isSettled = !newData.participants[index].isSettled;
    setBillData(newData);
  };

  // 1. แก้ไขฟังก์ชัน Import ให้รองรับข้อมูลแบบเต็ม
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          
          // ตรวจสอบโครงสร้างไฟล์แบบเก่า (ที่มีแต่คนจ่ายแล้ว) หรือแบบใหม่ (มีทุกคน)
          if (data.exportType === "Settled_Only") {
             // สำหรับไฟล์ที่เผลอ export ไปก่อนหน้านี้
            const normalizedData = {
              billName: data.billName,
              id: data.id,
              date: data.originalDate || "N/A",
              totalAmount: data.totalSettledAmount || 0,
              participants: (data.settledParticipants || []).map(p => ({
                ...p,
                isSettled: true 
              }))
            };
            setBillData(normalizedData);
          } else if (data.participants) {
            // สำหรับโครงสร้างมาตรฐาน (มีรายชื่อทุกคนและมีสถานะ isSettled บอก)
            setBillData(data);
          } else {
            alert("รูปแบบไฟล์ไม่ถูกต้อง");
          }
        } catch (error) {
          console.error("JSON Parsing Error:", error);
          alert("ไฟล์ JSON ไม่ถูกต้อง หรือโครงสร้างเสียหาย");
        }
      };
      reader.readAsText(file);
    }
  };

  // 2. แก้ไขฟังก์ชัน Export ให้ส่งออก "ทุกคน" พร้อมสถานะปัจจุบัน
  const handleExportSettled = () => {
    if (!billData) return;

    // ส่งออกข้อมูลทั้งหมดตาม State ปัจจุบัน (ไม่ใช้ filter ตัดใครออกแล้ว)
    const exportPayload = {
      billName: billData.billName,
      id: billData.id,
      date: billData.date,
      totalAmount: billData.totalAmount,
      participants: billData.participants // ส่งไปทุกคนเลย
    };

    // สร้าง Timestamp (เช่น 20260517_224219)
    const now = new Date();
    const timestamp = now.getFullYear().toString() + 
                     (now.getMonth() + 1).toString().padStart(2, '0') + 
                     now.getDate().toString().padStart(2, '0') + "_" + 
                     now.getHours().toString().padStart(2, '0') + 
                     now.getMinutes().toString().padStart(2, '0') + 
                     now.getSeconds().toString().padStart(2, '0');

    // จัดรูปฟอร์แมตชื่อไฟล์
    const safeBillName = billData.billName.replace(/\s+/g, '_');
    const fileName = `${safeBillName}_Settled_${timestamp}.json`;

    // สร้างลิงก์และสั่งดาวน์โหลด
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", fileName);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  if (!billData) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh] gap-md">
        <span className="material-symbols-outlined text-[64px] text-outline-variant">upload_file</span>
        <h2 className="font-headline-lg text-on-surface">Import Bill Data</h2>
        <p className="font-mono-code text-outline text-center max-w-sm">Upload a .json file exported from your receipt to manage settlements.</p>
        
        <input type="file" accept=".json" className="hidden" ref={fileInputRef} onChange={handleImport} />
        
        <button 
          onClick={() => fileInputRef.current.click()}
          className="mt-md bg-secondary text-on-secondary px-lg py-sm rounded font-mono-label uppercase tracking-widest font-bold flex items-center gap-sm shadow-[0_0_15px_rgba(68,226,205,0.3)] hover:bg-secondary-fixed transition-colors"
        >
          <span className="material-symbols-outlined">file_open</span> SELECT JSON FILE
        </button>
      </div>
    );
  }

  // ป้องกันการระเบิดด้วย Optional Chaining (?.)
  const settledCount = billData.participants?.filter(p => p.isSettled).length || 0;
  const totalCount = billData.participants?.length || 0;
  const isAllSettled = totalCount > 0 && settledCount === totalCount;

  return (
    <div className="max-w-4xl mx-auto w-full">
      {/* Context Header */}
      <div className="mb-xl">
        <span className="font-mono-code text-mono-code text-secondary block mb-xs">// INVOICE DETAILS</span>
        <h2 className="font-headline-lg text-headline-lg text-on-surface">{billData.billName}</h2>
        <div className="flex items-center gap-md mt-sm border-b border-outline-variant pb-md">
          <span className="font-mono-code text-mono-code text-outline bg-surface-container-highest px-sm py-xs rounded">ID: {billData.id}</span>
          <span className="font-mono-code text-mono-code text-outline">DATE: {billData.date}</span>
        </div>
      </div>

      {/* Hero Amount */}
      <div className="bg-surface border border-outline-variant p-xl rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-lg hover:bg-surface-container-high transition-colors mb-xl">
        <div>
          <p className="font-mono-label text-mono-label text-primary uppercase tracking-widest">// TOTAL BILL AMOUNT</p>
          <p className="font-display-lg text-display-lg text-secondary mt-sm tracking-tighter">{billData.totalAmount.toFixed(2)} ฿</p>
        </div>
        <div className={`flex items-center gap-sm px-md py-sm border border-outline-variant rounded bg-surface-container-highest transition-colors ${isAllSettled ? 'border-secondary bg-secondary/10' : ''}`}>
          <div className={`w-3 h-3 rounded-full shadow-[0_0_12px_currentColor] ${isAllSettled ? 'bg-secondary text-secondary' : 'bg-tertiary text-tertiary'}`}></div>
          <span className={`font-mono-label text-mono-label uppercase tracking-widest ${isAllSettled ? 'text-secondary' : 'text-tertiary'}`}>
            {isAllSettled ? "FULLY SETTLED" : `PARTIALLY PAID (${settledCount}/${totalCount})`}
          </span>
        </div>
      </div>

      {/* Participant List Section */}
      <div className="mb-xl">
        <p className="font-mono-label text-mono-label text-outline mb-md">01. // PARTICIPANT SETTLEMENT</p>
        <div className="bg-surface border border-outline-variant rounded flex flex-col divide-y divide-outline-variant">
          
          {billData.participants?.map((p, index) => (
            <div 
              key={index}
              onClick={() => toggleStatus(index)}
              className={`flex items-center justify-between p-md transition-colors cursor-pointer group gap-md ${
                p.isSettled ? 'bg-surface-container-low' : 'hover:bg-surface-container-low'
              }`}
            >
              <div className="flex items-center gap-md flex-1 min-w-0">
                <div 
                  className={`w-6 h-6 shrink-0 border-2 rounded flex items-center justify-center transition-all ${
                    p.isSettled ? 'border-outline bg-outline' : 'border-outline-variant bg-surface-container-lowest group-hover:border-primary'
                  }`}
                >
                  {p.isSettled && <span className="material-symbols-outlined text-[16px] text-background">check</span>}
                </div>
                <span className={`font-headline-sm text-headline-sm truncate transition-all ${
                  p.isSettled ? 'text-outline line-through' : 'text-on-surface'
                }`}>
                  {p.name}
                </span>
              </div>

              <div className={`flex flex-col items-end shrink-0 transition-opacity ${p.isSettled ? 'opacity-50' : ''}`}>
                <p className={`font-mono-code text-mono-code ${p.isSettled ? 'text-outline line-through' : 'text-secondary'}`}>
                  {p.amount.toFixed(2)} ฿
                </p>
                <p className={`font-mono-label text-mono-label mt-xs ${p.isSettled ? 'text-outline' : 'text-tertiary-container'}`}>
                  {p.isSettled ? "// SETTLED" : "// PENDING"}
                </p>
              </div>
            </div>
          ))}

        </div>
      </div>
      
      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-md pt-lg border-t border-outline-variant mt-xl">
        <button
          onClick={() => setBillData(null)}
          className="flex-1 px-lg py-md border border-outline-variant text-outline font-mono-label text-mono-label uppercase tracking-widest hover:bg-error-container hover:text-error hover:border-error transition-colors flex items-center justify-center gap-sm bg-transparent rounded"
        >
          <span className="material-symbols-outlined text-[20px]">delete</span>
          Clear Data
        </button>
        <button
          onClick={handleExportSettled}
          className="flex-1 px-lg py-md bg-primary text-background font-mono-label text-mono-label uppercase tracking-widest hover:bg-primary-fixed-dim transition-colors flex items-center justify-center gap-sm border-none shadow-none rounded"
        >
          <span className="material-symbols-outlined text-[20px]">download</span>
          Export Settled
        </button>
      </div>
    </div>
  );
}