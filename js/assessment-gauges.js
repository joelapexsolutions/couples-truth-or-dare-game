/*
 * Couples Games - animated gauge effects for the Intimacy Profile page.
 * Runs AFTER assessment.js and does not change it. It watches the hidden
 * percentage text that assessment.js already updates, then drives:
 * the lit arc, needle, glowing tip, active label, count-up number and level pop.
 */
(function () {
    'use strict';

    var reduce = false;
    try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

    function Gauge(svg) {
        this.svg = svg;
        this.bounds = svg.getAttribute('data-bounds').split(',').map(Number);
        this.pct = svg.querySelector('.gauge-percentage');
        this.progress = svg.querySelector('.gauge-progress');
        this.needle = svg.querySelector('.gauge-needle');
        this.tip = svg.querySelector('.gauge-tip');
        this.scoreText = svg.querySelector('.gauge-score');
        this.labels = svg.querySelectorAll('.gauge-label');
        this.segs = svg.querySelectorAll('.gauge-segment');
        var box = svg.closest('.gauge-container');
        this.levelEl = box ? box.querySelector('.gauge-level') : null;
        this.score = 0;
        this.shown = 0;
        this.index = -1;
        this.raf = 0;
        this.wasHidden = true;
        this.played = false;
    }

    Gauge.prototype.readScore = function () {
        var n = parseInt(this.pct ? this.pct.textContent : '0', 10);
        if (isNaN(n)) n = 0;
        return Math.max(0, Math.min(100, n));
    };

    Gauge.prototype.segmentIndex = function (score) {
        var b = this.bounds, last = b.length - 2;
        for (var i = 0; i <= last; i++) {
            if (score >= b[i] && score < b[i + 1]) return i;
        }
        return last;
    };

    Gauge.prototype.setPosition = function (score) {
        var angle = -90 + (score / 100) * 180;
        if (this.progress) this.progress.style.strokeDashoffset = String(100 - score);
        if (this.needle) this.needle.style.transform = 'rotate(' + angle + 'deg)';
        if (this.tip) this.tip.style.transform = 'rotate(' + angle + 'deg)';
        this.svg.classList.toggle('is-zero', score <= 0);
    };

    Gauge.prototype.setText = function (value) {
        if (!this.scoreText) return;
        var node = this.scoreText.firstChild;
        if (node && node.nodeType === 3) node.nodeValue = String(Math.round(value));
    };

    Gauge.prototype.countTo = function (target) {
        var self = this;
        cancelAnimationFrame(this.raf);
        if (reduce) { this.shown = target; this.setText(target); return; }
        var from = this.shown, start = null, dur = 1300;
        function step(ts) {
            if (start === null) start = ts;
            var t = Math.min(1, (ts - start) / dur);
            var eased = 1 - Math.pow(1 - t, 3);
            self.shown = from + (target - from) * eased;
            self.setText(self.shown);
            if (t < 1) self.raf = requestAnimationFrame(step);
        }
        this.raf = requestAnimationFrame(step);
    };

    Gauge.prototype.markActive = function (idx) {
        var i;
        for (i = 0; i < this.labels.length; i++) this.labels[i].classList.toggle('is-active', i === idx);
        for (i = 0; i < this.segs.length; i++) this.segs[i].classList.toggle('is-active', i === idx);
    };

    Gauge.prototype.update = function () {
        var score = this.readScore();
        var idx = this.segmentIndex(score);
        var changedLevel = (this.index !== -1 && idx !== this.index);
        this.score = score;
        this.index = idx;
        this.setPosition(score);
        this.countTo(score);
        this.markActive(idx);
        if (changedLevel) this.celebrate();
    };

    Gauge.prototype.celebrate = function () {
        var svg = this.svg, lvl = this.levelEl;
        svg.classList.remove('bump');
        void svg.getBoundingClientRect();
        svg.classList.add('bump');
        if (lvl) {
            lvl.classList.remove('changed');
            void lvl.offsetWidth;
            lvl.classList.add('changed');
        }
    };

    // Replay the sweep from zero whenever the gauge becomes visible (e.g. results screen opens).
    Gauge.prototype.replay = function () {
        var self = this, target = this.readScore();
        var prog = this.progress, needle = this.needle, tip = this.tip;
        [prog, needle, tip].forEach(function (el) { if (el) el.style.transition = 'none'; });
        this.shown = 0;
        this.setText(0);
        this.setPosition(0);
        void this.svg.getBoundingClientRect();
        [prog, needle, tip].forEach(function (el) { if (el) el.style.transition = ''; });
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                self.score = target;
                self.index = self.segmentIndex(target);
                self.setPosition(target);
                self.countTo(target);
                self.markActive(self.index);
            });
        });
    };

    function init() {
        var svgs = document.querySelectorAll('svg.gauge-svg');
        Array.prototype.forEach.call(svgs, function (svg) {
            var g = new Gauge(svg);
            g.update();

            if (g.pct && 'MutationObserver' in window) {
                new MutationObserver(function () { g.update(); })
                    .observe(g.pct, { childList: true, characterData: true, subtree: true });
            }

            if ('IntersectionObserver' in window) {
                new IntersectionObserver(function (entries) {
                    entries.forEach(function (en) {
                        var r = en.boundingClientRect;
                        if (r.width === 0 && r.height === 0) { g.wasHidden = true; return; }
                        if (en.isIntersecting && g.wasHidden) {
                            g.wasHidden = false;
                            g.replay();
                        }
                    });
                }, { threshold: 0.25 }).observe(svg);
            }
        });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
