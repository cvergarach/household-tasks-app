'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Task, Person } from '@/types';
import { Trash2, Edit, Plus, Mail, Bot, BarChart, Settings } from 'lucide-react';
import PersonModal from './components/PersonModal';
import TaskModal from './components/TaskModal';
import EmailConfigModal from './components/EmailConfigModal';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'tasks' | 'persons' | 'emails' | 'ai'>('tasks');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [personModalOpen, setPersonModalOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [emailConfigModalOpen, setEmailConfigModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [emailConfigStatus, setEmailConfigStatus] = useState<{ configured: boolean; source?: string }>({ configured: false });

  // AI Model states
  const [availableModels, setAvailableModels] = useState<any>(null);
  const [selectedModel, setSelectedModel] = useState<string>('gemini-2.5-flash');

  useEffect(() => {
    loadData();
    loadEmailConfig();
    loadModels();
  }, []);

  const loadData = async () => {
    try {
      const [tasksData, personsData] = await Promise.all([
        api.getTasks(true),
        api.getPersons()
      ]);
      setTasks(tasksData);
      setPersons(personsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const loadEmailConfig = async () => {
    try {
      const config = await api.getEmailConfig();
      setEmailConfigStatus({
        configured: !!(config.config?.host && config.config?.user),
        source: config.source
      });
    } catch (error) {
      console.error('Error loading email config:', error);
    }
  };

  const handleDeleteTask = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar "${name}" permanentemente?`)) return;
    try {
      await api.deleteTask(id);
      await loadData();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleDistributeWithAI = async () => {
    if (!confirm('¿Redistribuir TODAS las tareas con IA? Esto borrará las asignaciones actuales.')) return;
    console.log('🚀 [FRONTEND] Iniciando distribución con IA...');
    setLoading(true);
    try {
      console.log('📡 [FRONTEND] Llamando a API redistributeAll...');
      const result = await api.redistributeAll('2025-12-27', '2026-03-31');
      console.log('✅ [FRONTEND] Respuesta de API:', result);
      alert('¡Distribución completada con IA!');
    } catch (error: any) {
      console.error('❌ [FRONTEND] Error distributing:', error);
      console.error('❌ [FRONTEND] Error details:', error.response?.data || error.message);
      alert(`Error al distribuir tareas: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
      console.log('🏁 [FRONTEND] Proceso finalizado');
    }
  };

  const handleAnalyzeBalance = async () => {
    setLoading(true);
    try {
      const result = await api.analyzeBalance('2025-12-27', '2026-03-31');
      alert(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error('Error analyzing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendTestEmail = async (email: string, name: string) => {
    setLoading(true);
    try {
      await api.sendTestEmail(email, name);
      alert(`Email de prueba enviado a ${email}`);
    } catch (error) {
      console.error('Error sending test email:', error);
      alert('Error al enviar email');
    } finally {
      setLoading(false);
    }
  };

  // Person handlers
  const handleOpenPersonModal = (person?: Person) => {
    setEditingPerson(person || null);
    setPersonModalOpen(true);
  };

  const handleSavePerson = async (data: any) => {
    setLoading(true);
    try {
      if (editingPerson) {
        await api.updatePerson(editingPerson.id, data);
      } else {
        await api.createPerson(data);
      }
      await loadData();
      setPersonModalOpen(false);
      setEditingPerson(null);
    } catch (error) {
      console.error('Error saving person:', error);
      alert('Error al guardar persona');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePerson = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar a "${name}" permanentemente?`)) return;
    setLoading(true);
    try {
      await api.deletePerson(id);
      await loadData();
    } catch (error) {
      console.error('Error deleting person:', error);
      alert('Error al eliminar persona');
    } finally {
      setLoading(false);
    }
  };

  // Task handlers
  const handleOpenTaskModal = (task?: Task) => {
    setEditingTask(task || null);
    setTaskModalOpen(true);
  };

  const handleSaveTask = async (data: any) => {
    setLoading(true);
    try {
      if (editingTask) {
        await api.updateTask(editingTask.id, data);
      } else {
        await api.createTask(data);
      }
      await loadData();
      setTaskModalOpen(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Error saving task:', error);
      alert('Error al guardar tarea');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEmailConfig = async (config: any) => {
    setLoading(true);
    try {
      await api.updateEmailConfig(config);
      await loadEmailConfig();
      alert('Configuración de email guardada correctamente');
    } catch (error) {
      console.error('Error saving email config:', error);
      alert('Error al guardar configuración de email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Configuración</h1>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'tasks'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              Tareas Maestras
            </button>
            <button
              onClick={() => setActiveTab('persons')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'persons'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              Personas
            </button>
            <button
              onClick={() => setActiveTab('emails')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'emails'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              Notificaciones
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'ai'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              IA & Distribución
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Tareas */}
          {activeTab === 'tasks' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Tareas Maestras ({tasks.length})</h2>
                <button
                  onClick={() => handleOpenTaskModal()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Tarea
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tiempo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Frecuencia</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tasks.map((task) => (
                      <tr key={task.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {task.number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {task.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {task.duration} min
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {task.frequency === 'daily' ? 'Diaria' : task.frequency === 'weekly' ? 'Semanal' : 'Mensual'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {task.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleOpenTaskModal(task)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id, task.name)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Personas */}
          {activeTab === 'persons' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Personas ({persons.length})</h2>
                <button
                  onClick={() => handleOpenPersonModal()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Persona
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {persons.map((person) => (
                  <div key={person.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-lg">{person.name}</h3>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-full"
                          style={{ backgroundColor: person.color }}
                        ></div>
                        <button
                          onClick={() => handleOpenPersonModal(person)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePerson(person.id, person.name)}
                          className="text-red-600 hover:text-red-900"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{person.email}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Emails */}
          {activeTab === 'emails' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Configuración de Notificaciones</h2>
                <button
                  onClick={() => setEmailConfigModalOpen(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Configurar Email
                </button>
              </div>

              {/* Email Status */}
              <div className="mb-6 p-4 rounded-lg border ${
                emailConfigStatus.configured ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
              }">
                <div className="flex items-center">
                  {emailConfigStatus.configured ? (
                    <>
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-sm font-medium text-green-800">
                        Email configurado ({emailConfigStatus.source === 'database' ? 'desde la app' : 'desde variables de entorno'})
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                      <span className="text-sm font-medium text-yellow-800">
                        Email no configurado - Haz clic en "Configurar Email" para empezar
                      </span>
                    </>
                  )}
                </div>
              </div>

              <h2 className="text-xl font-bold mb-4">Notificaciones por Persona</h2>
              <div className="space-y-4">
                {persons.map((person) => (
                  <div key={person.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold">{person.name}</h3>
                        <p className="text-sm text-gray-600">{person.email}</p>
                      </div>
                      <button
                        onClick={() => handleSendTestEmail(person.email, person.name)}
                        disabled={loading}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center disabled:opacity-50"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Enviar Prueba
                      </button>
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={person.emailNotifications.daily}
                          readOnly
                          className="mr-2"
                        />
                        <span className="text-sm">Notificaciones diarias (7:00 AM)</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={person.emailNotifications.weekly}
                          readOnly
                          className="mr-2"
                        />
                        <span className="text-sm">Notificaciones semanales (Domingos 7:00 AM)</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={person.emailNotifications.monthly}
                          readOnly
                          className="mr-2"
                        />
                        <span className="text-sm">Notificaciones mensuales (Día 1, 7:00 AM)</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* IA */}
          {activeTab === 'ai' && (
            <div>
              <h2 className="text-xl font-bold mb-6">🤖 Distribución con Inteligencia Artificial</h2>

              <div className="space-y-4">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-2 flex items-center">
                    <Bot className="w-5 h-5 mr-2" />
                    Redistribuir con IA
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Gemini AI distribuirá todas las tareas equitativamente entre las personas,
                    considerando horarios, disponibilidad y preferencias.
                  </p>
                  <button
                    onClick={handleDistributeWithAI}
                    disabled={loading}
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 font-medium"
                  >
                    {loading ? 'Procesando...' : 'Redistribuir TODO con IA'}
                  </button>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-2 flex items-center">
                    <BarChart className="w-5 h-5 mr-2" />
                    Analizar Balance
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Analiza si la distribución actual es equitativa y obtén recomendaciones de mejora.
                  </p>
                  <button
                    onClick={handleAnalyzeBalance}
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
                  >
                    {loading ? 'Analizando...' : 'Analizar Balance de Carga'}
                  </button>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-2">ℹ️ Información</h3>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• El sistema considera horarios de trabajo de cada persona</li>
                    <li>• Las tareas se rotan equitativamente</li>
                    <li>• Se respetan las preferencias individuales</li>
                    <li>• Cada persona recibe aproximadamente el mismo tiempo de tareas</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <PersonModal
        isOpen={personModalOpen}
        onClose={() => {
          setPersonModalOpen(false);
          setEditingPerson(null);
        }}
        onSave={handleSavePerson}
        person={editingPerson}
      />

      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => {
          setTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        task={editingTask}
        persons={persons}
        maxTaskNumber={tasks.length > 0 ? Math.max(...tasks.map(t => t.number)) : 0}
      />

      <EmailConfigModal
        isOpen={emailConfigModalOpen}
        onClose={() => setEmailConfigModalOpen(false)}
        onSave={handleSaveEmailConfig}
      />
    </div>
  );
}
