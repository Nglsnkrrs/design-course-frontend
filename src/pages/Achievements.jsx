// src/pages/Achievements.jsx
import React from 'react';
import Header from '../components/Header';
import { Award, Star, Trophy, Zap, BookOpen, Target, CheckCircle } from 'lucide-react';

const Achievements = () => {
  const achievements = [
    {
      id: 1,
      title: 'Первый шаг',
      description: 'Завершите первый урок',
      icon: Star,
      color: 'from-yellow-400 to-yellow-500',
      progress: 100,
      completed: true,
      date: '10 марта 2024'
    },
    {
      id: 2,
      title: 'Начинающий исследователь',
      description: 'Пройдите 5 уроков',
      icon: BookOpen,
      color: 'from-blue-400 to-blue-500',
      progress: 80,
      completed: false,
      current: 4,
      total: 5
    },
    {
      id: 3,
      title: 'Марафонец',
      description: 'Занимайтесь 7 дней подряд',
      icon: Zap,
      color: 'from-purple-400 to-purple-500',
      progress: 42,
      completed: false,
      current: 3,
      total: 7
    },
    {
      id: 4,
      title: 'Мастер знаний',
      description: 'Пройдите все уроки модуля',
      icon: Trophy,
      color: 'from-red-400 to-red-500',
      progress: 25,
      completed: false,
      current: 2,
      total: 8
    },
    {
      id: 5,
      title: 'Скорость света',
      description: 'Пройдите урок за 5 минут',
      icon: Zap,
      color: 'from-green-400 to-green-500',
      progress: 0,
      completed: false
    },
    {
      id: 6,
      title: 'Целеустремленный',
      description: 'Достигните 50% прогресса',
      icon: Target,
      color: 'from-orange-400 to-orange-500',
      progress: 75,
      completed: false,
      current: 75,
      total: 100
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Header progress={65} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Award className="text-red-500" size={32} />
            Мои достижения
          </h1>
          <p className="text-gray-500 mt-2">
            Получайте награды за свои успехи в обучении
          </p>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-4">
            <p className="text-2xl font-bold text-gray-800">6</p>
            <p className="text-sm text-gray-500">Всего достижений</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <p className="text-2xl font-bold text-green-600">1</p>
            <p className="text-sm text-gray-500">Получено</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <p className="text-2xl font-bold text-yellow-600">4</p>
            <p className="text-sm text-gray-500">В процессе</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <p className="text-2xl font-bold text-gray-400">1</p>
            <p className="text-sm text-gray-500">Не начато</p>
          </div>
        </div>

        {/* Сетка достижений */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement) => {
            const Icon = achievement.icon;
            return (
              <div
                key={achievement.id}
                className={`bg-white rounded-2xl shadow-lg p-6 transition-all hover:-translate-y-1 hover:shadow-xl
                  ${achievement.completed ? 'border-2 border-green-500' : ''}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${achievement.color} p-4 shadow-lg`}>
                    <Icon className="w-full h-full text-white" />
                  </div>
                  {achievement.completed && (
                    <CheckCircle className="text-green-500" size={24} />
                  )}
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {achievement.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {achievement.description}
                </p>

                {achievement.progress !== undefined && !achievement.completed && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Прогресс</span>
                      <span className="font-semibold text-gray-700">
                        {achievement.current || achievement.progress}%
                        {achievement.total && ` (${achievement.current}/${achievement.total})`}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${achievement.color}`}
                        style={{ width: `${achievement.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {achievement.completed && (
                  <p className="text-sm text-gray-500">
                    Получено: {achievement.date}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Пустое состояние */}
        {achievements.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
              <Award size={48} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Пока нет достижений
            </h3>
            <p className="text-gray-500">
              Начните обучение, чтобы получить первые награды
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Achievements;