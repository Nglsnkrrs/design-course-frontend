// src/components/Sidebar.jsx
import React, { useState, useEffect } from "react";
import {
  BookOpen,
  ChevronRight,
  Lock,
  PlayCircle,
  CheckCircle,
  Clock,
  Sparkles,
  Menu,
  X,
  GraduationCap,
  Trophy
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = ({ modules, isCollapsed, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedModules, setExpandedModules] = useState({});

  // Автоматически раскрывать текущий модуль
  useEffect(() => {
    const currentModuleId = location.pathname.split('/')[2];
    if (currentModuleId) {
      setExpandedModules(prev => ({
        ...prev,
        [currentModuleId]: true
      }));
    }
  }, [location.pathname]);

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const handleModuleClick = (moduleId, isUnlocked) => {
    if (isUnlocked) {
      if (isCollapsed) {
        // Если сайдбар свернут, просто переходим к модулю
        navigate(`/module/${moduleId}`);
      } else {
        // Если развернут, раскрываем список уроков
        toggleModule(moduleId);
      }
    }
  };

  const handleLessonClick = (lessonId, isUnlocked) => {
    if (isUnlocked) {
      navigate(`/lesson/${lessonId}`);
      // Закрываем мобильное меню после перехода
      setIsMobileOpen(false);
    }
  };

  const getModuleProgress = (module) => {
    if (!module.lessons) return 0;
    const completedLessons = module.lessons.filter(l => l.completed).length;
    return Math.round((completedLessons / module.lessons.length) * 100);
  };

  const isActiveModule = (moduleId) => {
    return location.pathname === `/module/${moduleId}`;
  };

  const isActiveLesson = (lessonId) => {
    return location.pathname === `/lesson/${lessonId}`;
  };

  // Градиенты для иконок модулей
  const gradients = [
    "from-blue-500 to-cyan-500",
    "from-purple-500 to-pink-500",
    "from-orange-500 to-red-500",
    "from-green-500 to-emerald-500",
    "from-yellow-500 to-amber-500"
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col">
      {/* Заголовок с кнопкой сворачивания */}
      <div className={`flex items-center justify-between mb-6 px-2 ${isCollapsed ? 'justify-center' : ''}`}>
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
              <GraduationCap size={18} className="text-white" />
            </div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
              Блоки курса
            </h2>
          </div>
        )}
        {onToggle && (
          <button
            onClick={onToggle}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
          >
            <Menu size={18} className={`transform transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      {/* Общий прогресс */}
      {!isCollapsed && modules?.length > 0 && (
        <div className="mb-6 p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border border-red-100">
          <div className="flex items-center gap-2 mb-2">
            <Trophy size={16} className="text-red-500" />
            <span className="text-sm font-medium text-gray-700">Общий прогресс</span>
          </div>
          <div className="h-2 bg-white rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-500"
              style={{
                width: `${Math.round(modules.reduce((acc, mod) => acc + getModuleProgress(mod), 0) / modules.length)}%`
              }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {modules.filter(mod => mod.lessons?.some(l => l.completed)).length} из {modules.length} модулей в процессе
          </p>
        </div>
      )}

      {/* Список модулей */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <ul className="space-y-2 px-1">
          {modules?.map((mod, index) => {
            const isUnlocked = mod.lessons?.some(l => l.unlocked) || false;
            const isActive = isActiveModule(mod.id);
            const progress = getModuleProgress(mod);
            const gradient = gradients[index % gradients.length];
            const isExpanded = expandedModules[mod.id];
            const completedLessons = mod.lessons?.filter(l => l.completed).length || 0;

            return (
              <li key={mod.id} className="space-y-1">
                {/* Модуль */}
                <div
                  className={`
                    relative group rounded-xl transition-all duration-300
                    ${isCollapsed ? 'px-2' : 'px-3'}
                    ${isUnlocked
                      ? isActive
                        ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg scale-[1.02]'
                        : 'hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 cursor-pointer'
                      : 'opacity-50 cursor-not-allowed'
                    }
                  `}
                  onClick={() => handleModuleClick(mod.id, isUnlocked)}
                >
                  <div className={`flex items-center gap-3 py-2.5 ${isCollapsed ? 'justify-center' : ''}`}>
                    {/* Иконка модуля с градиентом */}
                    <div className={`
                      relative flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
                      ${isUnlocked
                        ? isActive
                          ? 'bg-white/20'
                          : `bg-gradient-to-br ${gradient} bg-opacity-10`
                        : 'bg-gray-100'
                      }
                    `}>
                      {isUnlocked ? (
                        <BookOpen size={16} className={isActive ? 'text-white' : `text-${gradient.split(' ')[0].replace('from-', '')}`} />
                      ) : (
                        <Lock size={14} className="text-gray-400" />
                      )}

                      {/* Индикатор прогресса на иконке */}
                      {isUnlocked && progress === 100 && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>

                    {/* Информация о модуле (скрыто при свернутом сайдбаре) */}
                    {!isCollapsed && (
                      <>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`font-medium truncate ${isActive ? 'text-white' : 'text-gray-700'}`}>
                              {mod.title}
                            </span>
                            {progress === 100 && (
                              <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                            )}
                          </div>

                          {/* Прогресс модуля */}
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${
                                  isActive
                                    ? 'bg-white'
                                    : 'bg-gradient-to-r from-red-500 to-red-600'
                                }`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <span className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                              {completedLessons}/{mod.lessons?.length || 0}
                            </span>
                          </div>
                        </div>

                        {/* Стрелка для раскрытия */}
                        {isUnlocked && mod.lessons?.length > 1 && (
                          <ChevronRight
                            size={16}
                            className={`transform transition-transform duration-300 flex-shrink-0
                              ${isActive ? 'text-white' : 'text-gray-400'}
                              ${isExpanded ? 'rotate-90' : ''}
                            `}
                          />
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Уроки модуля (раскрывающийся список) */}
                {!isCollapsed && isExpanded && isUnlocked && mod.lessons?.length > 0 && (
                  <ul className="ml-11 space-y-1 mt-1 animate-slideDown">
                    {mod.lessons.map((lesson, lessonIndex) => {
                      const isLessonActive = isActiveLesson(lesson.id);
                      const isLessonUnlocked = lesson.unlocked;
                      const isLessonCompleted = lesson.completed;

                      return (
                        <li
                          key={lesson.id}
                          className={`
                            flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200
                            ${isLessonUnlocked
                              ? isLessonActive
                                ? 'bg-red-50 text-red-600 font-medium'
                                : 'hover:bg-gray-50 text-gray-600 cursor-pointer'
                              : 'text-gray-400 cursor-not-allowed'
                            }
                          `}
                          onClick={() => handleLessonClick(lesson.id, isLessonUnlocked)}
                        >
                          {isLessonUnlocked ? (
                            isLessonCompleted ? (
                              <CheckCircle size={14} className={isLessonActive ? 'text-red-500' : 'text-green-500'} />
                            ) : (
                              <PlayCircle size={14} className={isLessonActive ? 'text-red-500' : 'text-gray-400'} />
                            )
                          ) : (
                            <Lock size={12} className="text-gray-300" />
                          )}

                          <span className="flex-1 truncate">
                            Урок {lessonIndex + 1}: {lesson.title || `Введение`}
                          </span>

                          {/* Индикатор времени урока */}
                          {lesson.duration && (
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Clock size={10} />
                              {lesson.duration}
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Бонус: недавние модули */}
      {!isCollapsed && modules?.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 px-2 mb-3">
            <Sparkles size={14} className="text-red-500" />
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Недавние
            </span>
          </div>
          <div className="space-y-2">
            {modules.slice(0, 2).map((mod) => (
              <div
                key={mod.id}
                className="flex items-center gap-2 px-2 py-1.5 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleModuleClick(mod.id, mod.lessons?.some(l => l.unlocked))}
              >
                <div className="w-6 h-6 bg-gradient-to-br from-red-500 to-red-600 rounded-md flex items-center justify-center">
                  <BookOpen size={12} className="text-white" />
                </div>
                <span className="text-xs text-gray-600 truncate flex-1">{mod.title}</span>
                <span className="text-xs text-gray-400">{getModuleProgress(mod)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Десктопная версия - статический сайдбар на всю высоту */}
      <aside className={`
        hidden lg:block bg-white border-r border-gray-200 shadow-lg
        transition-all duration-300
        ${isCollapsed ? 'w-20' : 'w-80'}
        min-h-screen h-screen sticky top-0
      `}>
        {sidebarContent}
      </aside>

      {/* Мобильная версия */}
      <div className="lg:hidden">
        {/* Кнопка открытия мобильного сайдбара */}
        <button
          onClick={() => setIsMobileOpen(true)}
          className="fixed left-4 bottom-4 z-50 w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-all duration-300 hover:scale-110"
        >
          <Menu size={24} />
        </button>

        {/* Оверлей */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        {/* Мобильный сайдбар - фиксированный для мобильных */}
        <aside className={`
          fixed left-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-50
          transform transition-transform duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="h-full flex flex-col">
            {/* Заголовок мобильного сайдбара */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                  <GraduationCap size={18} className="text-white" />
                </div>
                <h2 className="font-bold text-gray-800">Блоки курса</h2>
              </div>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Контент мобильного сайдбара */}
            <div className="flex-1 overflow-y-auto p-4">
              {sidebarContent}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};

export default Sidebar;