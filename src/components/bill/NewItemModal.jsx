import { useState } from "react";

export default function NewItemModal({ onClose, onSave, availableFriends, initialData }) {
  const isEditing = !!initialData;
  const [itemName, setItemName] = useState(initialData?.name || "");
  const [itemPrice, setItemPrice] = useState(initialData?.price?.toString() || "");
  const [selectedParticipants, setSelectedParticipants] = useState(
    initialData ? [...initialData.participants] : [...availableFriends]
  );

  const priceNum = parseFloat(itemPrice) || 0;
  const splitAmount = selectedParticipants.length > 0 ? Math.ceil(priceNum / selectedParticipants.length) : 0;

  const handleToggleParticipant = (name) => {
    setSelectedParticipants(prev =>
      prev.includes(name) ? prev.filter(p => p !== name) : [...prev, name]
    );
  };

  const handleSelectAll = () => {
    if (selectedParticipants.length === availableFriends.length) {
      setSelectedParticipants([]);
    } else {
      setSelectedParticipants([...availableFriends]);
    }
  };

  const handleSubmit = () => {
    if (itemName && priceNum > 0 && selectedParticipants.length > 0) {
      onSave({
        id: isEditing ? initialData.id : Date.now(),
        name: itemName,
        price: priceNum,
        participants: selectedParticipants
      });
      onClose();
    }
  };

  const getColor = (name) => {
    const colors = [
      "bg-primary-container text-on-primary-container border-primary-fixed-dim",
      "bg-tertiary-container text-on-tertiary-container border-tertiary-fixed-dim",
      "bg-secondary-container text-on-secondary-container border-secondary-fixed",
      "bg-error-container text-on-error-container border-error",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-md">
      <div className="bg-surface-dim border border-outline-variant rounded-lg shadow-2xl w-full max-w-lg flex flex-col max-h-[80vh] overflow-hidden">

        {/* Header */}
        <div className="p-lg border-b border-outline-variant flex justify-between items-center bg-surface-container-low shrink-0">
          <div className="flex items-center gap-sm">
            <span className="font-mono-label text-mono-label text-secondary">02.</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              {isEditing ? "EDIT_ITEM_MODAL" : "NEW_ITEMS_MODAL"}
            </h2>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-secondary transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Body (Added scrollbar hiding classes: [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']) */}
        <div className="p-lg flex-1 overflow-y-auto space-y-xl [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">

          <div className="space-y-md">
            <label className="font-mono-label text-mono-label text-on-surface-variant block">ITEM_NAME //</label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline group-focus-within:text-secondary transition-colors">last_page</span>
              <input
                className="w-full bg-[#161b22] border border-outline-variant rounded px-lg py-sm pl-[36px] text-body-md text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all font-mono-code"
                placeholder="e.g. Dinner" type="text" value={itemName} onChange={e => setItemName(e.target.value)} autoFocus
              />
            </div>

            <label className="font-mono-label text-mono-label text-on-surface-variant block">ITEM_PRICE //</label>
            <div className="relative group">
              <span className="absolute left-md top-1/2 -translate-y-1/2 font-mono-code text-mono-code text-secondary">฿</span>
              <input
                className="w-full bg-[#161b22] border border-outline-variant rounded px-lg py-sm pl-[36px] text-body-md text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all font-mono-code"
                placeholder="0.00" type="number" value={itemPrice} onChange={e => setItemPrice(e.target.value)}
              />
            </div>
          </div>

          {/* Participants Section */}
          <div className="flex flex-col gap-sm">
            <div className="flex justify-between items-end border-b border-outline-variant pb-xs">
              <label className="font-mono-label text-mono-label text-outline uppercase tracking-widest">PARTICIPANTS //</label>
              <button onClick={handleSelectAll} className="font-mono-label text-mono-label text-secondary hover:text-secondary-fixed transition-colors">
                {selectedParticipants.length === availableFriends.length ? "DESELECT_ALL" : "SELECT_ALL"}
              </button>
            </div>

            {/* แก้ไขเป็น Grid 2 Columns */}
            <div className="grid grid-cols-2 gap-sm mt-sm">
              {availableFriends.map((friend, index) => {
                const isSelected = selectedParticipants.includes(friend);
                const initial = friend.charAt(0).toUpperCase();
                const avatarColorClass = getColor(friend);

                return (
                  <label
                    key={friend}
                    className={`relative flex items-center gap-sm p-sm rounded-md cursor-pointer transition-all border ${isSelected
                        ? 'bg-secondary/10 border-secondary shadow-[0_0_10px_rgba(68,226,205,0.1)]'
                        : 'bg-surface-container border-outline-variant hover:bg-surface-container-high'
                      }`}
                  >
                    <div className={`w-8 h-8 shrink-0 rounded flex items-center justify-center font-mono-label font-bold border ${avatarColorClass}`}>
                      {initial}
                    </div>

                    {/* ชื่อเพื่อน ตัดคำถ้ายาวเกินไป */}
                    <span className="font-mono-code text-mono-code text-on-surface truncate pr-6">
                      {friend}
                    </span>

                    {/* เอา Default Input ออก ซ่อนไว้แต่ยังรับค่าได้ */}
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={isSelected}
                      onChange={() => handleToggleParticipant(friend)}
                    />

                    {/* ไอคอน Check mark จะโชว์เมื่อถูกเลือก */}
                    {isSelected && (
                      <span className="material-symbols-outlined absolute right-sm text-secondary" style={{ fontSize: '18px' }}>
                        check_circle
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Calculation Box */}
          <div className="bg-surface-container-highest border border-outline-variant rounded-lg p-md flex flex-col gap-sm">
            <div className="font-mono-label text-mono-label text-outline uppercase tracking-widest border-b border-outline-variant pb-xs">
              EST_CALCULATION
            </div>
            <div className="flex justify-between items-center mt-xs">
              <span className="font-mono-code text-mono-code text-on-surface-variant">TOTAL_SPLIT</span>
              <span className="font-headline-sm text-headline-sm text-on-surface font-bold">{priceNum.toFixed(2)} ฿</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-mono-code text-mono-code text-on-surface-variant">AMOUNT / PERSON</span>
              <span className="font-mono-code text-mono-code text-secondary">
                {splitAmount.toFixed(2)} ฿ <span className="text-outline text-[10px]">x{selectedParticipants.length}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-lg border-t border-outline-variant bg-surface-container-lowest flex justify-end gap-md shrink-0">
          <button onClick={onClose} className="font-mono-label text-mono-label px-lg py-sm text-outline hover:text-on-surface transition-colors">
            CANCEL
          </button>
          <button
            onClick={handleSubmit}
            disabled={!itemName || priceNum <= 0 || selectedParticipants.length === 0}
            className="px-lg py-sm font-mono-label text-mono-label bg-secondary text-on-secondary hover:bg-secondary-fixed rounded font-bold uppercase tracking-widest transition-colors flex items-center gap-xs shadow-[0_0_15px_rgba(68,226,205,0.3)] disabled:opacity-50 disabled:shadow-none"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isEditing ? "save" : "add"}
            </span>
            {isEditing ? "SAVE_CHANGES" : "ADD_TO_BILL"}
          </button>
        </div>
      </div>
    </div>
  );
}