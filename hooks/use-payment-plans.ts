import { useState, useEffect } from 'react';
import { ref, onValue, off, DataSnapshot } from 'firebase/database';
import { database } from '@/lib/firebase';

import { PaymentPlan } from '@/types';

export function usePaymentPlans() {
  const [plans, setPlans] = useState<PaymentPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const plansRef = ref(database, 'payment_plans');

    setLoading(true);

    const handleData = (snapshot: DataSnapshot) => {
      try {
        const data = snapshot.val();
        if (data) {
          console.log('Data received:', data);
          
          const plansArray = Object.keys(data).map(key => ({
            firebase_id: key,
            ...data[key]
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

    // Cleanup subscription
    return () => {
      off(plansRef);
    };
  }, []);

  return { plans, loading, error };
}
