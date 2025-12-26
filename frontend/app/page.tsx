'use client';

import { useEffect, useState } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Check, Trash2, Skull } from 'lucide-react';
import { api } from '@/lib/api';
import { Assignment, Person } from '@/types';

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [currentDate]);

  useEffect(() => {
    loadPersons();
  }, []);

  const loadPersons = async () => {
    try {
      const data = await api.getPersons();
      setPersons(data);
    } catch (error) {
      console.error('Error loading persons:', error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      const data = await api.getAssignmentsByDate(dateStr);
      setAssignments(data);
    } catch (error) {
      console.error('Error loading assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await api.completeAssignment(id);
      await loadData();
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const handleDeleteDay = async (id: string) => {
    if (!confirm('¿Eliminar esta tarea solo de hoy?')) return;
    try {
      await api.deleteAssignment(id);
      await loadData();
    } catch (error) {
      console.error('Error deleting assignment:', error);
    }
  };

  const handleDeleteAll = async (taskId: string, taskName: string) => {
    if (!confirm(`¿Eliminar "${taskName}" de TODOS los días?`)) return;
    try {
      await api.deleteTaskAssignments(taskId);
      await loadData();
    } catch (error) {
      console.error('Error deleting all assignments:', error);
    }
  };

  const getPersonColor = (personId: string) => {
    const person = persons.find(p => p.id === personId);
    return person?.color || '#3B82F6';
  };

  // Agrupar por persona
  const byPerson = assignments.reduce((acc, a) => {
    if (!acc[a.personId]) acc[a.personId] = [];
    acc[a.personId].push(a);
    return acc;
  }, {} as Record<string, Assignment[]>);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header con selector de fecha */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentDate(subDays(currentDate, 1))}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              {format(currentDate, "EEEE, dd 'de' MMMM", { locale: es })}
            </h1>
            <p className="text-gray-600">{format(currentDate, 'yyyy')}</p>
          </div>
          
          <button
            onClick={() => setCurrentDate(addDays(currentDate, 1))}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Lista de tareas */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Cargando tareas...</p>
        </div>
      ) : assignments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg">No hay tareas asignadas para este día</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(byPerson).map(([personId, tasks]) => {
            const person = tasks[0]?.person;
            const totalMinutes = tasks.reduce((sum, t) => sum + (t.task?.duration || 0), 0);
            
            return (
              <div key={personId} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div 
                  className="p-4 text-white font-bold text-lg"
                  style={{ backgroundColor: getPersonColor(personId) }}
                >
                  {person?.name} - {tasks.length} tareas ({totalMinutes} min / {(totalMinutes / 60).toFixed(1)} hrs)
                </div>
                
                <div className="divide-y">
                  {tasks.map((assignment) => (
                    <div 
                      key={assignment.id} 
                      className={`p-4 flex items-center justify-between ${assignment.completed ? 'bg-gray-50' : ''}`}
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <input
                          type="checkbox"
                          checked={assignment.completed}
                          onChange={() => handleComplete(assignment.id)}
                          className="w-5 h-5 rounded"
                        />
                        <div className="flex-1">
                          <p className={`font-medium ${assignment.completed ? 'line-through text-gray-500' : ''}`}>
                            {assignment.task?.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {assignment.task?.duration} minutos
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleDeleteDay(assignment.id)}
                          className="p-2 text-gray-400 hover:text-gray-600 rounded"
                          title="Eliminar solo de hoy"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteAll(assignment.taskId, assignment.task?.name || '')}
                          className="p-2 text-red-500 hover:text-red-700 rounded"
                          title="Eliminar de TODO el calendario"
                        >
                          <Skull className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
