import { useState, useEffect } from 'preact/hooks';
import { Link } from 'preact-router';
import db from '../lib/db';
import { groupByMonth } from '../lib/utils';
import eventBus from '../lib/eventBus';

export default function Summary() {
  const [groupedRecords, setGroupedRecords] = useState([]);

  useEffect(() => {
    loadSummaryData();
    
    eventBus.on('recordsUpdated', loadSummaryData);
    
    return () => {
      eventBus.off('recordsUpdated', loadSummaryData);
    };
  }, []);

  const loadSummaryData = async () => {
    try {
      const welders = await db.getAllWelders();
      let allRecords = [];

      for (const welder of welders) {
        const welderRecords = await db.getRecordsByWelder(welder.id);
        const recordsWithWelderName = welderRecords.map(record => ({
          ...record,
          welderName: welder.name
        }));
        allRecords = [...allRecords, ...recordsWithWelderName];
      }

      const sortedRecords = allRecords.sort((a, b) => new Date(b.date) - new Date(a.date));
      const grouped = groupByMonth(sortedRecords);
      
      const summaryData = grouped.map(monthGroup => {
        const articlesMap = {};
        
        monthGroup.records.forEach(record => {
          if (!articlesMap[record.article]) {
            articlesMap[record.article] = {
              article: record.article,
              totalQuantity: 0,
              welderDetails: {}
            };
          }
          
          articlesMap[record.article].totalQuantity = Math.round((articlesMap[record.article].totalQuantity + record.quantity) * 100) / 100;
          
          if (!articlesMap[record.article].welderDetails[record.welderName]) {
            articlesMap[record.article].welderDetails[record.welderName] = 0;
          }
          articlesMap[record.article].welderDetails[record.welderName] = Math.round((articlesMap[record.article].welderDetails[record.welderName] + record.quantity) * 100) / 100;
        });

        const articlesArray = Object.values(articlesMap);

        return {
          ...monthGroup,
          articles: articlesArray
        };
      });

      setGroupedRecords(summaryData);
    } catch (error) {
      console.error('Ошибка загрузки данных для сводки:', error);
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
      <h1 className="text-2xl font-bold text-white mb-6">Сводка по всем сварщикам</h1>

      {groupedRecords.length === 0 ? (
        <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-8 text-center text-gray-400">
          <div className="text-3xl mb-3">📊</div>
          <p className="text-lg font-medium mb-2">Нет данных для сводки</p>
          <p>Добавьте записи в карточках сварщиков</p>
        </div>
      ) : (
        <div className="space-y-6">
          {groupedRecords.map((monthGroup, index) => (
            <div key={index} className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 overflow-hidden">
              <div className="bg-gray-700 px-4 py-3 border-b border-gray-600">
                <h3 className="text-lg font-semibold text-white">{monthGroup.month}</h3>
              </div>
              
              <div className="divide-y divide-gray-700">
                {monthGroup.articles.map((article, articleIndex) => (
                  <div key={articleIndex} className="px-4 py-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-medium text-white">{article.article}</span>
                      <span className="text-xl font-bold text-blue-400">{article.totalQuantity.toFixed(2)} шт.</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(article.welderDetails).map(([welderName, quantity]) => (
                        <span 
                          key={welderName}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-900 text-blue-300"
                        >
                          {welderName}: {quantity.toFixed(2)} шт.
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}