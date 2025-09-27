// src/lib/utils.js
// Функция для группировки записей по месяцам
export function groupByMonth(records) {
  const groups = {};
  records.forEach(record => {
    const date = new Date(record.date);
    const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    if (!groups[monthKey]) {
      groups[monthKey] = {
        month: date.toLocaleString('ru', { month: 'long', year: 'numeric' }),
        monthKey: monthKey,
        records: []
      };
    }
    groups[monthKey].records.push(record);
  });

  // Сортируем месяцы по убыванию (новые сверху)
  return Object.keys(groups)
    .sort((a, b) => b.localeCompare(a))
    .map(key => groups[key]);
}

// Функция для агрегации записей по артикулам
export function aggregateRecords(records) {
  const aggregated = {};
  records.forEach(record => {
    if (!aggregated[record.article]) {
      aggregated[record.article] = {
        article: record.article,
        quantity: 0,
        records: [record]
      };
    } else {
      aggregated[record.article].quantity += record.quantity;
      aggregated[record.article].records.push(record);
    }
  });
  return Object.values(aggregated);
}