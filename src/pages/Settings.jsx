// src/pages/Settings.jsx
import React, { useState } from 'react';
import Header from '../components/Header';
import { Bell, Moon, Sun, Globe, Volume2, Shield, Eye, EyeOff } from 'lucide-react';

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    language: 'ru',
    sound: true,
    twoFactor: false,
    showEmail: true
  });

  const toggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Header progress={65} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Настройки</h1>
        <p className="text-gray-500 mb-8">Управляйте настройками вашего аккаунта</p>

        <div className="space-y-6">
          {/* Уведомления */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Bell size={20} className="text-red-500" />
              Уведомления
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Push-уведомления</p>
                  <p className="text-sm text-gray-500">Получать уведомления о новых уроках</p>
                </div>
                <button
                  onClick={() => toggleSetting('notifications')}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings.notifications ? 'bg-red-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      settings.notifications ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Звуки</p>
                  <p className="text-sm text-gray-500">Звуковые эффекты в приложении</p>
                </div>
                <button
                  onClick={() => toggleSetting('sound')}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings.sound ? 'bg-red-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      settings.sound ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Внешний вид */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Sun size={20} className="text-yellow-500" />
              Внешний вид
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Темная тема</p>
                  <p className="text-sm text-gray-500">Переключить тему оформления</p>
                </div>
                <button
                  onClick={() => toggleSetting('darkMode')}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings.darkMode ? 'bg-red-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      settings.darkMode ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Язык</p>
                  <p className="text-sm text-gray-500">Выберите язык интерфейса</p>
                </div>
                <select
                  value={settings.language}
                  onChange={(e) => setSettings({...settings, language: e.target.value})}
                  className="px-3 py-1 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500"
                >
                  <option value="ru">Русский</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>
            </div>
          </div>

          {/* Безопасность */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Shield size={20} className="text-green-500" />
              Безопасность
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Двухфакторная аутентификация</p>
                  <p className="text-sm text-gray-500">Дополнительная защита аккаунта</p>
                </div>
                <button
                  onClick={() => toggleSetting('twoFactor')}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings.twoFactor ? 'bg-red-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      settings.twoFactor ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Показывать email</p>
                  <p className="text-sm text-gray-500">Отображать email в профиле</p>
                </div>
                <button
                  onClick={() => toggleSetting('showEmail')}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings.showEmail ? 'bg-red-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      settings.showEmail ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Кнопка сохранения */}
          <button className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all">
            Сохранить изменения
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;