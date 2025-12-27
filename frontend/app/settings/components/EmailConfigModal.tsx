'use client';

import { useEffect, useState } from 'react';
import { X, Mail, Check, AlertCircle } from 'lucide-react';

interface EmailConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (config: any) => Promise<void>;
}

export default function EmailConfigModal({ isOpen, onClose, onSave }: EmailConfigModalProps) {
    const [config, setConfig] = useState({
        host: '',
        port: 587,
        secure: false,
        user: '',
        password: '',
        from: ''
    });
    const [testing, setTesting] = useState(false);
    const [saving, setSaving] = useState(false);
    const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
    const [presets, setPresets] = useState<any>({});

    useEffect(() => {
        if (isOpen) {
            loadPresets();
            loadCurrentConfig();
        }
    }, [isOpen]);

    const loadPresets = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/config/email/presets`);
            const data = await response.json();
            setPresets(data);
        } catch (error) {
            console.error('Error loading presets:', error);
        }
    };

    const loadCurrentConfig = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/config/email`);
            const data = await response.json();
            if (data.config) {
                setConfig({
                    host: data.config.host || '',
                    port: data.config.port || 587,
                    secure: data.config.secure || false,
                    user: data.config.user || '',
                    password: '', // Don't load password for security
                    from: data.config.from || ''
                });
            }
        } catch (error) {
            console.error('Error loading config:', error);
        }
    };

    const applyPreset = (presetKey: string) => {
        const preset = presets[presetKey];
        if (preset) {
            setConfig(prev => ({
                ...prev,
                host: preset.host,
                port: preset.port,
                secure: preset.secure
            }));
        }
    };

    const handleTest = async () => {
        setTesting(true);
        setTestResult(null);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/config/email/test`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            });
            const data = await response.json();
            setTestResult({
                success: data.success,
                message: data.message || (data.success ? 'Conexión exitosa' : 'Error en la conexión')
            });
        } catch (error: any) {
            setTestResult({
                success: false,
                message: error.message || 'Error al probar la conexión'
            });
        } finally {
            setTesting(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await onSave(config);
            onClose();
        } catch (error) {
            console.error('Error saving config:', error);
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex items-center">
                        <Mail className="w-6 h-6 text-blue-600 mr-2" />
                        <h2 className="text-2xl font-bold">Configurar Email</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Presets */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Proveedor de Email
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {Object.entries(presets).map(([key, preset]: [string, any]) => (
                                <button
                                    key={key}
                                    onClick={() => applyPreset(key)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                                >
                                    {preset.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* SMTP Settings */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Host SMTP *
                            </label>
                            <input
                                type="text"
                                value={config.host}
                                onChange={(e) => setConfig({ ...config, host: e.target.value })}
                                placeholder="smtp.gmail.com"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Puerto *
                            </label>
                            <input
                                type="number"
                                value={config.port}
                                onChange={(e) => setConfig({ ...config, port: parseInt(e.target.value) })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Usuario / Email *
                        </label>
                        <input
                            type="email"
                            value={config.user}
                            onChange={(e) => setConfig({ ...config, user: e.target.value })}
                            placeholder="tu_email@gmail.com"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contraseña / App Password *
                        </label>
                        <input
                            type="password"
                            value={config.password}
                            onChange={(e) => setConfig({ ...config, password: e.target.value })}
                            placeholder="••••••••••••••••"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Para Gmail, usa una contraseña de aplicación (App Password)
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email "From" (opcional)
                        </label>
                        <input
                            type="email"
                            value={config.from}
                            onChange={(e) => setConfig({ ...config, from: e.target.value })}
                            placeholder={config.user || 'tu_email@gmail.com'}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Test Result */}
                    {testResult && (
                        <div className={`p-4 rounded-lg flex items-center ${testResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                            }`}>
                            {testResult.success ? (
                                <Check className="w-5 h-5 mr-2" />
                            ) : (
                                <AlertCircle className="w-5 h-5 mr-2" />
                            )}
                            <span>{testResult.message}</span>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t bg-gray-50">
                    <button
                        onClick={handleTest}
                        disabled={testing || !config.host || !config.user || !config.password}
                        className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {testing ? 'Probando...' : 'Probar Conexión'}
                    </button>
                    <div className="flex space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving || !config.host || !config.user || !config.password}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
