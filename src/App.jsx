import { useState, useEffect } from "react";
import Layout from "./components/layout/Layout";
import AddFriends from "./components/bill/AddFriends";
import BillItems from "./components/bill/BillItems";
import SummaryCalc from "./components/bill/SummaryCalc";
import Receipt from "./components/bill/Receipt";
import Settlement from "./components/bill/Settlement";

export default function App() {
  const [friends, setFriends] = useState(() => {
    const savedFriends = localStorage.getItem("splitHarmony_friends");
    if (savedFriends) {
      try {
        return JSON.parse(savedFriends);
      } catch (e) {
        console.error("Invalid friends data in storage");
      }
    }
    return [];
  });

  const [items, setItems] = useState(() => {
    const savedItems = localStorage.getItem("splitHarmony_items");
    if (savedItems) {
      try {
        return JSON.parse(savedItems);
      } catch (e) {
        console.error("Invalid items data in storage");
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("splitHarmony_friends", JSON.stringify(friends));
  }, [friends]);

  useEffect(() => {
    localStorage.setItem("splitHarmony_items", JSON.stringify(items));
  }, [items]);

  // State สำหรับควบคุมหน้าต่าง (Routing)
  const [currentView, setCurrentView] = useState("builder"); // 'builder' | 'receipt' | 'settlement'
  const [finalBillName, setFinalBillName] = useState("");

  const allParticipants = ["Me", ...friends];

  const handleAddFriend = (newName) => {
    if (newName && !friends.includes(newName)) {
      setFriends([...friends, newName]);
    }
  };

  const handleRemoveFriend = (nameToRemove) => {
    setFriends((prev) => prev.filter((name) => name !== nameToRemove));
    setItems((prevItems) =>
      prevItems.map((item) => ({
        ...item,
        participants: item.participants.filter((p) => p !== nameToRemove)
      }))
    );
  };

  // ฟังก์ชันสลับไปหน้า Receipt พร้อมบันทึกชื่อบิล
  const handleFinalizeBill = (billName) => {
    setFinalBillName(billName);
    setCurrentView("receipt");
  };

  return (
    // โยน currentView และ setCurrentView ลงไปให้ Layout จัดการ Sidebar สี Active State
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      
      {currentView === "builder" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          <header className="col-span-full mb-lg flex items-end justify-between">
            <div>
              <span className="font-mono-code text-mono-code text-secondary block mb-xs">// WORKSPACE</span>
              <h1 className="font-headline-lg text-headline-lg text-on-surface">Bill Creation Session</h1>
            </div>
          </header>
          <div className="col-span-1 lg:col-span-8 flex flex-col gap-lg">
            <AddFriends friends={friends} onAddFriend={handleAddFriend} onRemoveFriend={handleRemoveFriend} />
            <BillItems items={items} setItems={setItems} availableFriends={allParticipants} />
          </div>
          <div className="col-span-1 lg:col-span-4">
            <SummaryCalc items={items} allParticipants={allParticipants} onFinalize={handleFinalizeBill} />
          </div>
        </div>
      )}

      {currentView === "receipt" && (
        <Receipt 
          billName={finalBillName} 
          items={items} 
          allParticipants={allParticipants}
          onBack={() => setCurrentView("builder")} 
        />
      )}

      {/* หน้าประวัติการชำระเงิน นำเข้า JSON */}
      {currentView === "settlement" && (
        <Settlement />
      )}
      
    </Layout>
  );
}