import { MailspringAPIRequest, Utils } from 'mailspring-exports';

const CACHE_SIZE = 200;
const CACHE_INDEX_KEY = 'pp-cache-v3-keys';
const CACHE_KEY_PREFIX = 'pp-cache-v3-';

class ParticipantProfileDataSource {
  _cacheIndex: string[];

  constructor() {
    try {
      this._cacheIndex = JSON.parse(window.localStorage.getItem(CACHE_INDEX_KEY) || `[]`);
    } catch (err) {
      this._cacheIndex = [];
    }
  }

  async find(contact) {
    return {};
  }

  // LocalStorage Retrieval / Saving

  hasCache(email) {
    return localStorage.getItem(`${CACHE_KEY_PREFIX}${email}`) !== null;
  }

  getCache(email) {
    const raw = localStorage.getItem(`${CACHE_KEY_PREFIX}${email}`);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw);
    } catch (err) {
      return null;
    }
  }

  setCache(email, value) {
    localStorage.setItem(`${CACHE_KEY_PREFIX}${email}`, JSON.stringify(value));
    const updatedIndex = this._cacheIndex.filter(e => e !== email);
    updatedIndex.push(email);

    if (updatedIndex.length > CACHE_SIZE) {
      const oldestKey = updatedIndex.shift();
      localStorage.removeItem(`${CACHE_KEY_PREFIX}${oldestKey}`);
    }

    localStorage.setItem(CACHE_INDEX_KEY, JSON.stringify(updatedIndex));
    this._cacheIndex = updatedIndex;
  }
}

export default new ParticipantProfileDataSource();
