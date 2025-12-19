import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FormNotificationProps {
  type: 'success' | 'error';
  message: string;
  show: boolean;
  onClose: () => void;
  autoHideDuration?: number;
}

export function FormNotification({
  type,
  message,
  show,
  onClose,
  autoHideDuration = 5000,
}: FormNotificationProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!show) {
      setProgress(100);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - (100 / (autoHideDuration / 100));
        if (newProgress <= 0) {
          onClose();
          return 0;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [show, autoHideDuration, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="fixed top-4 right-4 z-50 max-w-md w-full"
        >
          <div
            className={`
              relative overflow-hidden rounded-lg shadow-lg border-2
              ${type === 'success'
                ? 'bg-green-50 border-green-300'
                : 'bg-red-50 border-red-300'
              }
            `}
          >
            <div className="p-4 flex items-start gap-3">
              <div className="flex-shrink-0">
                {type === 'success' ? (
                  <CheckCircle2 className="text-green-600" size={24} />
                ) : (
                  <XCircle className="text-red-600" size={24} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3
                  className={`font-semibold text-sm ${
                    type === 'success' ? 'text-green-900' : 'text-red-900'
                  }`}
                >
                  {type === 'success' ? 'Success!' : 'Error'}
                </h3>
                <p
                  className={`mt-1 text-sm ${
                    type === 'success' ? 'text-green-700' : 'text-red-700'
                  }`}
                >
                  {message}
                </p>
              </div>

              <button
                onClick={onClose}
                className={`
                  flex-shrink-0 rounded-lg p-1 transition-colors
                  ${type === 'success'
                    ? 'hover:bg-green-100 text-green-600'
                    : 'hover:bg-red-100 text-red-600'
                  }
                `}
              >
                <X size={18} />
              </button>
            </div>

            <div
              className={`h-1 transition-all duration-100 ease-linear ${
                type === 'success' ? 'bg-green-500' : 'bg-red-500'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface InlineFormMessageProps {
  type: 'success' | 'error' | 'info';
  message: string;
  show: boolean;
}

export function InlineFormMessage({ type, message, show }: InlineFormMessageProps) {
  if (!show) return null;

  const styles = {
    success: 'bg-green-50 border-green-300 text-green-800',
    error: 'bg-red-50 border-red-300 text-red-800',
    info: 'bg-blue-50 border-blue-300 text-blue-800',
  };

  const icons = {
    success: <CheckCircle2 className="text-green-600" size={20} />,
    error: <XCircle className="text-red-600" size={20} />,
    info: <CheckCircle2 className="text-blue-600" size={20} />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className={`flex items-center gap-2 p-4 rounded-lg border-2 ${styles[type]}`}
    >
      {icons[type]}
      <p className="text-sm font-medium">{message}</p>
    </motion.div>
  );
}
