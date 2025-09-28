import { useState, useEffect } from 'preact/hooks';
import { Link } from 'preact-router';
import db from '../lib/db';

export default function Norms() {
  const [norms, setNorms] = useState([]);
  const [newArticle, setNewArticle] = useState('');

  // Загружаем нормы при загрузке компонента
  useEffect(() => {
    loadNorms();
  }, []);

  const loadNorms = async () => {
    try {
      const normsList = await db.getAllNorms();
      console.log('Загружено норм:', normsList);
      setNorms(normsList);
    } catch (error) {
      console.error('Ошибка загрузки норм:', error);
    }
  };

  const addNorm = async () => {
    console.log('Добавление артикула:', newArticle);
    
    if (newArticle.trim() === '') {
      console.log('Пустой артикул');
      return;
    }
    
    // Проверяем, есть ли уже такой артикул
    const existingNorm = norms.find(norm => 
      norm.article.toLowerCase() === newArticle.trim().toLowerCase()
    );
    
    if (existingNorm) {
      alert('Такой артикул уже существует в списке норм');
      return;
    }
    
    try {
      console.log('Сохранение в БД...');
      await db.addNorm(newArticle.trim());
      console.log('Артикул сохранен');
      
      setNewArticle('');
      await loadNorms(); // Перезагружаем список
      console.log('Список обновлен');
      
    } catch (error) {
      console.error('Ошибка добавления нормы:', error);
      alert('Ошибка при добавлении нормы: ' + error.message);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addNorm();
    }
  };

  const deleteNorm = async (id) => {
    if (confirm('Удалить этот артикул из базы?')) {
      try {
        // TODO: Добавить метод deleteNorm в db.js
        console.log('Удаление артикула с id:', id);
        await loadNorms();
      } catch (error) {
        console.error('Ошибка удаления нормы:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      {/* Кнопка на главную */}
      <div className="mb-6">
        <Link href="/">
          <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
            ← На главную
          </button>
        </Link>
      </div>

      {/* Заголовок */}
      <h1 className="text-2xl font-bold text-white mb-6">База артикулов (Нормы)</h1>

      {/* Форма добавления артикула */}
      <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-4 mb-6">
        <div className="flex gap-3 items-center">
          <input
            type="text"
            value={newArticle}
            onInput={(e) => setNewArticle(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 px-4 py-2 border border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-gray-700 text-white"
            placeholder="Введите артикул (например, хт637)"
          />
          <button 
            onClick={addNorm}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            Добавить
          </button>
        </div>
      </div>

      {/* Список артикулов */}
      <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 overflow-hidden">
        <div className="bg-gray-700 px-4 py-3 border-b border-gray-600">
          <h2 className="text-lg font-semibold text-white">
            Список артикулов {norms.length > 0 && `(${norms.length})`}
          </h2>
        </div>
        
        {norms.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <div className="text-3xl mb-2">📋</div>
            <p className="text-lg font-medium mb-1">Нет добавленных артикулов</p>
            <p>Добавьте первый артикул с помощью формы выше</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {norms.map((norm, index) => (
              <div key={norm.id} className="px-4 py-3 hover:bg-gray-750 transition-colors">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-white">{norm.article}</span>
                  <button 
                    onClick={() => deleteNorm(norm.id)}
                    className="px-3 py-1 text-red-400 hover:bg-red-900 hover:text-red-300 rounded-lg transition-colors"
                    title="Удалить артикул"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Подсказка */}
      <div className="mt-4 text-sm text-gray-500 text-center">
        💡 Этот список помогает избегать опечаток при вводе артикулов
      </div>
    </div>
  );
}