export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface Contact {
  phone: string;
  email: string;
}

export interface Student {
  id: string;
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  yearOfAdmission: number;
  course: string;
  address: Address;
  contact: Contact;
}

export const AVAILABLE_COURSES = [
  'Computer Engineering',
  'Artificial Intelligence & Machine Learning',
  'Data Science',
  'Information Technology',
  'Electronics & Telecommunication'
];