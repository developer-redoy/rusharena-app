"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Preferences } from "@capacitor/preferences";
import { Receipt, Gamepad2 } from "lucide-react";
import { showToast } from "@/app/component/application/tostify";

export default function MyMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("played");

  useEffect(() => {
    fetchData(tab);
  }, [tab]);

  async function fetchData(type) {
    try {
      setLoading(true);

      const { value } = await Preferences.get({
        key: "access_token",
      });

      const url =
        type === "played"
          ? `/api/mymatch?authId=${value}&matchList=true`
          : `/api/mymatch/refund?authId=${value}`;

      const { data } = await axios.get(url);

      if (data.success) {
        setMatches(Array.isArray(data.data.matches) ? data.data.matches : []);
      } else {
        setMatches([]);
      }
    } catch (error) {
      console.error(error);
      setMatches([]);
      showToast("error", "Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#070b18] text-white pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-[#070b18] z-10 px-4 pt-5 pb-4">
        <h1 className="text-2xl font-bold text-center">My Matches</h1>

        <div className="mt-5 bg-[#151b2f] rounded-full p-1 flex">
          <button
            onClick={() => setTab("played")}
            className={`flex-1 py-2 rounded-full font-medium transition ${
              tab === "played" ? "bg-yellow-400 text-black" : "text-gray-300"
            }`}
          >
            <div className="flex justify-center items-center gap-2">
              <Gamepad2 size={17} />
              Played
            </div>
          </button>

          <button
            onClick={() => setTab("refund")}
            className={`flex-1 py-2 rounded-full font-medium transition ${
              tab === "refund" ? "bg-yellow-400 text-black" : "text-gray-300"
            }`}
          >
            <div className="flex justify-center items-center gap-2">
              <Receipt size={17} />
              Refunds
            </div>
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : matches.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 text-gray-400">
          <Gamepad2 size={55} />
          <p className="mt-4">No Data Found</p>
        </div>
      ) : (
        <div className="px-4 space-y-3">
          {matches.map((match) => (
            <div
              key={match._id}
              className="bg-gray-900 rounded-2xl border border-gray-800 shadow-md p-4 flex justify-between items-center hover:bg-gray-800 transition-all"
            >
              {/* Left */}
              <div>
                <h2 className="text-base font-semibold">{match.title}</h2>

                <p className="text-sm text-gray-400 mt-1">
                  {new Date(match.time).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>

              {/* Right */}
              <div className="flex items-center gap-6 text-center">
                {tab === "refund" ? (
                  <div className="flex flex-col">
                    <strong className="text-yellow-400">Refund</strong>
                    <span>৳{match.refund}</span>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col">
                      <strong className="text-yellow-400">My Kills</strong>
                      <span>{match.myKills}</span>
                    </div>

                    <div className="flex flex-col">
                      <strong className="text-green-400">My Win</strong>
                      <span>{match.myWin}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
