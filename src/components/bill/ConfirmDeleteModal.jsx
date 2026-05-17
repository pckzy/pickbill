export default function ConfirmDeleteModal({ onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-md">
      <div className="bg-surface-dim border border-error/30 rounded-lg shadow-2xl w-full max-w-sm flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-lg border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
          <div className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-error">warning</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">CONFIRM_DELETE</h2>
          </div>
        </div>

        {/* Body */}
        <div className="p-xl flex-1 text-center bg-surface-container-lowest">
          <p className="font-mono-code text-on-surface-variant mb-xs text-body-md">
            Are you sure you want to delete this item?
          </p>
          <p className="font-mono-label text-[10px] text-error uppercase tracking-widest mt-sm">
            // THIS_ACTION_CANNOT_BE_UNDONE
          </p>
        </div>

        {/* Footer */}
        <div className="p-lg border-t border-outline-variant bg-surface-container-lowest flex justify-end gap-md">
          <button 
            onClick={onClose} 
            className="font-mono-label text-mono-label px-lg py-sm text-outline hover:text-on-surface transition-colors"
          >
            CANCEL
          </button>
          <button 
            onClick={onConfirm} 
            className="px-lg py-sm font-mono-label text-mono-label bg-error-container text-error hover:bg-error hover:text-on-error rounded font-bold uppercase tracking-widest transition-colors flex items-center gap-xs shadow-[0_0_15px_rgba(147,0,10,0.3)]"
          >
            <span className="material-symbols-outlined text-[18px]">delete_forever</span>
            DELETE
          </button>
        </div>

      </div>
    </div>
  );
}