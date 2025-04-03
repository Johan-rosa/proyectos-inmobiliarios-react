export interface PaymentPlan {
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
  deliveryDate: Date;
  reservationDate: Date;
  signatureDate: Date;
  firstPaymentDate: Date;
  lastPaymentDate: Date;
  frequency: string;
  payments: Payment[];
}

export interface Payment {
  id: number
  date: Date
  ordinary: number
  extra: number
}