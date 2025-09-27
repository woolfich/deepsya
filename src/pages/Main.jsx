import { useState, useEffect } from 'preact/hooks';
import { Link } from 'preact-router';
import db from '../lib/db';
import ImportExportModal from '../components/ImportExportModal';

export default function Main() {
  const [welders, setWelders] = useState([]);
  const [newWelderName, setNewWelderName] = useState('');
  const [showImportExportModal, setShowImportExportModal] = useState(false);

  useEffect(() => {
    loadWelders();
  }, []);

  const loadWelders = async () => {
    try {
      const weldersList = await db.getAllWelders();
      setWelders(weldersList);
    } catch (error) {
      console.error('Ошибка загрузки сварщиков:', error);
    }
  };

  const addWelder = async () => {
    if (newWelderName.trim() === '') return;
    
    try {
      await db.addWelder(newWelderName.trim());
      setNewWelderName('');
      await loadWelders();
    } catch (error) {
      console.error('Ошибка добавления сварщика:', error);
      alert('Ошибка при добавлении сварщика');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') addWelder();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 font-sans">
      {/* Верхняя панель */}
      <div className="fixed top-0 left-0 right-0 bg-gray-800/95 backdrop-blur-lg shadow-md z-50 border-b border-gray-700 px-4 py-3">
        <div className="max-w-6xl mx-auto flex gap-3 items-center">
          <input
            type="text"
            value={newWelderName}
            onInput={(e) => setNewWelderName(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 px-4 py-2 border border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-gray-700 text-white"
            placeholder="Введите фамилию сварщика"
          />
          <button 
            onClick={addWelder}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            Добавить сварщика
          </button>
          <button 
            onClick={() => setShowImportExportModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors whitespace-nowrap"
          >
            Импорт-Экспорт
          </button>
        </div>
      </div>

      {/* Основной контент */}
      <div className="flex-1 pt-20 pb-24 px-4 max-w-6xl mx-auto w-full">
        {welders.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <div className="text-2xl mb-2">📋</div>
            <p className="text-lg font-medium mb-1">Нет добавленных сварщиков</p>
            <p>Добавьте первого сварщика с помощью формы выше</p>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-white">
                Список сварщиков ({welders.length})
              </h2>
            </div>
            <div className="space-y-3">
              {welders.map(welder => (
                <Link key={welder.id} href={`/welder/${welder.id}`} className="block no-underline">
                  <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 shadow-sm hover:shadow-lg hover:border-blue-500 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-semibold text-lg">
                        {welder.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-lg font-semibold text-white">
                        {welder.name}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Нижняя панель */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800/95 backdrop-blur-lg shadow-md z-50 border-t border-gray-700 px-4 py-3">
        <div className="max-w-6xl mx-auto flex justify-around gap-3">
          <Link href="/deepsya/summary" className="flex-1 no-underline">
            <button className="w-full px-4 py-2 bg-transparent text-white rounded-xl font-medium hover:bg-gray-700 transition-colors">
              📊 Сводка
            </button>
          </Link>
          <Link href="/deepsya/norms" className="flex-1 no-underline">
            <button className="w-full px-4 py-2 bg-transparent text-white rounded-xl font-medium hover:bg-gray-700 transition-colors">
              ⚙️ Нормы
            </button>
          </Link>
        </div>
      </div>

      {/* Модальное окно импорта/экспорта */}
      {showImportExportModal && (
        <ImportExportModal onClose={() => setShowImportExportModal(false)} />
      )}
    </div>
  );
}