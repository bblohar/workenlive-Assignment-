import React, { useState, useEffect } from 'react';
import { type Student, AVAILABLE_COURSES } from '../types/student';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (student: Omit<Student, 'id'>) => void;
  initialData?: Student | null;
}

export const StudentFormModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    dob: '',
    yearOfAdmission: new Date().getFullYear(),
    course: AVAILABLE_COURSES[0],
    street: '',
    city: '',
    state: '',
    postalCode: '',
    phone: '',
    email: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        gender: initialData.gender,
        dob: initialData.dob,
        yearOfAdmission: initialData.yearOfAdmission,
        course: initialData.course,
        street: initialData.address.street,
        city: initialData.address.city,
        state: initialData.address.state,
        postalCode: initialData.address.postalCode,
        phone: initialData.contact.phone,
        email: initialData.contact.email
      });
    } else {
      setFormData({
        name: '',
        gender: 'Male',
        dob: '',
        yearOfAdmission: new Date().getFullYear(),
        course: AVAILABLE_COURSES[0],
        street: '',
        city: '',
        state: '',
        postalCode: '',
        phone: '',
        email: ''
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const err: Record<string, string> = {};
    if (!formData.name.trim()) err.name = 'Full name is required';
    if (!formData.dob) err.dob = 'Date of birth is required';
    if (!formData.street.trim()) err.street = 'Street is required';
    if (!formData.city.trim()) err.city = 'City is required';
    if (!formData.state.trim()) err.state = 'State is required';
    
    if (!/^\d{6}$/.test(formData.postalCode.trim())) {
      err.postalCode = 'Postal code must be exactly 6 digits';
    }
    if (!/^\d{10}$/.test(formData.phone.trim())) {
      err.phone = 'Phone number must be a valid 10-digit number';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      err.email = 'Enter a valid email address';
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      name: formData.name,
      gender: formData.gender,
      dob: formData.dob,
      yearOfAdmission: Number(formData.yearOfAdmission),
      course: formData.course,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode
      },
      contact: {
        phone: formData.phone,
        email: formData.email
      }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center pb-4 border-b">
          <h2 className="text-xl font-bold text-slate-800">
            {initialData ? 'Update Student Record' : 'Register New Student'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
              <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Gender</label>
              <select value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value as any })} className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Date of Birth</label>
              <input type="date" value={formData.dob} onChange={e => setFormData({ ...formData, dob: e.target.value })} className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Admission Year</label>
              <input type="number" min="2015" max="2030" value={formData.yearOfAdmission} onChange={e => setFormData({ ...formData, yearOfAdmission: Number(e.target.value) })} className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Course</label>
            <select value={formData.course} onChange={e => setFormData({ ...formData, course: e.target.value })} className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
              {AVAILABLE_COURSES.map(course => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Email</label>
              <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Phone</label>
              <input type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
          </div>

          <div className="border-t pt-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Address</h3>
            <div className="space-y-3">
              <input type="text" placeholder="Street Address" value={formData.street} onChange={e => setFormData({ ...formData, street: e.target.value })} className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              {errors.street && <p className="text-red-500 text-xs">{errors.street}</p>}

              <div className="grid grid-cols-3 gap-2">
                <input type="text" placeholder="City" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} className="border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                <input type="text" placeholder="State" value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} className="border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                <input type="text" placeholder="PIN Code" value={formData.postalCode} onChange={e => setFormData({ ...formData, postalCode: e.target.value })} className="border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              {(errors.city || errors.state || errors.postalCode) && (
                <p className="text-red-500 text-xs">Please provide valid City, State, and 6-digit Postal Code.</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm">
              {initialData ? 'Save Changes' : 'Create Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};