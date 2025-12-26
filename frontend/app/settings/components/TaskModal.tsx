'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface TaskFormData {
    number: number;
    name: string;
    duration: number;
    frequency: 'daily' | 'weekly' | 'monthly';
    category: string;
    area: string;
    priority: number;
    requiresDaylight: boolean;
    requiresWeekend: boolean;
    canRotate: boolean;
    preferredPersonId: string | null;
}

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: TaskFormData) => void;
    task?: any;
    persons: any[];
    maxTaskNumber: number;
}

const CATEGORIES = [
    { value: 'cocina', label: 'Cocina' },
    { value: 'bano', label: 'Baño' },
    { value: 'dormitorio', label: 'Dormitorio' },
    { value: 'areas_comunes', label: 'Áreas Comunes' },
    { value: 'lavanderia', label: 'Lavandería' },
    { value: 'jardin', label: 'Jardín' },
    { value: 'terraza', label: 'Terraza' },
    { value: 'general', label: 'General' },
];

const FREQUENCIES = [
    { value: 'daily', label: 'Diaria' },
    { value: 'weekly', label: 'Semanal' },
    { value: 'monthly', label: 'Mensual' },
];

export default function TaskModal({ isOpen, onClose, onSave, task, persons, maxTaskNumber }: TaskModalProps) {
    const [formData, setFormData] = useState<TaskFormData>({
        number: maxTaskNumber + 1,
        name: '',
        duration: 15,
        frequency: 'daily',
        category: 'general',
        area: '',
        priority: 3,
        requiresDaylight: false,
        requiresWeekend: false,
        canRotate: true,
        preferredPersonId: null,
    });

    useEffect(() => {
        if (task) {
            setFormData({
                number: task.number,
                name: task.name,
                duration: task.duration,
                frequency: task.frequency,
                category: task.category,
                area: task.area || '',
                priority: task.priority,
                requiresDaylight: task.requiresDaylight,
                requiresWeekend: task.requiresWeekend,
                canRotate: task.canRotate,
                preferredPersonId: task.preferredPersonId,
            });
        } else {
            setFormData({
                number: maxTaskNumber + 1,
                name: '',
                duration: 15,
                frequency: 'daily',
                category: 'general',
                area: '',
                priority: 3,
                requiresDaylight: false,
                requiresWeekend: false,
                canRotate: true,
                preferredPersonId: null,
            });
        }
    }, [task, maxTaskNumber]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold">
                        {task ? 'Editar Tarea' : 'Nueva Tarea'}
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
                                    Número *
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    value={formData.number}
                                    onChange={(e) => setFormData({ ...formData, number: parseInt(e.target.value) })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Duración (minutos) *
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre de la Tarea *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Ej: Lavar platos después del desayuno"
                            />
                        </div>
                    </div>

                    {/* Categorización */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Categorización</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Frecuencia *
                                </label>
                                <select
                                    value={formData.frequency}
                                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    {FREQUENCIES.map((freq) => (
                                        <option key={freq.value} value={freq.value}>
                                            {freq.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Categoría *
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    {CATEGORIES.map((cat) => (
                                        <option key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Prioridad (1-5) *
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    max="5"
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Área Específica
                            </label>
                            <input
                                type="text"
                                value={formData.area}
                                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Ej: Cocina, Baño 1, Dormitorio Principal"
                            />
                        </div>
                    </div>

                    {/* Requisitos Especiales */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Requisitos Especiales</h3>
                        <div className="space-y-2">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.requiresDaylight}
                                    onChange={(e) => setFormData({ ...formData, requiresDaylight: e.target.checked })}
                                    className="mr-2"
                                />
                                <span className="text-sm">Requiere luz de día</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.requiresWeekend}
                                    onChange={(e) => setFormData({ ...formData, requiresWeekend: e.target.checked })}
                                    className="mr-2"
                                />
                                <span className="text-sm">Requiere fin de semana</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.canRotate}
                                    onChange={(e) => setFormData({ ...formData, canRotate: e.target.checked })}
                                    className="mr-2"
                                />
                                <span className="text-sm">Puede rotar entre personas</span>
                            </label>
                        </div>
                    </div>

                    {/* Asignación Preferida */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Asignación Preferida (Opcional)</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Persona Preferida
                            </label>
                            <select
                                value={formData.preferredPersonId || ''}
                                onChange={(e) => setFormData({ ...formData, preferredPersonId: e.target.value || null })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Ninguna (asignar automáticamente)</option>
                                {persons.map((person) => (
                                    <option key={person.id} value={person.id}>
                                        {person.name}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-500 mt-1">
                                Si seleccionas una persona, la IA intentará asignarle esta tarea preferentemente
                            </p>
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
                            {task ? 'Guardar Cambios' : 'Crear Tarea'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
