// src/components/ImportExportModal.jsx
import { useRef } from 'preact/hooks';
import { exportData, importDataSafe } from '../lib/importExport';

const ImportExportModal = ({ onClose }) => {
  const fileInputRef = useRef(null);

  const handleExport = async () => {
    const success = await exportData();
    if (success) {
      onClose();
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await importDataSafe(file);
      onClose();
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      alert(`Ошибка импорта: ${error.message}`);
    }
    
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl max-w-md w-full border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">Импорт/Экспорт данных</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              ✕
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <h4 className="font-medium text-white mb-2">Экспорт данных</h4>
            <p className="text-sm text-gray-300 mb-3">
              Скачайте резервную копию всех данных в JSON-файл
            </p>
            <button 
              onClick={handleExport}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              📥 Экспорт данных
            </button>
          </div>
          
          <div className="border-t border-gray-700 pt-4">
            <h4 className="font-medium text-white mb-2">Импорт данных</h4>
            <p className="text-sm text-gray-300 mb-3">
              Загрузите JSON-файл с данными для восстановления
            </p>
            <button 
              onClick={handleImportClick}
              className="w-full px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              📤 Импорт данных
            </button>
            
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>
        
        <div className="p-4 bg-gray-700 border-t border-gray-600">
          <p className="text-xs text-gray-400">
            💡 Рекомендуется регулярно создавать резервные копии данных
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImportExportModal;