"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
  MatchType1Img,
  MatchType2Img,
  MatchType3Img,
  MatchType4Img,
  MatchType5Img,
  MatchType6Img,
  MatchType7Img,
  MatchType8Img,
  MatchType9Img,
  MatchType10Img,
} from "@/config";
import { Preferences } from "@capacitor/preferences";
import { showToast } from "@/app/component/application/tostify";
import axios from "axios";

// ✅ helper to get image based on type
const getMatchImage = (matchType) => {
  switch (matchType) {
    case MatchType1:
      return MatchType1Img;
    case MatchType2:
      return MatchType2Img;
    case MatchType3:
      return MatchType3Img;
    case MatchType4:
      return MatchType4Img;
    case MatchType5:
      return MatchType5Img;
    case MatchType6:
      return MatchType6Img;
    case MatchType7:
      return MatchType7Img;
    case MatchType8:
      return MatchType8Img;
    case MatchType9:
      return MatchType9Img;
    case MatchType10:
      return MatchType10Img;
    default:
      return "/images/logo.jpg";
  }
};

export default function ResultPage() {
  const router = useRouter();

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openMatchId, setOpenMatchId] = useState(null); // ✅ per match toggle

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-US", {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      weekday: "short",
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const toggleMatch = (id) => {
    setOpenMatchId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    let isMounted = true;

    const fetchMatches = async () => {
      setLoading(true);
      setError(null);

      try {
        const { value } = await Preferences.get({ key: "access_token" });

        if (!value) {
          showToast("error", "Please login to continue!");
          return;
        }

        const res = await axios.get(`/api/results`, {
          headers: {
            "x-user-id": value,
          },
        });

        if (isMounted) {
          setMatches(res.data?.data || []);
        }
      } catch (err) {
        if (isMounted) {
          const message =
            err.response?.data?.message ||
            err.message ||
            "Something went wrong!";
          setError(message);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMatches();

    return () => {
      isMounted = false;
    };
  }, []);

  // ✅ Loading UI
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // ✅ Error UI
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  // ✅ No matches
  if (!matches.length) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-800 text-white p-4">
        <h1 className="text-3xl font-bold mb-4 text-center">
          No Matches Found
        </h1>
      </div>
    );
  }

  return (
    <div className="space-y-4 bg-black min-h-screen p-4">
      <h1 className="text-center text-2xl text-white font-bold mb-4">
        Today Matches
      </h1>

      <div className="grid md:grid-cols-2 gap-3">
        {matches.map((match) => {
          // ✅ Sort players by winning ASC
          const sortedPlayers = [...(match.joinedPlayers || [])].sort(
            (a, b) => (a.winning || 0) - (b.winning || 0),
          );

          return (
            <Card
              key={match._id}
              className="text-green-300 bg-green-900/20 border border-green-800 hover:bg-green-900/30 transition"
            >
              <CardHeader>
                <div className="flex gap-4">
                  <div className="w-16 h-16 min-w-16 rounded-full overflow-hidden relative">
                    <Image
                      src={getMatchImage(match.matchType)}
                      alt={match.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <CardTitle className="flex flex-col justify-center">
                    <strong>{match.title}</strong>
                    <p className="text-sm text-gray-300">
                      {formatDate(match.startTime)}
                    </p>
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Prize */}
                {/* ✅ Prize Info */}
                <div className="flex justify-around">
                  <div className="text-green-500 font-bold flex flex-col items-center">
                    <strong>+ WIN PRIZE</strong>
                    <span>{match.winPrize} TK</span>
                  </div>
                  <div className="text-blue-500 font-bold flex flex-col items-center">
                    <strong>+ PER KILL</strong>
                    <span>{match.perKill} TK</span>
                  </div>
                  <div className="text-red-500 font-bold flex flex-col items-center">
                    <strong>ENTRY FEE</strong>
                    <span>{match.entryFee} TK</span>
                  </div>
                </div>

                <div className="flex justify-between text-gray-300 mt-2">
                  <div className="flex flex-col items-center w-full">
                    <strong>ENTRY TYPE</strong>
                    <span>{match.entryType}</span>
                  </div>
                  <div className="flex flex-col items-center border-x-4 border-amber-600 w-full">
                    <strong>MAP</strong>
                    <span>{match.map}</span>
                  </div>
                  <div className="flex flex-col items-center w-full">
                    <strong>VERSION</strong>
                    <span>MOBILE</span>
                  </div>
                </div>

                {/* Toggle */}
                <button
                  className="w-full bg-gray-700 p-2 rounded-lg font-bold text-white"
                  onClick={() => toggleMatch(match._id)}
                >
                  {openMatchId === match._id ? "Hide Players" : "Show Players"}
                </button>

                {/* Players */}
                <div
                  className={`transition-all duration-300 overflow-hidden ${
                    openMatchId === match._id ? "max-h-[500px]" : "max-h-0"
                  }`}
                >
                  <div className="overflow-x-auto mt-3">
                    <table className="w-full text-sm border border-gray-700">
                      <thead>
                        <tr className="bg-gray-800 text-gray-300 text-xs">
                          <th className="p-2 text-left">#</th>
                          <th className="p-2 text-left">Name</th>
                          <th className="p-2 text-center">Kills</th>
                          <th className="p-2 text-center">Wins</th>
                        </tr>
                      </thead>

                      <tbody>
                        {sortedPlayers.map((player, index) => (
                          <tr
                            key={player._id || index}
                            className="border-b border-gray-700 hover:bg-gray-800"
                          >
                            <td className="p-2">{index + 1}</td>
                            <td className="p-2 text-green-400">
                              {player.name || "N/A"}
                            </td>
                            <td className="p-2 text-center">
                              {player.kills || 0}
                            </td>
                            <td className="p-2 text-center">
                              {player.winning || 0}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
