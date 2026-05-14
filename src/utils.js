/**
 * Pure utility functions extracted from the inline <script> in index.html
 * and from assets/js/theme.js.
 *
 * These exports exist solely to enable unit testing and coverage measurement.
 * The original index.html continues to contain its own inline copies of these
 * functions and has NOT been modified.
 */

// ── Storage (mirrors index.html) ────────────────────────────────────────────
export const STORAGE_KEY = 'DATATABLE_INVENTORY_DATA';

export const Storage = {
    save:  (data) => localStorage.setItem(STORAGE_KEY, JSON.stringify(data)),
    load:  () => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    },
    clear: () => localStorage.removeItem(STORAGE_KEY),
};

// ── Price helpers (mirrors index.html keyup handlers & form-submit logic) ───

/** Strip all non-numeric characters except '.' */
export const stripNonNumeric = (str) => String(str).replace(/[^0-9.]/g, '');

/** Compute displayed total price string (mirrors keyup handler). */
export const calcTotalPrice = (unitRaw, qtyRaw) => {
    const unit = stripNonNumeric(unitRaw);
    const qty  = stripNonNumeric(qtyRaw) || '0';
    return 'RM ' + (parseFloat(unit) * parseFloat(qty)).toFixed(2);
};

/** Format unit price for row storage (mirrors form-submit logic). */
export const formatUnitPrice = (raw) =>
    'RM ' + parseFloat(stripNonNumeric(raw)).toFixed(2);

/** Format quantity for row storage (mirrors form-submit logic). */
export const formatQuantity = (raw) =>
    parseFloat(stripNonNumeric(raw)).toFixed(0);

// ── Name-duplicate validation (mirrors index.html add / edit submit) ─────────

/**
 * Returns true when candidateName already exists in rows
 * (case-insensitive, trimmed match on column 0).
 */
export const isDuplicateName = (rows, candidateName) => {
    const normalised = candidateName.trim().toLowerCase();
    return rows.some(row => row[0].trim().toLowerCase() === normalised);
};

/** Returns true when the edited name actually changed from the original. */
export const nameChanged = (originalRaw, editedRaw) =>
    editedRaw.trim().toLowerCase() !== originalRaw.trim().toLowerCase();

// ── DB.txt / DataTables export file parser (mirrors index.html readSingleFile) ──

/**
 * Parses the content of a DataTables-exported DB.txt file and returns the
 * body array.
 */
export const parseDbFile = (contents) =>
    JSON.parse(contents.split('"body":')[1].split('}')[0]);

// ── DataTables currency sort pre-processor (mirrors index.html) ─────────────

/**
 * Converts an "RM X.XX" string to a float for numeric sorting.
 * Registered in index.html as $.fn.dataTable.ext.type.order['rm-currency-pre'].
 */
export const rmCurrencyPre = (data) =>
    parseFloat(data.replace(/[^0-9.]/g, '')) || 0;

// ── theme.js helpers ────────────────────────────────────────────────────────

/** Returns the CSS display value for the scroll-to-top button (mirrors theme.js). */
export const getScrollToTopDisplay = (pageYOffset) =>
    pageYOffset > 100 ? 'block' : 'none';

// ── index.html interface-state helpers ──────────────────────────────────────

/** Returns a visibility map for toolbar buttons based on current row count. */
export const getButtonVisibility = (rowCount) => ({
    'ADD NEW ITEM': rowCount > 0,
    'SAVE DATA':    rowCount > 0,
    'LOAD DATA':    rowCount === 0,
    'NEW DATA':     rowCount === 0,
});

/** Returns true when a sort click should proceed (debounce guard). */
export const isSortAllowed = (now, lastSortTime) => now - lastSortTime >= 500;
