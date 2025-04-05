import { ref, onValue, off, DataSnapshot } from 'firebase/database';
import { useState, useEffect } from 'react';
import { database } from '@/lib/firebase';
import { PaymentPlanWithID } from '@/types';

export function usePaymentPlans() {
  const [plans, setPlans] = useState<PaymentPlanWithID[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const plansRef = ref(database, 'payment_plans');
    setLoading(true);

    const handleData = (snapshot: DataSnapshot) => {
      try {
        const data = snapshot.val();
        if (data) {
          const plansArray = Object.keys(data).map(key => ({
            firebase_id: key,
            ...data[key],
            currency: data[key].currency || 'USD',
            reservationPercent: data[key].reservationPercent || 0,
            duringConstructionPercent: data[key].duringConstructionPercent || 0,
            atDeliveryPercent: data[key].atDeliveryPercent || 0,
          }));
          setPlans(plansArray);
        } else {
          setPlans([]);
        }
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setLoading(false);
      }
    };

    onValue(plansRef, handleData, (err) => {
      setError(err);
      setLoading(false);
    });

    return () => off(plansRef);
  }, []);

  return { plans, loading, error };
}