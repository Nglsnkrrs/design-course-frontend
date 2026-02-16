// src/pages/Profile.jsx
import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { User, Mail, Calendar, Award, BookOpen, Clock, Edit2, Save, X } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSave = () => {
    // Здесь будет логика сохранения
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Header progress={75} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Профиль пользователя</h1>
          <p className="text-gray-500">Управляйте своими данными и настройками</p>
        </div>

        {/* Основная информация */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{user?.name}</h2>
                <p className="text-gray-500">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
            >
              {isEditing ? <Save size={18} /> : <Edit2 size={18} />}
              {isEditing ? 'Сохранить' : 'Редактировать'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <User size={16} />
                <span className="text-sm">Имя</span>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={editedUser?.name}
                  onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                  className="w-full p-2 border border-gray-200 rounded-lg"
                />
              ) : (
                <p className="text-lg font-medium text-gray-800">{user?.name}</p>
              )}
            </div>

            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Mail size={16} />
                <span className="text-sm">Email</span>
              </div>
              <p className="text-lg font-medium text-gray-800">{user?.email}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Calendar size={16} />
                <span className="text-sm">Дата регистрации</span>
              </div>
              <p className="text-lg font-medium text-gray-800">15 марта 2024</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <BookOpen size={16} />
                <span className="text-sm">Пройдено курсов</span>
              </div>
              <p className="text-lg font-medium text-gray-800">3 из 5</p>
            </div>
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Clock className="text-blue-500" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">24</p>
                <p className="text-sm text-gray-500">часа обучения</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Award className="text-green-500" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">12</p>
                <p className="text-sm text-gray-500">достижений</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <BookOpen className="text-purple-500" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">47</p>
                <p className="text-sm text-gray-500">уроков</p>
              </div>
            </div>
          </div>
        </div>

        {/* Достижения */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Последние достижения</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center mb-2">
                  <Award className="text-white" size={32} />
                </div>
                <p className="text-sm font-medium text-gray-700">Достижение {i}</p>
                <p className="text-xs text-gray-500">Описание</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;