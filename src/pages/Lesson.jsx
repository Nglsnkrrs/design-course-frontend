// src/pages/Lesson.jsx
import React, { useContext, useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { ModulesContext } from "../context/ModulesContext";
import {
  BookOpen,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  Play,
  Download,
  Share2,
  Bookmark,
  MessageCircle,
  Award,
  Sparkles,
  ArrowLeft,
  Maximize2,
  Volume2,
  Subtitles,
  Settings,
  File,
  FileArchive,
  FileSpreadsheet,
  FileImage
} from "lucide-react";

const Lesson = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { modules, unlockLesson, ensureFirstLessonUnlocked } = useContext(ModulesContext);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [downloading, setDownloading] = useState(null);
  const [availableMaterials, setAvailableMaterials] = useState([]);
  const [checkingMaterials, setCheckingMaterials] = useState(true);
  const videoRef = useRef(null);

  const module = modules?.find((m) => m.lessons.some((l) => l.id === parseInt(id)));

  let lesson = null;
  let lessonIndex = -1;
  let prevLesson = null;
  let nextLesson = null;
  let progress = 0;
  let isLessonUnlocked = false;

  if (module) {
    lessonIndex = module.lessons.findIndex((l) => l.id === parseInt(id));
    lesson = module.lessons[lessonIndex];
    prevLesson = lessonIndex > 0 ? module.lessons[lessonIndex - 1] : null;
    nextLesson = lessonIndex < module.lessons.length - 1 ? module.lessons[lessonIndex + 1] : null;

    isLessonUnlocked = lesson?.unlocked || false;

    progress = Math.round(
      (modules.flatMap((m) => m.lessons).filter((l) => l.completed).length /
        modules.flatMap((m) => m.lessons).length) *
        100
    );
  }

  useEffect(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    if (saved !== null) {
      setIsSidebarCollapsed(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  useEffect(() => {
    const interval = setInterval(() => {
      setVideoProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (lesson?.completed) {
      setIsCompleted(true);
    } else {
      setIsCompleted(false);
    }
  }, [lesson]);

  // Проверка доступности материалов
  useEffect(() => {
    const checkMaterials = async () => {
      if (!lesson?.materials || lesson.materials.length === 0) {
        setAvailableMaterials([]);
        setCheckingMaterials(false);
        return;
      }

      setCheckingMaterials(true);
      const available = [];

      for (const material of lesson.materials) {
        try {
          const response = await fetch(`http://localhost:5000/api/check-file/${material.file}`);
          const data = await response.json();

          if (data.exists) {
            available.push({
              ...material,
              exists: true,
              size: data.sizeFormatted || material.size,
              url: data.url
            });
          } else {
            console.log(`Material not available: ${material.file}`);
          }
        } catch (error) {
          console.error(`Error checking material ${material.file}:`, error);
        }
      }

      setAvailableMaterials(available);
      setCheckingMaterials(false);
    };

    checkMaterials();
  }, [lesson]);

  const completeLesson = useCallback(() => {
    if (module && lesson && !lesson.completed && lesson.unlocked) {
      unlockLesson(module.id, lessonIndex);
      setIsCompleted(true);
    }
  }, [module, lesson, lessonIndex, unlockLesson]);

  const goToModule = useCallback(() => {
    if (module) {
      navigate(`/module/${module.id}`);
    }
  }, [module, navigate]);

  useEffect(() => {
    if (module && lesson && !isLessonUnlocked) {
      navigate(`/module/${module.id}`);
    }
  }, [module, lesson, isLessonUnlocked, navigate]);

  // Функция для скачивания материала
  const downloadMaterial = async (material) => {
    try {
      setDownloading(material.file);

      // Формируем URL
      const fileUrl = `http://localhost:5000/materials/${material.file}`;

      // Для PDF открываем в новой вкладке
      if (material.type === 'pdf') {
        window.open(fileUrl + '#view=FitH', '_blank');
      } else {
        // Для других файлов создаем ссылку для скачивания
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = material.file;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      // Показываем уведомление
      setTimeout(() => {
        setDownloading(null);
      }, 2000);

    } catch (error) {
      console.error('Error:', error);
      alert('Ошибка при открытии файла');
      setDownloading(null);
    }
  };

  // Функция для получения иконки в зависимости от типа файла
  const getFileIcon = (type, color) => {
    const iconProps = { size: 20, className: `text-${color}-500` };

    switch(type?.toLowerCase()) {
      case 'pdf':
        return <FileText {...iconProps} />;
      case 'docx':
      case 'doc':
        return <FileText {...iconProps} />;
      case 'zip':
      case 'rar':
      case '7z':
        return <FileArchive {...iconProps} />;
      case 'xlsx':
      case 'xls':
      case 'csv':
        return <FileSpreadsheet {...iconProps} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'svg':
      case 'webp':
        return <FileImage {...iconProps} />;
      case 'psd':
      case 'ai':
      case 'fig':
      case 'sketch':
        return <File {...iconProps} />;
      default:
        return <File {...iconProps} />;
    }
  };

  if (!module || !lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Загрузка урока...</p>
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
          {/* Верхняя навигация */}
          <div className="bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={goToModule}
                    className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ArrowLeft size={18} />
                    <span>К модулю</span>
                  </button>

                  <div className="h-6 w-px bg-gray-300" />

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Урок {lessonIndex + 1} из {module.lessons.length}</span>
                    <div className="w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-300"
                        style={{ width: `${((lessonIndex + 1) / module.lessons.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <Bookmark size={18} />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Основной контент */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Левая колонка - видео и контент */}
              <div className="lg:col-span-2 space-y-6">
                {/* Видео плеер */}
                {lesson.video && (
  <div className="relative group rounded-2xl overflow-hidden shadow-2xl bg-black">
    <iframe
      ref={videoRef}
      width="100%"
      height="480"
      src={`${lesson.video}?autoplay=0&controls=1&rel=0&modestbranding=1&showinfo=0&iv_load_policy=3`}
      title={lesson.title}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      referrerPolicy="strict-origin-when-cross-origin"
      className="w-full aspect-video"
      style={{
        border: 0,
        pointerEvents: 'auto' // Обеспечивает нормальную работу кликов
      }}
    />

    {/* Прогресс видео (можно оставить или убрать) */}
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
      <div
        className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-300"
        style={{ width: `${videoProgress}%` }}
      />
    </div>
  </div>
)}

                {/* Информация об уроке */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-800 mb-2">{lesson.title}</h1>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock size={16} />
                          {lesson.duration || '15 мин'}
                        </span>
                        {availableMaterials.length > 0 && (
                          <span className="flex items-center gap-1">
                            <FileText size={16} />
                            {availableMaterials.length} материалов
                          </span>
                        )}
                      </div>
                    </div>

                    {lesson.completed && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full">
                        <CheckCircle size={16} />
                        <span className="text-sm font-medium">Пройден</span>
                      </div>
                    )}
                  </div>

                  <div className="prose max-w-none">
                    <p className="text-gray-600 leading-relaxed">{lesson.content}</p>
                  </div>

                  {/* Материалы урока */}
                  {!checkingMaterials && availableMaterials.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Материалы урока</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {availableMaterials.map((material, index) => (
                          <div
                            key={index}
                            onClick={() => downloadMaterial(material)}
                            className={`
                              flex items-center gap-3 p-4 bg-gray-50 rounded-xl
                              hover:bg-gray-100 transition-all cursor-pointer group
                              ${downloading === material.file ? 'opacity-50 pointer-events-none' : ''}
                            `}
                          >
                            <div className={`w-10 h-10 bg-${material.color}-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                              {getFileIcon(material.type, material.color)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-gray-700">{material.name}</p>
                                {downloading === material.file ? (
                                  <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <Download size={16} className="text-gray-400 group-hover:text-red-500 transition-colors" />
                                )}
                              </div>
                              <p className="text-xs text-gray-500">
                                {material.file.split('.').pop().toUpperCase()} • {material.size}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Сообщение о загрузке материалов */}
                  {checkingMaterials && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-gray-500">
                        <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm">Проверка доступных материалов...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Заметки к уроку */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <button
                    onClick={() => setShowNotes(!showNotes)}
                    className="flex items-center justify-between w-full"
                  >
                    <h3 className="text-lg font-semibold text-gray-800">Мои заметки</h3>
                    <ChevronRight size={20} className={`transform transition-transform ${showNotes ? 'rotate-90' : ''}`} />
                  </button>

                  {showNotes && (
                    <div className="mt-4 animate-slideDown">
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Запишите свои мысли по уроку..."
                        className="w-full h-32 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Правая колонка - навигация по урокам */}
              <div className="space-y-6">
                {/* Прогресс модуля */}
                <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg p-6 text-white">
                  <div className="flex items-center gap-2 mb-4">
                    <Award size={24} />
                    <h3 className="text-lg font-semibold">Прогресс модуля</h3>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Урок {lessonIndex + 1} из {module.lessons.length}</span>
                      <span>{Math.round(((lessonIndex + 1) / module.lessons.length) * 100)}%</span>
                    </div>
                    <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full transition-all duration-300"
                        style={{ width: `${((lessonIndex + 1) / module.lessons.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Навигация по урокам */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Уроки модуля</h3>
                  <div className="space-y-2">
                    {module.lessons.map((l, idx) => {
                      const isActive = l.id === parseInt(id);
                      const isLessonCompleted = l.completed;
                      const isLessonUnlocked = l.unlocked;

                      return (
                        <div
                          key={l.id}
                          className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer
                            ${isActive
                              ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md'
                              : isLessonUnlocked
                                ? 'hover:bg-gray-50 text-gray-700 cursor-pointer'
                                : 'text-gray-400 cursor-not-allowed opacity-50'
                            }
                          `}
                          onClick={() => isLessonUnlocked && !isActive && navigate(`/lesson/${l.id}`)}
                        >
                          <div className={`
                            w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
                            ${isActive
                              ? 'bg-white text-red-600'
                              : isLessonCompleted
                                ? 'bg-green-100 text-green-600'
                                : isLessonUnlocked
                                  ? 'bg-gray-100 text-gray-600'
                                  : 'bg-gray-50 text-gray-400'
                            }
                          `}>
                            {idx + 1}
                          </div>
                          <span className="flex-1 text-sm truncate">{l.title}</span>
                          {isLessonCompleted && (
                            <CheckCircle size={14} className={isActive ? 'text-white' : 'text-green-500'} />
                          )}
                          {!isLessonUnlocked && !isLessonCompleted && (
                            <span className="text-xs text-gray-400">Заблокировано</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Обсуждение */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <MessageCircle size={18} className="text-red-500" />
                    Обсуждение
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">3 комментария</p>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        А
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700">Анна</p>
                        <p className="text-xs text-gray-500">Отличный урок, спасибо!</p>
                      </div>
                    </div>
                    <button className="text-sm text-red-500 hover:text-red-600 font-medium">
                      Добавить комментарий
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Навигация между уроками */}
            <div className="mt-8 flex items-center justify-between">
              {prevLesson && prevLesson.unlocked && (
                <button
                  onClick={() => navigate(`/lesson/${prevLesson.id}`)}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-xl shadow-md hover:shadow-lg transition-all group"
                >
                  <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                  <div className="text-left">
                    <p className="text-xs text-gray-500">Предыдущий урок</p>
                    <p className="font-medium">{prevLesson.title}</p>
                  </div>
                </button>
              )}

              <div className="flex-1 flex justify-center">
                {lesson.completed ? (
                  <div className="flex items-center gap-2 px-8 py-3 bg-green-500 text-white rounded-xl shadow-lg">
                    <CheckCircle size={20} />
                    <span>Урок завершен!</span>
                  </div>
                ) : (
                  <button
                    onClick={completeLesson}
                    disabled={!lesson.unlocked}
                    className={`
                      flex items-center gap-2 px-8 py-3 rounded-xl shadow-lg transition-all transform hover:scale-105
                      ${!lesson.unlocked
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-xl'
                      }
                    `}
                  >
                    <BookOpen size={20} />
                    Завершить урок
                  </button>
                )}
              </div>

              {nextLesson && nextLesson.unlocked && (
                <button
                  onClick={() => navigate(`/lesson/${nextLesson.id}`)}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-xl shadow-md hover:shadow-lg transition-all group"
                >
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Следующий урок</p>
                    <p className="font-medium">{nextLesson.title}</p>
                  </div>
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>

            {/* Если нет следующего урока и это последний урок модуля */}
            {!nextLesson && !lesson.completed && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500 mb-2">Это последний урок модуля</p>
                <button
                  onClick={completeLesson}
                  disabled={!lesson.unlocked}
                  className={`
                    flex items-center gap-2 px-8 py-3 rounded-xl shadow-lg transition-all transform hover:scale-105 mx-auto
                    ${!lesson.unlocked
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-xl'
                    }
                  `}
                >
                  <Award size={20} />
                  Завершить модуль
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Уведомление о завершении */}
      {isCompleted && !lesson.completed && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 animate-slideUp">
          <Sparkles size={20} />
          <span>Урок отмечен как завершенный!</span>
        </div>
      )}
    </div>
  );
};

export default Lesson;