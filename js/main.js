/* ==========================================================================
   Couples Games website - shared script
   Loaded by: index, packs, couples-intimacy-profile, date-night-ideas, 404
   (The Long Distance page has its own script and does not load this file.)
   Every feature checks that its elements exist, so one file works on all pages.
   ========================================================================== */
(function () {
    'use strict';

    function track(name, params) {
        try {
            if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
        } catch (e) { /* analytics must never break the page */ }
    }

    /* ---- Always use the clean home URL (/index.html -> /) ---- */
    try {
        if (/\/index\.html$/.test(window.location.pathname) && window.location.hostname === 'couplestruthdare.com') {
            window.location.replace('/' + window.location.search + window.location.hash);
        }
    } catch (e) { /* ignore */ }

    document.addEventListener('DOMContentLoaded', function () {
        initNav();
        initYear();
        initPlayTracking();
        initDemo();
        initPackAgeGate();
        initIdeas();
    });

    /* ---------------------------------------------------------------------
       Navigation: mobile menu + scrolled state
       --------------------------------------------------------------------- */
    function initNav() {
        var navbar = document.querySelector('.navbar');
        var burger = document.querySelector('.hamburger');
        var links = document.querySelector('.nav-links');

        if (navbar) {
            var onScroll = function () { navbar.classList.toggle('scrolled', window.scrollY > 8); };
            onScroll();
            window.addEventListener('scroll', onScroll, { passive: true });
        }
        if (!burger || !links) return;

        function setOpen(open) {
            links.classList.toggle('active', open);
            burger.setAttribute('aria-expanded', open ? 'true' : 'false');
        }
        burger.addEventListener('click', function (e) {
            e.stopPropagation();
            setOpen(!links.classList.contains('active'));
        });
        links.addEventListener('click', function (e) {
            if (e.target.closest('a')) setOpen(false);
        });
        document.addEventListener('click', function (e) {
            if (!links.contains(e.target) && !burger.contains(e.target)) setOpen(false);
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') setOpen(false);
        });
    }

    function initYear() {
        var year = String(new Date().getFullYear());
        document.querySelectorAll('.js-year').forEach(function (el) { el.textContent = year; });
    }

    /* ---------------------------------------------------------------------
       Track clicks on the Google Play links (shows up in Google Analytics)
       --------------------------------------------------------------------- */
    function initPlayTracking() {
        document.addEventListener('click', function (e) {
            var a = e.target.closest && e.target.closest('a[href*="play.google.com"]');
            if (!a) return;
            track('click_google_play', {
                page: window.location.pathname,
                placement: a.getAttribute('data-placement') || 'link'
            });
        });
    }

    /* ---------------------------------------------------------------------
       Homepage: "draw a card" demo
       --------------------------------------------------------------------- */
    var TRUTHS = [
        "What's a small thing I do that always makes your day better?",
        "What was your very first impression of me?",
        "Which memory of us would you relive in a heartbeat?",
        "What's something you've been meaning to tell me but haven't?",
        "Which of our dates would you happily repeat?",
        "What's one thing you'd like us to do more of this year?",
        "When did you first realise you were falling for me?",
        "Which song reminds you of us, and why?"
    ];
    var DARES = [
        "Give your partner a 60-second shoulder rub.",
        "Slow dance to one whole song with no phones in sight.",
        "Say three things you love about your partner while looking them in the eye.",
        "Describe your partner like a movie-trailer voiceover.",
        "Do your best impression of your partner. They score it out of 10.",
        "Write a one-line love note and hide it where they'll find it today.",
        "Take a silly selfie together. Best of three wins.",
        "Feed your partner a bite of their favourite snack."
    ];

    function initDemo() {
        var truthBtn = document.getElementById('demoTruth');
        var dareBtn = document.getElementById('demoDare');
        var result = document.getElementById('demoResult');
        if (!truthBtn || !dareBtn || !result) return;

        var last = { truth: -1, dare: -1 };

        function pick(kind) {
            var list = kind === 'truth' ? TRUTHS : DARES;
            var i;
            do { i = Math.floor(Math.random() * list.length); } while (i === last[kind] && list.length > 1);
            last[kind] = i;
            return list[i];
        }

        function draw(kind) {
            var prompt = pick(kind);
            result.classList.add('filled');
            result.innerHTML = '';

            var type = document.createElement('div');
            type.className = 'demo-type';
            type.textContent = kind === 'truth' ? 'Truth' : 'Dare';

            var text = document.createElement('p');
            text.className = 'demo-prompt';
            text.textContent = prompt;

            var again = document.createElement('p');
            again.className = 'demo-hint';
            again.textContent = 'Tap a card again for a new one.';

            result.appendChild(type);
            result.appendChild(text);
            result.appendChild(again);

            truthBtn.classList.toggle('picked', kind === 'truth');
            dareBtn.classList.toggle('picked', kind === 'dare');
            track('demo_draw_card', { kind: kind });
        }

        truthBtn.addEventListener('click', function () { draw('truth'); });
        dareBtn.addEventListener('click', function () { draw('dare'); });
    }

    /* ---------------------------------------------------------------------
       Packs page: 18+ age gate for the explicit packs
       Keeps the same ids/classes the packs page has always used.
       --------------------------------------------------------------------- */
    function initPackAgeGate() {
        var modal = document.getElementById('ageVerificationModal');
        var buttons = document.querySelectorAll('.erotic-download');
        if (!modal || !buttons.length) return;

        var closeBtn = document.getElementById('closeAgeModal');
        var cancelBtn = document.getElementById('cancelDownload');
        var confirmBtn = document.getElementById('confirmDownload');
        var pending = null;
        var lastFocus = null;

        function openModal(pack, filename, trigger) {
            pending = { pack: pack, filename: filename };
            lastFocus = trigger || null;
            modal.classList.remove('hidden');
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            if (cancelBtn) cancelBtn.focus();
        }
        function closeModal() {
            modal.classList.add('hidden');
            modal.classList.remove('active');
            document.body.style.overflow = '';
            pending = null;
            if (lastFocus && lastFocus.focus) lastFocus.focus();
        }
        function notify(message) {
            var old = document.querySelector('.download-notification');
            if (old) old.remove();
            var note = document.createElement('div');
            note.className = 'download-notification';
            note.setAttribute('role', 'status');
            var icon = document.createElement('i');
            icon.className = 'fas fa-check-circle';
            note.appendChild(icon);
            note.appendChild(document.createTextNode(' ' + message));
            document.body.appendChild(note);
            requestAnimationFrame(function () { note.classList.add('show'); });
            setTimeout(function () {
                note.classList.remove('show');
                setTimeout(function () { note.remove(); }, 400);
            }, 4000);
        }
        function startDownload(pack, filename) {
            var a = document.createElement('a');
            a.href = pack;
            a.download = filename;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            notify('Your download has started. Open the app and import the file.');
            track('download_pack_adult', { file: filename });
        }

        buttons.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                openModal(btn.getAttribute('data-pack'), btn.getAttribute('data-filename'), btn);
            });
        });
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
        if (confirmBtn) {
            confirmBtn.addEventListener('click', function () {
                if (pending) startDownload(pending.pack, pending.filename);
                closeModal();
            });
        }
        modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
        });

        /* plain (non-adult) pack downloads are tracked too */
        document.querySelectorAll('a.download-btn[download]').forEach(function (a) {
            a.addEventListener('click', function () {
                track('download_pack', { file: a.getAttribute('download') });
            });
        });
    }

    /* ---------------------------------------------------------------------
       Date night ideas page: category filter + "pick one for us"
       --------------------------------------------------------------------- */
    function initIdeas() {
        var list = document.getElementById('ideasList');
        if (!list) return;
        var items = Array.prototype.slice.call(list.querySelectorAll('.idea'));
        var chips = document.querySelectorAll('.chip[data-filter]');
        var pickBtn = document.getElementById('pickIdea');
        var pickOut = document.getElementById('pickResult');
        var current = 'all';

        function visibleItems() {
            return items.filter(function (el) { return !el.classList.contains('hidden'); });
        }
        function applyFilter(cat) {
            current = cat;
            items.forEach(function (el) {
                var show = cat === 'all' || el.getAttribute('data-cat') === cat;
                el.classList.toggle('hidden', !show);
                el.classList.remove('is-picked');
            });
            chips.forEach(function (c) {
                var on = c.getAttribute('data-filter') === cat;
                c.classList.toggle('active', on);
                c.setAttribute('aria-pressed', on ? 'true' : 'false');
            });
            if (pickOut) { pickOut.classList.add('hidden'); pickOut.textContent = ''; }
        }
        chips.forEach(function (c) {
            c.addEventListener('click', function () {
                applyFilter(c.getAttribute('data-filter'));
                track('ideas_filter', { category: c.getAttribute('data-filter') });
            });
        });
        if (pickBtn && pickOut) {
            pickBtn.addEventListener('click', function () {
                var pool = visibleItems();
                if (!pool.length) return;
                items.forEach(function (el) { el.classList.remove('is-picked'); });
                var el = pool[Math.floor(Math.random() * pool.length)];
                el.classList.add('is-picked');
                var title = el.querySelector('h3');
                pickOut.textContent = title ? title.textContent : '';
                pickOut.classList.remove('hidden');
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                track('ideas_pick_one', { filter: current });
            });
        }
    }
})();
