export const TIER_DETAILS = [
  {
    level: "Silver",
    rangeLabel: "0 – 19,999 JetPoints",
    perks: "2x baggage allowance + priority check-in",
    nextAt: 20000,
    min: 0,
    nextTier: "Gold",
  },
  {
    level: "Gold",
    rangeLabel: "20,000 – 49,999 JetPoints",
    perks: "Lounge entry + complimentary seat upgrades",
    nextAt: 50000,
    min: 20000,
    nextTier: "Platinum",
  },
  {
    level: "Platinum",
    rangeLabel: "50,000+ JetPoints",
    perks: "First-class upgrades, chauffeur service, concierge desk",
    nextAt: null,
    min: 50000,
    nextTier: null,
  },
];

const tierMap = TIER_DETAILS.reduce((map, tier) => {
  map[tier.level] = tier;
  return map;
}, {});

export const calculateTierStats = (tierLevel = "Silver", jetPoints = 0) => {
  const tier = tierMap[tierLevel] || tierMap["Silver"];
  const nextTier = tier.nextTier;
  const pointsToNextTier = nextTier && tier.nextAt !== null
    ? Math.max(0, tier.nextAt - jetPoints)
    : 0;

  const rangeSpan =
    nextTier && tier.nextAt !== null ? tier.nextAt - tier.min || 1 : jetPoints || 1;
  const progressWithinTier = nextTier
    ? Math.min(100, Math.max(0, ((jetPoints - tier.min) / rangeSpan) * 100))
    : 100;

  return {
    tierLabel: tier.level,
    tierRangeLabel: tier.rangeLabel,
    nextTier,
    pointsToNextTier,
    progressPercent: Math.round(progressWithinTier),
  };
};

export const formatJoinDate = (dateString) => {
  if (!dateString) return null;
  const parsedDate = new Date(dateString);
  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }
  return parsedDate.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

