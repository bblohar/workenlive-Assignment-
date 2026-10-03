import React from 'react';
import type { Student } from '../types/student';
import { X, Mail, Phone, MapPin, Calendar, BookOpen, User } from 'lucide-react';

interface Props {
  student: Student | null;
  onClose: () => void;
}

export const DetailModal: React.FC<Props> = ({ student, onClose }) => {
  if (!student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
        <div className="flex justify-between items-start border-b pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{student.name}</h2>
            <p className="text-sm text-blue-600 font-medium">{student.course}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>

        <div className="mt-5 space-y-4 text-sm text-slate-700">
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl">
            <div className="flex items-center gap-2">
              <User size={16} className="text-slate-400" />
              <span><strong>Gender:</strong> {student.gender}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-slate-400" />
              <span><strong>DOB:</strong> {student.dob}</span>
            </div>
            <div className="flex items-center gap-2 col-span-2">
              <BookOpen size={16} className="text-slate-400" />
              <span><strong>Admission Year:</strong> {student.yearOfAdmission}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-blue-500" />
              <a href={`mailto:${student.contact.email}`} className="text-blue-600 hover:underline">{student.contact.email}</a>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-emerald-500" />
              <span>{student.contact.phone}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin size={16} className="text-rose-500 shrink-0 mt-0.5" />
              <span>{student.address.street}, {student.address.city}, {student.address.state} - {student.address.postalCode}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};