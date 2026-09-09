import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, AlertCircle, CheckCircle2, Lock } from 'lucide-react';
import { HeartBackground } from '../components/HeartBackground';
import { MovingNoButton } from '../components/MovingNoButton';
import { LoveButton } from '../components/LoveButton';
import { StepModal } from '../components/StepModal';
import { DatePicker } from '../components/DatePicker';
import { TimePicker } from '../components/TimePicker';
import { VibeCard } from '../components/VibeCard';
import { FinalConfirmation } from '../components/FinalConfirmation';
import { Countdown } from '../components/Countdown';
import { AudioPlayer } from '../components/AudioPlayer';
import { useInvitation } from '../hooks/useInvitation';

export const DateInvitation = () => {
  const { inviteCode } = useParams();
  const actualCode = inviteCode || 'demo-love-2026';

  const {
    invitation,
    loading,
    error,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    selectedVibe,
    setSelectedVibe,
    isModalOpen,
    setIsModalOpen,
    currentStep,
    isSubmitting,
    isConfirmed,
    prepDetails,
    handleSelectYes,
    handleNextStep,
    handlePrevStep,
    handleConfirmDate,
  } = useInvitation(actualCode);

  const senderName = invitation?.sender_name || 'Suraj';
  const recipientName = invitation?.recipient_name || 'My Love';

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <HeartBackground />
        <div className="relative z-10 flex flex-col items-center gap-4 text-center">
          <Heart className="w-12 h-12 text-rose-500 animate-bounce fill-rose-500/30" />
          <p className="text-xl font-bold text-rose-200">Opening your invitation... ❤️</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden">
      <HeartBackground />
      <AudioPlayer />

      <main className="relative z-10 w-full max-w-lg my-auto">
        <AnimatePresence mode="wait">
          {/* ============================================================
              STATE A: CONFIRMED SUCCESS SCREEN
             ============================================================ */}
          {isConfirmed ? (
            <motion.div
              key="success-screen"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card-dark rounded-3xl p-6 sm:p-8 border border-rose-500/40 text-center space-y-6 shadow-2xl backdrop-blur-2xl"
            >
              {/* Header Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold text-xs sm:text-sm uppercase tracking-widest animate-pulse">
                <Sparkles className="w-4 h-4" /> Date Locked 🔒❤️
              </div>

              {/* Main Title */}
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-pink-100 to-rose-200 tracking-tight drop-shadow-md">
                  🎉 IT'S A DATE! ❤️
                </h1>
                <p className="text-slate-300 text-sm sm:text-base font-medium">
                  Glad you didn't say no. 😌
                </p>
              </div>

              {/* Date & Time Highlight Box */}
              <div className="bg-slate-900/90 rounded-2xl p-5 border border-rose-500/30 space-y-3 shadow-inner">
                <div className="text-lg sm:text-xl font-extrabold text-white">
                  📅 {prepDetails?.formattedSelectedDate || selectedDate}
                </div>
                <div className="text-base sm:text-lg font-bold text-rose-300">
                  🕐 {prepDetails?.formattedSelectedTime || selectedTime}
                </div>
                {selectedVibe && (
                  <div className="inline-block px-3.5 py-1 rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-200 text-xs font-semibold">
                    ✨ {selectedVibe}
                  </div>
                )}
              </div>

              {/* 30-Minute Preparation Time Highlight */}
              {prepDetails?.prepTimeString && (
                <div className="bg-gradient-to-r from-rose-950/70 via-rose-900/40 to-slate-900/80 rounded-2xl p-4 border border-rose-400/40 text-left flex items-start gap-3 shadow-lg">
                  <div className="p-2.5 bg-rose-500/20 text-rose-400 rounded-xl mt-0.5 shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-rose-200">
                      Be ready by {prepDetails.prepTimeString}. ❤️
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                      I'll be coming to get you. 😌
                    </p>
                  </div>
                </div>
              )}

              {/* Ticking Countdown Timer */}
              {prepDetails?.targetDateObj && (
                <div className="pt-2">
                  <Countdown targetDate={prepDetails.targetDateObj} />
                </div>
              )}

              <p className="text-xs text-slate-400 italic pt-2">
                "No backing out now. See you soon, beautiful. ❤️"
              </p>
            </motion.div>
          ) : (
            /* ============================================================
                STATE B: LANDING INVITATION QUESTION PAGE
               ============================================================ */
            <motion.div
              key="landing-question"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card-dark rounded-3xl p-5 sm:p-10 border border-rose-500/30 text-center space-y-6 sm:space-y-8 shadow-2xl backdrop-blur-2xl w-full max-w-[94vw] sm:max-w-lg mx-auto"
            >
              {/* Header Greeting */}
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 font-semibold text-xs sm:text-sm">
                  <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                  <span>{senderName} sent you a private message</span>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-rose-200/90 tracking-wide">
                  💌 A Very Important Question...
                </h2>

                <h1 className="text-2xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-100 to-pink-200 tracking-tight leading-tight pt-1 sm:pt-2 drop-shadow-md">
                  Will you go on a date with me? ❤️
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  Think carefully... 👀
                </p>
              </div>

              {/* Error Message if any */}
              {error && (
                <div className="p-3 bg-rose-950/80 border border-rose-500/50 rounded-xl text-xs text-rose-200 flex items-center justify-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              {/* Interactive YES & Moving NO Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-2 sm:pt-4 relative min-h-[130px] w-full max-w-full">
                <LoveButton onClick={handleSelectYes}>
                  YES ❤️
                </LoveButton>

                <MovingNoButton />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ============================================================
          INTERACTIVE DATE PLANNING STEP MODAL (Steps 1 to 5)
         ============================================================ */}
      <StepModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        showBack={currentStep > 1 && currentStep < 5}
        onBack={handlePrevStep}
        currentStep={currentStep}
        totalSteps={5}
        title={
          currentStep === 1
            ? 'WAIT... 😳'
            : currentStep === 2
            ? 'So... when are you free? 🥰'
            : currentStep === 3
            ? 'What time should I steal you for? 🕐'
            : currentStep === 4
            ? "What's our date vibe? ✨"
            : 'One last look 👀❤️'
        }
      >
        {/* Step 1: Funny Modal */}
        {currentStep === 1 && (
          <div className="text-center space-y-6 py-2">
            <div className="text-5xl animate-bounce">😳❤️</div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-rose-200">You actually chose YES?!</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                I wasn't emotionally prepared for this. 😂❤️
              </p>
              <p className="text-rose-300 text-xs font-semibold">Good choice though. 😌</p>
            </div>
            <LoveButton fullWidth onClick={handleNextStep}>
              Okay ❤️
            </LoveButton>
          </div>
        )}

        {/* Step 2: Date Picker */}
        {currentStep === 2 && (
          <DatePicker
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onNext={handleNextStep}
          />
        )}

        {/* Step 3: Time Picker */}
        {currentStep === 3 && (
          <TimePicker
            selectedTime={selectedTime}
            onSelectTime={setSelectedTime}
            onNext={handleNextStep}
          />
        )}

        {/* Step 4: Vibe Card Selection */}
        {currentStep === 4 && (
          <VibeCard
            selectedVibe={selectedVibe}
            onSelectVibe={setSelectedVibe}
            onNext={handleNextStep}
          />
        )}

        {/* Step 5: Final Confirmation & Save */}
        {currentStep === 5 && (
          <FinalConfirmation
            date={selectedDate}
            time={selectedTime}
            vibe={selectedVibe}
            onConfirm={handleConfirmDate}
            isSubmitting={isSubmitting}
          />
        )}
      </StepModal>

      {/* Footer Link for Admin */}
      <footer className="relative z-10 mt-6 text-center">
        <Link
          to="/admin"
          className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-rose-400 transition-colors py-1 px-3 rounded-full hover:bg-slate-900/60"
        >
          <Lock className="w-3 h-3" /> Admin Dashboard
        </Link>
      </footer>
    </div>
  );
};
