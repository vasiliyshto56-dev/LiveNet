import React, { useState, useEffect } from 'react';
import { Menu, Settings, LogOut, MessageCircle, Eye, ThumbsUp, ThumbsDown, ChevronLeft, Maximize, Minimize } from 'lucide-react';

// 📺 Live Stream Player URL: https://your-domain.com/player
// Replace with your actual domain

export default function LiveNet() {
  const loadState = (key, defaultValue) => {
    try {
      const saved = localStorage.getItem(`livenet_${key}`);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const saveState = (key, value) => {
    try {
      localStorage.setItem(`livenet_${key}`, JSON.stringify(value));
    } catch (e) {
      console.error('Error saving:', e);
    }
  };

  const [view, setView] = useState(loadState('view', 'home'));
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(loadState('isAdmin', false));
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [isLive, setIsLive] = useState(loadState('isLive', false));
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  
  const [viewers, setViewers] = useState(loadState('viewers', 0));
  const [likes, setLikes] = useState(loadState('likes', 0));
  const [dislikes, setDislikes] = useState(loadState('dislikes', 0));
  const [userLiked, setUserLiked] = useState(loadState('userLiked', false));
  const [userDisliked, setUserDisliked] = useState(loadState('userDisliked', false));
  const [scheduleText, setScheduleText] = useState(loadState('scheduleText', ''));
  const [parsedSchedule, setParsedSchedule] = useState(loadState('parsedSchedule', []));
  const [streamName, setStreamName] = useState(loadState('streamName', 'Прямой эфир'));

  useEffect(() => { saveState('view', view); }, [view]);
  useEffect(() => { saveState('isAdmin', isAdmin); }, [isAdmin]);
  useEffect(() => { saveState('isLive', isLive); }, [isLive]);
  useEffect(() => { saveState('viewers', viewers); }, [viewers]);
  useEffect(() => { saveState('likes', likes); }, [likes]);
  useEffect(() => { saveState('dislikes', dislikes); }, [dislikes]);
  useEffect(() => { saveState('userLiked', userLiked); }, [userLiked]);
  useEffect(() => { saveState('userDisliked', userDisliked); }, [userDisliked]);
  useEffect(() => { saveState('scheduleText', scheduleText); }, [scheduleText]);
  useEffect(() => { saveState('parsedSchedule', parsedSchedule); }, [parsedSchedule]);
  useEffect(() => { saveState('streamName', streamName); }, [streamName]);

  // Realistic viewer count - increases when stream starts
  useEffect(() => {
    if (!isLive) return;
    
    const timer = setInterval(() => {
      setViewers(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 8000);
    
    return () => clearInterval(timer);
  }, [isLive]);

  // Parse schedule from text (e.g., "18:00 - Передача 1\n20:00 - Передача 2")
  const parseSchedule = (text) => {
    const lines = text.split('\n').filter(line => line.trim());
    const schedule = lines.map(line => {
      const match = line.match(/(\d{1,2}):(\d{2})\s*-?\s*(.+)/);
      if (match) {
        return {
          time: `${match[1].padStart(2, '0')}:${match[2]}`,
          name: match[3].trim()
        };
      }
      return null;
    }).filter(Boolean);
    return schedule;
  };

  const handleScheduleSave = () => {
    const parsed = parseSchedule(scheduleText);
    setParsedSchedule(parsed);
    setView('admin');
  };

  const handleAdminLogin = () => {
    if (adminPassword === '0f9a4193i27374bx456') {
      setIsAdmin(true);
      setShowPasswordInput(false);
      setAdminPassword('');
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setView('home');
  };

  // Handle spacebar to toggle stream (but not when typing in input)
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        if (!isLive && !isConnecting) {
          handleStartStream();
        } else if (isLive && !isDisconnecting) {
          setIsDisconnecting(true);
          setTimeout(() => {
            setIsLive(false);
            setIsConnecting(false);
            setIsDisconnecting(false);
          }, 1500);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isLive, isConnecting, isDisconnecting]);

  const handleStartStream = () => {
    setIsLive(true);
    setViewers(0);
    setIsConnecting(true);
    setTimeout(() => setIsConnecting(false), 2000);
  };

  const handleLike = () => {
    if (userLiked) {
      setUserLiked(false);
      setLikes(Math.max(0, likes - 1));
    } else {
      setUserLiked(true);
      if (userDisliked) {
        setUserDisliked(false);
        setDislikes(Math.max(0, dislikes - 1));
      }
      setLikes(likes + 1);
    }
  };

  const handleDislike = () => {
    if (userDisliked) {
      setUserDisliked(false);
      setDislikes(Math.max(0, dislikes - 1));
    } else {
      setUserDisliked(true);
      if (userLiked) {
        setUserLiked(false);
        setLikes(Math.max(0, likes - 1));
      }
      setDislikes(dislikes + 1);
    }
  };

  // Home Page
  if (view === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 text-white overflow-hidden">
        <div className="flex justify-between items-center px-8 py-6 border-b border-purple-700/50 shadow-lg">
          <div></div>
          <button
            onClick={() => setShowPasswordInput(!showPasswordInput)}
            className="p-2 hover:bg-purple-700/50 rounded transition shadow-md"
          >
            <Settings size={20} />
          </button>
        </div>

        {showPasswordInput && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-purple-900 p-8 rounded-2xl border border-pink-500/50 shadow-2xl">
              <h2 className="text-xl font-bold mb-4 text-pink-400">Панель администратора</h2>
              <input
                type="password"
                placeholder="Введите пароль"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full bg-purple-800 border border-pink-500/30 rounded-lg px-4 py-3 mb-4 text-white placeholder-purple-300 focus:outline-none focus:border-pink-500 transition shadow-md"
                onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAdminLogin}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 px-4 py-3 rounded-lg font-bold transition shadow-lg hover:shadow-pink-500/50"
                >
                  Вход
                </button>
                <button
                  onClick={() => setShowPasswordInput(false)}
                  className="flex-1 bg-purple-800 hover:bg-purple-700 px-4 py-3 rounded-lg font-bold transition shadow-md"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="h-screen flex flex-col items-center justify-center px-8">
          <h1 className="text-8xl font-black mb-6 text-center bg-gradient-to-r from-pink-400 via-purple-400 to-pink-300 bg-clip-text text-transparent drop-shadow-lg">
            LiveNet
          </h1>

          <p className="text-purple-200 text-xl mb-16 text-center max-w-lg font-light">
            Выдуманный телеканал для настоящих фанатов
          </p>

          <div className="flex gap-4 flex-col w-full max-w-sm items-center">
            <button
              onClick={() => setView('player')}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-pink-500/60 transition transform hover:scale-105 text-lg shadow-lg"
            >
              ▶ СМОТРЕТЬ СТРИМ
            </button>
            <a
              href="https://t.me/livenet_official"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-blue-500/60 transition transform hover:scale-105 text-center text-lg flex items-center justify-center gap-2 shadow-lg"
            >
              <MessageCircle size={20} /> ТЕЛЕГРАМ КАНАЛ
            </a>
          </div>

          {isAdmin && (
            <button
              onClick={() => setView('admin')}
              className="mt-8 px-6 py-2 bg-gradient-to-r from-purple-700 to-pink-700 text-white text-sm rounded-lg hover:shadow-lg transition shadow-md font-semibold"
            >
              Панель администратора
            </button>
          )}
        </div>

        <div className="absolute bottom-0 w-full text-center py-6 text-purple-300/70 text-sm border-t border-purple-700/50">
          © 2026 LiveNet. Все права защищены.
        </div>
      </div>
    );
  }

  // Player View
  if (view === 'player') {
    return (
      <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'h-screen'} bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 text-white flex flex-col overflow-hidden`}>
        {/* Header */}
        {!isFullscreen && (
          <div className="flex justify-between items-center px-6 py-4 border-b border-purple-700/50 shadow-lg">
            <button
              onClick={() => setView('home')}
              className="flex items-center gap-2 text-purple-300 hover:text-white transition shadow-md hover:shadow-lg rounded-lg p-2"
            >
              <Menu size={20} />
              Назад
            </button>
            <div className="w-8"></div>
          </div>
        )}

        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-purple-800/50 to-purple-900">
            <div className="w-full h-full bg-purple-950 flex items-center justify-center relative overflow-hidden group shadow-2xl">
              {/* Fullscreen Button */}
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="absolute top-4 right-4 bg-purple-800/80 hover:bg-purple-700/80 p-2 rounded-lg transition shadow-lg backdrop-blur-sm z-10"
              >
                {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
              </button>

              {isConnecting ? (
                <div className="flex flex-col items-center gap-6">
                  <div className="relative w-32 h-32">
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full flex items-center justify-center border-2 border-pink-400/50 shadow-2xl animate-pulse">
                      <span className="text-6xl">▶</span>
                    </div>
                    <div className="absolute inset-0 rounded-full animate-spin" style={{
                      borderTop: '3px solid #ec4899',
                      borderRight: '3px solid transparent'
                    }}></div>
                  </div>
                  <p className="text-xl font-bold text-pink-400 animate-pulse">Подключение к эфиру...</p>
                </div>
              ) : isDisconnecting ? (
                <div className="flex flex-col items-center gap-6">
                  <div className="relative w-32 h-32">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-purple-500/20 rounded-full flex items-center justify-center border-2 border-red-400/50 shadow-2xl animate-pulse">
                      <span className="text-6xl">⊗</span>
                    </div>
                    <div className="absolute inset-0 rounded-full animate-spin" style={{
                      borderTop: '3px solid #ef4444',
                      borderRight: '3px solid transparent'
                    }}></div>
                  </div>
                  <p className="text-xl font-bold text-red-400 animate-pulse">Отсоединение от эфира...</p>
                </div>
              ) : isLive ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-32 h-32 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full flex items-center justify-center border-2 border-pink-400/50 shadow-2xl">
                    <span className="text-6xl">▶</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-6 px-8 text-center">
                  <div className="text-9xl animate-bounce">😢</div>
                  <div>
                    <h2 className="text-4xl font-bold text-pink-400 mb-3">Увы, но мы не в эфире :(</h2>
                    <p className="text-purple-300 text-lg">Нажми пробел для подключения</p>
                  </div>
                </div>
              )}
              {!isLive && isFullscreen && (
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="absolute top-4 left-4 bg-purple-800/80 hover:bg-purple-700/80 p-2 rounded-lg transition shadow-lg"
                >
                  <ChevronLeft size={20} />
                </button>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          {!isFullscreen && (
            <div className="w-80 bg-purple-900/50 border-l border-purple-700/50 flex flex-col shadow-2xl">
            {/* Stream Status and Name */}
            <div className="p-6 border-b border-purple-700/50">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  {isLive ? (
                    <>
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <p className="text-sm font-bold text-red-400">В ЭФИРЕ</p>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                      <p className="text-sm font-bold text-gray-400">ВНЕ ЭФИРА</p>
                    </>
                  )}
                </div>
                <h2 className="text-xl font-bold text-white">{streamName}</h2>
              </div>


              
              {/* Likes/Dislikes */}
              <div className="flex gap-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                    userLiked
                      ? 'bg-green-500/80 text-white'
                      : 'bg-purple-800 text-purple-300 hover:bg-purple-700'
                  }`}
                >
                  <ThumbsUp size={18} />
                  <span className="font-bold">{likes > 0 ? likes : '0'}</span>
                </button>
                <button
                  onClick={handleDislike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                    userDisliked
                      ? 'bg-red-500/80 text-white'
                      : 'bg-purple-800 text-purple-300 hover:bg-purple-700'
                  }`}
                >
                  <ThumbsDown size={18} />
                  <span className="font-bold">{dislikes > 0 ? dislikes : '0'}</span>
                </button>
              </div>
            </div>

              {/* Schedule */}
              <div className="flex-1 overflow-y-auto p-6 space-y-3">
                <h3 className="font-bold text-lg mb-4">Расписание</h3>
                {parsedSchedule.length > 0 ? (
                  parsedSchedule.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-purple-800/50 rounded-lg p-3 border border-purple-700/50 hover:bg-purple-800 transition shadow-md"
                    >
                      <p className="text-pink-400 font-bold text-sm">{item.time}</p>
                      <p className="text-white text-sm">{item.name}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-purple-400 text-sm">Расписание не добавлено</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Admin View
  if (view === 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 text-white p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Панель администратора</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setView('home')}
              className="flex items-center gap-2 px-6 py-2 bg-purple-700 hover:bg-purple-600 rounded-lg font-bold transition shadow-lg"
            >
              <ChevronLeft size={20} />
              Выйти в меню
            </button>
            <button
              onClick={handleAdminLogout}
              className="flex items-center gap-2 px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-bold transition shadow-lg"
            >
              <LogOut size={20} />
              Выйти
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl">
          {/* Stream Control */}
          <div className="bg-purple-800/50 rounded-2xl p-8 border border-purple-700/50 shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-pink-400">Управление трансляцией</h2>
            
            <div className="space-y-6">
              {/* Live Status */}
              <div>
                <label className="block text-sm font-semibold mb-3 text-purple-300">Статус эфира</label>
                <button
                  onClick={() => {
                    if (!isLive) {
                      handleStartStream();
                    } else {
                      setIsLive(false);
                      setIsConnecting(false);
                    }
                  }}
                  className={`w-full py-4 rounded-lg font-bold transition shadow-lg text-lg ${
                    isLive
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-purple-700 hover:bg-purple-600 text-purple-300'
                  }`}
                >
                  {isLive ? '🔴 ОСТАНОВИТЬ ЭФИР' : '⚪ ЗАПУСТИТЬ ЭФИР'}
                </button>
              </div>


            </div>
          </div>

          {/* Stream Name */}
          <div className="bg-purple-800/50 rounded-2xl p-8 border border-purple-700/50 shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-pink-400">Название эфира</h2>
            
            <input
              type="text"
              value={streamName}
              onChange={(e) => setStreamName(e.target.value)}
              className="w-full bg-purple-900 border border-pink-500/30 rounded-lg px-4 py-3 text-white placeholder-purple-400 focus:outline-none focus:border-pink-500 transition mb-4 shadow-md"
              placeholder="Введите название эфира"
            />
            
            <p className="text-purple-300 text-sm">Название будет отображаться в плеере</p>
          </div>

          {/* Stats */}
          <div className="bg-purple-800/50 rounded-2xl p-8 border border-purple-700/50 shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-pink-400">Статистика</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-purple-900/50 p-4 rounded-lg border border-purple-700/50">
                <span className="text-purple-300">👍 Лайки</span>
                <span className="text-2xl font-bold text-green-400">{likes}</span>
              </div>
              <div className="flex justify-between items-center bg-purple-900/50 p-4 rounded-lg border border-purple-700/50">
                <span className="text-purple-300">👎 Дислайки</span>
                <span className="text-2xl font-bold text-red-400">{dislikes}</span>
              </div>
              <button
                onClick={() => {
                  setLikes(0);
                  setDislikes(0);
                  setUserLiked(false);
                  setUserDisliked(false);
                }}
                className="w-full py-3 bg-purple-700 hover:bg-purple-600 rounded-lg font-bold transition mt-4 text-sm"
              >
                Сбросить статистику
              </button>
            </div>
          </div>

          {/* Schedule Manager */}
          <div className="lg:col-span-2 bg-purple-800/50 rounded-2xl p-8 border border-purple-700/50 shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-pink-400">Расписание</h2>
            <p className="text-purple-300 text-sm mb-4">Вставьте расписание (пример: 18:00 - Передача 1)</p>
            
            <textarea
              value={scheduleText}
              onChange={(e) => setScheduleText(e.target.value)}
              placeholder="18:00 - Передача 1&#10;20:00 - Передача 2&#10;22:00 - Передача 3"
              className="w-full bg-purple-900 border border-pink-500/30 rounded-lg px-4 py-4 text-white placeholder-purple-400 focus:outline-none focus:border-pink-500 transition shadow-md h-32 resize-none"
            />
            
            <button
              onClick={handleScheduleSave}
              className="w-full mt-4 py-3 bg-pink-500 hover:bg-pink-600 rounded-lg font-bold transition shadow-lg text-white"
            >
              Сохранить расписание
            </button>

            {parsedSchedule.length > 0 && (
              <div className="mt-6 space-y-2">
                <h3 className="text-sm font-semibold text-purple-300">Предпросмотр:</h3>
                {parsedSchedule.map((item, idx) => (
                  <div key={idx} className="bg-purple-900/50 p-3 rounded-lg border border-purple-700/50">
                    <p className="text-pink-400 font-bold text-sm">{item.time}</p>
                    <p className="text-white text-sm">{item.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}