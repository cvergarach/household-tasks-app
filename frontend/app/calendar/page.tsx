'use client';

import { useEffect, useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '@/lib/api';
import { Assignment } from '@/types';

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [currentMonth]);

  const loadData = async () => {
    setLoading(true);
    try {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1;
      const data = await api.getAssignmentsByMonth(year, month);
      setAssignments(data);
    } catch (error) {
      console.error('Error loading assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getAssignmentsForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return assignments.filter(a => a.date === dateStr);
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-gray-100">
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <h1 className="text-2xl font-bold">
            {format(currentMonth, 'MMMM yyyy', { locale: es })}
          </h1>
          
          <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-gray-100">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Calendar Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-2">
            {/* Days of week header */}
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
              <div key={day} className="text-center font-semibold text-gray-600 p-2">
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {days.map((day) => {
              const dayAssignments = getAssignmentsForDay(day);
              const totalMinutes = dayAssignments.reduce((sum, a) => sum + (a.task?.duration || 0), 0);
              
              return (
                <div
                  key={day.toString()}
                  className={`min-h-[100px] border rounded-lg p-2 ${
                    !isSameMonth(day, currentMonth) ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'
                  } ${isSameDay(day, new Date()) ? 'ring-2 ring-blue-500' : ''}`}
                >
                  <div className="font-semibold text-sm mb-1">
                    {format(day, 'd')}
                  </div>
                  {dayAssignments.length > 0 && (
                    <div className="text-xs text-gray-600">
                      <div>{dayAssignments.length} tareas</div>
                      <div>{(totalMinutes / 60).toFixed(1)}h</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
