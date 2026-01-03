import React, { useContext, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../Contexts/AuthContext";
import { TIER_DETAILS, calculateTierStats, formatJoinDate } from "../utils/loyalty";
import { toast } from "react-hot-toast";

const rewards = [
  "Complimentary business-class upgrades on select routes",
  "Lounge access for you + 1 guest",
  "Waived change fees and priority support",
  "Partner hotel night vouchers and chauffeur transfers",
];

const earnOptions = [
  "Book JetPath or partner flights inside your dashboard—JetPoints post instantly after each confirmation.",
  "Cabin boosts amplify the earn rate: Premium +15%, Business +35%, First +50%.",
  "Tier bonuses stack on top: Gold +25%, Platinum +50% extra JetPoints per booking.",
];

const earnFormula = [
  { label: "Base rate", value: "10 JetPoints per $1 (or equivalent) in airfare" },
  { label: "Cabin multiplier", value: "Economy 1x · Premium 1.15x · Business 1.35x · First 1.5x" },
  { label: "Tier multiplier", value: "Silver 1x · Gold 1.25x · Platinum 1.5x" },
];

const redeemOptions = [
  "Book or upgrade flights directly in the JetPath app",
  "Pay for seat selection, baggage, or onboard Wi‑Fi",
  "Transfer JetPoints to hotel and car partners",
  "Donate miles to JetPath Care community initiatives",
];

const Loyalty = () => {
  const { UserInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (UserInfo?.isAdmin) {
      toast.error("Admins can only access the Admin Panel");
      navigate("/admin");
    }
  }, [UserInfo, navigate]);

  if (UserInfo?.isAdmin) {
    return null;
  }

  const jetPoints = Number(UserInfo?.jetPoints) || 0;
  const tierLevel = UserInfo?.tierLevel || "Silver";
  const joinDateLabel = formatJoinDate(UserInfo?.loyaltyJoinDate);
  const tierStats = useMemo(
    () => calculateTierStats(tierLevel, jetPoints),
    [tierLevel, jetPoints]
  );

  const isAuthenticated = Boolean(UserInfo && UserInfo.email);
  const memberName =
    (UserInfo && UserInfo.username) || (UserInfo && UserInfo.firstName) || "Loyalty Guest";
  const formatter = new Intl.NumberFormat();

  const nextTierCopy = tierStats.nextTier
    ? `${formatter.format(tierStats.pointsToNextTier)} pts to reach ${tierStats.nextTier}`
    : "You unlocked every tier";

  return (
    <section className="w-full min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white px-6 py-12 flex flex-col gap-10">
      <header className="max-w-5xl mx-auto text-center flex flex-col gap-4">
        <p className="uppercase text-sm tracking-[0.4em] text-red-500">Loyalty</p>
        <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
          Earn JetPoints. Unlock elite travel. Fly better with JetPath.
        </h1>
        <p className="text-lg text-slate-200">
          Travel should reward ambition. Level up through Silver, Gold, and Platinum tiers,
          collect JetPoints with every booking, and spend them on upgrades, experiences, and perks
          curated for modern travelers.
        </p>
      </header>

      <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-2">
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex flex-col gap-4 shadow-lg shadow-black/30">
          <p className="text-sm text-slate-400">Your profile</p>
          <h2 className="text-3xl font-semibold">{memberName}</h2>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="px-4 py-1 rounded-full border border-red-600 text-red-400">
              {tierLevel} Tier
            </span>
            <span className="px-4 py-1 rounded-full border border-slate-700">
              {joinDateLabel ? `Member since ${joinDateLabel}` : "Join to start tracking JetPoints"}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm text-slate-400 uppercase tracking-[0.4em]">JetPoints balance</p>
            <p className="text-4xl font-semibold">{formatter.format(jetPoints)}</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-slate-400">
              <span>
                Next tier: {tierStats.nextTier ? tierStats.nextTier : "Max tier unlocked"}
              </span>
              <span>{nextTierCopy}</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-500 to-red-700"
                style={{ width: `${tierStats.progressPercent}%` }}
              />
            </div>
          </div>
          {!isAuthenticated && (
            <p className="text-xs text-slate-500">
              Sign in to see your live JetPoints balance pulled from your JetPath profile.
            </p>
          )}
        </div>

        <div className="bg-gradient-to-br from-red-900/60 via-red-800/60 to-red-700/60 border border-red-900/40 rounded-3xl p-6 flex flex-col gap-5 shadow-xl shadow-red-950/40">
          <p className="text-sm uppercase tracking-[0.4em] text-red-200">JetPoints ladders</p>
          <h3 className="text-2xl font-semibold">Tier benefits snapshot</h3>
          <ul className="flex flex-col gap-4 text-sm">
            {TIER_DETAILS.map((tier) => (
              <li
                key={tier.level}
                className="flex flex-col rounded-2xl border border-red-900/40 bg-red-950/40 px-4 py-3"
              >
                <div className="flex justify-between text-sm font-semibold text-red-200">
                  <span>{tier.level}</span>
                  <span>{tier.rangeLabel}</span>
                </div>
                <p className="text-slate-100 text-sm mt-1">{tier.perks}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-2">
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex flex-col gap-4">
          <h3 className="text-2xl font-semibold text-red-300">How to earn JetPoints</h3>
          <p className="text-slate-300 text-sm">
            Every confirmed flight booking inside your JetPath account automatically credits JetPoints
            based on fare, cabin, and loyalty tier. The math is transparent, so you always know how
            close you are to the next status unlock.
          </p>
          <ul className="list-disc list-inside text-slate-100 text-sm space-y-2">
            {earnOptions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="mt-4 rounded-2xl border border-slate-800 bg-black/30 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-red-400 mb-2">
              JetPoints formula
            </p>
            <div className="flex flex-col gap-2 text-sm text-slate-100">
              {earnFormula.map((row) => (
                <div key={row.label} className="flex flex-col">
                  <span className="text-slate-400 text-xs">{row.label}</span>
                  <span>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex flex-col gap-4">
          <h3 className="text-2xl font-semibold text-red-300">How to use your points</h3>
          <p className="text-slate-300 text-sm">
            Redeem JetPoints straight from the JetPath app or web portal. Mix points + cash when you
            want flexibility on premium travel.
          </p>
          <ul className="list-disc list-inside text-slate-100 text-sm space-y-2">
            {redeemOptions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="max-w-5xl mx-auto bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex flex-col gap-4">
        <h3 className="text-2xl font-semibold text-red-300">Featured rewards</h3>
        <p className="text-slate-300 text-sm">
          Top picks this month. Check the Rewards tab in your dashboard for limited-time drops.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {rewards.map((reward) => (
            <div
              key={reward}
              className="p-4 rounded-2xl border border-slate-800 bg-slate-950/40 text-sm text-slate-200"
            >
              {reward}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col items-center text-center gap-4 pb-16">
        <p className="text-slate-300 text-sm max-w-3xl">
          Ready to collect your first JetPoints? Create your loyalty profile in less than two
          minutes, link your bookings, and watch rewards build with every takeoff.
        </p>
        <button className="px-10 py-3 rounded-full bg-red-700 text-white text-sm uppercase tracking-[0.3em] hover:bg-red-600 transition">
          {isAuthenticated ? "Book a flight" : "Join now"}
        </button>
      </div>
    </section>
  );
};

export default Loyalty;
