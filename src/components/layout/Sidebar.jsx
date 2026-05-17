export default function Sidebar() {
  return (
    <nav className="hidden md:flex flex-col z-40 bg-surface-container-low dark:bg-surface-container-low border-r border-outline-variant dark:border-outline-variant w-64 h-full fixed left-0 top-0">
      <div className="p-lg border-b border-outline-variant dark:border-outline-variant flex items-center gap-sm">
        <div className="w-8 h-8 rounded bg-primary-container text-on-primary-container flex items-center justify-center font-mono-label text-mono-label font-bold">
          SH
        </div>
        <div>
          <div className="font-headline-sm text-headline-sm font-black text-primary dark:text-primary tracking-tight">
            PickBill
          </div>
          <div className="font-mono-label text-mono-label text-on-surface-variant">v1.0.4-stable</div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto py-md">
        <ul className="flex flex-col gap-xs font-mono-label text-mono-label uppercase tracking-widest">
          <li>
            <a className="flex items-center gap-md bg-on-secondary-fixed-variant text-secondary border-l-4 border-secondary px-md py-sm opacity-80 scale-95 transition-all" href="#">
              <span className="material-symbols-outlined">dashboard</span>
              _dashboard.exe
            </a>
          </li>
          <li>
            <a className="flex items-center gap-md text-outline p-md hover:bg-surface-container-highest transition-all" href="#">
              <span className="material-symbols-outlined">group</span>
              _friends.list
            </a>
          </li>
          <li>
            <a className="flex items-center gap-md text-outline p-md hover:bg-surface-container-highest transition-all" href="#">
              <span className="material-symbols-outlined">folder_shared</span>
              _groups.config
            </a>
          </li>
          <li>
            <a className="flex items-center gap-md text-outline p-md hover:bg-surface-container-highest transition-all" href="#">
              <span className="material-symbols-outlined">history</span>
              _history.log
            </a>
          </li>
        </ul>
      </div>
      <div className="p-md border-t border-outline-variant dark:border-outline-variant">
        <button className="w-full bg-primary text-background font-mono-label text-mono-label uppercase tracking-widest py-sm rounded hover:opacity-90 transition-opacity flex items-center justify-center gap-sm">
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
          CREATE_BILL
        </button>
        <ul className="mt-md flex flex-col gap-xs font-mono-label text-mono-label uppercase tracking-widest">
          <li>
            <a className="flex items-center gap-md text-outline p-sm hover:bg-surface-container-highest transition-all rounded" href="#">
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>settings</span>
              Settings
            </a>
          </li>
          <li>
            <a className="flex items-center gap-md text-error p-sm hover:bg-error-container hover:text-on-error-container transition-all rounded" href="#">
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>logout</span>
              Logout
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}