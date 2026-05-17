export default function Layout({ children, currentView, onViewChange }) {
  return (
    <div className="bg-background text-on-surface h-screen flex overflow-hidden antialiased grid-bg relative">
      
      {/* DESKTOP SIDENAV (PC ยังคงเหมือนเดิม) */}
      <nav className="hidden lg:flex flex-col z-40 fixed left-0 top-0 h-full w-64 bg-surface-container-low border-r border-outline-variant">
        <div className="p-lg border-b border-outline-variant">
          <h1 className="font-headline-sm text-headline-sm font-black text-primary">PickBills</h1>
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

      {/* MAIN CANVAS */}
      {/* ⭐️ เอา pb-[60px] ออกไป เพราะไม่มี Bottom Nav แล้ว */}
      <main className="flex-1 h-full overflow-y-auto w-full lg:ml-64 flex flex-col relative z-10">
        
        {/* MOBILE TOP HEADER & TABS (ย้ายมาไว้ข้างบนทั้งหมด) */}
        <div className="lg:hidden sticky top-0 z-50 flex flex-col w-full bg-surface border-b border-outline-variant shrink-0 shadow-md">
          {/* <header className="flex justify-between items-center px-lg py-md">
            <h1 className="font-headline-sm text-headline-sm font-bold text-primary tracking-tighter">PickBills</h1>
          </header> */}
          
          {/* Mobile Tabs */}
          <div className="flex w-full bg-surface-container-low border-t border-outline-variant">
            <button 
              onClick={() => onViewChange("builder")} 
              className={`flex-1 flex items-center justify-center gap-xs py-md border-b-2 transition-colors ${currentView !== "settlement" ? "border-secondary text-secondary bg-surface-container-highest" : "border-transparent text-outline hover:bg-surface-container"}`}
            >
              <span className="material-symbols-outlined text-[16px]">dashboard</span>
              <span className="font-mono-label text-[11px] tracking-widest mt-[2px]">DASHBOARD</span>
            </button>
            <button 
              onClick={() => onViewChange("settlement")} 
              className={`flex-1 flex items-center justify-center gap-xs py-sm border-b-2 transition-colors ${currentView === "settlement" ? "border-secondary text-secondary bg-surface-container-highest" : "border-transparent text-outline hover:bg-surface-container"}`}
            >
              <span className="material-symbols-outlined text-[16px]">history</span>
              <span className="font-mono-label text-[11px] tracking-widest mt-[2px]">HISTORY</span>
            </button>
          </div>
        </div>

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