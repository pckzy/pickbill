import { useState } from "react";

export default function AddFriendsModal({ onClose, onAdd, recentlyAdded, onRemove }) {
  const [inputValue, setInputValue] = useState("");

  const getDotColor = (name) => {
    const colors = [
      "bg-primary shadow-[0_0_8px_#adc6ff]",
      "bg-tertiary shadow-[0_0_8px_#eec200]",
      "bg-secondary shadow-[0_0_8px_#44e2cd]",
      "bg-error shadow-[0_0_8px_#ffb4ab]",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const submitAdd = () => {
    if (inputValue.trim()) {
      onAdd(inputValue.trim().toUpperCase()); // ปรับเป็นตัวพิมพ์ใหญ่ตามสไตล์ UI
      setInputValue("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") submitAdd();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-md">
      <div className="bg-surface-dim border border-outline-variant rounded-lg shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-lg border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
          <div className="flex items-center gap-sm">
            <span className="font-mono-label text-mono-label text-secondary">01.</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">ADD_FRIENDS_MODAL</h2>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-secondary transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-lg flex-1 overflow-y-auto space-y-xl">
          <div className="space-y-sm">
            <label className="font-mono-label text-mono-label text-on-surface-variant block">SEARCH_BY_ID_OR_NAME //</label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-sm text-outline" style={{ fontSize: '20px' }}>search</span>
              <input
                className="w-full bg-[#161b22] border border-outline-variant rounded px-lg py-sm pl-[36px] pr-[80px] text-body-md text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all font-mono-code placeholder:text-outline/50"
                placeholder="e.g. USER_01"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
              />
              {/* ปุ่ม ADD ที่ฝังใน Input */}
              <div className="absolute right-md">
                <button
                  onClick={submitAdd}
                  className="font-mono-label text-mono-label px-sm py-xs border border-secondary text-secondary rounded hover:bg-secondary hover:text-on-secondary transition-all flex items-center gap-xs bg-surface-dim"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span> ADD
                </button>
              </div>
            </div>
          </div>

          {/* Recently Added Section */}
          <div className="space-y-md">
            <h3 className="font-mono-label text-mono-label text-on-surface-variant border-b border-outline-variant pb-xs">
              RECENTLY_ADDED //
            </h3>
            <div className="flex flex-wrap gap-sm">
              {recentlyAdded.map((name) => (
                <div key={name} className="inline-flex items-center gap-xs px-sm py-xs border border-outline-variant bg-surface-container rounded-full group">
                  <span className={`w-2 h-2 rounded-full ${getDotColor(name)}`}></span>
                  <span className="font-mono-label text-mono-label text-on-surface">{name}</span>
                  <span 
                    onClick={() => onRemove(name)}
                    className="material-symbols-outlined text-[14px] text-outline cursor-pointer hover:text-error opacity-0 group-hover:opacity-100 transition-all"
                  >
                    close
                  </span>
                </div>
              ))}
              {recentlyAdded.length === 0 && (
                <span className="text-outline font-mono-label text-[10px]">NO_FRIENDS_ADDED</span>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-lg border-t border-outline-variant bg-surface-container-lowest flex justify-end gap-md">
          <button onClick={onClose} className="font-mono-label text-mono-label px-lg py-sm text-outline hover:text-on-surface transition-colors">
            CANCEL
          </button>
          <button onClick={onClose} className="font-mono-label text-mono-label px-lg py-sm bg-secondary text-on-secondary rounded hover:bg-secondary-fixed transition-colors">
            DONE
          </button>
        </div>
      </div>
    </div>
  );
}