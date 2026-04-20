"use client";

import React, { useEffect, useState } from "react";

let popupShown = false; // Global flag (resets when app restarts)

export default function PopupNotice() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Show popup only if not shown yet in this app session
    if (!popupShown) {
      setShowPopup(true);
      popupShown = true;
    }
  }, []);

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white w-[90%] max-w-md rounded-2xl p-5 shadow-lg border border-gray-700">
        <h2 className="text-center text-lg font-bold text-red-500 mb-3">
          গুরুত্বপূর্ণ নোটিশ‼️
        </h2>

        <div className="space-y-3 text-sm leading-relaxed">
          <>
            <p className="text-yellow-400 mt-3">
              ⚠️BR এর বাহিরের প্লেয়ার নিয়ে ঢুকবেন না, এবং ইনভাইট দিবেন না -
              নাহলে সোজা কিক খাবেন টাকা বেক পাবেন না।🚫
            </p>

            <p className="text-yellow-400 mt-3">
              💬ডিপোজিটে সমস্যা হলে টেলিগ্রামে মেসেজ দিন।✅
            </p>

            <p className="text-green-400 mt-3">
              ✅ উইথড্র request পাঠালে ৫-৩০ মিনিটের মধ্যে টাকা পেয়ে যাবেন।
            </p>

            <p className="text-green-400 mt-3">
              💬দিনে একবার উইথড্র ও দিতে পারবা, সর্বনিম্ন উইথড্র ৬৫ টাকা,
              সর্বোচ্চ উইথড্র ৪০০ টাকা।💰
            </p>

            <p className="text-yellow-400 mt-3">
              ⚠️সব ম্যাচের রুলস গুলো পড়ে ম্যাচএ জয়েন করবেন।✅
            </p>

            <p className="text-yellow-400 mt-3">
              🗨️ফ্রি ম্যাচ এর রুম আইডি পাসওয়ার্ড টেলিগ্রাম চ্যানেলে দেওয়া হয়।
            </p>

            <p className="text-yellow-400 mt-3">
              📩যেকোনো সহযোগিতায় টেলিগ্রামে জয়েন করুন।
            </p>

            <p className="text-yellow-400 mt-3 text-center">
              ফ্রি ম্যাচে জয়েন করুন, ধন্যবাদ
            </p>
          </>
        </div>

        <button
          onClick={() => setShowPopup(false)}
          className="mt-5 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-medium transition"
        >
          Okay
        </button>
      </div>
    </div>
  );
}
