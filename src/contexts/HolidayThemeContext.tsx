import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Holiday {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  theme_color: string;
  secondary_color: string;
  emoji: string;
  confetti_colors: string[];
  banner_message: string | null;
  offer_text: string;
  offer_badge: string;
  urgency_text: string;
  is_active: boolean;
  priority: number;
}

const holidays: Holiday[] = [
  {
    id: '1',
    name: 'New Year',
    start_date: '01-01',
    end_date: '01-15',
    theme_color: '#fbbf24',
    secondary_color: '#fcd34d',
    emoji: '🎆',
    confetti_colors: ['#fbbf24', '#fcd34d', '#ffffff', '#60a5fa'],
    banner_message: 'New Year, New Revenue Streams',
    offer_text: '⚡ ACT NOW: Exclusive 2025 Launch Pricing Expires Soon!',
    offer_badge: 'ENDS JAN 15',
    urgency_text: 'Only Days Left',
    is_active: true,
    priority: 10
  },
  {
    id: '2',
    name: 'Valentine\'s Day',
    start_date: '02-01',
    end_date: '02-14',
    theme_color: '#ec4899',
    secondary_color: '#f472b6',
    emoji: '💖',
    confetti_colors: ['#ec4899', '#f472b6', '#ffffff', '#fbbf24'],
    banner_message: 'Fall in Love with Automation',
    offer_text: 'Show your business some love - Save today',
    offer_badge: 'VALENTINE\'S SPECIAL',
    urgency_text: 'Only until Feb 14th',
    is_active: true,
    priority: 8
  },
  {
    id: '3',
    name: 'St. Patrick\'s Day',
    start_date: '03-10',
    end_date: '03-17',
    theme_color: '#10b981',
    secondary_color: '#34d399',
    emoji: '☘️',
    confetti_colors: ['#10b981', '#34d399', '#fbbf24', '#ffffff'],
    banner_message: 'Lucky You Found KenjiAI',
    offer_text: 'Get lucky with AI automation - Special pricing',
    offer_badge: 'LUCK OF THE IRISH',
    urgency_text: 'Expires March 17th',
    is_active: true,
    priority: 7
  },
  {
    id: '4',
    name: 'Easter',
    start_date: '04-13',
    end_date: '04-20',
    theme_color: '#a78bfa',
    secondary_color: '#c4b5fd',
    emoji: '🐰',
    confetti_colors: ['#a78bfa', '#c4b5fd', '#fbbf24', '#ec4899'],
    banner_message: 'Spring Into AI Automation',
    offer_text: 'Hop on the AI revolution - Special offer',
    offer_badge: 'SPRING SAVINGS',
    urgency_text: 'Through April 20th',
    is_active: true,
    priority: 7
  },
  {
    id: '5',
    name: 'Memorial Day',
    start_date: '05-20',
    end_date: '05-26',
    theme_color: '#dc2626',
    secondary_color: '#3b82f6',
    emoji: '🇺🇸',
    confetti_colors: ['#dc2626', '#3b82f6', '#ffffff'],
    banner_message: 'Memorial Day Automation Sale',
    offer_text: 'Honor productivity - Special Memorial Day pricing',
    offer_badge: 'MEMORIAL DAY SALE',
    urgency_text: 'Ends May 26th',
    is_active: true,
    priority: 8
  },
  {
    id: '6',
    name: 'Independence Day',
    start_date: '06-28',
    end_date: '07-04',
    theme_color: '#dc2626',
    secondary_color: '#3b82f6',
    emoji: '🎆',
    confetti_colors: ['#dc2626', '#3b82f6', '#ffffff'],
    banner_message: 'Declare Independence from Manual Work',
    offer_text: 'Celebrate freedom with AI - Special 4th of July offer',
    offer_badge: 'INDEPENDENCE SALE',
    urgency_text: 'Through July 4th',
    is_active: true,
    priority: 9
  },
  {
    id: '7',
    name: 'Labor Day',
    start_date: '08-30',
    end_date: '09-02',
    theme_color: '#f97316',
    secondary_color: '#fbbf24',
    emoji: '⚒️',
    confetti_colors: ['#f97316', '#fbbf24', '#ffffff'],
    banner_message: 'Labor Less, Earn More',
    offer_text: 'Let AI do the work - Labor Day special',
    offer_badge: 'LABOR DAY DEAL',
    urgency_text: 'Only until Sept 2nd',
    is_active: true,
    priority: 8
  },
  {
    id: '8',
    name: 'Halloween',
    start_date: '10-20',
    end_date: '10-31',
    theme_color: '#f97316',
    secondary_color: '#7c3aed',
    emoji: '🎃',
    confetti_colors: ['#f97316', '#7c3aed', '#000000'],
    banner_message: 'Scary Good Automation Deals',
    offer_text: 'Don\'t get spooked by manual work - Save now',
    offer_badge: 'SPOOKY SAVINGS',
    urgency_text: 'Until Halloween',
    is_active: true,
    priority: 7
  },
  {
    id: '9',
    name: 'Black Friday',
    start_date: '11-25',
    end_date: '11-29',
    theme_color: '#000000',
    secondary_color: '#fbbf24',
    emoji: '🛍️',
    confetti_colors: ['#000000', '#fbbf24', '#ffffff'],
    banner_message: 'Black Friday: Biggest Sale of the Year',
    offer_text: '🔥 FINAL HOURS: Biggest Savings of the Year - Selling Out Fast!',
    offer_badge: 'ENDS TONIGHT',
    urgency_text: 'LAST CHANCE',
    is_active: true,
    priority: 10
  },
  {
    id: '10',
    name: 'Cyber Monday',
    start_date: '11-29',
    end_date: '12-02',
    theme_color: '#3b82f6',
    secondary_color: '#06b6d4',
    emoji: '💻',
    confetti_colors: ['#3b82f6', '#06b6d4', '#fbbf24'],
    banner_message: 'Cyber Monday: Tech Deals You Can\'t Miss',
    offer_text: '⚠️ URGENT: Cyber Monday Ends At Midnight - Claim Your Spot NOW!',
    offer_badge: 'TODAY ONLY',
    urgency_text: 'ENDS IN HOURS',
    is_active: true,
    priority: 10
  },
  {
    id: '11',
    name: 'Christmas',
    start_date: '12-01',
    end_date: '12-25',
    theme_color: '#dc2626',
    secondary_color: '#10b981',
    emoji: '🎄',
    confetti_colors: ['#dc2626', '#10b981', '#ffffff', '#fbbf24'],
    banner_message: 'The Gift That Keeps Giving: AI Automation',
    offer_text: '🎁 HURRY: Holiday Pricing Disappears After Christmas - Secure Your Spot!',
    offer_badge: 'LAST DAYS',
    urgency_text: 'BEFORE CHRISTMAS',
    is_active: true,
    priority: 10
  },
  {
    id: '12',
    name: 'New Year Eve',
    start_date: '12-26',
    end_date: '12-31',
    theme_color: '#fbbf24',
    secondary_color: '#fcd34d',
    emoji: '🎉',
    confetti_colors: ['#fbbf24', '#fcd34d', '#ffffff', '#60a5fa'],
    banner_message: 'End the Year Strong, Start 2025 Stronger',
    offer_text: '⏰ FINAL CALL: 2024 Pricing Vanishes At Midnight - Lock It In NOW!',
    offer_badge: 'ENDS TONIGHT',
    urgency_text: 'HOURS LEFT',
    is_active: true,
    priority: 10
  }
];

interface HolidayThemeContextType {
  currentHoliday: Holiday | null;
  isHolidayActive: boolean;
  themeColor: string;
  secondaryColor: string;
  gradientClass: string;
  textGradientClass: string;
}

const HolidayThemeContext = createContext<HolidayThemeContextType | undefined>(undefined);

const defaultTheme = {
  theme_color: '#3b82f6',
  secondary_color: '#10b981',
  gradientClass: 'from-blue-600 to-green-500',
  textGradientClass: 'from-blue-400 to-green-400',
};

function isDateInRange(startDate: string, endDate: string): boolean {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();

  const [startMonth, startDay] = startDate.split('-').map(Number);
  const [endMonth, endDay] = endDate.split('-').map(Number);

  if (startMonth === endMonth) {
    return currentMonth === startMonth && currentDay >= startDay && currentDay <= endDay;
  }

  if (startMonth > endMonth) {
    return (
      (currentMonth === startMonth && currentDay >= startDay) ||
      (currentMonth === endMonth && currentDay <= endDay) ||
      currentMonth > startMonth ||
      currentMonth < endMonth
    );
  }

  return (
    (currentMonth === startMonth && currentDay >= startDay) ||
    (currentMonth === endMonth && currentDay <= endDay) ||
    (currentMonth > startMonth && currentMonth < endMonth)
  );
}

function getGradientClass(color1: string, color2: string): string {
  const colorMap: Record<string, string> = {
    '#dc2626': 'red-600',
    '#10b981': 'green-500',
    '#3b82f6': 'blue-600',
    '#f97316': 'orange-500',
    '#7c3aed': 'purple-600',
    '#fbbf24': 'yellow-400',
    '#ec4899': 'pink-500',
    '#000000': 'gray-900',
    '#d97706': 'amber-600',
    '#a78bfa': 'purple-400',
    '#06b6d4': 'cyan-500',
    '#f472b6': 'pink-400',
    '#34d399': 'green-400',
    '#c4b5fd': 'purple-300',
    '#fcd34d': 'yellow-300',
  };

  const color1Name = colorMap[color1] || 'blue-600';
  const color2Name = colorMap[color2] || 'green-500';

  return `from-${color1Name} to-${color2Name}`;
}

function getTextGradientClass(color1: string, color2: string): string {
  const colorMap: Record<string, string> = {
    '#dc2626': 'red-400',
    '#10b981': 'green-400',
    '#3b82f6': 'blue-400',
    '#f97316': 'orange-400',
    '#7c3aed': 'purple-400',
    '#fbbf24': 'yellow-300',
    '#ec4899': 'pink-400',
    '#000000': 'gray-300',
    '#d97706': 'amber-400',
    '#a78bfa': 'purple-300',
    '#06b6d4': 'cyan-400',
    '#f472b6': 'pink-300',
    '#34d399': 'green-300',
    '#c4b5fd': 'purple-200',
    '#fcd34d': 'yellow-200',
  };

  const color1Name = colorMap[color1] || 'blue-400';
  const color2Name = colorMap[color2] || 'green-400';

  return `from-${color1Name} to-${color2Name}`;
}

export function HolidayThemeProvider({ children }: { children: ReactNode }) {
  const [currentHoliday, setCurrentHoliday] = useState<Holiday | null>(null);

  useEffect(() => {
    function findActiveHoliday() {
      const activeHolidays = holidays
        .filter(holiday => holiday.is_active)
        .sort((a, b) => b.priority - a.priority);

      const activeHoliday = activeHolidays.find(holiday =>
        isDateInRange(holiday.start_date, holiday.end_date)
      );

      if (activeHoliday) {
        setCurrentHoliday(activeHoliday);
      }
    }

    findActiveHoliday();

    const interval = setInterval(findActiveHoliday, 3600000);

    return () => clearInterval(interval);
  }, []);

  const themeColor = currentHoliday?.theme_color || defaultTheme.theme_color;
  const secondaryColor = currentHoliday?.secondary_color || defaultTheme.secondary_color;
  const gradientClass = currentHoliday
    ? getGradientClass(currentHoliday.theme_color, currentHoliday.secondary_color)
    : defaultTheme.gradientClass;
  const textGradientClass = currentHoliday
    ? getTextGradientClass(currentHoliday.theme_color, currentHoliday.secondary_color)
    : defaultTheme.textGradientClass;

  return (
    <HolidayThemeContext.Provider
      value={{
        currentHoliday,
        isHolidayActive: currentHoliday !== null,
        themeColor,
        secondaryColor,
        gradientClass,
        textGradientClass,
      }}
    >
      {children}
    </HolidayThemeContext.Provider>
  );
}

export function useHolidayTheme() {
  const context = useContext(HolidayThemeContext);
  if (!context) {
    throw new Error('useHolidayTheme must be used within HolidayThemeProvider');
  }
  return context;
}
