import { Timestamp } from "firebase/firestore";

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
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PaymentPlanWithID extends PaymentPlan {
  id: string;
}

export interface Payment {
  id: number
  date: Date | Timestamp | string
  ordinary: number
  extra: number
}