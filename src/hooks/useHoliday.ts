import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Holiday {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  theme_color: string;
  secondary_color: string;
  emoji: string;
  confetti_colors: string[];
  banner_message: string;
  is_active: boolean;
  priority: number;
}

const isDateInRange = (currentDate: Date, startDate: string, endDate: string): boolean => {
  const current = {
    month: currentDate.getMonth() + 1,
    day: currentDate.getDate()
  };

  const [startMonth, startDay] = startDate.split('-').map(Number);
  const [endMonth, endDay] = endDate.split('-').map(Number);

  const currentValue = current.month * 100 + current.day;
  const startValue = startMonth * 100 + startDay;
  const endValue = endMonth * 100 + endDay;

  if (startValue <= endValue) {
    return currentValue >= startValue && currentValue <= endValue;
  } else {
    return currentValue >= startValue || currentValue <= endValue;
  }
};

export const useHoliday = () => {
  const [currentHoliday, setCurrentHoliday] = useState<Holiday | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const { data, error } = await supabase
          .from('holidays')
          .select('*')
          .eq('is_active', true)
          .order('priority', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          const today = new Date();

          const activeHolidays = data.filter((holiday) =>
            isDateInRange(today, holiday.start_date, holiday.end_date)
          );

          if (activeHolidays.length > 0) {
            setCurrentHoliday(activeHolidays[0] as Holiday);
          } else {
            setCurrentHoliday(null);
          }
        }
      } catch (error) {
        console.error('Error fetching holidays:', error);
        setCurrentHoliday(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHolidays();

    const checkInterval = setInterval(fetchHolidays, 1000 * 60 * 60);

    return () => clearInterval(checkInterval);
  }, []);

  return { currentHoliday, loading };
};