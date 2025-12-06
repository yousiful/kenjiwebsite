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
  is_active: boolean;
  priority: number;
}

const holidays: Holiday[] = [
  {
    id: '1',
    name: 'Christmas',
    start_date: '12-01',
    end_date: '12-26',
    theme_color: '#dc2626',
    secondary_color: '#10b981',
    emoji: '🎄',
    confetti_colors: ['#dc2626', '#10b981', '#ffffff', '#fbbf24'],
    banner_message: 'Merry Christmas from KenjiAI!',
    is_active: true,
    priority: 10
  },
  {
    id: '2',
    name: 'New Year',
    start_date: '12-26',
    end_date: '01-02',
    theme_color: '#fbbf24',
    secondary_color: '#fcd34d',
    emoji: '🎆',
    confetti_colors: ['#fbbf24', '#fcd34d', '#ffffff', '#60a5fa'],
    banner_message: 'Happy New Year! Start fresh with KenjiAI',
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
