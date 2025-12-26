import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface DynamicDateTimeProps {
  format?: 'full' | 'date' | 'time' | 'short';
  showIcon?: boolean;
  className?: string;
  updateInterval?: number;
}

export function DynamicDateTime({
  format = 'full',
  showIcon = false,
  className = '',
  updateInterval = 1000
}: DynamicDateTimeProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, updateInterval);

    return () => clearInterval(timer);
  }, [updateInterval]);

  const formatDateTime = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
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
