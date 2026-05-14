/**
 * Tests for the custom DataTables currency sort comparator from index.html.
 *
 * Original code:
 *   $.fn.dataTable.ext.type.order['rm-currency-pre'] = function (data) {
 *       return parseFloat(data.replace(/[^0-9.]/g, '')) || 0;
 *   };
 *
 * This function is registered as a DataTables pre-sort transformer so that
 * columns typed 'rm-currency' are sorted by their numeric value rather than
 * lexicographically.
 */

import { describe, it, expect } from 'vitest';
import { rmCurrencyPre } from '../src/utils.js';

describe('rmCurrencyPre – value extraction', () => {
    it('extracts the numeric value from a standard "RM " price', () => {
        expect(rmCurrencyPre('RM 129.00')).toBe(129);
    });

    it('handles a price with no decimal part', () => {
        expect(rmCurrencyPre('RM 50')).toBe(50);
    });

    it('handles a price with a single decimal digit', () => {
        expect(rmCurrencyPre('RM 60.5')).toBe(60.5);
    });

    it('parses a large price correctly', () => {
        expect(rmCurrencyPre('RM 18830.00')).toBe(18830);
    });

    it('parses a small price correctly', () => {
        expect(rmCurrencyPre('RM 15.10')).toBe(15.1);
    });

    it('returns 0 for an empty string (fallback with || 0)', () => {
        expect(rmCurrencyPre('')).toBe(0);
    });

    it('returns 0 for a non-numeric string', () => {
        expect(rmCurrencyPre('N/A')).toBe(0);
    });

    it('works with a plain numeric string (no prefix)', () => {
        expect(rmCurrencyPre('269.00')).toBe(269);
    });
});

describe('rmCurrencyPre – sort ordering', () => {
    it('sorts prices in ascending numeric order', () => {
        const prices = ['RM 269.00', 'RM 129.00', 'RM 499.00', 'RM 45.99'];
        const sorted = [...prices].sort((a, b) => rmCurrencyPre(a) - rmCurrencyPre(b));
        expect(sorted).toEqual(['RM 45.99', 'RM 129.00', 'RM 269.00', 'RM 499.00']);
    });

    it('sorts prices in descending numeric order', () => {
        const prices = ['RM 50.00', 'RM 80.00', 'RM 15.10'];
        const sorted = [...prices].sort((a, b) => rmCurrencyPre(b) - rmCurrencyPre(a));
        expect(sorted).toEqual(['RM 80.00', 'RM 50.00', 'RM 15.10']);
    });

    it('treats 0-value entries as equal and places them before positive values', () => {
        const prices = ['RM 50.00', '', 'RM 10.00'];
        const sorted = [...prices].sort((a, b) => rmCurrencyPre(a) - rmCurrencyPre(b));
        // '' maps to 0, so it comes first
        expect(sorted[0]).toBe('');
    });

    it('correctly orders all DB.txt unit prices', () => {
        const dbPrices = [
            'RM 129.00', 'RM 269.00', 'RM 45.99', 'RM 140.00',
            'RM 129.00', 'RM 60.50',  'RM 80.00', 'RM 79.00',
            'RM 499.00', 'RM 50.00',  'RM 89.00', 'RM 15.10',
        ];
        const sorted = [...dbPrices].sort((a, b) => rmCurrencyPre(a) - rmCurrencyPre(b));
        expect(sorted[0]).toBe('RM 15.10');
        expect(sorted[sorted.length - 1]).toBe('RM 499.00');
    });
});
