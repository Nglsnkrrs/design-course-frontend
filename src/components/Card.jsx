// src/components/Card.jsx
import React from "react";
import {
  BookOpen,
  Lock,
  ChevronRight,
  Clock,
  Users,
  Star,
  PlayCircle,
  CheckCircle,
  Sparkles,
  GraduationCap,
  Trophy
} from "lucide-react";

const Card = ({ module, onClick, index = 0 }) => {
  // Градиенты для карточек
  const gradients = [
    "from-blue-500 to-cyan-500",
    "from-purple-500 to-pink-500",
    "from-orange-500 to-red-500",
    "from-green-500 to-emerald-500",
    "from-yellow-500 to-amber-500",
    "from-indigo-500 to-purple-500",
    "from-red-500 to-pink-500",
    "from-teal-500 to-cyan-500"
  ];

  const gradient = gradients[index % gradients.length];
  const isUnlocked = module.unlocked;

  // Расчет прогресса модуля (если есть уроки)
  const progress = module.lessons ?
    Math.round((module.lessons.filter(l => l.completed).length / module.lessons.length) * 100) :
    module.progress || 0;

  const isCompleted = progress === 100;
  const lessonsCount = module.lessons?.length || module.lessonsCount || 0;
  const completedLessons = module.lessons?.filter(l => l.completed).length || module.completedLessons || 0;

  // Уровень сложности (можно передавать в пропсах)
  const difficulty = module.difficulty || "Средний";
  const difficultyColors = {
    "Начальный": "text-green-600 bg-green-50",
    "Средний": "text-yellow-600 bg-yellow-50",
    "Продвинутый": "text-red-600 bg-red-50"
  };

  // Длительность модуля
  const duration = module.duration || "2 часа";

  // Количество студентов
  const students = module.students || 1234;

  // Рейтинг
  const rating = module.rating || 4.5;

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl transition-all duration-500 transform hover:-translate-y-2
        ${isUnlocked
          ? "cursor-pointer"
          : "cursor-not-allowed opacity-75"
        }
      `}
      onClick={isUnlocked ? onClick : null}
    >
      {/* Анимированный фоновый градиент */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

      {/* Декоративные элементы */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl transform translate-x-16 -translate-y-16 group-hover:translate-x-8 group-hover:-translate-y-8 transition-transform duration-700" />

      {/* Основная карточка */}
      <div className={`
        relative h-full rounded-2xl border backdrop-blur-sm transition-all duration-300
        ${isUnlocked
          ? isCompleted
            ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/50 shadow-lg hover:shadow-2xl"
            : "bg-white/90 border-gray-200/50 shadow-lg hover:shadow-2xl hover:border-transparent"
          : "bg-gray-100/90 border-gray-200/50"
        }
      `}>
        {/* Верхний акцент */}
        <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />

        {/* Бейдж статуса */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          {isCompleted && (
            <span className="flex items-center gap-1 px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full shadow-lg">
              <CheckCircle size={12} />
              Завершено
            </span>
          )}
          {!isUnlocked && (
            <span className="flex items-center gap-1 px-2 py-1 bg-gray-500 text-white text-xs font-medium rounded-full shadow-lg">
              <Lock size={12} />
              Заблокировано
            </span>
          )}
        </div>

        {/* Контент карточки */}
        <div className="p-6">
          {/* Иконка модуля */}
          <div className="flex items-start justify-between mb-4">
            <div className={`
              relative w-16 h-16 rounded-xl bg-gradient-to-br ${gradient} p-4 shadow-lg
              transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300
              ${!isUnlocked && "opacity-50"}
            `}>
              {isUnlocked ? (
                isCompleted ? (
                  <Trophy className="w-full h-full text-white" />
                ) : (
                  <BookOpen className="w-full h-full text-white" />
                )
              ) : (
                <Lock className="w-full h-full text-white" />
              )}

              {/* Пульсирующий индикатор для новых модулей */}
              {module.isNew && isUnlocked && (
                <div className="absolute -top-1 -right-1">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                </div>
              )}
            </div>

            {/* Рейтинг */}
            {isUnlocked && (
              <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                <Star size={14} className="text-yellow-500 fill-current" />
                <span className="text-sm font-medium text-gray-700">{rating}</span>
              </div>
            )}
          </div>

          {/* Заголовок и описание */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              {module.title}
              {module.isNew && isUnlocked && (
                <span className="text-xs bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-1 rounded-full">
                  NEW
                </span>
              )}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2">
              {module.description}
            </p>
          </div>

          {/* Мета-информация */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock size={14} className="text-gray-400" />
              <span>{duration}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Users size={14} className="text-gray-400" />
              <span>{students.toLocaleString()} студ.</span>
            </div>
          </div>

          {/* Уровень сложности */}
          <div className="mb-4">
            <span className={`text-xs px-2 py-1 rounded-full ${difficultyColors[difficulty] || difficultyColors["Средний"]}`}>
              {difficulty}
            </span>
          </div>

          {/* Прогресс бар (если модуль разблокирован) */}
          {isUnlocked && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Прогресс</span>
                <span className="font-semibold text-gray-700">{progress}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r ${gradient}`}
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-shimmer" />
                </div>
              </div>
            </div>
          )}

          {/* Статистика уроков */}
          {lessonsCount > 0 && (
            <div className="mt-4 flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-500">
                <PlayCircle size={14} />
                <span>{lessonsCount} уроков</span>
              </div>
              {isUnlocked && completedLessons > 0 && (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle size={14} />
                  <span>{completedLessons} завершено</span>
                </div>
              )}
            </div>
          )}

          {/* Кнопка действия */}
          {isUnlocked && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Начать обучение</span>
                <div className="flex items-center text-blue-600 font-medium group-hover:translate-x-1 transition-transform">
                  <span className="mr-1">Перейти</span>
                  <ChevronRight size={16} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Эффект свечения при наведении */}
        {isUnlocked && (
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;