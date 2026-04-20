"use client";
import {
  MatchType1,
  MatchType2,
  MatchType3,
  MatchType4,
  MatchType5,
  MatchType6,
  MatchType7,
  MatchType8,
  MatchType9,
  MatchType10,
} from "@/config";
import { useState, useRef, useEffect } from "react";

import MatchRule from "@/app/component/application/matchRule";

export default function RulesPage() {
  const [activeTab, setActiveTab] = useState(0);
  const scrollRef = useRef(null);

  const tabs = [
    MatchType1,
    MatchType2,
    MatchType3,
    MatchType4,
    MatchType5,
    MatchType6,
    MatchType7,
    MatchType8,
    MatchType9,
    MatchType10,
  ];

  useEffect(() => {
    const container = scrollRef.current;
    const selected = container?.children[activeTab];
    if (container && selected) {
      const containerWidth = container.offsetWidth;
      const tabLeft = selected.offsetLeft;
      const tabWidth = selected.offsetWidth;
      const scrollLeft = tabLeft - (containerWidth / 2 - tabWidth / 2);
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white p-4">
      <h1 className="text-center text-2xl font-bold mb-4">All Rules</h1>

      {/* Tabs */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto space-x-2 mt-4 mb-6 no-scrollbar"
      >
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`flex-shrink-0 px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-200 ${
              activeTab === i
                ? "bg-yellow-400 text-black scale-105 shadow-lg"
                : "bg-gray-700 text-gray-200 hover:bg-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-gray-900 p-4 rounded-2xl shadow-lg text-sm leading-relaxed">
        <MatchRule matchType={tabs[activeTab]} />
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </div>
  );
}
