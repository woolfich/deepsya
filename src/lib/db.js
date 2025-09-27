import { openDB } from 'idb';

const DB_NAME = 'WelderTracker';
const DB_VERSION = 1;

class Database {
  constructor() {
    this.db = null;
  }

  async init() {
    this.db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, newVersion, transaction) {
        if (!db.objectStoreNames.contains('welders')) {
          const weldersStore = db.createObjectStore('welders', { keyPath: 'id', autoIncrement: true });
          weldersStore.createIndex('name', 'name', { unique: true });
        }

        if (!db.objectStoreNames.contains('records')) {
          const recordsStore = db.createObjectStore('records', { keyPath: 'id', autoIncrement: true });
          recordsStore.createIndex('welderId', 'welderId', { unique: false });
          recordsStore.createIndex('article', 'article', { unique: false });
          recordsStore.createIndex('date', 'date', { unique: false });
        }

        if (!db.objectStoreNames.contains('norms')) {
          const normsStore = db.createObjectStore('norms', { keyPath: 'id', autoIncrement: true });
          normsStore.createIndex('article', 'article', { unique: true });
        }

        if (!db.objectStoreNames.contains('history')) {
          const historyStore = db.createObjectStore('history', { keyPath: 'id', autoIncrement: true });
          historyStore.createIndex('recordId', 'recordId', { unique: false });
          historyStore.createIndex('date', 'date', { unique: false });
        }
      },
    });
  }

  async addWelder(name) {
    if (!this.db) await this.init();
    return this.db.add('welders', { name, createdAt: new Date() });
  }

  async getAllWelders() {
    if (!this.db) await this.init();
    return this.db.getAll('welders');
  }

  async getWelder(id) {
    if (!this.db) await this.init();
    return this.db.get('welders', id);
  }

  async addRecord(welderId, article, quantity) {
    if (!this.db) await this.init();
    const date = new Date();
    return this.db.add('records', { welderId, article, quantity, date });
  }

  async getRecordsByWelder(welderId) {
    if (!this.db) await this.init();
    return this.db.getAllFromIndex('records', 'welderId', welderId);
  }

  async updateRecord(id, quantity) {
    if (!this.db) await this.init();
    const record = await this.db.get('records', id);
    record.quantity = quantity;
    record.date = new Date();
    return this.db.put('records', record);
  }

  async addNorm(article) {
    if (!this.db) await this.init();
    return this.db.add('norms', { article });
  }

  async getAllNorms() {
    if (!this.db) await this.init();
    return this.db.getAll('norms');
  }

  async getNormByArticle(article) {
    if (!this.db) await this.init();
    return this.db.getFromIndex('norms', 'article', article);
  }

  async addHistoryRecord(recordId, oldQuantity, newQuantity) {
    if (!this.db) await this.init();
    return this.db.add('history', { recordId, oldQuantity, newQuantity, date: new Date() });
  }

  async getHistoryByRecord(recordId) {
    if (!this.db) await this.init();
    return this.db.getAllFromIndex('history', 'recordId', recordId);
  }

  // В src/lib/db.js добавляем методы:

// Метод для получения всех записей (для экспорта)
async getAllRecords() {
  if (!this.db) await this.init();
  return this.db.getAll('records');
}

// Метод для получения всей истории (для экспорта)
async getAllHistory() {
  if (!this.db) await this.init();
  return this.db.getAll('history');
}

// Методы очистки таблиц (для импорта)
async clearWelders() {
  if (!this.db) await this.init();
  return this.db.clear('welders');
}

async clearRecords() {
  if (!this.db) await this.init();
  return this.db.clear('records');
}

async clearNorms() {
  if (!this.db) await this.init();
  return this.db.clear('norms');
}

async clearHistory() {
  if (!this.db) await this.init();
  return this.db.clear('history');
}
}

export default new Database();