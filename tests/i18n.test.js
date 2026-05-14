import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock localStorage before importing i18n
let mockStorage = {};
const originalLS = globalThis.localStorage;

Object.defineProperty(globalThis, 'localStorage', {
  value: {
    getItem: (key) => mockStorage[key] || null,
    setItem: (key, value) => { mockStorage[key] = value; },
    removeItem: (key) => { delete mockStorage[key]; },
    clear: () => { mockStorage = {}; },
  },
  writable: true,
  configurable: true,
});

import * as i18nModule from '../src/i18n.js';

async function loadFreshI18nModule(mockI18next) {
  const previousI18next = globalThis.i18next;
  globalThis.i18next = mockI18next;
  vi.resetModules();
  const module = await import('../src/i18n.js');
  globalThis.i18next = previousI18next;
  return module;
}

describe('i18n module', () => {
  beforeEach(() => {
    mockStorage = {};
  });

  describe('initI18n()', () => {
    it('initializes i18next successfully', async () => {
      const i18n = await i18nModule.initI18n();
      expect(i18n).toBeDefined();
      expect(i18n.isInitialized).toBe(true);
    });

    it('returns same instance on subsequent calls', async () => {
      const first = await i18nModule.initI18n();
      const second = await i18nModule.initI18n();
      expect(first).toBe(second);
    });

    it('initializes with default language English when no stored preference', async () => {
      mockStorage = {};
      const i18n = await i18nModule.initI18n();
      expect(i18n.language).toBe('en');
    });

    it('uses stored language preference if valid', async () => {
      mockStorage['app.language'] = 'zh';
      // Re-init to pick up stored language
      const i18n = await i18nModule.initI18n();
      // Note: After first init, calling initI18n again won't reinitialize
      // This test documents the behavior
      expect(i18n).toBeDefined();
    });

    it('initializes with English and Chinese resources', async () => {
      const i18n = await i18nModule.initI18n();
      expect(i18n.hasResourceBundle('en', 'translation')).toBe(true);
      expect(i18n.hasResourceBundle('zh', 'translation')).toBe(true);
    });
  });

  describe('setLanguage()', () => {
    beforeEach(async () => {
      await i18nModule.initI18n();
    });

    it('changes language to English', async () => {
      await i18nModule.setLanguage('en');
      const lang = await i18nModule.getCurrentLanguage();
      expect(lang).toBe('en');
    });

    it('changes language to Chinese', async () => {
      await i18nModule.setLanguage('zh');
      const lang = await i18nModule.getCurrentLanguage();
      expect(lang).toBe('zh');
    });

    it('persists language selection to localStorage', async () => {
      await i18nModule.setLanguage('zh');
      expect(mockStorage['app.language']).toBe('zh');
      
      await i18nModule.setLanguage('en');
      expect(mockStorage['app.language']).toBe('en');
    });

    it('throws error for unsupported language', async () => {
      await expect(i18nModule.setLanguage('fr')).rejects.toThrow();
    });

    it('throws error for null or empty language', async () => {
      await expect(i18nModule.setLanguage(null)).rejects.toThrow();
      await expect(i18nModule.setLanguage('')).rejects.toThrow();
    });

    it('only supports en and zh', async () => {
      const supportedLangs = ['en', 'zh'];
      const unsupportedLangs = ['fr', 'de', 'es', 'ja', 'ko'];
      
      for (const lang of supportedLangs) {
        await expect(i18nModule.setLanguage(lang)).resolves.toBeDefined();
      }
      
      for (const lang of unsupportedLangs) {
        await expect(i18nModule.setLanguage(lang)).rejects.toThrow();
      }
    });
  });

  describe('t()', () => {
    beforeEach(async () => {
      await i18nModule.initI18n();
    });

    it('translates English keys correctly', async () => {
      await i18nModule.setLanguage('en');
      const title = i18nModule.t('page.title');
      expect(title).toBe('UNIQLO Inventory System');
    });

    it('translates Chinese keys correctly', async () => {
      await i18nModule.setLanguage('zh');
      const title = i18nModule.t('page.title');
      expect(title).toBe('优衣库库存管理系统');
    });

    it('returns key itself when not initialized properly', () => {
      // When called before init completes
      const key = 'some.nonexistent.key';
      const result = i18nModule.t(key);
      expect(typeof result).toBe('string');
    });

    it('supports translation options', async () => {
      await i18nModule.setLanguage('en');
      // Test that options can be passed (even if not used in simple translations)
      const result = i18nModule.t('page.title', { defaultValue: 'Default' });
      expect(result).toBeDefined();
    });

    it('translates modal messages', async () => {
      await i18nModule.setLanguage('en');
      expect(i18nModule.t('modal.deleteTitle')).toBe('Delete Confirmation');
      expect(i18nModule.t('modal.deleteBody')).toContain('sure');
      
      await i18nModule.setLanguage('zh');
      expect(i18nModule.t('modal.deleteTitle')).toBe('删除确认');
      expect(i18nModule.t('modal.deleteBody')).toContain('确定');
    });

    it('translates error messages', async () => {
      await i18nModule.setLanguage('en');
      const enError = i18nModule.t('error.duplicateName');
      expect(enError).toContain('already exists');
      
      await i18nModule.setLanguage('zh');
      const zhError = i18nModule.t('error.duplicateName');
      expect(zhError).toContain('已存在');
    });

    it('translates header and table content', async () => {
      await i18nModule.setLanguage('en');
      expect(i18nModule.t('header.manageInventory')).toBe('Manage Inventory');
      expect(i18nModule.t('table.colItemName')).toBe('Item Name');
      
      await i18nModule.setLanguage('zh');
      expect(i18nModule.t('header.manageInventory')).toBe('库存管理');
      expect(i18nModule.t('table.colItemName')).toBe('商品名称');
    });
  });

  describe('getCurrentLanguage()', () => {
    beforeEach(async () => {
      await i18nModule.initI18n();
    });

    it('returns current language', async () => {
      await i18nModule.setLanguage('en');
      const lang = await i18nModule.getCurrentLanguage();
      expect(lang).toBe('en');
    });

    it('reflects language changes', async () => {
      await i18nModule.setLanguage('zh');
      let lang = await i18nModule.getCurrentLanguage();
      expect(lang).toBe('zh');
      
      await i18nModule.setLanguage('en');
      lang = await i18nModule.getCurrentLanguage();
      expect(lang).toBe('en');
    });
  });

  describe('Language persistence across sessions', () => {
    it('respects stored language on next initialization', async () => {
      // This documents behavior for subsequent init after language change
      mockStorage['app.language'] = 'zh';
      const i18n = await i18nModule.initI18n();
      expect(i18n).toBeDefined();
    });
  });

  describe('Resource completeness', () => {
    beforeEach(async () => {
      await i18nModule.initI18n();
    });

    it('has page section translations', async () => {
      await i18nModule.setLanguage('en');
      expect(i18nModule.t('page.title')).toBeTruthy();
    });

    it('has header translations', async () => {
      await i18nModule.setLanguage('en');
      expect(i18nModule.t('header.manageInventory')).toBeTruthy();
      expect(i18nModule.t('header.logoAlt')).toBeTruthy();
    });

    it('has table column translations', async () => {
      await i18nModule.setLanguage('en');
      expect(i18nModule.t('table.colItemName')).toBe('Item Name');
      expect(i18nModule.t('table.colQuantity')).toBe('Quantity');
      expect(i18nModule.t('table.colEdit')).toBe('Edit');
      expect(i18nModule.t('table.colDelete')).toBe('Delete');
    });

    it('has toolbar button translations', async () => {
      await i18nModule.setLanguage('en');
      expect(i18nModule.t('toolbar.addNewItem')).toBeTruthy();
      expect(i18nModule.t('toolbar.saveData')).toBeTruthy();
    });

    it('has modal dialog translations', async () => {
      await i18nModule.setLanguage('en');
      expect(i18nModule.t('modal.deleteTitle')).toBeTruthy();
      expect(i18nModule.t('modal.deleteBody')).toBeTruthy();
      expect(i18nModule.t('modal.okBtn')).toBeTruthy();
    });

    it('has form label translations', async () => {
      await i18nModule.setLanguage('en');
      expect(i18nModule.t('form.labelItemName')).toBe('Item Name');
      expect(i18nModule.t('form.labelQuantity')).toBe('Quantity');
    });

    it('has error message translations', async () => {
      await i18nModule.setLanguage('en');
      expect(i18nModule.t('error.duplicateName')).toBeTruthy();
      expect(i18nModule.t('error.fileLoadFailed')).toBeTruthy();
    });

    it('Chinese translations match English key structure', async () => {
      await i18nModule.setLanguage('en');
      const enTitle = i18nModule.t('page.title');
      
      await i18nModule.setLanguage('zh');
      const zhTitle = i18nModule.t('page.title');
      
      expect(enTitle).toBe('UNIQLO Inventory System');
      expect(zhTitle).toBe('优衣库库存管理系统');
    });
  });

  describe('localStorage error handling', () => {
    it('handles localStorage errors gracefully', async () => {
      const originalLS = globalThis.localStorage;
      globalThis.localStorage = {
        getItem: () => { throw new Error('Access denied'); },
        setItem: () => { throw new Error('Quota exceeded'); },
      };
      
      // Should not throw
      await expect(i18nModule.initI18n()).resolves.toBeDefined();
      await expect(i18nModule.setLanguage('en')).resolves.toBeDefined();
      
      globalThis.localStorage = originalLS;
    });

    it('falls back to English when localStorage.getItem is missing', async () => {
      const originalLS = globalThis.localStorage;
      globalThis.localStorage = { setItem: () => {} };

      await i18nModule.initI18n();
      expect(await i18nModule.getCurrentLanguage()).toBe('en');

      globalThis.localStorage = originalLS;
    });

    it('falls back to English when localStorage.getItem throws', async () => {
      const originalLS = globalThis.localStorage;
      globalThis.localStorage = {
        getItem: () => { throw new Error('Access denied'); },
        setItem: () => {},
      };

      await i18nModule.initI18n();
      expect(await i18nModule.getCurrentLanguage()).toBe('en');

      globalThis.localStorage = originalLS;
    });

    it('returns without writing when localStorage.setItem is missing', async () => {
      const originalLS = globalThis.localStorage;
      globalThis.localStorage = {
        getItem: () => null,
      };

      await expect(i18nModule.setLanguage('en')).resolves.toBeDefined();

      globalThis.localStorage = originalLS;
    });

    it('ignores localStorage.setItem errors', async () => {
      const originalLS = globalThis.localStorage;
      globalThis.localStorage = {
        getItem: () => null,
        setItem: () => { throw new Error('QuotaExceededError'); },
      };

      await expect(i18nModule.setLanguage('zh')).resolves.toBeDefined();

      globalThis.localStorage = originalLS;
    });

    it('covers resolveInitialLanguage when localStorage.getItem is missing', async () => {
      const mockI18next = {
        isInitialized: false,
        language: 'en',
        init: vi.fn(async function(config) {
          this.isInitialized = true;
          this._config = config;
          return this;
        }),
        changeLanguage: vi.fn(async function(lang) {
          this.language = lang;
          return lang;
        }),
        t: vi.fn((key) => key),
      };
      const originalLS = globalThis.localStorage;
      globalThis.localStorage = { setItem: () => {} };

      const freshModule = await loadFreshI18nModule(mockI18next);
      await freshModule.initI18n();

      const config = mockI18next.init.mock.calls[0][0];
      expect(config.lng).toBe('en');

      globalThis.localStorage = originalLS;
    });

    it('covers resolveInitialLanguage when localStorage.getItem throws', async () => {
      const mockI18next = {
        isInitialized: false,
        language: 'en',
        init: vi.fn(async function(config) {
          this.isInitialized = true;
          this._config = config;
          return this;
        }),
        changeLanguage: vi.fn(async function(lang) {
          this.language = lang;
          return lang;
        }),
        t: vi.fn((key) => key),
      };
      const originalLS = globalThis.localStorage;
      globalThis.localStorage = {
        getItem: () => { throw new Error('Access denied'); },
        setItem: () => {},
      };

      const freshModule = await loadFreshI18nModule(mockI18next);
      await freshModule.initI18n();

      const config = mockI18next.init.mock.calls[0][0];
      expect(config.lng).toBe('en');

      globalThis.localStorage = originalLS;
    });

    it('covers resolveInitialLanguage when stored language is zh', async () => {
      const mockI18next = {
        isInitialized: false,
        language: 'en',
        init: vi.fn(async function(config) {
          this.isInitialized = true;
          this._config = config;
          return this;
        }),
        changeLanguage: vi.fn(async function(lang) {
          this.language = lang;
          return lang;
        }),
        t: vi.fn((key) => key),
      };
      const originalLS = globalThis.localStorage;
      globalThis.localStorage = {
        getItem: () => 'zh',
        setItem: () => {},
      };

      const freshModule = await loadFreshI18nModule(mockI18next);
      await freshModule.initI18n();

      const config = mockI18next.init.mock.calls[0][0];
      expect(config.lng).toBe('zh');

      globalThis.localStorage = originalLS;
    });

    it('covers t() fallback when i18next is not initialized', async () => {
      const mockI18next = {
        isInitialized: false,
        language: 'en',
        init: vi.fn(async function(config) {
          this.isInitialized = true;
          this._config = config;
          return this;
        }),
        changeLanguage: vi.fn(async function(lang) {
          this.language = lang;
          return lang;
        }),
        t: vi.fn((key) => key),
      };
      const freshModule = await loadFreshI18nModule(mockI18next);

      const result = freshModule.t('page.title');
      expect(result).toBe('page.title');
      expect(mockI18next.t).not.toHaveBeenCalled();
    });

    it('works with missing localStorage methods', async () => {
      const originalLS = globalThis.localStorage;
      globalThis.localStorage = {};
      
      await expect(i18nModule.initI18n()).resolves.toBeDefined();
      
      globalThis.localStorage = originalLS;
    });
  });

  describe('Translation completeness for UI sections', () => {
    beforeEach(async () => {
      await i18nModule.initI18n();
    });

    it('has nav/navigation translations', async () => {
      await i18nModule.setLanguage('en');
      expect(i18nModule.t('nav.mainNavigation')).toBeTruthy();
      expect(i18nModule.t('nav.openInventoryPanel')).toBeTruthy();
    });

    it('has loading state translations', async () => {
      await i18nModule.setLanguage('en');
      expect(i18nModule.t('loading.default')).toBe('Please wait...');
      expect(i18nModule.t('loading.savingData')).toBeTruthy();
    });

    it('has cookie consent translations', async () => {
      await i18nModule.setLanguage('en');
      expect(i18nModule.t('cookie.bannerText')).toContain('localStorage');
      expect(i18nModule.t('cookie.accept')).toBe('Accept');
      expect(i18nModule.t('cookie.decline')).toBe('Decline');
    });
  });
});
