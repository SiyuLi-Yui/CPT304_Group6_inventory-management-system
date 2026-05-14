/**
 * Tests for price-calculation logic as defined in index.html.
 *
 * Relevant original code (edit form keyup handlers):
 *
 *   $('#edit_quantity').on('keyup', function () {
 *     const qty = $(this).val().replace(/[^0-9.]/g, '');
 *     $(this).val(qty);
 *     if (qty) {
 *       const unit = $('#edit_unit_price').val().replace(/[^0-9.]/g, '');
 *       $('#edit_total_price').val('RM ' + (unit * qty).toFixed(2));
 *     }
 *   });
 *
 *   $('#edit_unit_price').on('keyup', function () {
 *     const value = $(this).val().replace(/[^0-9.]/g, '');
 *     $(this).val('RM ' + value);
 *     const qty = $('#edit_quantity').val() || 0;
 *     $('#edit_total_price').val('RM ' + (value * qty).toFixed(2));
 *   });
 *
 *   // On form submit, quantity is stored as:
 *   const quantity = parseFloat($('#edit_quantity').val().replace(/[^0-9.]/g, '')).toFixed(0);
 *   const unitPrice = parseFloat($('#edit_unit_price').val().replace(/[^0-9.]/g, '')).toFixed(2);
 *   // updatedRow[3] = 'RM ' + unitPrice
 */

import { describe, it, expect } from 'vitest';
import { stripNonNumeric, calcTotalPrice, formatUnitPrice, formatQuantity } from '../src/utils.js';

describe('stripNonNumeric', () => {
    it('removes the "RM " prefix', () => {
        expect(stripNonNumeric('RM 129.00')).toBe('129.00');
    });

    it('leaves a plain number unchanged', () => {
        expect(stripNonNumeric('60.50')).toBe('60.50');
    });

    it('removes currency symbols and spaces', () => {
        expect(stripNonNumeric('RM 1,234.56')).toBe('1234.56');
    });

    it('returns an empty string for non-numeric input', () => {
        expect(stripNonNumeric('abc')).toBe('');
    });
});

describe('calcTotalPrice', () => {
    it('multiplies unit price by quantity and formats with "RM " prefix', () => {
        expect(calcTotalPrice('RM 129.00', '20')).toBe('RM 2580.00');
    });

    it('handles fractional unit prices correctly', () => {
        expect(calcTotalPrice('RM 60.50', '75')).toBe('RM 4537.50');
    });

    it('rounds to exactly 2 decimal places', () => {
        expect(calcTotalPrice('RM 15.10', '450')).toBe('RM 6795.00');
    });

    it('returns "RM 0.00" when quantity is 0', () => {
        expect(calcTotalPrice('RM 50.00', '0')).toBe('RM 0.00');
    });

    it('returns "RM 0.00" when quantity is empty', () => {
        expect(calcTotalPrice('RM 50.00', '')).toBe('RM 0.00');
    });

    it('handles unit price without "RM " prefix', () => {
        expect(calcTotalPrice('89.00', '57')).toBe('RM 5073.00');
    });

    it('handles single-item purchase', () => {
        expect(calcTotalPrice('RM 499.00', '1')).toBe('RM 499.00');
    });
});

describe('formatUnitPrice', () => {
    it('formats a plain number with "RM " and 2 decimal places', () => {
        expect(formatUnitPrice('129')).toBe('RM 129.00');
    });

    it('formats an already-prefixed value correctly', () => {
        expect(formatUnitPrice('RM 45.99')).toBe('RM 45.99');
    });

    it('pads a single-decimal value to 2 decimal places', () => {
        expect(formatUnitPrice('60.5')).toBe('RM 60.50');
    });
});

describe('formatQuantity', () => {
    it('rounds a float down to nearest integer', () => {
        expect(formatQuantity('3.7')).toBe('4'); // toFixed(0) rounds
    });

    it('returns "0" for zero input', () => {
        expect(formatQuantity('0')).toBe('0');
    });

    it('strips non-numeric characters before converting', () => {
        expect(formatQuantity('  20  ')).toBe('20');
    });

    it('handles large quantities', () => {
        expect(formatQuantity('3000')).toBe('3000');
    });
});
