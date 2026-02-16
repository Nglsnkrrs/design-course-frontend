// src/pages/Home.jsx
import React, { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { ModulesContext } from "../context/ModulesContext";
import { BookOpen, Lock, ChevronRight, Sparkles, GraduationCap } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const { modules, getTotalProgress } = useContext(ModulesContext);

  const progress = getTotalProgress();

  const gradients = [
    "from-blue-500 to-cyan-500",
    "from-purple-500 to-pink-500",
    "from-orange-500 to-red-500",
    "from-green-500 to-emerald-500",
    "from-yellow-500 to-amber-500",
    "from-indigo-500 to-purple-500"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Header progress={progress} />

      {/* Декоративные элементы */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Приветственный баннер */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl shadow-xl overflow-hidden mb-8">
          <div className="relative px-6 py-8 sm:px-12 sm:py-12">
            <div className="relative z-10">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Добро пожаловать в обучение!
                <span className="inline-block animate-wave ml-2">👋</span>
              </h1>
              <p className="text-blue-100 text-lg max-w-2xl">
                Продолжайте свое обучение. У вас отличный прогресс!
              </p>

              {/* Прогресс бар в баннере */}
              <div className="mt-6 max-w-md">
                <div className="flex justify-between text-white text-sm mb-2">
                  <span>Общий прогресс</span>
                  <span className="font-semibold">{progress}%</span>
                </div>
                <div className="h-3 bg-white/30 rounded-full backdrop-blur-sm overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Декоративная иконка */}
            <div className="absolute right-0 top-0 bottom-0 hidden lg:flex items-center pr-12">
              <GraduationCap size={120} className="text-white/20" />
            </div>
          </div>
        </div>

        {/* Заголовок секции модулей */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
              <BookOpen className="text-white" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Доступные модули</h2>
          </div>
          <span className="text-sm text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm">
            {modules.length} модулей • {modules.flatMap(m => m.lessons).length} уроков
          </span>
        </div>
      </div>

      {/* Сетка модулей */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {modules.map((mod, index) => {
            const isUnlocked = mod.unlocked;
            const gradient = gradients[index % gradients.length];
            const lessonsCount = mod.lessons.length;
            const completedLessons = mod.lessons.filter(l => l.completed).length;
            const moduleProgress = Math.round((completedLessons / lessonsCount) * 100);

            return (
              <div
                key={mod.id}
                className={`group relative overflow-hidden rounded-2xl transition-all duration-300 transform hover:-translate-y-1
                  ${isUnlocked
                    ? "cursor-pointer"
                    : "cursor-not-allowed opacity-75"
                  }
                `}
                onClick={() => isUnlocked && navigate(`/module/${mod.id}`)}
              >
                {/* Градиентный фон карточки */}
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                {/* Основное содержимое карточки */}
                <div className={`relative h-full p-6 rounded-2xl border backdrop-blur-sm
                  ${isUnlocked
                    ? "bg-white/90 border-gray-200/50 shadow-lg hover:shadow-2xl hover:border-transparent"
                    : "bg-gray-100/90 border-gray-200/50"
                  }
                `}>
                  {/* Индикатор прогресса модуля */}
                  {isUnlocked && (
                    <div className="absolute top-4 right-4">
                      <div className="relative w-12 h-12">
                        <svg className="w-12 h-12 transform -rotate-90">
                          <circle
                            cx="24"
                            cy="24"
                            r="20"
                            stroke="currentColor"
                            strokeWidth="3"
                            fill="transparent"
                            className="text-gray-200"
                          />
                          <circle
                            cx="24"
                            cy="24"
                            r="20"
                            stroke="currentColor"
                            strokeWidth="3"
                            fill="transparent"
                            strokeDasharray={2 * Math.PI * 20}
                            strokeDashoffset={2 * Math.PI * 20 * (1 - moduleProgress / 100)}
                            className="text-transparent"
                            style={{ stroke: `url(#gradient-${index})` }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-semibold text-gray-600">{moduleProgress}%</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Иконка модуля */}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} p-3 mb-4 shadow-lg
                    ${!isUnlocked && "opacity-50"}
                  `}>
                    {isUnlocked ? (
                      <BookOpen className="w-full h-full text-white" />
                    ) : (
                      <Lock className="w-full h-full text-white" />
                    )}
                  </div>

                  {/* Заголовок и описание */}
                  <h3 className={`text-xl font-bold mb-2 flex items-center gap-2
                    ${isUnlocked ? "text-gray-800" : "text-gray-500"}
                  `}>
                    {mod.title}
                    {isUnlocked && moduleProgress === 100 && (
                      <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                        Завершен
                      </span>
                    )}
                  </h3>

                  <p className={`text-sm mb-4 line-clamp-2
                    ${isUnlocked ? "text-gray-600" : "text-gray-400"}
                  `}>
                    {mod.description}
                  </p>

                  {/* Мета-информация */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <BookOpen size={14} />
                        {lessonsCount} уроков
                      </span>
                      {isUnlocked && completedLessons > 0 && (
                        <span className="text-green-600 text-xs bg-green-50 px-2 py-1 rounded-full">
                          {completedLessons} пройдено
                        </span>
                      )}
                    </div>

                    {isUnlocked ? (
                      <div className="flex items-center text-sm font-medium text-blue-600 group-hover:translate-x-1 transition-transform">
                        {moduleProgress === 100 ? 'Повторить' : 'Начать'}
                        <ChevronRight size={16} className="ml-1" />
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400 flex items-center gap-1">
                        <Lock size={14} />
                        {index === 0 ? 'Заблокировано' : 'Пройдите предыдущий модуль'}
                      </span>
                    )}
                  </div>

                  {/* Эффект свечения при наведении */}
                  {isUnlocked && (
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Пустое состояние */}
        {modules.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
              <BookOpen size={48} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Пока нет модулей</h3>
            <p className="text-gray-500">Скоро здесь появятся новые курсы</p>
          </div>
        )}
      </div>

      {/* Добавляем градиенты для SVG */}
      <svg className="hidden">
        <defs>
          {gradients.map((gradient, index) => (
            <linearGradient key={index} id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" className={`stop-${gradient.split(' ')[0].replace('from-', '')}`} />
              <stop offset="100%" className={`stop-${gradient.split(' ')[1].replace('to-', '')}`} />
            </linearGradient>
          ))}
        </defs>
      </svg>
    </div>
  );
};

export default Home;