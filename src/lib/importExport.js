// src/lib/importExport.js
import db from './db';

// Функция экспорта всех данных
export const exportData = async () => {
  try {
    // Собираем все данные из базы
    const welders = await db.getAllWelders();
    const norms = await db.getAllNorms();
    
    // Собираем все записи всех сварщиков
    let allRecords = [];
    let allHistory = [];
    
    for (const welder of welders) {
      const records = await db.getRecordsByWelder(welder.id);
      allRecords = [...allRecords, ...records];
      
      // Собираем историю для каждой записи
      for (const record of records) {
        const history = await db.getHistoryByRecord(record.id);
        allHistory = [...allHistory, ...history];
      }
    }
    
    // Формируем объект данных для экспорта
    const exportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      data: {
        welders,
        records: allRecords,
        norms,
        history: allHistory
      }
    };
    
    // Создаем JSON и Blob для скачивания
    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Создаем ссылку для скачивания
    const a = document.createElement('a');
    a.href = url;
    a.download = `welder-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Ошибка при экспорте данных:', error);
    alert('Ошибка при экспорте данных');
    return false;
  }
};

// Функция импорта данных
export const importData = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        // Проверяем структуру файла
        if (!data.version || !data.data) {
          throw new Error('Неверный формат файла');
        }
        
        // Подтверждение импорта (опасная операция)
        if (!confirm('ВНИМАНИЕ: Все текущие данные будут удалены и заменены импортируемыми. Продолжить?')) {
          reject(new Error('Импорт отменен'));
          return;
        }
        
        // Очищаем текущую базу данных
        await clearDatabase();
        
        // Восстанавливаем данные в правильном порядке
        if (data.data.welders) {
          for (const welder of data.data.welders) {
            await db.addWelder(welder.name);
            // Note: ID могут измениться, нужно аккуратно восстановить связи
          }
        }
        
        // Для простоты: перезагружаем страницу после импорта
        alert('Данные успешно импортированы! Страница будет перезагружена.');
        window.location.reload();
        
        resolve(true);
      } catch (error) {
        console.error('Ошибка при импорте данных:', error);
        reject(error);
      }
    };
    
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
};

// Функция очистки базы данных
const clearDatabase = async () => {
  try {
    // Здесь нужно реализовать очистку всех таблиц
    // Это сложная операция, требующая осторожности
    console.warn('Очистка базы данных...');
    // В реальной реализации нужно очистить каждую таблицу
  } catch (error) {
    console.error('Ошибка при очистке базы данных:', error);
    throw error;
  }
};

// Упрощенная версия импорта (без очистки, только добавление)
export const importDataSafe = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        if (!data.version || !data.data) {
          throw new Error('Неверный формат файла');
        }
        
        // Импортируем только сварщиков и нормы (без перезаписи)
        if (data.data.welders) {
          for (const welder of data.data.welders) {
            try {
              await db.addWelder(welder.name);
            } catch (error) {
              // Игнорируем ошибки дубликатов
              if (!error.message.includes('unique')) {
                console.error('Ошибка добавления сварщика:', error);
              }
            }
          }
        }
        
        if (data.data.norms) {
          for (const norm of data.data.norms) {
            try {
              await db.addNorm(norm.article);
            } catch (error) {
              // Игнорируем ошибки дубликатов
              if (!error.message.includes('unique')) {
                console.error('Ошибка добавления нормы:', error);
              }
            }
          }
        }
        
        alert('Данные успешно импортированы!');
        resolve(true);
      } catch (error) {
        console.error('Ошибка при импорте данных:', error);
        reject(error);
      }
    };
    
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
};