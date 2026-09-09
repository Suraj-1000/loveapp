import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { calculatePrepTime } from '../utils/dateUtils';
import { triggerLoveConfetti } from '../components/Confetti';

export const useInvitation = (inviteCode) => {
  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form State
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedVibe, setSelectedVibe] = useState('');

  // Flow & Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Funny modal, 2: Date, 3: Time, 4: Vibe, 5: Confirm
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [prepDetails, setPrepDetails] = useState(null);

  const fetchInvitation = useCallback(async () => {
    if (!inviteCode) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data, error: err } = await supabase.getInvitation(inviteCode);
      if (err) throw err;
      if (data) {
        setInvitation(data);
        if (data.status === 'confirmed' || data.response === 'YES') {
          setIsConfirmed(true);
          setSelectedDate(data.selected_date || '');
          setSelectedTime(data.selected_time || '');
          setSelectedVibe(data.vibe || '');

          if (data.selected_date && data.selected_time) {
            const computed = calculatePrepTime(data.selected_date, data.selected_time);
            setPrepDetails(computed);
          }
        }
      }
    } catch (e) {
      console.error('Error fetching invitation:', e);
      setError('Could not load invitation');
    } finally {
      setLoading(false);
    }
  }, [inviteCode]);

  useEffect(() => {
    fetchInvitation();
  }, [fetchInvitation]);

  const handleSelectYes = () => {
    triggerLoveConfetti();
    setIsModalOpen(true);
    setCurrentStep(1);
  };

  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleConfirmDate = async () => {
    if (!selectedDate || !selectedTime) return;

    setIsSubmitting(true);

    const computed = calculatePrepTime(selectedDate, selectedTime);
    setPrepDetails(computed);

    try {
      const { data, error: err } = await supabase.submitResponse({
        inviteCode: inviteCode || 'demo-love-2026',
        response: 'YES',
        selectedDate,
        selectedTime,
        vibe: selectedVibe || 'Surprise Me',
        prepTime: computed.prepDateTimeISO,
      });

      if (err) throw err;

      triggerLoveConfetti();
      setIsConfirmed(true);
      setIsModalOpen(false);
      if (data) setInvitation(data);
    } catch (e) {
      console.error('Error saving date response:', e);
      setError('Oops 😭 Something went wrong saving your date. Please try again ❤️');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
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
    setCurrentStep,
    isSubmitting,
    isConfirmed,
    prepDetails,
    handleSelectYes,
    handleNextStep,
    handlePrevStep,
    handleConfirmDate,
    refetch: fetchInvitation,
  };
};
