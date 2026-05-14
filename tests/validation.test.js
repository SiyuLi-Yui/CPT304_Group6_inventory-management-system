/**
 * Tests for the duplicate item-name validation logic from index.html.
 *
 * Original code (add form submit handler):
 *   const newName = $('#add_itemname').val().trim().toLowerCase();
 *   const exists = datatable.data().toArray().some(row =>
 *       row[0].trim().toLowerCase() === newName
 *   );
 *   if (exists) { alert('Error: Item name already exists! ...'); return; }
 *
 * Original code (edit form submit handler):
 *   const editedName = $('#edit_itemname').val().trim().toLowerCase();
 *   const originalName = currentRowData[0].trim().toLowerCase();
 *   if (editedName !== originalName) {
 *       const exists = datatable.data().toArray().some(row =>
 *           row[0].trim().toLowerCase() === editedName
 *       );
 *       if (exists) { alert('Error: Item name already exists! ...'); return; }
 *   }
 */

import { describe, it, expect } from 'vitest';
import { isDuplicateName, nameChanged } from '../src/utils.js';

const SAMPLE_ROWS = [
    ['Blazer (Female)', '20', 'Outerwear', 'RM 129.00', 'RM 2580.00', '', ''],
    ['Bomber Jacket',   '70', 'Outerwear', 'RM 269.00', 'RM 18830.00', '', ''],
    ['Denim Jeans',     '31', 'Pants',     'RM 129.00', 'RM 3999.00', '', ''],
    ['Polo Shirt',      '27', 'Shirt',     'RM 50.00',  'RM 1350.00', '', ''],
];

describe('isDuplicateName – add-item path', () => {
    it('detects an exact-match duplicate', () => {
        expect(isDuplicateName(SAMPLE_ROWS, 'Polo Shirt')).toBe(true);
    });

    it('detects a case-insensitive duplicate', () => {
        expect(isDuplicateName(SAMPLE_ROWS, 'polo shirt')).toBe(true);
        expect(isDuplicateName(SAMPLE_ROWS, 'POLO SHIRT')).toBe(true);
        expect(isDuplicateName(SAMPLE_ROWS, 'PoLo ShIrT')).toBe(true);
    });

    it('detects a duplicate after trimming surrounding whitespace', () => {
        expect(isDuplicateName(SAMPLE_ROWS, '  Polo Shirt  ')).toBe(true);
    });

    it('returns false for a brand-new, unique name', () => {
        expect(isDuplicateName(SAMPLE_ROWS, 'Hoodie')).toBe(false);
    });

    it('returns false when the inventory is empty', () => {
        expect(isDuplicateName([], 'Polo Shirt')).toBe(false);
    });

    it('is case-insensitive for mixed-case stored names', () => {
        expect(isDuplicateName(SAMPLE_ROWS, 'blazer (female)')).toBe(true);
    });
});

describe('isDuplicateName – edit-item path (collision with another row)', () => {
    it('correctly identifies a collision with a different existing row', () => {
        // User is editing "Polo Shirt" but types "Bomber Jacket" (already exists)
        expect(isDuplicateName(SAMPLE_ROWS, 'Bomber Jacket')).toBe(true);
    });

    it('returns false when the new name does not collide with any row', () => {
        expect(isDuplicateName(SAMPLE_ROWS, 'V-Neck Tee')).toBe(false);
    });
});

describe('nameChanged', () => {
    it('returns false when the name is unchanged (same case)', () => {
        expect(nameChanged('Polo Shirt', 'Polo Shirt')).toBe(false);
    });

    it('returns false when only casing differs (treated as same name)', () => {
        expect(nameChanged('Polo Shirt', 'polo shirt')).toBe(false);
    });

    it('returns false when only surrounding whitespace differs', () => {
        expect(nameChanged('Polo Shirt', '  Polo Shirt  ')).toBe(false);
    });

    it('returns true when the name genuinely changes', () => {
        expect(nameChanged('Polo Shirt', 'V-Neck Tee')).toBe(true);
    });
});
