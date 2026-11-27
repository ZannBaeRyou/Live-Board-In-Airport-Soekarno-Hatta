const fs = require('fs');
const path = require('path');
const assert = require('assert');
const vm = require('vm');

const css = fs.readFileSync(path.join(__dirname, '../assets/css/style.css'), 'utf8');
const indexHtml = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const mainJs = fs.readFileSync(path.join(__dirname, '../assets/js/main.js'), 'utf8');

// Task 1: Check CSS & HTML rules
assert(css.includes('.hero-batik-clip'), 'style.css must define .hero-batik-clip container');
assert(css.includes('will-change: transform') || css.includes('will-change: opacity, transform'), 'style.css must specify will-change for watermark elements');
assert(css.includes('prefers-reduced-motion: reduce'), 'style.css must support prefers-reduced-motion: reduce');
assert(indexHtml.includes('hero-batik-clip'), 'index.html must wrap hero-batik-watermark inside hero-batik-clip');

// Task 2: Static code contract checks
assert(mainJs.includes('initParallaxScroll'), 'main.js must define initParallaxScroll');
assert(mainJs.includes('prefers-reduced-motion'), 'initParallaxScroll must check prefers-reduced-motion');
assert(mainJs.includes('requestAnimationFrame'), 'initParallaxScroll must use requestAnimationFrame');
assert(mainJs.includes('backgroundPositionY'), 'initParallaxScroll must update body backgroundPositionY');
assert(mainJs.includes('translate3d'), 'initParallaxScroll must use translate3d on batik watermark');
assert(mainJs.includes('initParallaxScroll()'), 'DOMContentLoaded must invoke initParallaxScroll()');

// Behavioral execution test via isolated VM extracting initParallaxScroll
const fnMatch = mainJs.match(/function initParallaxScroll\(\)\s*\{[\s\S]*?\n\}/);
assert(fnMatch, 'Could not extract initParallaxScroll() body from main.js');

function createMockEnv(reducedMotion = false) {
    let scrollHandler = null;
    let listenerOpts = null;
    let rafCallbacks = [];
    const mockWatermark = { style: {} };
    const mockBody = { style: {} };
    const sandbox = {
        Math,
        window: {
            pageYOffset: 0,
            matchMedia: (q) => ({ matches: q.includes('prefers-reduced-motion') ? reducedMotion : false }),
            addEventListener: (ev, cb, opts) => {
                if (ev === 'scroll') {
                    scrollHandler = cb;
                    listenerOpts = opts;
                }
            },
            requestAnimationFrame: (cb) => {
                rafCallbacks.push(cb);
                return rafCallbacks.length;
            }
        },
        document: {
            body: mockBody,
            documentElement: { scrollTop: 0 },
            querySelector: (sel) => sel.includes('hero-batik-watermark') ? mockWatermark : null
        }
    };
    vm.createContext(sandbox);
    vm.runInContext(fnMatch[0] + '\ninitParallaxScroll();', sandbox);
    return {
        sandbox,
        mockBody,
        mockWatermark,
        getScrollHandler: () => scrollHandler,
        getListenerOpts: () => listenerOpts,
        flushRaf: () => {
            const cbs = rafCallbacks.splice(0, rafCallbacks.length);
            cbs.forEach(cb => cb());
        },
        pendingRafCount: () => rafCallbacks.length
    };
}

// 1. Reduced motion respects preference & attaches no scroll listener
const reducedEnv = createMockEnv(true);
assert.strictEqual(reducedEnv.getScrollHandler(), null, 'Must not attach scroll listener when prefers-reduced-motion is active');

// 2. Normal motion attaches passive listener
const env = createMockEnv(false);
assert.strictEqual(typeof env.getScrollHandler(), 'function', 'Must attach scroll listener');
assert.strictEqual(env.getListenerOpts() && env.getListenerOpts().passive, true, 'Scroll listener must be passive');

// 3. Normal scroll (scrollY = 250) updates both layers with multi-depth offsets + rAF throttling
env.sandbox.window.pageYOffset = 250;
env.getScrollHandler()();
env.getScrollHandler()(); // second scroll before rAF flushes should be throttled
assert.strictEqual(env.pendingRafCount(), 1, 'rAF ticking guard must throttle rapid scroll events');
env.flushRaf();
assert.strictEqual(env.mockBody.style.backgroundPositionY, `${(250 * 0.45) % 24}px`, 'Global polka dot backgroundPositionY mismatch');
assert.strictEqual(env.mockWatermark.style.transform, `translate3d(0, ${250 * 0.22}px, 0)`, 'Hero batik watermark transform mismatch');

// 4. Deep scroll (scrollY = 1200) clamps batik watermark at 120px
env.sandbox.window.pageYOffset = 1200;
env.getScrollHandler()();
env.flushRaf();
assert.strictEqual(env.mockWatermark.style.transform, 'translate3d(0, 120px, 0)', 'Hero batik watermark must clamp at 120px on deep scroll');

// 5. Negative rubber-band overscroll (scrollY = -30) clamps safely at 0px
env.sandbox.window.pageYOffset = -30;
env.getScrollHandler()();
env.flushRaf();
assert.strictEqual(env.mockBody.style.backgroundPositionY, '0px', 'Negative overscroll must clamp backgroundPositionY to 0px');
assert.strictEqual(env.mockWatermark.style.transform, 'translate3d(0, 0px, 0)', 'Negative overscroll must clamp watermark transform to 0px');

console.log('PASS: test_parallax_scroll verified (CSS, clipping, rAF throttling, clamping, overscroll, reduced-motion)');
