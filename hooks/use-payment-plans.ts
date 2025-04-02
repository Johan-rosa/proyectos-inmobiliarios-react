import { useState, useEffect } from 'react';
import { ref, onValue, off, DataSnapshot } from 'firebase/database';
import { database } from '@/lib/firebase';

export type PaymentPlan = {
  id: string;
  client: string;
  vendedor: string;
  proyecto: string;
  unidad: string;
  moneda: string;
  amount: number;
  inicial: number;
  reserva: number;
  firma: number;
  reserva_firma: number;
  en_cuotas: number;
  contra_entrega: number;
  n_cuotas: number;
  original_payment: number;
  payment: number;
  frequency: string;
  payment_start: string; // ISO date string
  payment_end: string; // ISO date string
  fecha_reserva: string; // ISO date string
  fecha_firma: string; // ISO date string
  fecha_entrega: string; // ISO date string
  payment_table: {
    Id: number;
    Fecha: string; // ISO date string
    Cuota: number;
  }[];
  extra: number;
  creator_email: string;
  date: string; // ISO date string
  last_edit: string; // ISO date string
  status: 'Borrador' | 'Firmado';
};

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
          // Convert Firebase object to array
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
