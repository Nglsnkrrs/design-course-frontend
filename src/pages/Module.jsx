// src/pages/Module.jsx
import React, { useContext, useMemo, useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { ModulesContext } from "../context/ModulesContext";
import {
  BookOpen,
  CheckCircle,
  Lock,
  ChevronRight,
  ChevronLeft,
  Clock,
  PlayCircle,
  Award,
  BarChart,
  Users,
  Star,
  Download,
  Share2
} from "lucide-react";

const Module = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { modules, getTotalProgress, ensureFirstLessonUnlocked } = useContext(ModulesContext);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("lessons");
  const [showShareModal, setShowShareModal] = useState(false);

  const module = useMemo(() => {
    return modules?.find((m) => m.id === parseInt(id));
  }, [modules, id]);

  const progress = getTotalProgress();

  const moduleProgress = useMemo(() => {
    if (!module?.lessons) return 0;
    const completed = module.lessons.filter(l => l.completed).length;
    return Math.round((completed / module.lessons.length) * 100);
  }, [module]);

  const completedLessons = useMemo(() => {
    return module?.lessons?.filter(l => l.completed).length || 0;
  }, [module]);

  // Проверка доступа к модулю
  useEffect(() => {
    if (module && !module.unlocked) {
      navigate('/course');
    }
  }, [module, navigate]);

  // Проверка и разблокировка первого урока
  useEffect(() => {
    if (module && module.unlocked) {
      const hasUnlockedLessons = module.lessons.some(l => l.unlocked);

      if (!hasUnlockedLessons && module.lessons.length > 0) {
        console.log('Ensuring first lesson unlocked for module:', module.id);
        ensureFirstLessonUnlocked(module.id);
      }
    }
  }, [module, ensureFirstLessonUnlocked]);

  const handleLessonClick = useCallback((lessonId) => {
    navigate(`/lesson/${lessonId}`);
  }, [navigate]);

  const handleBackToCourses = useCallback(() => {
    navigate('/course');
  }, [navigate]);

  const handleShare = useCallback(() => {
    setShowShareModal(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  useEffect(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    if (saved !== null) {
      setIsSidebarCollapsed(JSON.parse(saved));
    }
  }, []);

  if (!module) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Загрузка модуля...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Header progress={progress} />

      <div className="flex">
        <Sidebar
          modules={modules}
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        <main className="flex-1">
          {/* Герой-секция модуля */}
          <div className="relative bg-gradient-to-r from-red-500 to-red-600 text-white">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <button
                onClick={handleBackToCourses}
                className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
              >
                <ChevronLeft size={18} />
                <span>Назад к курсам</span>
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm">
                      Модуль {module.id}
                    </div>
                    {moduleProgress === 100 && (
                      <div className="px-3 py-1 bg-green-500 rounded-full text-sm flex items-center gap-1">
                        <CheckCircle size={14} />
                        Завершен
                      </div>
                    )}
                  </div>

                  <h1 className="text-4xl font-bold mb-4">{module.title}</h1>
                  <p className="text-lg text-white/90 mb-6 max-w-2xl">
                    {module.description}
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-white/80">
                      <Clock size={18} />
                      <span>{module.duration || '8 часов'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <BookOpen size={18} />
                      <span>{module.lessons?.length || 0} уроков</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <Users size={18} />
                      <span>{module.students || 1234} студентов</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <Star size={18} className="fill-yellow-300 text-yellow-300" />
                      <span>{module.rating || 4.8} (128 отзывов)</span>
                    </div>
                  </div>
                </div>

                {/* Карточка прогресса */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center gap-3 mb-4">
                    <BarChart size={24} />
                    <h3 className="text-xl font-semibold">Ваш прогресс</h3>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Выполнено уроков</span>
                      <span className="font-semibold">{completedLessons} из {module.lessons?.length || 0}</span>
                    </div>
                    <div className="h-3 bg-white/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full transition-all duration-500"
                        style={{ width: `${moduleProgress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span>Осталось уроков</span>
                    <span className="font-semibold">{(module.lessons?.length || 0) - completedLessons}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Табы навигации */}
          <div className="border-b border-gray-200 bg-white/50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex gap-8">
                <button
                  onClick={() => setActiveTab("lessons")}
                  className={`py-4 px-2 border-b-2 font-medium transition-colors relative
                    ${activeTab === "lessons"
                      ? "border-red-500 text-red-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                    }
                  `}
                >
                  <span className="flex items-center gap-2">
                    <BookOpen size={18} />
                    Уроки
                  </span>
                  {module.lessons && (
                    <span className="absolute -top-1 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {module.lessons.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab("materials")}
                  className={`py-4 px-2 border-b-2 font-medium transition-colors
                    ${activeTab === "materials"
                      ? "border-red-500 text-red-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                    }
                  `}
                >
                  <span className="flex items-center gap-2">
                    <Download size={18} />
                    Материалы
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("discussion")}
                  className={`py-4 px-2 border-b-2 font-medium transition-colors
                    ${activeTab === "discussion"
                      ? "border-red-500 text-red-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                    }
                  `}
                >
                  <span className="flex items-center gap-2">
                    <Users size={18} />
                    Обсуждение
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Контент вкладок */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {activeTab === "lessons" && (
              <div className="grid gap-4">
                {module.lessons?.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className={`
                      group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300
                      ${lesson.unlocked
                        ? "cursor-pointer hover:-translate-y-1"
                        : "opacity-75 cursor-not-allowed"
                      }
                    `}
                    onClick={() => lesson.unlocked && handleLessonClick(lesson.id)}
                  >
                    <div className="flex items-center p-4">
                      {/* Номер урока с иконкой */}
                      <div className={`
                        w-12 h-12 rounded-xl flex items-center justify-center mr-4
                        ${lesson.completed
                          ? "bg-gradient-to-br from-green-500 to-emerald-500"
                          : lesson.unlocked
                            ? "bg-gradient-to-br from-red-500 to-red-600"
                            : "bg-gray-200"
                        }
                      `}>
                        {lesson.completed ? (
                          <CheckCircle className="text-white" size={20} />
                        ) : lesson.unlocked ? (
                          <PlayCircle className="text-white" size={20} />
                        ) : (
                          <Lock className="text-white" size={18} />
                        )}
                      </div>

                      {/* Информация об уроке */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-sm text-gray-500">
                            Урок {index + 1} из {module.lessons.length}
                          </span>
                          {lesson.completed && (
                            <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                              Пройден
                            </span>
                          )}
                          {!lesson.unlocked && (
                            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
                              Заблокирован
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                          {lesson.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {lesson.content || "Описание урока..."}
                        </p>

                        {/* Мета-информация урока */}
                        <div className="flex items-center gap-4 mt-2">
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock size={12} />
                            {lesson.duration || '15 мин'}
                          </span>
                          {lesson.video && (
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <PlayCircle size={12} />
                              Видео
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Стрелка для перехода */}
                      {lesson.unlocked && (
                        <ChevronRight
                          size={20}
                          className="text-gray-400 group-hover:text-red-500 group-hover:translate-x-1 transition-all"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "materials" && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Материалы модуля</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <Download size={20} className="text-red-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Презентация модуля</p>
                      <p className="text-xs text-gray-500">PDF • 2.5 MB</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Download size={20} className="text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Домашнее задание</p>
                      <p className="text-xs text-gray-500">DOCX • 1.2 MB</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "discussion" && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Обсуждение модуля</h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                      А
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Анна</p>
                        <p className="text-sm text-gray-600">Отличный модуль! Очень понятно объясняете.</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">2 часа назад</p>
                    </div>
                  </div>

                  <button className="text-red-500 hover:text-red-600 font-medium text-sm">
                    Написать комментарий
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Модальное окно для шаринга */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 animate-slideUp">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Поделиться модулем</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={window.location.href}
                readOnly
                className="flex-1 p-2 border border-gray-200 rounded-lg bg-gray-50"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setShowShareModal(false);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Копировать
              </button>
            </div>
            <button
              onClick={() => setShowShareModal(false)}
              className="mt-4 text-gray-500 hover:text-gray-700 text-sm"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Module;