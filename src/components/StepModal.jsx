import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft } from 'lucide-react';

export const StepModal = ({ isOpen, onClose, title, children, showBack, onBack, currentStep, totalSteps = 5 }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg glass-card-dark rounded-3xl p-6 sm:p-8 shadow-2xl border border-rose-500/30 overflow-hidden z-10 my-auto"
        >
          {/* Top Progress bar */}
          {currentStep && (
            <div className="w-full bg-slate-800/60 h-1.5 rounded-full mb-6 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}

          {/* Modal Header */}
          <div className="flex items-center justify-between mb-6">
            {showBack ? (
              <button
                onClick={onBack}
                className="p-2 rounded-full text-slate-300 hover:text-rose-400 hover:bg-rose-950/50 transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : (
              <div className="w-9" />
            )}

            {title && (
              <h2 className="text-xl sm:text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-100 to-rose-300">
                {title}
              </h2>
            )}

            {onClose ? (
              <button
                onClick={onClose}
                className="p-2 rounded-full text-slate-400 hover:text-rose-400 hover:bg-rose-950/50 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            ) : (
              <div className="w-9" />
            )}
          </div>

          {/* Modal Body */}
          <div className="relative">{children}</div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
