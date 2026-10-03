import React, { useState, useMemo } from 'react';
import { useStudents } from './context/StudentContext';
import { type Student, AVAILABLE_COURSES } from './types/student';
import { StudentFormModal } from './components/StudentFormModal';
import { DetailModal } from './components/DetailModal';
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal';
import { Search, Plus, Trash2, Edit2, ChevronLeft, ChevronRight, ArrowUpDown, Eye } from 'lucide-react';

export const App: React.FC = () => {
  const { students, addStudent, updateStudent, deleteStudent } = useStudents();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('');

  const [sortField, setSortField] = useState<'name' | 'yearOfAdmission' | 'course'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [detailStudent, setDetailStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);

  const admissionYears = useMemo(() => {
    return Array.from(new Set(students.map(s => s.yearOfAdmission))).sort((a, b) => b - a);
  }, [students]);

  const filteredAndSortedStudents = useMemo(() => {
    return students
      .filter(s => {
        const matchesSearch =
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.yearOfAdmission.toString().includes(searchTerm);

        const matchesCourse = selectedCourse ? s.course === selectedCourse : true;
        const matchesYear = selectedYear ? s.yearOfAdmission === Number(selectedYear) : true;

        return matchesSearch && matchesCourse && matchesYear;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (typeof valA === 'string') {
          return sortOrder === 'asc'
            ? valA.localeCompare(valB as string)
            : (valB as string).localeCompare(valA);
        }
        return sortOrder === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
      });
  }, [students, searchTerm, selectedCourse, selectedYear, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedStudents.length / pageSize) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedStudents.slice(start, start + pageSize);
  }, [filteredAndSortedStudents, currentPage]);

  const toggleSort = (field: 'name' | 'yearOfAdmission' | 'course') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Student Management System</h1>
          <p className="text-sm text-slate-500">Manage admissions, credentials, and student directories</p>
        </div>
        <button
          onClick={() => { setEditingStudent(null); setIsFormOpen(true); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl shadow-sm transition"
        >
          <Plus size={18} />
          Add Student
        </button>
      </div>

      <div className="bg-white border rounded-xl p-4 mb-6 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search size={18} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, course, year..."
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex w-full md:w-auto gap-3 flex-wrap">
          <select
            value={selectedCourse}
            onChange={e => { setSelectedCourse(e.target.value); setCurrentPage(1); }}
            className="border rounded-lg px-3 py-2 text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">All Courses</option>
            {AVAILABLE_COURSES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            value={selectedYear}
            onChange={e => { setSelectedYear(e.target.value); setCurrentPage(1); }}
            className="border rounded-lg px-3 py-2 text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">All Admission Years</option>
            {admissionYears.map(year => <option key={year} value={year}>{year}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b text-slate-600 font-semibold uppercase text-xs tracking-wider">
              <tr>
                <th className="py-3 px-4 cursor-pointer" onClick={() => toggleSort('name')}>
                  <div className="flex items-center gap-1.5">Name <ArrowUpDown size={14} /></div>
                </th>
                <th className="py-3 px-4 cursor-pointer" onClick={() => toggleSort('course')}>
                  <div className="flex items-center gap-1.5">Course <ArrowUpDown size={14} /></div>
                </th>
                <th className="py-3 px-4 cursor-pointer" onClick={() => toggleSort('yearOfAdmission')}>
                  <div className="flex items-center gap-1.5">Year <ArrowUpDown size={14} /></div>
                </th>
                <th className="py-3 px-4">Gender</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    No matching student records found.
                  </td>
                </tr>
              ) : (
                paginatedStudents.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 font-medium text-slate-900 cursor-pointer" onClick={() => setDetailStudent(student)}>
                      {student.name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{student.course}</td>
                    <td className="py-3.5 px-4 text-slate-600">{student.yearOfAdmission}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                        {student.gender}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-xs">
                      <div>{student.contact.email}</div>
                      <div>{student.contact.phone}</div>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button onClick={() => setDetailStudent(student)} className="p-1.5 hover:bg-slate-100 text-slate-500 rounded-lg">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => { setEditingStudent(student); setIsFormOpen(true); }} className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => setDeletingStudent(student)} className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t bg-slate-50 text-xs text-slate-600">
          <span>Showing {paginatedStudents.length} of {filteredAndSortedStudents.length} results</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1 border rounded disabled:opacity-40">
              <ChevronLeft size={16} />
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-1 border rounded disabled:opacity-40">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <StudentFormModal isOpen={isFormOpen} onClose={() => { setIsFormOpen(false); setEditingStudent(null); }} initialData={editingStudent} onSubmit={(data) => { editingStudent ? updateStudent(editingStudent.id, data) : addStudent(data); }} />
      <DetailModal student={detailStudent} onClose={() => setDetailStudent(null)} />
      <ConfirmDeleteModal isOpen={Boolean(deletingStudent)} studentName={deletingStudent?.name || ''} onConfirm={() => { if (deletingStudent) { deleteStudent(deletingStudent.id); setDeletingStudent(null); } }} onCancel={() => setDeletingStudent(null)} />
    </div>
  );
};