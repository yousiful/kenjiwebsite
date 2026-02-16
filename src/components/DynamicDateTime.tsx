import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface DynamicDateTimeProps {
  format?: 'full' | 'date' | 'time' | 'short';
  showIcon?: boolean;
  className?: string;
  updateInterval?: number;
  timezone?: string;
}

export function DynamicDateTime({
  format = 'full',
  showIcon = false,
  className = '',
  updateInterval = 1000,
  timezone = 'America/Chicago'
}: DynamicDateTimeProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, updateInterval);

    return () => clearInterval(timer);
  }, [updateInterval]);

  const formatDateTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { timeZone: timezone };
    const tzDate = new Date(date.toLocaleString('en-US', options));

    const month = tzDate.getMonth() + 1;
    const day = tzDate.getDate();
    const year = tzDate.getFullYear();

    let hours = tzDate.getHours();
    const minutes = tzDate.getMinutes();
    const seconds = tzDate.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;

    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    const secondsStr = seconds < 10 ? '0' + seconds : seconds;

    switch (format) {
      case 'date':
        return `${month}/${day}/${year}`;
      case 'time':
        return `${hours}:${minutesStr}:${secondsStr} ${ampm}`;
      case 'short':
        return `${month}/${day}/${year} ${hours}:${minutesStr} ${ampm}`;
      case 'full':
      default:
        return `${month}/${day}/${year} ${hours}:${minutesStr}:${secondsStr} ${ampm}`;
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showIcon && <Clock className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />}
      <time dateTime={currentTime.toISOString()}>
        {formatDateTime(currentTime)}
      </time>
    </div>
  );
}
