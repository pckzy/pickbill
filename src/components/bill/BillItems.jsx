import { useState } from "react";
import NewItemModal from "./NewItemModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

export default function BillItems({ items, setItems, availableFriends }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // เก็บ State ของรายการที่กำลังแก้ไข
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleRemoveItem = (idToRemove) => {
    setItems(items.filter((item) => item.id !== idToRemove));
    setItemToDelete(null);
  };

  const handleOpenModal = (item = null) => {
    setEditingItem(item); // ถ้าเป็น null คือสร้างใหม่, ถ้าส่ง item มาคือแก้ของเดิม
    setIsModalOpen(true);
  };

  const handleSaveItem = (savedItem) => {
    if (editingItem) {
      // โหมดอัปเดตของเดิม
      setItems(items.map((item) => (item.id === savedItem.id ? savedItem : item)));
    } else {
      // โหมดสร้างใหม่
      setItems([...items, savedItem]);
    }
  };

  // Helper สำหรับคำนวณราคาต่อคนเพื่อโชว์ใน UI
  const getAmountPerPerson = (price, participantsCount) => {
    if (participantsCount === 0) return "0.00";
    return Math.ceil(price / participantsCount).toFixed(2);
  };

  // bg-secondary/10 text-secondary border border-secondary/20
  const getBoxColor = (name) => {
    const colors = [
      "bg-primary/10 text-primary border border-primary/20",
      "bg-tertiary/10 text-tertiary border border-tertiary/20",
      "bg-secondary/10 text-secondary border border-secondary/20",
      "bg-error/10 text-error border border-error/20",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <section className="bg-surface-container border border-outline-variant rounded-xl p-lg transition-colors hover:bg-surface-container-high">
      <div className="flex items-center justify-between mb-md">
        <div className="flex items-center gap-sm">
          <span className="font-mono-code text-mono-code text-outline">02.</span>
          <h2 className="font-headline-sm text-headline-sm text-on-surface">// BILL_ITEMS</h2>
        </div>
      </div>

      <div className="flex flex-col gap-sm">
        {/* Render รายการจาก State ด้วย UI ใหม่ */}
        {items.map((item) => (
          <div
            key={item.id}
            className="group relative flex flex-col md:flex-row items-start md:items-center gap-md bg-surface-container-low p-md rounded-lg border border-outline-variant hover:border-secondary transition-all cursor-pointer"
          >
            {/* 1. ส่วนข้อมูลหลัก (ชื่อ + Tags) - ยึดพื้นที่เต็มบน Mobile */}
            <div className="flex-1 w-full">
              <div className="flex items-center gap-sm mb-xs">
                <span className="material-symbols-outlined text-secondary" style={{ fontSize: "16px" }}>edit_note</span>
                <span className="font-headline-sm text-on-surface">{item.name}</span>
              </div>
              <div className="flex flex-wrap gap-xs">
                {item.participants.length === availableFriends.length ? (
                  <span className="bg-secondary/10 text-secondary border border-secondary/20 px-sm py-0.5 rounded font-mono-label text-[10px] tracking-tighter">ALL</span>
                ) : (
                  item.participants.map((p) => (
                    <span key={p} className={`${getBoxColor(p)} px-sm py-0.5 rounded font-mono-label text-[10px] tracking-tighter`}>
                      {p}
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* 2. ส่วนราคาและปุ่ม (จัดให้อยู่บรรทัดเดียวกันบน Mobile, ชิดขวาบน Desktop) */}
            <div className="flex w-full md:w-auto items-center justify-between md:justify-end gap-md md:border-l border-outline-variant md:pl-md pt-sm md:pt-0 border-t border-outline-variant/50 md:border-t-0 mt-xs md:mt-0">

              {/* ราคา */}
              <div className="flex flex-col items-start md:items-end gap-xs">
                <div className="font-mono-code text-secondary font-bold text-headline-sm">{item.price.toFixed(2)} ฿</div>
                <div className="font-mono-label text-on-surface-variant text-[10px] uppercase tracking-widest">
                  {getAmountPerPerson(item.price, item.participants.length)} ฿ / PERS
                </div>
              </div>

              {/* ปุ่ม Edit/Delete */}
              <div className="flex items-center gap-xs">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // ป้องกันไม่ให้ Event กระทบกับ Container หลัก
                    handleOpenModal(item);
                  }}
                  className="p-sm rounded hover:bg-surface-variant text-outline hover:text-secondary transition-colors"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>edit</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setItemToDelete(item.id);
                  }}
                  className="p-sm rounded hover:bg-error-container text-outline hover:text-error transition-colors"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* ปุ่มสร้างใหม่ */}
        <button
          onClick={() => handleOpenModal(null)}
          className="w-full mt-sm border border-outline-variant border-dashed text-on-surface-variant hover:text-primary hover:border-primary py-md rounded-lg font-mono-label text-mono-label flex items-center justify-center gap-sm transition-all bg-surface-container-lowest">
          <span className="material-symbols-outlined">add_circle</span>
          EXECUTE_NEW_ITEM.EXE
        </button>
      </div>

      {isModalOpen && (
        <NewItemModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveItem}
          availableFriends={availableFriends}
          initialData={editingItem} // ส่งข้อมูลเข้าไป ถ้ารายการใหม่จะเป็น null
        />
      )}

      {itemToDelete !== null && (
        <ConfirmDeleteModal
          onClose={() => setItemToDelete(null)}
          onConfirm={() => handleRemoveItem(itemToDelete)}
        />
      )}
    </section>
  );
}