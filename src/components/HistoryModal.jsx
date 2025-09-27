import { useEffect, useState } from 'preact/hooks';
import db from '../lib/db';

const HistoryModal = ({ record, onClose, onUpdate }) => {
  const [history, setHistory] = useState([]);
  const [editQuantity, setEditQuantity] = useState('');

  useEffect(() => {
    if (record) {
      loadHistory();
      setEditQuantity(record.quantity || '');
    }
  }, [record]);

  const loadHistory = async () => {
    try {
      const historyData = await db.getHistoryByRecord(record.id);
      setHistory(historyData);
    } catch (error) {
      console.error('Ошибка загрузки истории:', error);
    }
  };

  const updateQuantity = async () => {
    if (editQuantity === '' || parseInt(editQuantity) === record.quantity) return;
    
    try {
      const oldQuantity = record.quantity;
      await db.updateRecord(record.id, parseInt(editQuantity));
      await db.addHistoryRecord(record.id, oldQuantity, parseInt(editQuantity));
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Ошибка обновления количества:', error);
    }
  };

  if (!record) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">История изменений</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              ✕
            </button>
          </div>
          <p className="text-gray-300 mt-1">Артикул: {record.article}</p>
        </div>
        
        <div className="p-6 border-b border-gray-700">
          <div className="flex gap-3 items-center">
            <input
              type="number"
              value={editQuantity}
              onInput={(e) => setEditQuantity(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Новое количество"
            />
            <button 
              onClick={updateQuantity}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Обновить
            </button>
          </div>
        </div>

        <div className="max-h-64 overflow-y-auto">
          <div className="p-4 bg-gray-700 border-b border-gray-600">
            <span className="text-sm font-medium text-gray-300">Текущее: {record.quantity} шт.</span>
          </div>
          {history.length === 0 ? (
            <div className="p-4 text-center text-gray-400">
              История изменений отсутствует
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {history.map((item, index) => (
                <div key={index} className="p-4 hover:bg-gray-750 transition-colors">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-300">
                      {new Date(item.date).toLocaleDateString('ru-RU')}
                    </span>
                    <span className="text-sm font-medium text-white">
                      {item.oldQuantity} → {item.newQuantity} шт.
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(item.date).toLocaleTimeString('ru-RU')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 bg-gray-700 border-t border-gray-600">
          <button 
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;