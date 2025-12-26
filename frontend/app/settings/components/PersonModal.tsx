'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface WorkSchedule {
    monday: { start?: string; end?: string; available: boolean };
    tuesday: { start?: string; end?: string; available: boolean };
    wednesday: { start?: string; end?: string; available: boolean };
    thursday: { start?: string; end?: string; available: boolean };
    friday: { start?: string; end?: string; available: boolean };
    saturday: { start?: string; end?: string; available: boolean };
    sunday: { start?: string; end?: string; available: boolean };
}

interface PersonFormData {
    name: string;
    email: string;
    color: string;
    workSchedule: WorkSchedule;
    specialConditions: {
        limitedUntil: string | null;
        maxHoursPerWeek: number | null;
        shiftWork: boolean;
        fullTimeAvailable: boolean;
    };
    emailNotifications: {
        daily: boolean;
        weekly: boolean;
        monthly: boolean;
        time: string;
    };
}

interface PersonModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: PersonFormData) => void;
    person?: any;
}

const DAYS = [
    { key: 'monday', label: 'Lunes' },
    { key: 'tuesday', label: 'Martes' },
    { key: 'wednesday', label: 'Miércoles' },
    { key: 'thursday', label: 'Jueves' },
    { key: 'friday', label: 'Viernes' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' },
];

const COLORS = [
    '#3B82F6', '#EC4899', '#10B981', '#F59E0B', '#8B5CF6',
    '#EF4444', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
];

export default function PersonModal({ isOpen, onClose, onSave, person }: PersonModalProps) {
    const [formData, setFormData] = useState<PersonFormData>({
        name: '',
        email: '',
        color: COLORS[0],
        workSchedule: {
            monday: { start: '08:00', end: '19:00', available: false },
            tuesday: { start: '08:00', end: '19:00', available: false },
            wednesday: { start: '08:00', end: '19:00', available: false },
            thursday: { start: '08:00', end: '19:00', available: false },
            friday: { start: '08:00', end: '19:00', available: false },
            saturday: { available: true },
            sunday: { available: true },
        },
        specialConditions: {
            limitedUntil: null,
            maxHoursPerWeek: null,
            shiftWork: false,
            fullTimeAvailable: false,
        },
        emailNotifications: {
            daily: true,
            weekly: true,
            monthly: true,
            time: '07:00',
        },
    });

    useEffect(() => {
        if (person) {
            setFormData({
                name: person.name,
                email: person.email,
                color: person.color,
                workSchedule: person.workSchedule,
                specialConditions: person.specialConditions,
                emailNotifications: person.emailNotifications,
            });
        }
    }, [person]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const updateWorkSchedule = (day: string, field: string, value: any) => {
        setFormData({
            ...formData,
            workSchedule: {
                ...formData.workSchedule,
                [day]: {
                    ...formData.workSchedule[day as keyof WorkSchedule],
                    [field]: value,
                },
            },
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold">
                        {person ? 'Editar Persona' : 'Nueva Persona'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Información Básica */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Información Básica</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nombre *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Color
                            </label>
                            <div className="flex gap-2 flex-wrap">
                                {COLORS.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, color })}
                                        className={`w-10 h-10 rounded-full border-2 ${formData.color === color ? 'border-gray-900' : 'border-gray-300'
                                            }`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Horario de Trabajo */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Horario de Trabajo</h3>
                        <div className="space-y-3">
                            {DAYS.map(({ key, label }) => (
                                <div key={key} className="flex items-center gap-4">
                                    <div className="w-24">
                                        <span className="text-sm font-medium">{label}</span>
                                    </div>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={formData.workSchedule[key as keyof WorkSchedule].available}
                                            onChange={(e) => updateWorkSchedule(key, 'available', e.target.checked)}
                                            className="mr-2"
                                        />
                                        <span className="text-sm">Disponible</span>
                                    </label>
                                    {!formData.workSchedule[key as keyof WorkSchedule].available && (
                                        <>
                                            <input
                                                type="time"
                                                value={formData.workSchedule[key as keyof WorkSchedule].start || '08:00'}
                                                onChange={(e) => updateWorkSchedule(key, 'start', e.target.value)}
                                                className="px-2 py-1 border border-gray-300 rounded text-sm"
                                            />
                                            <span className="text-sm">a</span>
                                            <input
                                                type="time"
                                                value={formData.workSchedule[key as keyof WorkSchedule].end || '19:00'}
                                                onChange={(e) => updateWorkSchedule(key, 'end', e.target.value)}
                                                className="px-2 py-1 border border-gray-300 rounded text-sm"
                                            />
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Condiciones Especiales */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Condiciones Especiales</h3>
                        <div className="space-y-3">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.specialConditions.fullTimeAvailable}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            specialConditions: {
                                                ...formData.specialConditions,
                                                fullTimeAvailable: e.target.checked,
                                            },
                                        })
                                    }
                                    className="mr-2"
                                />
                                <span className="text-sm">Disponible tiempo completo</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.specialConditions.shiftWork}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            specialConditions: {
                                                ...formData.specialConditions,
                                                shiftWork: e.target.checked,
                                            },
                                        })
                                    }
                                    className="mr-2"
                                />
                                <span className="text-sm">Trabaja en turnos rotativos</span>
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Máximo horas por semana
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.specialConditions.maxHoursPerWeek || ''}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                specialConditions: {
                                                    ...formData.specialConditions,
                                                    maxHoursPerWeek: e.target.value ? parseInt(e.target.value) : null,
                                                },
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        placeholder="Sin límite"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Limitado hasta
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.specialConditions.limitedUntil || ''}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                specialConditions: {
                                                    ...formData.specialConditions,
                                                    limitedUntil: e.target.value || null,
                                                },
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notificaciones */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Notificaciones por Email</h3>
                        <div className="space-y-2">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.emailNotifications.daily}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            emailNotifications: {
                                                ...formData.emailNotifications,
                                                daily: e.target.checked,
                                            },
                                        })
                                    }
                                    className="mr-2"
                                />
                                <span className="text-sm">Notificaciones diarias (7:00 AM)</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.emailNotifications.weekly}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            emailNotifications: {
                                                ...formData.emailNotifications,
                                                weekly: e.target.checked,
                                            },
                                        })
                                    }
                                    className="mr-2"
                                />
                                <span className="text-sm">Notificaciones semanales (Domingos 7:00 AM)</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.emailNotifications.monthly}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            emailNotifications: {
                                                ...formData.emailNotifications,
                                                monthly: e.target.checked,
                                            },
                                        })
                                    }
                                    className="mr-2"
                                />
                                <span className="text-sm">Notificaciones mensuales (Día 1, 7:00 AM)</span>
                            </label>
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            {person ? 'Guardar Cambios' : 'Crear Persona'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
