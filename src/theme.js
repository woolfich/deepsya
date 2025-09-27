// src/theme.js

// Цветовая палитра (современная и контрастная)
export const COLORS = {
  // Основные цвета
  primary: '#2563eb',     // Сочный синий (для основных кнопок и акцентов)
  primaryDark: '#1d4ed8',
  secondary: '#059669',   // Глубокий зеленый (для подтверждающих действий)
  
  // Фоны и поверхности
  background: '#f8fafc',  // Очень светлый серо-голубой фон
  surface: '#ffffff',     // Белый для карточек и панелей
  surfaceElevated: 'rgba(255, 255, 255, 0.9)', // Для фиксированных панелей
  
  // Текст
  textPrimary: '#0f172a',   // Почти черный для основного текста
  textSecondary: '#475569', // Серый для второстепенного текста
  textInverted: '#ffffff',  // Белый текст на цветном фоне
  
  // Системные цвета
  border: '#e2e8f0',
  error: '#dc2626',
  success: '#16a34a',
};

// Типографика
export const TYPOGRAPHY = {
  // Семейства шрифтов (используем стандартные, хорошо читаемые на iOS/Android)
  family: {
    base: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', // Основной текст
    heading: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif', // Для заголовков
  },
  
  // Размеры (по принципу модульной шкалы)
  sizes: {
    xs: 12,    // Мелкий вспомогательный текст
    sm: 14,    // Описания, подписи
    base: 16,  // Основной текст (базовый размер)
    lg: 18,    // Подзаголовки, крупные кнопки
    xl: 20,    // Заголовки разделов
    '2xl': 24, // Главные заголовки
  },
  
  // Высота строк (ключевой параметр для читаемости!)
  lineHeights: {
    tight: 1.25,   // Для заголовков
    normal: 1.5,   // Для основного текста
    relaxed: 1.75, // Для длинных абзацев
  },
  
  // Межбуквенные интервалы
  letterSpacing: {
    tight: '-0.005em',
    normal: '0em',
    wide: '0.025em',
  },
};

// Отступы и размеры
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
};

// Тени (для создания глубины)
export const SHADOWS = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
};