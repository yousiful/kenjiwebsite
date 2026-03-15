export interface SeasonCopy {
  badge: string;
  stripLabel: string;
  stripBonus: string;
  stripUrgency: string;
  subheadline: string;
  planBadge: string;
  annualBadge: string;
  rateNote: string;
  bonusTitle: string;
  bonusSubtitle: string;
  emailBonus: string;
  whyNowTitle: string;
  whyNowBody: string;
  bonusClosing: string;
}

interface SeasonDef {
  months: number[];
  copy: SeasonCopy;
}

const seasons: SeasonDef[] = [
  {
    months: [1],
    copy: {
      badge: 'New Year Offer — Pricing Changes Soon',
      stripLabel: 'New Year Offer',
      stripBonus: '$5,000 in setup bonuses this January',
      stripUrgency: 'Rates increase after launch window',
      subheadline: 'Start the year with your systems in place.',
      planBadge: 'January Pricing',
      annualBadge: 'New Year Special — Save $1,200',
      rateNote: 'January launch rate — locked in for the life of your plan.',
      bonusTitle: 'Start Strong This January',
      bonusSubtitle: 'Join before the launch window closes and get $5,000 in setup bonuses at no extra cost.',
      emailBonus: 'January Launch Campaign Flow',
      whyNowTitle: 'Why January matters',
      whyNowBody: 'Businesses that set up in January close deals while others are still planning. Get your systems running before your market heats up.',
      bonusClosing: 'Offer ends at the close of the January launch window.',
    },
  },
  {
    months: [2],
    copy: {
      badge: 'February Offer — Pricing Changes Soon',
      stripLabel: "February Offer",
      stripBonus: '$5,000 in setup bonuses this month',
      stripUrgency: 'Rates increase in March',
      subheadline: "Pick a plan, get set up, and close more deals this month.",
      planBadge: 'February Pricing',
      annualBadge: 'February Special — Save $1,200',
      rateNote: 'February rate — locked in for the life of your plan.',
      bonusTitle: "Make This Month Count",
      bonusSubtitle: 'Join before this month closes and get $5,000 in setup bonuses at no extra cost.',
      emailBonus: 'February Email Campaign Flow',
      whyNowTitle: 'Why this month matters',
      whyNowBody: 'Q1 is when buying decisions get made. Get your systems in place before your competitors do.',
      bonusClosing: 'Offer ends at the close of February.',
    },
  },
  {
    months: [3],
    copy: {
      badge: 'Spring Offer — Pricing Changes in April',
      stripLabel: 'Spring Offer',
      stripBonus: '$5,000 in setup bonuses this spring',
      stripUrgency: 'Rates increase in April',
      subheadline: 'Start spring with your pipeline running on autopilot.',
      planBadge: 'Spring Pricing',
      annualBadge: 'Spring Special — Save $1,200',
      rateNote: 'Spring rate — locked in for the life of your plan. Rates rise in April.',
      bonusTitle: 'Start the New Quarter Right',
      bonusSubtitle: 'Join before this quarter closes and get $5,000 in setup bonuses at no extra cost.',
      emailBonus: 'Spring Email Campaign Flow',
      whyNowTitle: 'Why Q1 matters',
      whyNowBody: 'Businesses that get set up at the start of a quarter consistently outperform those that wait. Get your systems running now.',
      bonusClosing: 'Offer ends at the close of this spring promotion.',
    },
  },
  {
    months: [4, 5],
    copy: {
      badge: 'Spring Offer — Pricing Changes in June',
      stripLabel: 'Spring Offer',
      stripBonus: '$5,000 in setup bonuses this spring',
      stripUrgency: 'Rates increase in June',
      subheadline: 'Lock in your spring rate before Q2 closes.',
      planBadge: 'Spring Pricing',
      annualBadge: 'Spring Special — Save $1,200',
      rateNote: 'Spring rate — locked in for the life of your plan. Rates rise in June.',
      bonusTitle: 'Close Q2 Ahead',
      bonusSubtitle: 'Join before this promotion closes and get $5,000 in setup bonuses at no extra cost.',
      emailBonus: 'Spring Email Campaign Flow',
      whyNowTitle: 'Why spring matters',
      whyNowBody: 'Q2 is when growth compounds. Businesses that start now finish the year ahead — not catching up.',
      bonusClosing: 'Offer ends at the close of this spring promotion.',
    },
  },
  {
    months: [6, 7, 8],
    copy: {
      badge: 'Summer Offer — Pricing Changes in September',
      stripLabel: 'Summer Offer',
      stripBonus: '$5,000 in setup bonuses this summer',
      stripUrgency: 'Rates increase in September',
      subheadline: 'Use the summer to build systems that run Q3 and beyond.',
      planBadge: 'Summer Pricing',
      annualBadge: 'Summer Special — Save $1,200',
      rateNote: 'Summer rate — locked in for the life of your plan. Rates rise in September.',
      bonusTitle: 'Build While Others Rest',
      bonusSubtitle: 'Join before summer closes and get $5,000 in setup bonuses at no extra cost.',
      emailBonus: 'Summer Email Campaign Flow',
      whyNowTitle: 'Why summer matters',
      whyNowBody: 'The businesses that set up their systems in summer consistently hit their Q4 goals. Start now, not in October.',
      bonusClosing: 'Offer ends at the close of this summer promotion.',
    },
  },
  {
    months: [9, 10],
    copy: {
      badge: 'Q4 Offer — Pricing Changes in November',
      stripLabel: 'Q4 Offer',
      stripBonus: '$5,000 in setup bonuses this fall',
      stripUrgency: 'Rates increase before the holidays',
      subheadline: 'Set up now and close Q4 strong.',
      planBadge: 'Fall Pricing',
      annualBadge: 'Fall Special — Save $1,200',
      rateNote: 'Fall rate — locked in for the life of your plan. Rates rise before the holidays.',
      bonusTitle: 'Close Q4 at Full Speed',
      bonusSubtitle: 'Join before this promotion closes and get $5,000 in setup bonuses at no extra cost.',
      emailBonus: 'Fall Email Campaign Flow',
      whyNowTitle: 'Why fall matters',
      whyNowBody: 'Q4 buying decisions happen now. Businesses that are set up in October finish the year ahead — not scrambling.',
      bonusClosing: 'Offer ends at the close of this fall promotion.',
    },
  },
  {
    months: [11, 12],
    copy: {
      badge: 'Year-End Offer — Pricing Changes in January',
      stripLabel: 'Year-End Offer',
      stripBonus: '$5,000 in setup bonuses this season',
      stripUrgency: 'Rates increase in the new year',
      subheadline: 'Start the new year ahead — not catching up.',
      planBadge: 'Year-End Pricing',
      annualBadge: 'Year-End Special — Save $1,200',
      rateNote: 'Year-end rate — locked in for the life of your plan. Rates rise in January.',
      bonusTitle: 'Start the New Year at Full Speed',
      bonusSubtitle: 'Join before year-end closes and get $5,000 in setup bonuses at no extra cost.',
      emailBonus: 'Year-End Email Campaign Flow',
      whyNowTitle: 'Why year-end matters',
      whyNowBody: 'Businesses that close the year with their systems in place start January ahead of everyone else. Set up now.',
      bonusClosing: 'Offer ends at the close of this year-end promotion.',
    },
  },
];

export function getSeasonCopy(): SeasonCopy {
  const month = new Date().getMonth() + 1;
  const match = seasons.find(s => s.months.includes(month));
  return match ? match.copy : seasons[2].copy;
}
