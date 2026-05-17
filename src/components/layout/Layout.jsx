export default function Layout({ children, currentView, onViewChange }) {
  return (
    <div className="bg-background text-on-surface h-screen flex overflow-hidden antialiased grid-bg relative">
      
      {/* DESKTOP SIDENAV */}
      <nav className="hidden md:flex flex-col z-40 fixed left-0 top-0 h-full w-64 bg-surface-container-low border-r border-outline-variant">
        <div className="p-lg border-b border-outline-variant">
          <h1 className="font-headline-sm text-headline-sm font-black text-primary">PickBill</h1>
          <p className="font-mono-code text-mono-code text-outline mt-sm">v1.0.4-stable</p>
        </div>
        <div className="flex-1 overflow-y-auto py-md flex flex-col gap-xs">
          <button onClick={() => onViewChange("builder")} className={`flex items-center gap-md p-md font-mono-label text-mono-label uppercase tracking-widest transition-all ${currentView !== "settlement" ? "bg-on-secondary-fixed-variant text-secondary border-l-4 border-secondary translate-x-1" : "text-outline hover:bg-surface-container-highest"}`}>
            <span className="material-symbols-outlined">dashboard</span>
            _dashboard.exe
          </button>
          <button onClick={() => onViewChange("settlement")} className={`flex items-center gap-md p-md font-mono-label text-mono-label uppercase tracking-widest transition-all ${currentView === "settlement" ? "bg-on-secondary-fixed-variant text-secondary border-l-4 border-secondary translate-x-1" : "text-outline hover:bg-surface-container-highest"}`}>
            <span className="material-symbols-outlined">history</span>
            _history.log
          </button>
        </div>
      </nav>

      {/* MOBILE BOTTOM NAV (2 ก้อน ซ้าย-ขวา) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-surface-container-low border-t border-outline-variant flex h-[60px]">
        <button onClick={() => onViewChange("builder")} className={`flex-1 flex flex-col items-center justify-center border-r border-outline-variant transition-colors ${currentView !== "settlement" ? "text-secondary bg-surface-container-highest" : "text-outline"}`}>
          <span className="material-symbols-outlined text-[20px]">dashboard</span>
          <span className="font-mono-label text-[10px] mt-1">DASHBOARD</span>
        </button>
        <button onClick={() => onViewChange("settlement")} className={`flex-1 flex flex-col items-center justify-center transition-colors ${currentView === "settlement" ? "text-secondary bg-surface-container-highest" : "text-outline"}`}>
          <span className="material-symbols-outlined text-[20px]">history</span>
          <span className="font-mono-label text-[10px] mt-1">HISTORY</span>
        </button>
      </nav>

      {/* MAIN CANVAS */}
      <main className="flex-1 h-full overflow-y-auto w-full md:ml-64 flex flex-col relative z-10 pb-[60px] md:pb-0">
        
        {/* MOBILE TOP HEADER (สำหรับมือถือ) */}
        <header className="md:hidden flex justify-between items-center w-full px-lg py-md bg-surface border-b border-outline-variant shrink-0">
          <h1 className="font-headline-sm text-headline-sm font-bold text-primary tracking-tighter">PickBill</h1>
        </header>

        {/* CONTENT AREA */}
        <div className="flex-1 w-full max-w-7xl mx-auto p-md lg:p-container-padding">
          {children}
        </div>

        {/* FOOTER */}
        <footer className="w-full py-md px-lg flex flex-col md:flex-row justify-between items-center gap-sm bg-surface-container-lowest border-t border-outline-variant shrink-0">
          <span className="font-mono-code text-mono-code text-primary">PICKBILL_CORE</span>
          <span className="font-mono-label text-mono-label text-outline text-center md:text-left">© 2026 PICKBILL_CORE // ALL RIGHTS RESERVED</span>
        </footer>

      </main>
    </div>
  );
}