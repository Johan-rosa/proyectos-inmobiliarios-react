import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp,
  FieldValue
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { PaymentPlan, Payment } from '@/types';

// Collection reference
const paymentPlansCollection = collection(db, 'paymentPlans');

// Define a type for Firestore-ready payment plan with FieldValue support
interface FirestorePaymentPlan {
  client: string;
  project: string;
  unit: string;
  currency: string;
  price: number;
  reservation: number;
  signature: number;
  reservationPercent: number;
  signaturePercent: number;
  reservationSignatuerPercent: number;
  duringConstruction: number;
  duringConstructionPercent: number;
  atDelivery: number;
  atDeliveryPercent: number;
  deliveryDate: FieldValue;
  reservationDate: FieldValue;
  signatureDate: FieldValue;
  firstPaymentDate: FieldValue;
  lastPaymentDate: FieldValue;
  frequency: string;
  payments: {
    id: number;
    date: FieldValue;
    ordinary: number;
    extra: number;
  }[];
  createdAt: FieldValue;
  updatedAt: FieldValue;
  [key: string]: unknown; // Allow additional fields
}

// Helper function to convert dates to Firestore format
const preparePaymentPlanForFirestore = (paymentPlan: PaymentPlan): FirestorePaymentPlan => {
  // Create a copy to avoid mutating the original
  const planForFirestore: Partial<FirestorePaymentPlan> = { 
    ...paymentPlan,
    // Convert Date objects to timestamps
    deliveryDate: Timestamp.now(),
    reservationDate: Timestamp.now(),
    signatureDate: Timestamp.now(),
    firstPaymentDate: Timestamp.now(),
    lastPaymentDate: Timestamp.now(),
    
    // Convert dates in payments array
    payments: paymentPlan.payments.map(payment => ({
      ...payment,
      date: Timestamp.now()
    })),
    
    // Add metadata
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
  
  return planForFirestore as FirestorePaymentPlan;
};

// Helper function to convert Firestore data to application format
const convertFirestorePaymentPlan = (doc: QueryDocumentSnapshot<DocumentData>): PaymentPlan & { id: string } => {
  const data = doc.data();
  
  // Convert Firestore timestamps back to Date objects
  const convertTimestampToDate = (timestamp: Timestamp | undefined) => 
    timestamp ? new Date(timestamp.toMillis()) : new Date();
  
  return {
    id: doc.id,
    client: data.client || '',
    project: data.project || '',
    unit: data.unit || '',
    currency: data.currency || 'USD',
    price: data.price || 0,
    reservation: data.reservation || 0,
    signature: data.signature || 0,
    reservationPercent: data.reservationPercent || 0,
    signaturePercent: data.signaturePercent || 0,
    reservationSignatuerPercent: data.reservationSignatuerPercent || 0,
    duringConstruction: data.duringConstruction || 0,
    duringConstructionPercent: data.duringConstructionPercent || 0,
    atDelivery: data.atDelivery || 0,
    atDeliveryPercent: data.atDeliveryPercent || 0,
    deliveryDate: data.deliveryDate ? convertTimestampToDate(data.deliveryDate) : new Date(),
    reservationDate: data.reservationDate ? convertTimestampToDate(data.reservationDate) : new Date(),
    signatureDate: data.signatureDate ? convertTimestampToDate(data.signatureDate) : new Date(),
    firstPaymentDate: data.firstPaymentDate ? convertTimestampToDate(data.firstPaymentDate) : new Date(),
    lastPaymentDate: data.lastPaymentDate ? convertTimestampToDate(data.lastPaymentDate) : new Date(),
    frequency: data.frequency || 'trimestral',
    payments: Array.isArray(data.payments) 
      ? data.payments.map((payment: Payment, index: number) => ({
          id: payment.id || index + 1,
          date: payment.date instanceof Timestamp ? convertTimestampToDate(payment.date) : new Date(),
          ordinary: payment.ordinary || 0,
          extra: payment.extra || 0
        }))
      : [],
    createdAt: data.createdAt ? convertTimestampToDate(data.createdAt) : new Date(),
    updatedAt: data.updatedAt ? convertTimestampToDate(data.updatedAt) : new Date(),
  };
};

// Save a new payment plan
export const savePaymentPlan = async (paymentPlan: PaymentPlan): Promise<string> => {
  try {
    const planForFirestore = preparePaymentPlanForFirestore(paymentPlan);
    const docRef = await addDoc(paymentPlansCollection, planForFirestore);
    return docRef.id;
  } catch (error) {
    console.error('Error saving payment plan:', error);
    throw error;
  }
};

// Update an existing payment plan
export const updatePaymentPlan = async (id: string, paymentPlan: PaymentPlan): Promise<void> => {
  try {
    const planForFirestore = preparePaymentPlanForFirestore(paymentPlan);
    const docRef = doc(db, 'paymentPlans', id);
    await updateDoc(docRef, {
      ...planForFirestore,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating payment plan:', error);
    throw error;
  }
};

// Get a payment plan by ID
export const getPaymentPlanById = async (id: string): Promise<(PaymentPlan & { id: string }) | null> => {
  try {
    const docRef = doc(db, 'paymentPlans', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return convertFirestorePaymentPlan(docSnap as QueryDocumentSnapshot<DocumentData>);
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting payment plan:', error);
    throw error;
  }
};

// Interface for pagination and filtering options
export interface PaymentPlanQueryOptions {
  client?: string;
  project?: string;
  startAfterDoc?: QueryDocumentSnapshot<DocumentData>;
  pageSize?: number;
  sortBy?: 'client' | 'project' | 'price' | 'createdAt' | 'updatedAt';
  sortDirection?: 'asc' | 'desc';
}

// Get all payment plans with pagination and filtering
export const getPaymentPlans = async (options: PaymentPlanQueryOptions = {}) => {
  try {
    const {
      client,
      project,
      startAfterDoc,
      pageSize = 10,
      sortBy = 'createdAt',
      sortDirection = 'desc'
    } = options;

    // Start building the query
    let q = query(paymentPlansCollection);

    // Add filters if provided
    if (client) {
      q = query(q, where('client', '>=', client), where('client', '<=', client + '\uf8ff'));
    }

    if (project) {
      q = query(q, where('project', '>=', project), where('project', '<=', project + '\uf8ff'));
    }

    // Add sorting
    q = query(q, orderBy(sortBy, sortDirection));

    // Add pagination
    q = query(q, limit(pageSize));

    // If we have a starting document for pagination
    if (startAfterDoc) {
      q = query(q, startAfter(startAfterDoc));
    }

    // Execute the query
    const querySnapshot = await getDocs(q);
    
    // Process the results
    const plans: (PaymentPlan & { id: string })[] = [];
    let lastDoc: QueryDocumentSnapshot<DocumentData> | null = null;
    
    querySnapshot.forEach((doc) => {
      plans.push(convertFirestorePaymentPlan(doc));
      lastDoc = doc;
    });

    return {
      plans,
      lastDoc,
      hasMore: plans.length === pageSize
    };
  } catch (error) {
    console.error('Error getting payment plans:', error);
    throw error;
  }
};

// Delete a payment plan
export const deletePaymentPlan = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, 'paymentPlans', id);
    await updateDoc(docRef, { 
      deleted: true,
      deletedAt: Timestamp.now() 
    });
  } catch (error) {
    console.error('Error deleting payment plan:', error);
    throw error;
  }
};

// Search payment plans by client name or project
export const searchPaymentPlans = async (searchTerm: string, maxResults = 10) => {
  try {
    // Search by client name
    const clientQuery = query(
      paymentPlansCollection,
      where('client', '>=', searchTerm),
      where('client', '<=', searchTerm + '\uf8ff'),
      orderBy('client'),
      limit(maxResults)
    );
    
    // Search by project name
    const projectQuery = query(
      paymentPlansCollection,
      where('project', '>=', searchTerm),
      where('project', '<=', searchTerm + '\uf8ff'),
      orderBy('project'),
      limit(maxResults)
    );
    
    // Execute both queries
    const [clientSnapshot, projectSnapshot] = await Promise.all([
      getDocs(clientQuery),
      getDocs(projectQuery)
    ]);
    
    // Process results
    const clientResults: (PaymentPlan & { id: string })[] = [];
    const projectResults: (PaymentPlan & { id: string })[] = [];
    
    clientSnapshot.forEach((doc) => {
      clientResults.push(convertFirestorePaymentPlan(doc));
    });
    
    projectSnapshot.forEach((doc) => {
      // Avoid duplicates
      if (!clientResults.some(plan => plan.id === doc.id)) {
        projectResults.push(convertFirestorePaymentPlan(doc));
      }
    });
    
    // Combine and limit results
    return [...clientResults, ...projectResults].slice(0, maxResults);
  } catch (error) {
    console.error('Error searching payment plans:', error);
    throw error;
  }
};