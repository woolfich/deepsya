// src/routes/WelderCard.jsx
import { useState, useEffect, useRef } from 'preact/hooks';
import { Link } from 'preact-router';
import db from '../lib/db';
import { groupByMonth } from '../lib/utils';
import HistoryModal from '../components/HistoryModal';
import eventBus from '../lib/eventBus';

export default function WelderCard({ id }) {
  /* ---------- состояние ---------- */
  const [welder, setWelder]           = useState(null);
  const [article, setArticle]         = useState('');
  const [quantity, setQuantity]       = useState('');
  const [records, setRecords]         = useState([]);
  const [groupedRecords, setGrouped]  = useState([]);
  const [selectedRecord, setSelected] = useState(null);
  const [showHistoryModal, setShow]   = useState(false);

  /* ---------- long-press ---------- */
  const longPressTimer = useRef(null);
  const touchStartPos  = useRef({ x: 0, y: 0 });
  const LONG_PRESS_MS  = 500; // 0.5 с

  const startLong = (e, aggRec) => {
    if (e.type === 'mousedown' && e.button === 2) return; // пропускаем ПКМ
    const point = e.touches ? e.touches[0] : e;
    touchStartPos.current = { x: point.clientX, y: point.clientY };

    longPressTimer.current = setTimeout(() => {
      setSelected(aggRec.records[0]);
      setShow(true);
    }, LONG_PRESS_MS);
  };

  const cancelLong = () => {
    clearTimeout(longPressTimer.current);
    longPressTimer.current = null;
  };

  const onTouchMove = (e) => {
    if (!longPressTimer.current) return;
    const t = e.touches[0];
    const dx = Math.abs(t.clientX - touchStartPos.current.x);
    const dy = Math.abs(t.clientY - touchStartPos.current.y);
    if (dx > 10 || dy > 10) cancelLong(); // свайп – отмена
  };
  /* --------------------------------- */

  /* ---------- жизненный цикл ---------- */
  useEffect(() => {
    loadWelder();
    loadRecords();
  }, [id]);

  /* ---------- данные ---------- */
  const loadWelder = async () => {
    try {
      const data = await db.getWelder(parseInt(id, 10));
      setWelder(data);
    } catch (err) {
      console.error('Ошибка загрузки сварщика:', err);
    }
  };

  const loadRecords = async () => {
    try {
      const data = await db.getRecordsByWelder(parseInt(id, 10));
      const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setRecords(sorted);
      setGrouped(groupByMonth(sorted));
    } catch (err) {
      console.error('Ошибка загрузки записей:', err);
    }
  };

  /* ---------- добавление ---------- */
  const addRecord = async () => {
    if (!article.trim() || !quantity.trim()) return;
    try {
      const qty = Math.round(parseFloat(quantity.replace(',', '.')) * 100) / 100;
      if (Number.isNaN(qty)) return alert('Введите корректное количество');

      const now = new Date();
      const curMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

      const exist = records.find((r) => {
        const d = new Date(r.date);
        const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        return r.article === article.trim() && m === curMonth;
      });

      if (exist) {
        const old = exist.quantity;
        const neu = Math.round((old + qty) * 100) / 100;
        await db.updateRecord(exist.id, neu);
        await db.addHistoryRecord(exist.id, old, neu);
      } else {
        await db.addRecord(parseInt(id, 10), article.trim(), qty);
      }

      setArticle('');
      setQuantity('');
      await loadRecords();
      eventBus.emit('recordsUpdated');
    } catch (err) {
      console.error(err);
      alert('Ошибка при добавлении записи');
    }
  };

  const handleKeyPress = (e) => { if (e.key === 'Enter') addRecord(); };

  const handleArticleClick = (text) => {
    setArticle(text);
    setTimeout(() => document.querySelector('input[type="text"]')?.focus(), 100);
  };

  /* ---------- агрегация ---------- */
  const aggregateRecordsInMonth = (monthRecs) => {
    const map = {};
    monthRecs.forEach((r) => {
      if (!map[r.article]) {
        map[r.article] = { article: r.article, quantity: r.quantity, records: [r], latestDate: new Date(r.date) };
      } else {
        map[r.article].quantity = Math.round((map[r.article].quantity + r.quantity) * 100) / 100;
        map[r.article].records.push(r);
        const d = new Date(r.date);
        if (d > map[r.article].latestDate) map[r.article].latestDate = d;
      }
    });
    return Object.values(map).sort((a, b) => b.latestDate - a.latestDate);
  };

  /* ---------- рендер ---------- */
  if (!welder) {
    return (
      <div className="min-h-screen bg-gray-900 p-4">
        <Link href="/deepsya/" className="inline-block mb-4">
          <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">← На главную</button>
        </Link>
        <div className="text-white">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      {/* шапка */}
      <div className="mb-6">
        <Link href="/deepsya/" className="inline-block mb-4">
          <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">← На главную</button>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-semibold text-xl">
            {welder.name.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-2xl font-bold text-white">{welder.name}</h1>
        </div>
      </div>

      {/* форма добавления */}
      <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-4 mb-6">
        <div className="flex gap-3 items-center flex-wrap">
          <input
            type="text"
            value={article}
            onInput={(e) => setArticle(e.target.value)}
            placeholder="Артикул (например, хт637)"
            className="flex-1 min-w-[200px] px-4 py-2 border border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-gray-700 text-white"
          />
          <input
            type="text"
            value={quantity}
            onInput={(e) => setQuantity(e.target.value.replace(',', '.'))}
            onKeyPress={handleKeyPress}
            placeholder="Кол-во"
            className="w-32 px-4 py-2 border border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-gray-700 text-white"
          />
          <button
            onClick={addRecord}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            Добавить запись
          </button>
        </div>
      </div>

      {/* список записей */}
      {groupedRecords.length === 0 ? (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 text-center text-gray-400">
          <div className="text-3xl mb-3">📋</div>
          <p className="text-lg font-medium mb-2">Записи появятся здесь</p>
          <p>Добавьте первую запись с помощью формы выше</p>
        </div>
      ) : (
        <div className="space-y-6">
          {groupedRecords.map((monthGrp, idx) => {
            const agg = aggregateRecordsInMonth(monthGrp.records);
            return (
              <div key={idx} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <div className="bg-gray-700 px-4 py-3 border-b border-gray-600">
                  <h3 className="text-lg font-semibold text-white">{monthGrp.month}</h3>
                </div>
                <div className="divide-y divide-gray-700">
                  {agg.map((rec, j) => (
                    <div
                      key={j}
                      className="px-4 py-3 hover:bg-gray-750 transition-colors cursor-pointer select-none"
                      onClick={() => handleArticleClick(rec.article)}

                      /* правый клик (десктоп) */
                      onContextMenu={(e) => {
                        e.preventDefault();
                        setSelected(rec.records[0]);
                        setShow(true);
                      }}

                      /* long-press (тач) */
                      onTouchStart={(e) => startLong(e, rec)}
                      onTouchEnd={cancelLong}
                      onTouchMove={onTouchMove}
                      onTouchCancel={cancelLong}

                      /* long-press мышь (опционально) */
                      onMouseDown={(e) => startLong(e, rec)}
                      onMouseUp={cancelLong}
                      onMouseLeave={cancelLong}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-lg font-medium text-white block">{rec.article}</span>
                          <span className="text-sm text-gray-400">{rec.records.length} записей</span>
                        </div>
                        <span className="text-xl font-bold text-blue-400">{rec.quantity.toFixed(2)} шт.</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* модальное окно истории */}
      {showHistoryModal && (
        <HistoryModal
          record={selectedRecord}
          onClose={() => { setShow(false); setSelected(null); }}
          onUpdate={() => { loadRecords(); eventBus.emit('recordsUpdated'); }}
        />
      )}
    </div>
  );
}