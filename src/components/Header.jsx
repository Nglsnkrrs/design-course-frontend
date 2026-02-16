// src/components/Header.jsx
import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  LogOut,
  User,
  BookOpen,
  Award,
  Bell,
  Settings,
  ChevronDown,
  Menu,
  X
} from "lucide-react";

export default function Header({ progress = 0 }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const goHome = () => navigate("/course");
  const goToProfile = () => navigate("/profile");
  const goToAchievements = () => navigate("/achievements");

  // Определяем активную страницу
  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-gradient-to-r from-white via-white to-blue-50/50 shadow-md py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Левая часть с логотипом и приветствием */}
          <div className="flex items-center gap-4">
            {/* Логотип */}
            <div
              onClick={goHome}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="text-white" size={20} />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                  EduPlatform
                </h1>
                <p className="text-xs text-gray-500">Обучение без границ</p>
              </div>
            </div>

            {/* Приветствие с анимацией */}
            <div className="hidden md:block ml-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl">
                <User size={16} className="text-red-500" />
                <span className="text-sm text-gray-700">
                  С возвращением, <span className="font-semibold text-red-600">{user?.name || 'Гость'}</span>
                </span>
                <span className="text-xl animate-wave ml-1">👋</span>
              </div>
            </div>
          </div>

          {/* Правая часть - десктопная версия */}
          <div className="hidden md:flex items-center gap-4">
            {/* Прогресс с красивым дизайном */}
            <div className="relative group">
              <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-2xl border border-gray-100 hover:border-red-200 transition-colors">
                <div className="flex items-center gap-2">
                  <Award size={18} className="text-red-500" />
                  <span className="text-sm font-medium text-gray-700">Прогресс</span>
                </div>
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-1000 ease-out relative"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-shimmer" />
                  </div>
                </div>
                <span className="text-sm font-bold text-red-600 min-w-[40px]">
                  {progress}%
                </span>
              </div>

              {/* Всплывающая подсказка */}
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {progress}% курса завершено
              </div>
            </div>

            {/* Навигационные кнопки */}
            <nav className="flex items-center gap-1">
              <button
                onClick={goHome}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  isActive('/course')
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Home size={18} />
                <span>Главная</span>
              </button>

              <button
                onClick={goToAchievements}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  isActive('/achievements')
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Award size={18} />
                <span>Достижения</span>
              </button>
            </nav>

            {/* Уведомления */}
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* Профиль пользователя */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-300 border border-gray-200"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center text-white font-bold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium text-gray-700">{user?.name || 'Пользователь'}</p>
                  <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
                </div>
                <ChevronDown size={16} className={`text-gray-500 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Выпадающее меню пользователя */}
              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-slideDown">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        goToProfile();
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User size={16} className="text-gray-500" />
                      Профиль
                    </button>

                    <button
                      onClick={() => {
                        navigate('/settings');
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Settings size={16} className="text-gray-500" />
                      Настройки
                    </button>

                    <div className="border-t border-gray-100 my-1" />

                    <button
                      onClick={() => {
                        handleLogout();
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} />
                      Выйти
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Мобильное меню кнопка */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Мобильное меню */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-lg animate-slideDown">
          <div className="p-4 space-y-3">
            {/* Приветствие для мобильных */}
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="font-medium text-gray-800">{user?.name || 'Гость'}</p>
                <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
              </div>
            </div>

            {/* Прогресс для мобильных */}
            <div className="p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Прогресс курса</span>
                <span className="text-sm font-bold text-red-600">{progress}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Навигация для мобильных */}
            <button
              onClick={() => {
                goHome();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <Home size={20} className="text-gray-500" />
              <span>Главная</span>
            </button>

            <button
              onClick={() => {
                goToAchievements();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <Award size={20} className="text-gray-500" />
              <span>Достижения</span>
            </button>

            <button
              onClick={() => {
                goToProfile();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <User size={20} className="text-gray-500" />
              <span>Профиль</span>
            </button>

            <button
              onClick={() => {
                navigate('/settings');
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <Settings size={20} className="text-gray-500" />
              <span>Настройки</span>
            </button>

            <div className="border-t border-gray-100 my-2" />

            <button
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <LogOut size={20} />
              <span>Выйти</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}