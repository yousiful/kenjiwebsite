import React, { useState, useEffect, useRef } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  persistent?: boolean;
}

interface AccessibleNotificationsProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

const AccessibleNotifications: React.FC<AccessibleNotificationsProps> = ({
  position = 'top-right'
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const focusRef = useRef<HTMLDivElement>(null);

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = `notification-${Date.now()}-${Math.random()}`;
    setNotifications(prev => [...prev, { ...notification, id }]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  useEffect(() => {
    if (isPaused) return;

    const timers = notifications
      .filter(n => !n.persistent && n.duration)
      .map(notification =>
        setTimeout(() => {
          removeNotification(notification.id);
        }, notification.duration)
      );

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [notifications, isPaused]);

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" aria-hidden="true" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" aria-hidden="true" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" aria-hidden="true" />;
      case 'info':
        return <Info className="w-5 h-5" aria-hidden="true" />;
    }
  };

  const getColors = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return 'bg-green-900/90 border-green-500 text-green-100';
      case 'error':
        return 'bg-red-900/90 border-red-500 text-red-100';
      case 'warning':
        return 'bg-yellow-900/90 border-yellow-500 text-yellow-100';
      case 'info':
        return 'bg-blue-900/90 border-blue-500 text-blue-100';
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 -translate-x-1/2';
      case 'bottom-center':
        return 'bottom-4 left-1/2 -translate-x-1/2';
    }
  };

  const getAriaLive = (type: NotificationType) => {
    return type === 'error' || type === 'warning' ? 'assertive' : 'polite';
  };

  return (
    <div
      ref={focusRef}
      className={`fixed ${getPositionClasses()} z-50 flex flex-col gap-3 max-w-md pointer-events-none`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            role="alert"
            aria-live={getAriaLive(notification.type)}
            aria-atomic="true"
            className={`${getColors(notification.type)} border-2 rounded-lg shadow-xl backdrop-blur-sm p-4 pointer-events-auto w-full`}
          >
            <div className="flex gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {getIcon(notification.type)}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold mb-1">
                  {notification.title}
                </h3>
                <p className="text-sm opacity-90">
                  {notification.message}
                </p>
              </div>

              <button
                onClick={() => removeNotification(notification.id)}
                className="flex-shrink-0 p-1 rounded hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label={`Dismiss ${notification.type} notification: ${notification.title}`}
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {!notification.persistent && notification.duration && (
              <div className="mt-3 h-1 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{
                    duration: notification.duration / 1000,
                    ease: 'linear'
                  }}
                  className="h-full bg-white/50"
                />
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {notifications.length > 0 && (
        <div className="sr-only" role="status" aria-live="polite">
          {notifications.length} notification{notifications.length !== 1 ? 's' : ''} present.
          {isPaused && ' Notifications paused while focused.'}
        </div>
      )}
    </div>
  );
};

export { AccessibleNotifications, type Notification, type NotificationType };
