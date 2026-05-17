import { useState, useMemo, useRef, useEffect } from "react";
import html2canvas from "html2canvas";

export default function Receipt({ billName, items, allParticipants, onBack }) {
  const receiptRef = useRef(null);
  const fileInputRef = useRef(null); // Ref สำหรับซ่อนปุ่มอัปโหลดไฟล์

  // State สำหรับเก็บรูปภาพ QR Code ที่ผู้ใช้อัปโหลด
  const [customQrImage, setCustomQrImage] = useState(() => {
    return localStorage.getItem("splitHarmony_qrImage") || null;
  });
  const [isImageReady, setIsImageReady] = useState(true);

  useEffect(() => {
    if (customQrImage) {
      localStorage.setItem("splitHarmony_qrImage", customQrImage);
    } else {
      localStorage.removeItem("splitHarmony_qrImage"); // ลบออกถ้าไม่มีรูป
    }
  }, [customQrImage]);

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  }).toUpperCase();

  const txnId = useMemo(() => "TXN-" + Math.random().toString(36).substring(2, 7).toUpperCase(), []);

  const { totalAmount, activeBreakdown } = useMemo(() => {
    let total = 0;
    const breakdown = allParticipants.reduce((acc, p) => ({ ...acc, [p]: 0 }), {});

    items.forEach(item => {
      total += item.price;
      const pCount = item.participants.length;
      if (pCount > 0) {
        const splitPrice = Math.ceil(item.price / pCount);
        item.participants.forEach(p => {
          if (breakdown[p] !== undefined) breakdown[p] += splitPrice;
        });
      }
    });

    return {
      totalAmount: total,
      activeBreakdown: Object.entries(breakdown).filter(([_, amount]) => amount > 0)
    };
  }, [items, allParticipants]);

  // ฟังก์ชันจัดการเมื่อผู้ใช้เลือกไฟล์รูป (บีบอัดก่อนเซฟ)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsImageReady(false);

    const reader = new FileReader();
    
    reader.onload = (event) => {
      const img = new Image();
      
      img.onload = () => {
        // สร้าง Canvas เพื่อย่อขนาดรูปภาพ
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 600; // ย่อให้ขนาดไม่เกิน 600px 
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // บีบอัดเป็น JPEG (คุณภาพ 80%)
        // ทำให้ไฟล์เล็กลงจาก 5MB เหลือแค่ไม่กี่ KB
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);

        setCustomQrImage(compressedBase64);
        setIsImageReady(true);
      };

      img.onerror = () => {
        setIsImageReady(true); // ปลดล็อคถ้าโหลดรูปไม่ขึ้น
      };

      img.src = event.target.result;
    };

    reader.readAsDataURL(file);
    e.target.value = ''; // เคลียร์ input 
  };

  const handleSaveImage = async () => {
    if (receiptRef.current === null) return;

    try {
      // ใช้ html2canvas แทน html-to-image
      const canvas = await html2canvas(receiptRef.current, {
        backgroundColor: '#11141a', // สีพื้นหลังใบเสร็จ
        scale: 2,                   // คูณ 2 ให้ภาพคมชัดขึ้น (รองรับจอ Retina)
        useCORS: true,              // อนุญาตให้โหลดรูปข้ามโดเมนได้ (กันบัคจอดำ)
        logging: false,             // ปิด console.log ของไลบรารี
      });

      // แปลง Canvas เป็น Base64 รูปภาพ PNG
      const dataUrl = canvas.toDataURL('image/png');
      
      // สร้างปุ่มดาวน์โหลดจำลองแล้วกด
      const link = document.createElement('a');
      link.download = `${billName.replace(/\s+/g, '_')}_receipt.png`;
      link.href = dataUrl;
      link.click();
      
    } catch (err) {
      console.error('Could not export receipt image:', err);
    }
  };

  const handleExportData = () => {
    const checkMySelf = (name) => name === 'Me' ? true : false;

    const exportPayload = {
      billName: billName || "Untitled Bill",
      id: txnId,
      date: currentDate,
      totalAmount: totalAmount,
      participants: activeBreakdown.map(([name, amount]) => ({
        name: name,
        amount: amount,
        isSettled: checkMySelf(name),
      }))
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${billName.replace(/\s+/g, '_')}_data.json`);
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center h-full min-h-[80vh]">
      <div className="flex flex-col items-center w-full max-w-[400px] gap-lg">

        <div className="flex w-full justify-between items-end mb-sm">
          <div>
            <span className="font-mono-label text-mono-label text-secondary uppercase block mb-xs">// EXPORT</span>
            <h1 className="font-headline-lg text-headline-lg text-on-surface">Receipt View</h1>
          </div>
          <div className="flex gap-xs">
            <button onClick={onBack} className="bg-surface-variant text-on-surface-variant px-md py-sm rounded font-mono-label text-mono-label hover:bg-surface-container-highest transition-colors">
              BACK
            </button>
          </div>
        </div>

        <div ref={receiptRef} className="w-full bg-[#11141a] border border-outline-variant rounded-xl overflow-hidden relative shadow-2xl flex flex-col" id="receipt-card">

          {/* Header */}
          <div className="p-lg border-b border-outline-variant bg-surface-container-low flex flex-col items-center text-center">
            <span className="font-mono-code text-mono-code text-primary mb-sm">PayGuDuay_Receipt</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs truncate w-full px-4">
              {billName || "Untitled Bill"}
            </h2>
            <p className="font-mono-label text-mono-label text-on-surface-variant">{currentDate} // ID: {txnId}</p>
          </div>

          {/* Body */}
          <div className="p-lg flex flex-col gap-md bg-surface-container-lowest">
            <div className="flex justify-between items-center border-b border-outline-variant/50 pb-sm">
              <span className="font-mono-label text-mono-label text-on-surface-variant uppercase tracking-widest">Participant</span>
              <span className="font-mono-label text-mono-label text-on-surface-variant uppercase tracking-widest">Amount</span>
            </div>

            {activeBreakdown.map(([person, amount]) => (
              <div key={person} className="flex justify-between items-center">
                <span className="font-body-md text-body-md text-on-surface">{person}</span>
                <span className="font-mono-code text-mono-code text-secondary">{amount.toFixed(2)} ฿</span>
              </div>
            ))}

            <div className="border-t border-dashed border-outline-variant mt-sm pt-md flex justify-between items-center">
              <span className="font-headline-sm text-headline-sm text-on-surface">Total Bill</span>
              <span className="font-mono-code text-mono-code text-primary text-lg">{totalAmount.toFixed(2)} ฿</span>
            </div>
          </div>

          {/* Footer (ระบบอัปโหลด QR Code) */}
          <div className="p-lg border-t border-outline-variant bg-[#11141a] flex flex-col items-center">
            <span className="font-mono-label text-mono-label text-on-surface-variant mb-md uppercase">
              {customQrImage ? "Scan to Settle" : "Upload your QR Code"}
            </span>

            {/* Input ซ่อนไว้ เพื่อเรียกใช้ผ่านการคลิก */}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageUpload}
            />

            <div
              onClick={() => fileInputRef.current.click()}
              className={`w-[140px] h-[140px] bg-[#1a1c20] border-2 border-dashed ${customQrImage ? 'border-transparent' : 'border-outline-variant hover:border-secondary'} p-xs flex items-center justify-center rounded-lg relative overflow-hidden group cursor-pointer transition-all`}
            >
              {customQrImage ? (
                <>
                  <img
                    src={customQrImage}
                    alt="Custom QR Code"
                    className="w-full h-full object-contain bg-white rounded"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="material-symbols-outlined text-white">edit</span>
                  </div>
                </>
              ) : (
                // แสดงปุ่มให้กดอัปโหลด
                <div className="flex flex-col items-center justify-center text-outline-variant group-hover:text-secondary transition-colors">
                  <span className="material-symbols-outlined text-[32px] mb-xs">add_photo_alternate</span>
                  <span className="font-mono-label text-[10px] uppercase text-center leading-tight">Click to<br />Upload QR</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full text-center">
          <p className="font-mono-label text-mono-label text-outline-variant">Share this card to easily settle debts.</p>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleSaveImage}
            disabled={!isImageReady}
            className={`px-md py-sm rounded font-mono-label transition-colors flex items-center gap-xs ${isImageReady
                ? "bg-primary text-on-primary-fixed hover:bg-primary-fixed-dim"
                : "bg-surface-variant text-outline cursor-wait opacity-70"
              }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {isImageReady ? "image" : "hourglass_empty"}
            </span>
            {isImageReady ? "SAVE IMG" : "UPLOADING..."}
          </button>

          <button onClick={handleExportData} className="bg-tertiary text-on-tertiary px-md py-sm rounded font-mono-label hover:opacity-80 transition-colors flex items-center gap-xs">
            <span className="material-symbols-outlined text-[16px]">data_object</span> DATA
          </button>
        </div>
      </div>
    </div>
  );
}