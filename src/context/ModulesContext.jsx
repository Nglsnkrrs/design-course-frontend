// src/context/ModulesContext.jsx
import { createContext, useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import { getUserProgress, completeLesson, initUserProgress } from "../services/api";

export const ModulesContext = createContext();

export const ModulesProvider = ({ children }) => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useContext(AuthContext);

  // Загрузка модулей и прогресса пользователя
  useEffect(() => {
    const loadModules = async () => {
      try {
        setLoading(true);
        console.log('Loading modules...');

        // Загружаем модули с сервера
        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const response = await fetch(`${API_BASE}/modules`);
        const modulesData = await response.json();

        console.log('Modules loaded from API:', modulesData);

        // Создаем глубокую копию модулей из JSON
        const baseModules = modulesData.modules.map(module => ({
          ...module,
          lessons: module.lessons.map(lesson => ({
            ...lesson,
            unlocked: false,
            completed: false
          }))
        }));

        // Если пользователь авторизован, загружаем его прогресс с сервера
        if (user && token) {
          try {
            console.log('Loading user progress...');
            let response;

            try {
              response = await getUserProgress(token);
            } catch (error) {
              console.log('Error getting progress, might need init:', error);
              if (error.response?.status === 404 || error.response?.status === 500) {
                console.log('Initializing user progress...');
                await initUserProgress(token);
                response = await getUserProgress(token);
              } else {
                throw error;
              }
            }

            const userProgress = response.data;
            console.log('User progress loaded:', userProgress);

            // Создаем карту прогресса для быстрого доступа
            const progressMap = userProgress.reduce((acc, item) => {
              acc[item.lessonId] = {
                completed: item.completed,
                unlocked: item.unlocked
              };
              return acc;
            }, {});

            console.log('Progress map:', progressMap);

            // Применяем прогресс к модулям и определяем разблокированные модули
            const updatedModules = baseModules.map((module, moduleIndex) => {
              // Первый модуль всегда разблокирован
              let isModuleUnlocked = moduleIndex === 0;

              // Для остальных модулей проверяем, все ли уроки предыдущего пройдены
              if (moduleIndex > 0) {
                const prevModule = baseModules[moduleIndex - 1];
                const allPrevLessonsCompleted = prevModule.lessons.every(lesson =>
                  progressMap[lesson.id]?.completed || false
                );
                isModuleUnlocked = allPrevLessonsCompleted;
              }

              // Применяем прогресс к урокам
              const updatedLessons = module.lessons.map((lesson, lessonIndex) => {
                const lessonProgress = progressMap[lesson.id];

                // Если урок уже есть в прогрессе, используем его статус
                if (lessonProgress) {
                  return {
                    ...lesson,
                    unlocked: lessonProgress.unlocked,
                    completed: lessonProgress.completed
                  };
                }

                // Если модуль разблокирован и это первый урок, разблокируем его
                if (isModuleUnlocked && lessonIndex === 0) {
                  return {
                    ...lesson,
                    unlocked: true,
                    completed: false
                  };
                }

                return {
                  ...lesson,
                  unlocked: false,
                  completed: false
                };
              });

              return {
                ...module,
                unlocked: isModuleUnlocked,
                lessons: updatedLessons
              };
            });

            console.log('Updated modules with progress:', updatedModules);
            setModules(updatedModules);
          } catch (error) {
            console.error('Error loading user progress:', error);
            // В случае ошибки показываем только первый модуль с первым уроком
            const initialModules = baseModules.map((module, moduleIndex) => ({
              ...module,
              unlocked: moduleIndex === 0,
              lessons: module.lessons.map((lesson, lessonIndex) => ({
                ...lesson,
                unlocked: moduleIndex === 0 && lessonIndex === 0,
                completed: false
              }))
            }));
            setModules(initialModules);
          }
        } else {
          // Для неавторизованных пользователей показываем демо-режим
          console.log('No user, showing demo mode');
          const initialModules = baseModules.map((module, moduleIndex) => ({
            ...module,
            unlocked: moduleIndex === 0,
            lessons: module.lessons.map((lesson, lessonIndex) => ({
              ...lesson,
              unlocked: moduleIndex === 0 && lessonIndex === 0,
              completed: false
            }))
          }));
          setModules(initialModules);
        }
      } catch (error) {
        console.error('Error loading modules:', error);
        setModules([]);
      } finally {
        setLoading(false);
      }
    };

    loadModules();
  }, [user, token]);

  // Вспомогательная функция для обновления прогресса
  const updateModulesProgress = (prevModules, moduleId, lessonIndex) => {
    return prevModules.map((m) => {
      if (m.id === moduleId) {
        const updatedLessons = m.lessons.map((lesson, idx) => {
          // Текущий урок - завершаем
          if (idx === lessonIndex) {
            return { ...lesson, unlocked: true, completed: true };
          }
          // Следующий урок - разблокируем, если он есть и еще не разблокирован
          if (idx === lessonIndex + 1 && !lesson.unlocked) {
            return { ...lesson, unlocked: true, completed: false };
          }
          return lesson;
        });

        return {
          ...m,
          lessons: updatedLessons
        };
      }
      return m;
    });
  };

  // Сохранение прогресса урока
  const unlockLesson = useCallback(async (moduleId, lessonIndex) => {
    if (!user || !token) {
      // Для неавторизованных пользователей просто обновляем локально
      setModules((prevModules) => {
        return updateModulesProgress(prevModules, moduleId, lessonIndex);
      });
      return;
    }

    // Находим модуль и урок
    const module = modules.find(m => m.id === moduleId);
    if (!module) return;

    const currentLesson = module.lessons[lessonIndex];
    if (!currentLesson) return;

    console.log('Completing lesson:', currentLesson.id);

    // Оптимистичное обновление UI
    setModules((prevModules) => {
      const updated = updateModulesProgress(prevModules, moduleId, lessonIndex);
      return updated;
    });

    // Отправляем запрос на сервер
    try {
      const response = await completeLesson(token, currentLesson.id);
      console.log('Server response:', response.data);

      // После успешного сохранения, проверяем, нужно ли разблокировать следующий модуль
      setModules(prevModules => {
        const currentModuleIndex = prevModules.findIndex(m => m.id === moduleId);
        const currentModule = prevModules[currentModuleIndex];
        const nextModule = prevModules[currentModuleIndex + 1];

        if (nextModule) {
          // Проверяем, все ли уроки текущего модуля пройдены
          const allCurrentLessonsCompleted = currentModule.lessons.every(l => l.completed);

          if (allCurrentLessonsCompleted && !nextModule.unlocked) {
            console.log('All lessons completed, unlocking next module:', nextModule.id);

            // Разблокируем следующий модуль и его первый урок
            const updatedModules = [...prevModules];
            updatedModules[currentModuleIndex + 1] = {
              ...nextModule,
              unlocked: true,
              lessons: nextModule.lessons.map((lesson, idx) => ({
                ...lesson,
                unlocked: idx === 0 ? true : lesson.unlocked,
                completed: false
              }))
            };
            return updatedModules;
          }
        }
        return prevModules;
      });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }, [user, token, modules]);

  // Функция для проверки, разблокирован ли модуль
  const isModuleUnlocked = useCallback((moduleId) => {
    const module = modules.find(m => m.id === moduleId);
    if (!module) return false;
    return module.unlocked;
  }, [modules]);

  // Функция для получения прогресса модуля
  const getModuleProgress = useCallback((moduleId) => {
    const module = modules.find(m => m.id === moduleId);
    if (!module) return 0;
    const completed = module.lessons.filter(l => l.completed).length;
    return Math.round((completed / module.lessons.length) * 100);
  }, [modules]);

  // Функция для получения общего прогресса
  const getTotalProgress = useCallback(() => {
    if (!modules.length) return 0;
    const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
    const completedLessons = modules.reduce((acc, m) =>
      acc + m.lessons.filter(l => l.completed).length, 0
    );
    return Math.round((completedLessons / totalLessons) * 100);
  }, [modules]);

  // Функция для разблокировки первого урока модуля
  const ensureFirstLessonUnlocked = useCallback((moduleId) => {
    setModules(prevModules => {
      return prevModules.map(module => {
        if (module.id === moduleId && module.unlocked) {
          const hasUnlockedLessons = module.lessons.some(l => l.unlocked);

          if (!hasUnlockedLessons && module.lessons.length > 0) {
            console.log('Ensuring first lesson unlocked for module:', moduleId);

            const updatedLessons = module.lessons.map((lesson, idx) => ({
              ...lesson,
              unlocked: idx === 0 ? true : lesson.unlocked
            }));

            return {
              ...module,
              lessons: updatedLessons
            };
          }
        }
        return module;
      });
    });
  }, []);

  return (
    <ModulesContext.Provider value={{
      modules,
      loading,
      unlockLesson,
      isModuleUnlocked,
      getModuleProgress,
      getTotalProgress,
      ensureFirstLessonUnlocked
    }}>
      {children}
    </ModulesContext.Provider>
  );

};
