import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Student } from '../types/student';

interface StudentContextType {
  students: Student[];
  addStudent: (student: Omit<Student, 'id'>) => Promise<void>;
  updateStudent: (id: string, student: Omit<Student, 'id'>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  loading: boolean;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

const API_BASE = 'http://localhost:5000/api/students';

const INITIAL_MOCK: Student[] = [
  {
    id: '1',
    name: 'Bhavesh Lohar',
    gender: 'Male',
    dob: '2004-07-29',
    yearOfAdmission: 2022,
    course: 'Artificial Intelligence & Machine Learning',
    address: { street: 'Main Road', city: 'Shirpur', state: 'Maharashtra', postalCode: '425405' },
    contact: { phone: '9876543210', email: 'bhavesh@example.com' }
  }
];

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(() => {
    const local = localStorage.getItem('wel_students');
    return local ? JSON.parse(local) : INITIAL_MOCK;
  });
const [loading] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch(API_BASE);
        if (res.ok) {
          const data = await res.json();
          setStudents(data);
          localStorage.setItem('wel_students', JSON.stringify(data));
        }
      } catch {
        // Fallback to local state if backend is offline
      }
    };
    fetchStudents();
  }, []);

  const persistLocally = (updated: Student[]) => {
    setStudents(updated);
    localStorage.setItem('wel_students', JSON.stringify(updated));
  };

  const addStudent = async (data: Omit<Student, 'id'>) => {
    const newStudent: Student = { ...data, id: crypto.randomUUID() };
    try {
      await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent)
      });
    } catch {
      // Backend silent fallback
    }
    persistLocally([newStudent, ...students]);
  };

  const updateStudent = async (id: string, data: Omit<Student, 'id'>) => {
    const updatedStudent: Student = { ...data, id };
    try {
      await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedStudent)
      });
    } catch {
      // Backend silent fallback
    }
    persistLocally(students.map(s => (s.id === id ? updatedStudent : s)));
  };

  const deleteStudent = async (id: string) => {
    try {
      await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    } catch {
      // Backend silent fallback
    }
    persistLocally(students.filter(s => s.id !== id));
  };

  return (
    <StudentContext.Provider value={{ students, addStudent, updateStudent, deleteStudent, loading }}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudents = () => {
  const context = useContext(StudentContext);
  if (!context) throw new Error('useStudents must be used within a StudentProvider');
  return context;
};