/**
 * Tests for the Storage object logic as defined in index.html.
 *
 * The original implementation (inline in index.html):
 *   const STORAGE_KEY = "DATATABLE_INVENTORY_DATA";
 *   const Storage = {
 *     save: (data) => localStorage.setItem(STORAGE_KEY, JSON.stringify(data)),
 *     load: () => { const saved = localStorage.getItem(STORAGE_KEY); return saved ? JSON.parse(saved) : []; },
 *     clear: () => localStorage.removeItem(STORAGE_KEY)
 *   };
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Storage, STORAGE_KEY } from '../src/utils.js';

// ── minimal in-memory localStorage mock (avoids Node.js 22+ built-in conflict) ──
const localStorageMock = (() => {
    let store = {};
    return {
        getItem:    (key) => Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null,
        setItem:    (key, value) => { store[key] = String(value); },
        removeItem: (key) => { delete store[key]; },
        clear:      () => { store = {}; },
    };
})();
vi.stubGlobal('localStorage', localStorageMock);

beforeEach(() => {
    localStorage.clear();
});

describe('Storage.load', () => {
    it('returns an empty array when localStorage is empty', () => {
        expect(Storage.load()).toEqual([]);
    });

    it('returns the parsed data previously saved', () => {
        const data = [['T-Shirt', '10', 'Shirt', 'RM 29.00', 'RM 290.00', '', '']];
        Storage.save(data);
        expect(Storage.load()).toEqual(data);
    });

    it('correctly round-trips multiple rows', () => {
        const data = [
            ['Hoodie', '5', 'Outerwear', 'RM 60.50', 'RM 302.50', '', ''],
            ['Slacks', '3', 'Pants',     'RM 89.00', 'RM 267.00', '', ''],
        ];
        Storage.save(data);
        expect(Storage.load()).toEqual(data);
    });
});

describe('Storage.save', () => {
    it('persists data as a JSON string in localStorage', () => {
        const data = [['Jeans', '12', 'Pants', 'RM 129.00', 'RM 1548.00', '', '']];
        Storage.save(data);
        const raw = localStorage.getItem(STORAGE_KEY);
        expect(raw).toBe(JSON.stringify(data));
    });

    it('overwrites previously saved data', () => {
        Storage.save([['OldItem', '1', 'Type', 'RM 1.00', 'RM 1.00', '', '']]);
        const newData = [['NewItem', '2', 'Type', 'RM 2.00', 'RM 4.00', '', '']];
        Storage.save(newData);
        expect(Storage.load()).toEqual(newData);
    });

    it('can save an empty array', () => {
        Storage.save([]);
        expect(Storage.load()).toEqual([]);
    });
});

describe('Storage.clear', () => {
    it('removes the key from localStorage', () => {
        Storage.save([['Item', '1', 'Type', 'RM 10.00', 'RM 10.00', '', '']]);
        Storage.clear();
        expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it('causes Storage.load to return [] after clearing', () => {
        Storage.save([['Item', '1', 'Type', 'RM 10.00', 'RM 10.00', '', '']]);
        Storage.clear();
        expect(Storage.load()).toEqual([]);
    });

    it('does not throw when called on an already-empty store', () => {
        expect(() => Storage.clear()).not.toThrow();
    });
});
