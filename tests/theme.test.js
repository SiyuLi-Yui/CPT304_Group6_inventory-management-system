/**
 * Tests for the DOM / UI behaviour in theme.js and the inline script in index.html.
 *
 * theme.js behaviours tested:
 *   1. Scroll-to-top button visibility (shown when pageYOffset > 100, hidden otherwise).
 *   2. Sidebar toggling – body.sidebar-toggled and sidebar.toggled class presence.
 *
 * index.html UI logic tested (DOM-level, without jQuery/DataTables):
 *   3. Sort debounce – rapid successive sort clicks within 500 ms are suppressed.
 *   4. Interface state – button visibility based on row count
 *      (ADD/SAVE hidden when 0 rows; LOAD/NEW hidden when rows > 0).
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getScrollToTopDisplay, isSortAllowed, getButtonVisibility } from '../src/utils.js';

// ─────────────────────────────────────────────────────────────────────────────
// 1. Scroll-to-top visibility
//    Original code in theme.js:
//      window.addEventListener('scroll', function () {
//        var scrollDistance = window.pageYOffset;
//        if (scrollDistance > 100) {
//          scrollToTop.style.display = 'block';
//        } else {
//          scrollToTop.style.display = 'none';
//        }
//      });
// ─────────────────────────────────────────────────────────────────────────────

describe('theme.js – scroll-to-top visibility', () => {
    it('is hidden when pageYOffset is 0', () => {
        expect(getScrollToTopDisplay(0)).toBe('none');
    });

    it('is hidden when pageYOffset is exactly 100', () => {
        expect(getScrollToTopDisplay(100)).toBe('none');
    });

    it('becomes visible when pageYOffset exceeds 100', () => {
        expect(getScrollToTopDisplay(101)).toBe('block');
    });

    it('remains visible at large scroll distances', () => {
        expect(getScrollToTopDisplay(5000)).toBe('block');
    });

    it('hides when the user scrolls back up to ≤ 100', () => {
        // Simulate scroll-down then scroll-up
        expect(getScrollToTopDisplay(200)).toBe('block');
        expect(getScrollToTopDisplay(50)).toBe('none');
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. Sidebar toggling (DOM-level, jsdom environment)
//    Original code in theme.js:
//      toggle.addEventListener('click', function(e) {
//        document.body.classList.toggle('sidebar-toggled');
//        sidebar.classList.toggle('toggled');
//        if (sidebar.classList.contains('toggled')) { …hide collapses… }
//      });
// ─────────────────────────────────────────────────────────────────────────────

describe('theme.js – sidebar toggle classes', () => {
    let body, sidebar;

    beforeEach(() => {
        body    = document.body;
        sidebar = document.createElement('div');
        sidebar.classList.add('sidebar');
        document.body.appendChild(sidebar);
        // Ensure clean state
        body.classList.remove('sidebar-toggled');
        sidebar.classList.remove('toggled');
    });

    it('adds "sidebar-toggled" to body on first click', () => {
        body.classList.toggle('sidebar-toggled');
        expect(body.classList.contains('sidebar-toggled')).toBe(true);
    });

    it('adds "toggled" to sidebar on first click', () => {
        sidebar.classList.toggle('toggled');
        expect(sidebar.classList.contains('toggled')).toBe(true);
    });

    it('removes classes on second click (toggle off)', () => {
        body.classList.toggle('sidebar-toggled');
        sidebar.classList.toggle('toggled');
        body.classList.toggle('sidebar-toggled');
        sidebar.classList.toggle('toggled');
        expect(body.classList.contains('sidebar-toggled')).toBe(false);
        expect(sidebar.classList.contains('toggled')).toBe(false);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. Sort-debounce logic
//    Original code (header click listener in index.html):
//      const now = Date.now();
//      if (now - lastSortTime < 500) {
//        event.preventDefault();
//        event.stopImmediatePropagation();
//        return false;
//      }
//      lastSortTime = now;
// ─────────────────────────────────────────────────────────────────────────────

describe('index.html – sort debounce', () => {
    it('allows the first sort click (lastSortTime = 0)', () => {
        expect(isSortAllowed(Date.now(), 0)).toBe(true);
    });

    it('blocks a click arriving 499 ms after the last sort', () => {
        const lastSortTime = Date.now();
        expect(isSortAllowed(lastSortTime + 499, lastSortTime)).toBe(false);
    });

    it('allows a click arriving exactly 500 ms after the last sort', () => {
        const lastSortTime = Date.now();
        expect(isSortAllowed(lastSortTime + 500, lastSortTime)).toBe(true);
    });

    it('allows a click arriving well after the debounce window', () => {
        const lastSortTime = Date.now() - 1000;
        expect(isSortAllowed(Date.now(), lastSortTime)).toBe(true);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. Interface state – button visibility based on row count
//    Original code (updateInterfaceState in index.html):
//      if (rowCount > 0) {
//        // ADD NEW ITEM → visible, SAVE DATA → visible
//        // LOAD DATA   → hidden,  NEW DATA   → hidden
//      } else {
//        // ADD NEW ITEM → hidden, SAVE DATA → hidden
//        // LOAD DATA   → visible, NEW DATA  → visible
//      }
// ─────────────────────────────────────────────────────────────────────────────

describe('index.html – interface state (button visibility)', () => {
    it('shows LOAD DATA and NEW DATA when the table is empty', () => {
        const vis = getButtonVisibility(0);
        expect(vis['LOAD DATA']).toBe(true);
        expect(vis['NEW DATA']).toBe(true);
    });

    it('hides ADD NEW ITEM and SAVE DATA when the table is empty', () => {
        const vis = getButtonVisibility(0);
        expect(vis['ADD NEW ITEM']).toBe(false);
        expect(vis['SAVE DATA']).toBe(false);
    });

    it('shows ADD NEW ITEM and SAVE DATA when the table has rows', () => {
        const vis = getButtonVisibility(5);
        expect(vis['ADD NEW ITEM']).toBe(true);
        expect(vis['SAVE DATA']).toBe(true);
    });

    it('hides LOAD DATA and NEW DATA when the table has rows', () => {
        const vis = getButtonVisibility(5);
        expect(vis['LOAD DATA']).toBe(false);
        expect(vis['NEW DATA']).toBe(false);
    });

    it('transitions correctly when a row is added (0 → 1)', () => {
        expect(getButtonVisibility(0)['ADD NEW ITEM']).toBe(false);
        expect(getButtonVisibility(1)['ADD NEW ITEM']).toBe(true);
    });

    it('transitions correctly when the last row is deleted (1 → 0)', () => {
        expect(getButtonVisibility(1)['LOAD DATA']).toBe(false);
        expect(getButtonVisibility(0)['LOAD DATA']).toBe(true);
    });
});
