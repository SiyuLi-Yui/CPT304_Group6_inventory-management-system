/**
 * Tests for the DB.txt / exported-DataTable file parsing logic from index.html.
 *
 * Original code (readSingleFile → reader.onload):
 *   const contents = event.target.result;
 *   const importedData = JSON.parse(contents.split('"body":')[1].split('}')[0]);
 *
 * The exported file format (produced by DataTables buttons.fileSave):
 *   {"header":[...],"footer":null,"body":[[row0col0, ...], [row1col0, ...], ...]}
 *
 * The parser:
 *   1. Splits on '"body":' to isolate the body value including its surrounding array.
 *   2. Calls .split('}')[0] to strip the closing '}' of the outer object.
 *   3. Parses the resulting JSON array string.
 *
 * NOTE: The parser relies on there being no literal '}' characters inside the
 *       row data – which holds true for the inventory values used in this app.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { parseDbFile } from '../src/utils.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH   = path.resolve(__dirname, '../DB.txt');

// Read the real DB.txt once for integration-style assertions
const DB_CONTENTS = readFileSync(DB_PATH, 'utf-8');

// ── fixtures ─────────────────────────────────────────────────────────────────
const SINGLE_ROW_FILE =
    '{"header":["Item Name","Quantity","Type","Unit Price","Total Price","",""],' +
    '"footer":null,"body":[["Polo Shirt","27","Shirt","RM 50.00","RM 1350.00","",""]]}';

const MULTI_ROW_FILE =
    '{"header":["Item Name","Quantity","Type","Unit Price","Total Price","",""],' +
    '"footer":null,"body":[' +
    '["Blazer (Female)","20","Outerwear","RM 129.00","RM 2580.00","",""],' +
    '["Bomber Jacket","70","Outerwear","RM 269.00","RM 18830.00","",""]' +
    ']}';
// ─────────────────────────────────────────────────────────────────────────────

describe('parseDbFile – structure', () => {
    it('returns an array', () => {
        expect(Array.isArray(parseDbFile(SINGLE_ROW_FILE))).toBe(true);
    });

    it('each row is itself an array', () => {
        const rows = parseDbFile(MULTI_ROW_FILE);
        rows.forEach(row => expect(Array.isArray(row)).toBe(true));
    });

    it('preserves the correct number of rows', () => {
        expect(parseDbFile(SINGLE_ROW_FILE)).toHaveLength(1);
        expect(parseDbFile(MULTI_ROW_FILE)).toHaveLength(2);
    });
});

describe('parseDbFile – column values', () => {
    it('parses item name (column 0)', () => {
        const [row] = parseDbFile(SINGLE_ROW_FILE);
        expect(row[0]).toBe('Polo Shirt');
    });

    it('parses quantity (column 1)', () => {
        const [row] = parseDbFile(SINGLE_ROW_FILE);
        expect(row[1]).toBe('27');
    });

    it('parses type (column 2)', () => {
        const [row] = parseDbFile(SINGLE_ROW_FILE);
        expect(row[2]).toBe('Shirt');
    });

    it('parses unit price with "RM " prefix intact (column 3)', () => {
        const [row] = parseDbFile(SINGLE_ROW_FILE);
        expect(row[3]).toBe('RM 50.00');
    });

    it('parses total price with "RM " prefix intact (column 4)', () => {
        const [row] = parseDbFile(SINGLE_ROW_FILE);
        expect(row[4]).toBe('RM 1350.00');
    });
});

describe('parseDbFile – real DB.txt', () => {
    it('parses the real DB.txt without throwing', () => {
        expect(() => parseDbFile(DB_CONTENTS)).not.toThrow();
    });

    it('returns 12 inventory rows from the real DB.txt', () => {
        expect(parseDbFile(DB_CONTENTS)).toHaveLength(12);
    });

    it('first row is "Blazer (Female)" with quantity 20', () => {
        const rows = parseDbFile(DB_CONTENTS);
        expect(rows[0][0]).toBe('Blazer (Female)');
        expect(rows[0][1]).toBe('20');
    });

    it('last row is "Winnie the Pooh Socks" with unit price RM 15.10', () => {
        const rows = parseDbFile(DB_CONTENTS);
        const last = rows[rows.length - 1];
        expect(last[0]).toBe('Winnie the Pooh Socks');
        expect(last[3]).toBe('RM 15.10');
    });

    it('every row has exactly 7 columns (5 data + 2 action placeholders)', () => {
        const rows = parseDbFile(DB_CONTENTS);
        rows.forEach(row => expect(row).toHaveLength(7));
    });
});
