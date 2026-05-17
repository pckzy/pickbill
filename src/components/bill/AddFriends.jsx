import { useState } from "react";
import AddFriendsModal from "./AddFriendsModal";

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

export default function AddFriends({ friends, onAddFriend, onRemoveFriend }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="bg-surface-container border border-outline-variant rounded-xl p-lg transition-colors hover:bg-surface-container-high">
      <div className="flex items-center gap-sm mb-md">
        <span className="font-mono-code text-mono-code text-outline">01.</span>
        <h2 className="font-headline-sm text-headline-sm text-on-surface">// ADD_FRIENDS</h2>
      </div>
      
      <div className="flex flex-wrap items-center gap-sm mb-md">
        {/* User Self (ล็อคสีไว้เป็นสีหลักของแอป) */}
        <div className="bg-surface-variant border border-outline text-on-surface-variant px-md py-sm rounded-lg font-mono-label text-mono-label flex items-center gap-xs">
          <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_#44e2cd]"></span>
          Me
        </div>

        {/* Dynamic Friend List */}
        {friends.map((friend) => (
          <div key={friend} className="bg-surface-dim border border-outline-variant text-on-surface px-md py-sm rounded-lg font-mono-label text-mono-label flex items-center gap-xs group">
            
            {/* จุดสุ่มสี */}
            <span className={`w-2 h-2 rounded-full ${getDotColor(friend)}`}></span>
            
            {friend}
            <span 
              onClick={() => onRemoveFriend(friend)}
              className="material-symbols-outlined text-outline cursor-pointer hover:text-error transition-colors ml-xs" 
              style={{ fontSize: '14px' }}
            >
              close
            </span>
          </div>
        ))}

        <button 
          onClick={() => setIsModalOpen(true)}
          className="border border-outline border-dashed text-primary hover:bg-surface-variant hover:border-primary px-md py-sm rounded-lg font-mono-label text-mono-label flex items-center gap-xs transition-all"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
          ADD_FRIEND
        </button>
      </div>

      {isModalOpen && (
        <AddFriendsModal 
          onClose={() => setIsModalOpen(false)} 
          onAdd={onAddFriend}
          recentlyAdded={friends}
          onRemove={onRemoveFriend}
        />
      )}
    </section>
  );
}