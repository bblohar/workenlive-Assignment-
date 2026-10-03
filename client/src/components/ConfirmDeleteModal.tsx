import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  studentName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDeleteModal: React.FC<Props> = ({ isOpen, studentName, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={24} />
        </div>
        <h3 className="text-lg font-bold text-slate-800">Confirm Deletion</h3>
        <p className="text-sm text-slate-600 mt-2">
          Are you sure you want to remove <span className="font-semibold text-slate-900">{studentName}</span>? This action cannot be undone.
        </p>
        <div className="flex justify-center gap-3 mt-6">
          <button onClick={onCancel} className="px-4 py-2 border rounded-lg text-sm text-slate-600 hover:bg-slate-50 font-medium">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold">Delete</button>
        </div>
      </div>
    </div>
  );
};