const SUPABASE_URL = 'https://xbdjigqrhsptepibvmgq.supabase.co';
const SUPABASE_KEY = 'sb_publishable_1F9D8VbT7O7V6TN_Hx07gw_R0IrJIrA';
const SUPABASE_ANON_KEY = SUPABASE_KEY;
const byId = (id) => document.getElementById(id);
const $ = byId;
async function shrinkImage(f) {
    try {
        const bm = await createImageBitmap(f);
        const k = Math.min(1, 1200 / Math.max(bm.width, bm.height));
        const c = document.createElement('canvas');
        c.width = Math.round(bm.width * k);
        c.height = Math.round(bm.height * k);
        c.getContext('2d').drawImage(bm, 0, 0, c.width, c.height);
        return await new Promise((r) => c.toBlob(r, 'image/jpeg', .85));
    } catch (e) {
        return f;
    }
}

(function () {
    function show(m) {
        var d = document.getElementById('errBar');
        if (!d) {
            d = document.createElement('div');
            d.id = 'errBar';
            d.style.cssText = 'position:fixed;left:0;right:0;bottom:0;z-index:99999;padding:8px 12px;background:#7a1f1f;color:#fff;font:12px/1.4 sans-serif';
            d.onclick = function () {
                d.remove();
            };
            document.body.appendChild(d);
        }
        d.textContent = 'Error: ' + m + ' (tap to hide)';
    }

    window.addEventListener('error', function (e) {
        show(e.message);
    });

    window.addEventListener('unhandledrejection', function (e) {
        show(String(e.reason && e.reason.message || e.reason));
    });
})();
function startIndexPage() {
    let poems = [];
    const categories = [
        {
            key: 'community', name: 'Community', desc: 'Poems shared by visitors of the forest.', pattern: /a^/
        },
        {
            key: 'love',
            name: 'Heart',
            desc: 'For love, longing, almosts, and goodbyes.',
            pattern: /love|heartbreak|lover|kiss|crush|miss you|goodbye|good-bye|relationship|romance|darling|belong to you|fall for|mahal|pag-ibig|pag ibig|pagmamahal|puso|sinta|iniibig|minahal|nagmahal|paglayo|paalam/i
        },
        {
            key: 'self',
            name: 'Mirror',
            desc: 'Pages about identity, self-worth, and learning who I am.',
            pattern: /myself|self-love|self love|my worth|who i am|my identity|own heart|choose myself|self-respect|self respect|my dreams|my fear|my mind|sarili|pagkatao|kakayahan|aking sarili/i
        },
        {
            key: 'healing',
            name: 'Dawn',
            desc: 'For letting go, finding peace, and becoming a little stronger.',
            pattern: /healing|heal|grow|growth|letting go|let go|moving on|forgive|forgiveness|peace|stronger|survive|recovery|paghilom|pagbangon|pagsubok|pag-asa|pagasa/i
        },
        {
            key: 'family',
            name: 'Belonging',
            desc: 'For the people who stay, guide us, and make a home.',
            pattern: /family|mother|father|parents|sister|brother|friend|friendship|best friend|pamilya|ina|ama|magulang|kaibigan|kapatid/i
        },
        {
            key: 'faith',
            name: 'Grace',
            desc: 'For prayers, trust, light, and the hope that carries us.',
            pattern: /god|jesus|faith|prayer|heaven|lord|church|bless|diyos|panginoon|panalangin|pananalig|biyaya/i
        },
        {
            key: 'life',
            name: 'Dreams',
            desc: 'For growing, finding a path, and dreaming of what comes next.',
            pattern: /life|dream|future|journey|path|purpose|hope|tomorrow|begin again|destination|buhay|pangarap|paglalakbay|kinabukasan|panahon/i
        },
        {
            key: 'other',
            name: 'Whispers',
            desc: 'For the feelings that do not fit neatly into one name.',
            pattern: /.*/
        }
    ];
    const searchInput = byId('search');
    const grid = byId('grid');
    const featured = byId('featured');
    const modal = byId('modal');
    const menu = byId('categoryMenu');
    const menuOverlay = byId('menuOverlay');
    const menuToggle = byId('menuToggle');
    const menuClose = byId('menuClose');
    const menuLinks = document.querySelectorAll('.menu-link');
    const currentLabel = byId('currentLabel');
    const padNumber = (number) => String(number).padStart(3, '0');
    const FEATURED_TITLES = /people who stay|my first inspiration|gentle surrender|behind the noise|peace in his guidance|malayang damdamin/i;
    const CATEGORY_BY_NUMBER = {};
    const CATEGORY_LISTS = {
        "love": "383,384,1,2,4,5,6,7,8,9,10,16,18,19,20,21,22,23,24,25,27,28,29,30,32,34,35,39,40,42,45,46,47,48,49,50,69,72,77,79,84,85,86,87,88,89,90,94,95,96,97,101,102,103,107,140,147,150,153,156,158,162,166,174,176,189,190,194,195,201,205,206,216,235,237,238,242,243,244,245,246,249,253,261,262,264,266,273,284,285,286,289,292,293,294,297,298,299,300,301,302,304,306,307,308,309,312,313,314,317,319,320,323,325,327,328,329,334,341,342,344,345,346,347,349,350,353,355,359,361,362,365,369,373,376,377,380", "self": "3,11,12,13,51,55,56,57,58,59,61,66,67,68,70,71,75,78,92,104,108,112,113,115,116,117,118,119,120,121,127,142,148,151,152,157,160,164,165,167,168,169,170,177,179,181,183,188,191,192,193,196,198,200,202,203,204,208,209,211,212,217,218,223,227,228,231,234,239,240,241,247,248,250,254,255,256,257,259,260,265,267,268,269,271,295,296,305,310,311,315,321,322,326,330,335,336,337,338,339,340,367,378", "healing": "31,37,38,76,80,81,83,91,93,106,122,128,129,130,132,136,145,146,159,161,173,178,185,186,199,221,222,224,225,226,270,272,276,279,281,283,287,303,318,332,348,351,352,354,358,360,366", "family": "26,36,73,82,105,123,135,137,141,144,149,154,163,171,172,187,230,233,251,252,258,275,277,331,364,379", "faith": "382,33,44,109,114,131,143,175,290", "life": "41,52,53,54,60,64,65,74,98,99,100,110,125,126,133,139,155,182,184,197,207,210,280,282,288,291,316,333,343,363,368,370,371,381", "other": "14,15,17,43,62,63,111,124,134,138,180,213,214,215,219,220,229,232,236,263,274,278,324,356,357,372,374,375"
    };

    Object.entries(CATEGORY_LISTS).forEach(([key, nums]) => nums.split(',').forEach((n) => {
        CATEGORY_BY_NUMBER[n] = key;
    }));

    function categoryOf(poem) {
        if (poem.guest) {
            return 'Community';
        }
        const fromDb = categories.some((c) => c.key === poem.category) ? poem.category : null;
        const key = fromDb || CATEGORY_BY_NUMBER[poem.number] || 'other';
        return categories.find((c) => c.key === key).name;
    }

    function buildStanzas(text) {
        const blocks = [];
        let group = [];
        for (const line of text.split('\n')) {
            if (!line.trim()) {
                if (group.length) {
                    blocks.push(group.join('\n'));
                    group = [];
                }
                continue;
            }
            group.push(line);
            if (group.length === 4) {
                blocks.push(group.join('\n'));
                group = [];
            }
        }
        if (group.length) {
            blocks.push(group.join('\n'));
        }
        return blocks.map((block) => {
            const stanza = document.createElement('p');
            stanza.className = 'stanza';
            stanza.textContent = block;
            return stanza;
        });
    }

    function fitPoem() {
        if (!modal.open) {
            return;
        }
        const t = byId('modalText');
        const body = t.parentElement;
        const pic = byId('media').querySelector('img');
        const lh = (s) => (s >= 20 ? 1.7 : s >= 14 ? 1.55 : 1.42);
        const set = (s) => {
            body.style.fontSize = s + 'px';
            body.style.lineHeight = lh(s);
        };
        const fits = () => t.scrollHeight <= t.clientHeight + 1 && t.scrollWidth <= t.clientWidth + 1;
        const tall = t.querySelectorAll('.stanza').length >= 6;
        modal.classList.toggle('tall', tall);
        if (tall) {
            if (pic) {
                pic.style.maxHeight = '';
            }
            t.style.columnCount = 'auto';
            const want = window.innerWidth >= 700 ? 20 : 17;
            set(want);
            if (!fits()) {
                let lo = 10;
                let hi = want;
                while (hi - lo > 0.25) {
                    const mid = (lo + hi) / 2;
                    set(mid);
                    if (fits()) {
                        lo = mid;
                    } else {
                        hi = mid;
                    }
                }
                set(lo);
            }
            t.scrollTop = 0;
            return;
        }
        const maxCols = t.clientWidth >= 800 ? 3 : t.clientWidth >= 560 ? 2 : 1;
        const search = () => {
            let best = null;
            for (let c = 1; c <= maxCols; c++) {
                t.style.columnCount = c === 1 ? 'auto' : c;
                set(9);
                if (!fits()) {
                    continue;
                }
                let lo = 9;
                let hi = 30;
                while (hi - lo > 0.25) {
                    const mid = (lo + hi) / 2;
                    set(mid);
                    if (fits()) {
                        lo = mid;
                    } else {
                        hi = mid;
                    }
                }
                if (!best || lo > best.size * 1.12) {
                    best = { size: lo, cols: c };
                }
            }
            return best;
        };
        if (pic) {
            pic.style.maxHeight = '';
        }
        let best = search();
        if (!best && pic) {
            pic.style.maxHeight = '56px';
            best = search();
        }
        if (!best) {
            best = { size: 12, cols: 1 };
        }
        t.style.columnCount = best.cols === 1 ? 'auto' : best.cols;
        set(best.size);
        t.scrollTop = 0;
    }

    function openPoem(poem) {
        byId('modalTitle').textContent = poem.guest ? poem.title : padNumber(poem.number);
        byId('modalEyebrow').textContent = poem.guest ? 'Community poem · by ' + poem.author : '';
        byId('modalBy').textContent = '— ' + (poem.guest ? poem.author : 'shaina');
        byId('modalText').replaceChildren(...buildStanzas(poem.text));
        modal.showModal();
        currentPoem = poem.number;
        const media = byId('media');
        media.replaceChildren();
        if (poem.image_url) {
            const im = document.createElement('img');
            im.src = poem.image_url;
            im.alt = '';
            im.loading = 'lazy';
            im.onload = fitPoem;
            media.append(im);
        }
        if (poem.music_url) {
            const au = document.createElement('audio');
            au.controls = true;
            au.preload = 'none';
            au.src = poem.music_url;
            media.append(au);
        }
        fitPoem();
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(fitPoem);
        }
        byId('sheet').hidden = true;
        byId('cmCount').textContent = '0';
        byId('modalText').parentElement.scrollTop = 0;
        byId('mLike').replaceWith(makeLikeButton(poem.number, 'mLike'));
        byId('cmMsg').textContent = '';
        loadComments(poem.number);
        logView(poem.number);
    }

    function makeCard(poem) {
        const card = document.createElement('article');
        card.className = 'card';
        const label = document.createElement('div');
        label.className = 'num';
        label.textContent = poem.guest ? 'Community' : padNumber(poem.number) + ' · ' + categoryOf(poem);
        const title = document.createElement('h3');
        title.textContent = poem.title;
        const preview = document.createElement('p');
        preview.className = 'preview';
        preview.textContent = poem.text;
        const readButton = document.createElement('button');
        readButton.className = 'read';
        readButton.type = 'button';
        readButton.textContent = 'Read poem ↗';
        readButton.onclick = () => openPoem(poem);
        const likeRow = document.createElement('div');
        likeRow.className = 'likerow';
        likeRow.append(makeLikeButton(poem.number));
        if (poem.guest) {
            const gt = document.createElement('h3');
            gt.className = 'guest-title';
            gt.textContent = poem.title;
            const gb = document.createElement('div');
            gb.className = 'guest-by';
            gb.textContent = 'Community · by ' + poem.author;
            card.append(label, gt, gb, preview, readButton, likeRow);
        } else {
            card.append(label, preview, readButton, likeRow);
        }
        card.style.cursor = 'pointer';
        card.onclick = (e) => {
            if (e.target.closest('button')) {
                return;
            }
            openPoem(poem);
        };
        return card;
    }

    function searchMatches(query) {
        const digits = query.replace(/^poem\s*/, '').trim();
        const isNumeric = /^\d+$/.test(digits);
        return poems.filter((poem) => {
            const paddedNumber = padNumber(poem.number);
            return (paddedNumber === digits ||
                String(poem.number) === digits ||
                poem.text.toLowerCase().includes(query) ||
                (poem.title || '').toLowerCase().includes(query) ||
                (poem.guest && (poem.author || '').toLowerCase().includes(query)) ||
                (isNumeric && paddedNumber.includes(digits)));
        });
    }

    let currentView = 'home';
    let currentCategory = null;
    function setActiveLink(key) {
        menuLinks.forEach((link) => link.classList.toggle('active', link.dataset.view === key));
    }

    function showView(view, label, activeKey) {
        currentView = view;
        document.querySelectorAll('.view').forEach((section) => section.classList.remove('active'));
        byId('view-' + view).classList.add('active');
        currentLabel.textContent = label;
        setActiveLink(activeKey);
        window.scrollTo({
            top: 0, behavior: 'smooth'
        });
    }

    function renderSubmit() {
        searchInput.value = '';
        showView('submit', 'Share your poem', 'submit');
    }

    function renderHome() {
        searchInput.value = '';
        showView('home', 'Home', 'home');
    }

    function renderCategory(category) {
        currentCategory = category;
        byId('categoryTitle').textContent = category.name;
        byId('categoryDesc').textContent = category.desc;
        const query = searchInput.value.trim().toLowerCase();
        let list = poems.filter((poem) => categoryOf(poem) === category.name);
        if (query) {
            const matches = searchMatches(query);
            list = list.filter((poem) => matches.includes(poem));
        }
        grid.replaceChildren(...list.map(makeCard));
        byId('count').textContent = `${list.length} poems · numbered 001–${padNumber(poems.reduce((max, poem) => poem.guest ? max : Math.max(max, poem.number), 0))}`;
        showView('category', category.name, category.key);
    }

    function renderSearch() {
        const query = searchInput.value.trim().toLowerCase();
        const list = query ? searchMatches(query) : [];
        byId('searchGrid').replaceChildren(...list.map(makeCard));
        byId('searchCount').textContent = query
            ? `${list.length} matching poems across every category`
            : 'Type a number, title, or word to search the full collection.';
        byId('searchDesc').textContent = query
            ? `Results for “${searchInput.value.trim()}”`
            : 'Search the entire poetry collection.';
        showView('search', 'Search', null);
    }

    function setMenuOpen(isOpen) {
        menu.classList.toggle('open', isOpen);
        menuOverlay.classList.toggle('open', isOpen);
        document.body.classList.toggle('menu-open', isOpen);
        menuToggle.setAttribute('aria-expanded', String(isOpen));
        menuToggle.setAttribute('aria-label', isOpen ? 'Close categories menu' : 'Open categories menu');
        (isOpen ? menuClose : menuToggle).focus();
    }

    menuToggle.addEventListener('click', () => setMenuOpen(!menu.classList.contains('open')));
    menuClose.addEventListener('click', () => setMenuOpen(false));
    menuOverlay.addEventListener('click', () => setMenuOpen(false));
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && menu.classList.contains('open')) {
            setMenuOpen(false);
        }
    });

    menuLinks.forEach((link) => {
        link.addEventListener('click', () => {
            const key = link.dataset.view;
            if (key === 'home') {
                renderHome();
            } else if (key === 'submit') {
                renderSubmit();
            } else {
                renderCategory(categories.find((category) => category.key === key));
            }
            setMenuOpen(false);
        });
    });

    searchInput.addEventListener('input', () => {
        if (searchInput.value.trim()) {
            renderSearch();
        } else if (currentView === 'search') {
            renderHome();
        } else if (currentView === 'category' && currentCategory) {
            renderCategory(currentCategory);
        }
    });

    const closeModal = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (modal.open) {
            modal.close();
        }
    };

    byId('close').addEventListener('click', closeModal);
    byId('close').addEventListener('touchend', closeModal);
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.close();
        }
    });

    const FEATURED_BY_CATEGORY = {
        love: 5, self: 3, healing: 222, family: 230, faith: 114, life: 99, other: 213
    };

    const BEST_POEM = 5;
    function makeFeatureCard(poem, categoryKey, isBest) {
        const card = makeCard(poem);
        const category = categories.find((c) => c.key === categoryKey);
        if (isBest) {
            const badge = document.createElement('div');
            badge.className = 'badge';
            badge.textContent = '★ Pick of the Forest';
            card.prepend(badge);
        }
        const readButton = card.querySelector('.read');
        const actions = document.createElement('div');
        actions.className = 'card-actions';
        const more = document.createElement('button');
        more.type = 'button';
        more.className = 'more';
        more.textContent = 'More in ' + category.name + ' →';
        more.onclick = () => renderCategory(category);
        readButton.replaceWith(actions);
        actions.append(readButton, more);
        return card;
    }

    const poemByNumber = (n) => poems.find((poem) => poem.number === n);
    async function loadPoems() {
        const get = (cols) => fetch(SUPABASE_URL + '/rest/v1/poems_db?select=' + cols + '&order=number.asc&limit=2000', { headers: { apikey: SUPABASE_KEY } });
        let res = await get('number,title,author,text,category,image_url,music_url,guest');
        if (!res.ok) {
            res = await get('number,title,author,text,category,image_url,music_url');
        }
        if (!res.ok) {
            res = await get('number,title,author,text,category');
        }
        if (!res.ok) {
            throw new Error('HTTP ' + res.status);
        }
        return res.json();
    }

    let currentPoem = null;
    let likeCounts = {};
    let myLikes = new Set();
    const deviceId = (() => {
        try {
            let d = localStorage.getItem('fow_device');
            if (!d) {
                d = (crypto.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2) + Date.now());
                localStorage.setItem('fow_device', d);
            }
            return d;
        } catch (e) {
            return 'tmp-' + Math.random().toString(36).slice(2) + Date.now();
        }
    })();
    const sb = (path, opts = {}) => fetch(SUPABASE_URL + '/rest/v1/' + path, {
        ...opts,
        headers: {
            apikey: SUPABASE_KEY, 'Content-Type': 'application/json', ...(opts.headers || {})
        }
    });

    const quiet = (p) => p.catch(() => {
    });

    function logVisit() {
        quiet(sb('visits?on_conflict=day,device_id', {
            method: 'POST', headers: { Prefer: 'resolution=ignore-duplicates,return=minimal' }, body: JSON.stringify({ device_id: deviceId })
        }));
    }

    function logView(n) {
        quiet(sb('poem_views?on_conflict=day,device_id,poem_number', {
            method: 'POST', headers: { Prefer: 'resolution=ignore-duplicates,return=minimal' }, body: JSON.stringify({
                device_id: deviceId, poem_number: n
            })
        }));
    }

    async function loadLikes() {
        try {
            const [c, m] = await Promise.all([
                sb('rpc/like_counts', {
                    method: 'POST', body: '{}'
                }).then((r) => r.json()),
                sb('rpc/my_likes', {
                    method: 'POST', body: JSON.stringify({ d: deviceId })
                }).then((r) => r.json())
            ]);
            likeCounts = {};
            c.forEach((x) => {
                likeCounts[x.poem_number] = Number(x.n);
            });
            myLikes = new Set(m.map((x) => x.poem_number));
        } catch (e) {
        }
    }

    function paintLike(btn) {
        const n = Number(btn.dataset.like);
        const on = myLikes.has(n);
        btn.classList.toggle('on', on);
        btn.querySelector('.h').textContent = on ? '♥' : '♡';
        btn.querySelector('.n').textContent = likeCounts[n] || 0;
    }

    function repaintLikes() {
        document.querySelectorAll('[data-like]').forEach(paintLike);
    }

    function makeLikeButton(n, id) {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'like';
        b.dataset.like = n;
        if (id) {
            b.id = id;
        }
        b.innerHTML = '<span class="h">♡</span><span class="n">0</span>';
        b.onclick = async () => {
            const was = myLikes.has(n);
            if (was) {
                myLikes.delete(n);
                likeCounts[n] = Math.max(0, (likeCounts[n] || 1) - 1);
            } else {
                myLikes.add(n);
                likeCounts[n] = (likeCounts[n] || 0) + 1;
            }
            repaintLikes();
            try {
                const r = await sb('rpc/toggle_like', {
                    method: 'POST', body: JSON.stringify({
                        p: n, d: deviceId
                    })
                });
                if (!r.ok) {
                    throw new Error();
                }
            } catch (e) {
                if (was) {
                    myLikes.add(n);
                    likeCounts[n] = (likeCounts[n] || 0) + 1;
                } else {
                    myLikes.delete(n);
                    likeCounts[n] = Math.max(0, (likeCounts[n] || 1) - 1);
                }
                repaintLikes();
            }
        };
        paintLike(b);
        return b;
    }

    const rpc = (fn, args) => sb('rpc/' + fn, {
        method: 'POST', body: JSON.stringify(args)
    });

    async function loadComments(n) {
        const box = byId('cmList');
        box.textContent = 'Loading...';
        try {
            const r = await rpc('get_comments', {
                p: n, d: deviceId
            });
            if (!r.ok) {
                throw new Error();
            }
            const rows = await r.json();
            if (currentPoem !== n) {
                return;
            }
            byId('cmCount').textContent = rows.length;
            if (!rows.length) {
                box.textContent = 'No comments yet. Be the first.';
                return;
            }
            box.replaceChildren(...rows.map((c) => renderComment(c, n)));
        } catch (e) {
            box.textContent = 'Could not load comments.';
        }
    }

    function renderComment(c, n) {
        const d = document.createElement('div');
        d.className = 'cm' + (c.mine ? ' mine' : '');
        const p = document.createElement('p');
        p.textContent = c.body;
        const t = document.createElement('small');
        t.textContent = new Date(c.created_at).toLocaleDateString() + (c.edited ? ' · edited' : '') + (c.mine ? ' · yours (hold to edit)' : '');
        d.append(p, t);
        if (!c.mine) {
            return d;
        }
        let timer = null;
        const cancel = () => {
            clearTimeout(timer);
            timer = null;
        };
        d.addEventListener('pointerdown', (e) => {
            if (e.target.closest('button, textarea')) {
                return;
            }
            cancel();
            timer = setTimeout(() => showActions(d, c, p, n), 500);
        });
        ['pointerup', 'pointerleave', 'pointercancel', 'pointermove'].forEach((ev) => d.addEventListener(ev, cancel));
        d.addEventListener('contextmenu', (e) => e.preventDefault());
        return d;
    }

    function showActions(d, c, p, n) {
        if (d.querySelector('.cacts')) {
            return;
        }
        const bar = document.createElement('div');
        bar.className = 'cacts';
        const mk = (label, fn) => {
            const b = document.createElement('button');
            b.type = 'button';
            b.textContent = label;
            b.onclick = fn;
            return b;
        };
        bar.append(mk('Edit', () => startEdit(d, c, p, n, bar)), mk('Delete', async () => {
            if (!confirm('Delete your comment?')) {
                return;
            }
            try {
                const r = await rpc('delete_comment', {
                    c: c.id, d: deviceId
                });
                if (!r.ok) {
                    throw new Error();
                }
            } catch (e) {
                alert('Could not delete. Try again.');
                return;
            }
            loadComments(n);
        }), mk('Cancel', () => bar.remove()));
        d.append(bar);
    }

    function startEdit(d, c, p, n, bar) {
        bar.remove();
        const ta = document.createElement('textarea');
        ta.maxLength = 500;
        ta.value = c.body;
        ta.style.cssText = 'width:100%;box-sizing:border-box;margin:6px 0;padding:8px 10px;border-radius:10px;border:1px solid #3a4020;background:transparent;color:inherit;font:13px var(--font-ui);min-height:60px';
        const acts = document.createElement('div');
        acts.className = 'cacts';
        const save = document.createElement('button');
        save.type = 'button';
        save.textContent = 'Save';
        const cancel = document.createElement('button');
        cancel.type = 'button';
        cancel.textContent = 'Cancel';
        cancel.onclick = () => loadComments(n);
        save.onclick = async () => {
            const body = ta.value.trim();
            if (!body) {
                return;
            }
            try {
                const r = await rpc('edit_comment', {
                    c: c.id, d: deviceId, b: body
                });
                if (!r.ok) {
                    throw new Error();
                }
            } catch (e) {
                alert('Could not save. Try again.');
                return;
            }
            loadComments(n);
        };
        acts.append(save, cancel);
        p.replaceWith(ta);
        d.append(acts);
        ta.focus();
    }

    let lastPost = 0;
    byId('cmSend').onclick = async () => {
        const body = byId('cmBody').value.trim();
        const msg = byId('cmMsg');
        if (!body) {
            msg.textContent = 'Write something first.';
            return;
        }
        if (Date.now() - lastPost < 10000) {
            msg.textContent = 'Please wait a few seconds.';
            return;
        }
        lastPost = Date.now();
        msg.textContent = 'Posting...';
        try {
            const r = await rpc('add_comment', {
                p: currentPoem, b: body, d: deviceId
            });
            if (!r.ok) {
                throw new Error();
            }
            byId('cmBody').value = '';
            msg.textContent = 'Posted!';
            loadComments(currentPoem);
        } catch (e) {
            msg.textContent = 'Could not post. Try again.';
        }
    };

    byId('cmBtn').onclick = () => {
        const sh = byId('sheet');
        sh.hidden = !sh.hidden;
    };

    byId('sheetClose').onclick = () => {
        byId('sheet').hidden = true;
    };

    window.addEventListener('resize', fitPoem);

    modal.addEventListener('close', () => {
        modal.classList.remove('tall');
        const body = byId('modalText').parentElement;
        body.style.fontSize = '';
        body.style.lineHeight = '';
        byId('modalText').style.columnCount = '';
        byId('media').querySelectorAll('audio').forEach((a) => a.pause());
        byId('sheet').hidden = true;
    });

    let lastTap = {
        t: 0, x: 0, y: 0
    };

    byId('modalText').parentElement.addEventListener('pointerup', (e) => {
        if (e.target.closest('button, audio, textarea, a')) {
            return;
        }
        const now = Date.now();
        const near = Math.abs(e.clientX - lastTap.x) < 40 && Math.abs(e.clientY - lastTap.y) < 40;
        if (now - lastTap.t < 320 && near) {
            lastTap.t = 0;
            if (!myLikes.has(currentPoem)) {
                byId('mLike').click();
            }
            const h = document.createElement('div');
            h.className = 'burst';
            h.textContent = '♥';
            modal.append(h);
            setTimeout(() => h.remove(), 800);
        } else {
            lastTap = {
                t: now, x: e.clientX, y: e.clientY
            };
        }
    });

    byId('shareLink').onclick = (e) => {
        e.preventDefault();
        renderSubmit();
    };

    async function uploadSubmission(file, isImg) {
        const blob = isImg ? await shrinkImage(file) : file;
        if (blob.size > 8 * 1024 * 1024) {
            throw new Error('File is too big (8 MB max)');
        }
        const ext = isImg ? 'jpg' : (file.name.split('.').pop() || 'mp3').toLowerCase().replace(/[^a-z0-9]/g, '');
        const name = Date.now() + '-' + Math.random().toString(36).slice(2, 10) + '.' + ext;
        const r = await fetch(SUPABASE_URL + '/storage/v1/object/submissions/' + name, {
            method: 'POST', headers: {
                apikey: SUPABASE_KEY, 'Content-Type': blob.type || file.type
            }, body: blob
        });
        if (!r.ok) {
            const j = await r.json().catch(() => ({}));
            throw new Error('Upload failed: ' + (j.message || r.status));
        }
        return SUPABASE_URL + '/storage/v1/object/public/submissions/' + name;
    }

    byId('sSend').onclick = async () => {
        const say = (t, bad) => {
            byId('sMsg').textContent = t;
            byId('sMsg').style.color = bad ? '#e58b8b' : '#cdbf8c';
        };
        const a = byId('sAuthor').value.trim();
        const t = byId('sTitle').value.trim();
        const b = byId('sText').value.trim();
        if (!a || !t || !b) {
            say('Please fill in your name, the title, and the poem.', 1);
            return;
        }
        if (b.length < 10) {
            say('The poem is too short.', 1);
            return;
        }
        if (byId('sSite').value) {
            say('Thank you! Your poem was sent for approval.');
            return;
        }
        byId('sSend').disabled = true;
        say('Sending...');
        try {
            const img = byId('sImg').files[0] ? await uploadSubmission(byId('sImg').files[0], true) : null;
            const mus = byId('sMus').files[0] ? await uploadSubmission(byId('sMus').files[0], false) : null;
            const r = await rpc('submit_poem', {
                t, a, b, img, mus
            });
            if (!r.ok) {
                throw new Error('Could not send (' + r.status + '). Please try again later.');
            }
            ['sAuthor', 'sTitle', 'sText', 'sImg', 'sMus'].forEach((id) => {
                byId(id).value = '';
            });
            say('Thank you! Your poem was sent and will show once it is approved.');
        } catch (e) {
            say(e.message || 'Something went wrong.', 1);
        }
        byId('sSend').disabled = false;
    };

    async function startUp() {
        try {
            poems = await loadPoems();
        } catch (err) {
            byId('spotlight').textContent = 'Could not load the poems right now. Please refresh in a moment.';
            return;
        }
        if (!poems.length) {
            byId('spotlight').textContent = 'No poems yet.';
            return;
        }
        logVisit();
        await loadLikes();
        const best = poemByNumber(BEST_POEM) || poems[0];
        const bestKey = categories.find((c) => c.name === categoryOf(best)).key;
        byId('spotlight').append(makeFeatureCard(best, bestKey, true));
        categories.forEach((category) => {
            const poem = poemByNumber(FEATURED_BY_CATEGORY[category.key]);
            if (poem) {
                featured.append(makeFeatureCard(poem, category.key, false));
            }
        });
    }

    startUp();
}

function startAdminPage() {
    const CATS = [
        ['love', 'Heart', /love|heartbreak|lover|kiss|crush|miss you|goodbye|good-bye|relationship|romance|darling|belong to you|fall for|mahal|pag-ibig|pag ibig|pagmamahal|puso|sinta|iniibig|minahal|nagmahal|paglayo|paalam/i],
        ['self', 'Mirror', /myself|self-love|self love|my worth|who i am|my identity|own heart|choose myself|self-respect|self respect|my dreams|my fear|my mind|sarili|pagkatao|kakayahan|aking sarili/i],
        ['healing', 'Dawn', /healing|heal|grow|growth|letting go|let go|moving on|forgive|forgiveness|peace|stronger|survive|recovery|paghilom|pagbangon|pagsubok|pag-asa|pagasa/i],
        ['family', 'Belonging', /family|mother|father|parents|sister|brother|friend|friendship|best friend|pamilya|ina|ama|magulang|kaibigan|kapatid/i],
        ['faith', 'Grace', /god|jesus|faith|prayer|heaven|lord|church|bless|diyos|panginoon|panalangin|pananalig|biyaya/i],
        ['life', 'Dreams', /life|dream|future|journey|path|purpose|hope|tomorrow|begin again|destination|buhay|pangarap|paglalakbay|kinabukasan|panahon/i],
        ['other', 'Whispers', /.*/]
    ];
    const SESSION_KEY = 'fow_session';
    let token = null;

    const readSession = () => {
        try {
            return JSON.parse(localStorage.getItem(SESSION_KEY));
        } catch (e) {
            return null;
        }
    };

    const saveSession = (data) => {
        token = data.access_token;
        try {
            localStorage.setItem(SESSION_KEY, JSON.stringify({
                access: data.access_token,
                refresh: data.refresh_token,
                exp: data.expires_at || Math.floor(Date.now() / 1000) + (data.expires_in || 3600)
            }));
        } catch (e) {
        }
    };

    const clearSession = () => {
        token = null;
        try {
            localStorage.removeItem(SESSION_KEY);
        } catch (e) {
        }
    };

    async function refreshSession() {
        const saved = readSession();
        if (!saved || !saved.refresh) {
            clearSession();
            return false;
        }
        try {
            const r = await fetch(SUPABASE_URL + '/auth/v1/token?grant_type=refresh_token', {
                method: 'POST',
                headers: {
                    apikey: SUPABASE_ANON_KEY,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ refresh_token: saved.refresh })
            });
            const data = await r.json();
            if (!r.ok) {
                clearSession();
                return false;
            }
            saveSession(data);
            return true;
        } catch (e) {
            return false;
        }
    }

    async function restoreSession() {
        const saved = readSession();
        if (!saved) {
            return;
        }
        if (saved.exp - 60 > Date.now() / 1000) {
            token = saved.access;
            return;
        }
        await refreshSession();
    }

    setInterval(() => {
        if (token) {
            refreshSession();
        }
    }, 30 * 60 * 1000);

    const H = () => ({
        apikey: SUPABASE_ANON_KEY, ...(token ? { Authorization: 'Bearer ' + token } : {}), 'Content-Type': 'application/json'
    });

    const say = (t, bad) => {
        $('msg').textContent = t;
        $('msg').style.color = bad ? '#c33' : 'inherit';
    };

    let touched = false;
    CATS.forEach(([k, n]) => $('cat').add(new Option(n + ' (' + k + ')', k)));
    $('cat').onchange = () => touched = true;
    function suggest() {
        if (touched) {
            return;
        }
        const t = ($('title').value + ' ' + $('text').value);
        const hit = CATS.find(([k, n, re]) => k !== 'other' && re.test(t)) || CATS[CATS.length - 1];
        $('cat').value = hit[0];
        $('hint').textContent = 'Auto category: ' + hit[1] + ' (you can change it)';
    }

    $('title').oninput = $('text').oninput = suggest;
    async function stats() {
        const g = async (p) => {
            try {
                const r = await fetch(SUPABASE_URL + '/rest/v1/' + p, { headers: H() });
                return r.ok ? await r.json() : [];
            } catch (e) {
                return [];
            }
        };
        const [v, pv, cm, po] = await Promise.all([g('visits?select=day&limit=100000'), g('poem_views?select=poem_number&limit=100000'),
            g('poem_comments?select=id,poem_number,name,body,created_at&order=created_at.desc&limit=1000'), g('poems_db?select=number,title&limit=2000')]);
        let lk = [];
        try {
            const r = await fetch(SUPABASE_URL + '/rest/v1/rpc/like_counts', {
                method: 'POST', headers: H(), body: '{}'
            });
            if (r.ok) {
                lk = await r.json();
            }
        } catch (e) {
        }
        $('oHearts').textContent = lk.reduce((a, x) => a + Number(x.n), 0);
        $('oComments').textContent = cm.length;
        $('oPoems').textContent = po.length;
        const title = {};
        po.forEach(p => title[p.number] = p.title);
        const nm = n => (n >= 100000 ? 'Community' : String(n).padStart(3, '0')) + ' · ' + (title[n] || '');
        const today = new Date().toISOString().slice(0, 10);
        const wk = new Date(Date.now() - 6 * 864e5).toISOString().slice(0, 10);
        $('vTotal').textContent = v.length;
        $('vToday').textContent = v.filter(x => x.day === today).length;
        $('vWeek').textContent = v.filter(x => x.day >= wk).length;
        const top = (map, el) => {
            const a = Object.entries(map).sort((x, y) => y[1] - x[1]).slice(0, 5);
            el.replaceChildren();
            if (!a.length) {
                el.textContent = 'Nothing yet.';
                return;
            }
            a.forEach(([n, c]) => {
                const d = document.createElement('div');
                d.className = 'row';
                const s = document.createElement('span');
                s.textContent = nm(n);
                const t = document.createElement('span');
                t.textContent = c;
                d.append(s, t);
                el.append(d);
            });
        };
        const vm = {};
        pv.forEach(x => vm[x.poem_number] = (vm[x.poem_number] || 0) + 1);
        top(vm, $('topViews'));
        const lm = {};
        lk.forEach(x => lm[x.poem_number] = Number(x.n));
        top(lm, $('topLikes'));
        const box = $('cmAdmin');
        box.replaceChildren();
        if (!cm.length) {
            box.textContent = 'No comments yet.';
        }
        cm.forEach(c => {
            const d = document.createElement('div');
            d.className = 'row';
            d.style.alignItems = 'flex-start';
            const s = document.createElement('span');
            s.style.wordBreak = 'break-word';
            s.textContent = nm(c.poem_number) + ' — ' + (c.name || 'Anonymous') + ': ' + c.body;
            const b = document.createElement('button');
            b.className = 's';
            b.textContent = 'Delete';
            b.onclick = async () => {
                if (!confirm('Delete this comment?')) {
                    return;
                }
                await fetch(SUPABASE_URL + '/rest/v1/poem_comments?id=eq.' + c.id, {
                    method: 'DELETE', headers: H()
                });
                stats();
            };
            d.append(s, b);
            box.append(d);
        });
    }

    function show() {
        $('login').hidden = !!token;
        $('app').hidden = !token;
        if (token) {
            load();
            stats();
        }
    }

    $('loginBtn').onclick = async () => {
        const r = await fetch(SUPABASE_URL + '/auth/v1/token?grant_type=password', {
            method: 'POST', headers: {
                apikey: SUPABASE_ANON_KEY, 'Content-Type': 'application/json'
            }, body: JSON.stringify({
                email: $('email').value, password: $('pass').value
            })
        });
        const j = await r.json();
        if (!r.ok) {
            alert(j.error_description || j.msg || 'Login failed');
            return;
        }
        saveSession(j);
        show();
    };

    $('logout').onclick = () => {
        clearSession();
        show();
    };

    let editing = null;
    let ALL = [];
    let shown = 50;
    const pad = n => String(n).padStart(3, '0');
    const TABS = [['stats', 'Stats'], ['write', 'Write'], ['subs', 'Submissions'], ['poems', 'Poems'], ['comments', 'Comments'], ['import', 'Import']];
    TABS.forEach(([k, n]) => {
        const b = document.createElement('button');
        b.textContent = n;
        b.dataset.t = k;
        b.onclick = () => tab(k);
        $('tabs').append(b);
    });

    function tab(n) {
        document.querySelectorAll('section[data-tab]').forEach(x => x.hidden = x.dataset.tab !== n);
        document.querySelectorAll('#tabs button').forEach(b => b.classList.toggle('on', b.dataset.t === n));
        scrollTo(0, 0);
    }

    tab('stats');
    let curImg = null;
    let curMus = null;
    function showMedia() {
        [['imgCur', curImg, 'picture', () => {
                    curImg = null;
                    $('img').value = '';
                    showMedia();
                }], ['musCur', curMus, 'music', () => {
                    curMus = null;
                    $('mus').value = '';
                    showMedia();
                }]].forEach(([id, u, n, rm]) => {
            const el = $(id);
            el.replaceChildren();
            if (!u) {
                return;
            }
            const a = document.createElement('small');
            a.textContent = 'Current ' + n + ' attached ';
            const b = document.createElement('button');
            b.className = 's';
            b.type = 'button';
            b.textContent = 'Remove';
            b.onclick = rm;
            el.append(a, b);
        });
    }

    async function upload(file, isImg) {
        const blob = isImg ? await shrinkImage(file) : file;
        const ext = isImg ? 'jpg' : (file.name.split('.').pop() || 'mp3').toLowerCase().replace(/[^a-z0-9]/g, '');
        const name = Date.now() + '-' + Math.random().toString(36).slice(2, 8) + '.' + ext;
        const r = await fetch(SUPABASE_URL + '/storage/v1/object/poem-media/' + name, {
            method: 'POST', headers: {
                apikey: SUPABASE_ANON_KEY, Authorization: 'Bearer ' + token, 'Content-Type': blob.type || file.type
            }, body: blob
        });
        if (!r.ok) {
            const j = await r.json().catch(() => ({}));
            throw new Error(j.message || 'Upload failed');
        }
        return SUPABASE_URL + '/storage/v1/object/public/poem-media/' + name;
    }

    function resetForm() {
        editing = null;
        curImg = curMus = null;
        $('img').value = $('mus').value = '';
        showMedia();
        $('title').value = $('text').value = '';
        $('author').value = 'Shaina';
        touched = false;
        suggest();
        $('formTitle').textContent = 'New poem';
        $('save').textContent = 'Save poem';
        $('cancelEdit').hidden = true;
        $('msg').textContent = '';
    }

    $('cancelEdit').onclick = () => {
        resetForm();
        tab('poems');
    };

    $('save').onclick = async () => {
        const title = $('title').value.trim();
        const text = $('text').value.trim();
        if (!text) {
            say('Please write the poem.', 1);
            return;
        }
        say('Saving...');
        try {
            if ($('img').files[0]) {
                curImg = await upload($('img').files[0], true);
            }
            if ($('mus').files[0]) {
                curMus = await upload($('mus').files[0], false);
            }
        } catch (e) {
            say('Upload failed: ' + e.message, 1);
            return;
        }
        const body = JSON.stringify({
            title, text, author: $('author').value.trim() || 'Shaina', category: $('cat').value, image_url: curImg, music_url: curMus
        });
        if (editing !== null) {
            const r = await fetch(SUPABASE_URL + '/rest/v1/poems_db?number=eq.' + editing, {
                method: 'PATCH', headers: {
                    ...H(), Prefer: 'return=minimal'
                }, body
            });
            if (!r.ok) {
                say((await r.json()).message || 'Update failed (session expired? log in again)', 1);
                return;
            }
            const n = editing;
            resetForm();
            await load();
            tab('poems');
            alert('Poem #' + pad(n) + ' updated');
            return;
        }
        const r = await fetch(SUPABASE_URL + '/rest/v1/poems_db', {
            method: 'POST', headers: {
                ...H(), Prefer: 'return=representation'
            }, body
        });
        const j = await r.json();
        if (!r.ok) {
            say(j.message || 'Save failed (session expired? log in again)', 1);
            return;
        }
        say('Saved as poem #' + pad(j[0].number) + ' ✓');
        resetForm();
        say('Saved as poem #' + pad(j[0].number) + ' ✓');
        load();
    };

    function startEdit(p) {
        editing = p.number;
        $('title').value = p.title || '';
        $('text').value = p.text;
        $('author').value = p.author || 'Shaina';
        touched = true;
        $('cat').value = p.category || 'other';
        $('hint').textContent = '';
        curImg = p.image_url || null;
        curMus = p.music_url || null;
        $('img').value = $('mus').value = '';
        showMedia();
        $('formTitle').textContent = 'Edit poem #' + pad(p.number);
        $('save').textContent = 'Update poem';
        $('cancelEdit').hidden = false;
        $('msg').textContent = '';
        tab('write');
    }

    function render() {
        const q = $('q').value.trim().toLowerCase().replace(/^#/, '');
        const rows = ALL.filter(p => !q || (p.title || '').toLowerCase().includes(q) || p.text.toLowerCase().includes(q) || String(p.number) === q.replace(/^0+/, '') || pad(p.number).includes(q));
        $('list').replaceChildren();
        rows.slice(0, shown).forEach(p => {
            const d = document.createElement('div');
            d.className = 'row';
            const s = document.createElement('span');
            s.textContent = (p.guest ? '👤 ' : pad(p.number) + ' · ') + (p.title || p.text.split('\n')[0].slice(0, 40)) + (p.guest ? ' — by ' + p.author : '');
            const e = document.createElement('button');
            e.className = 's';
            e.textContent = 'Edit';
            e.onclick = () => startEdit(p);
            const x = document.createElement('button');
            x.className = 's';
            x.textContent = 'Delete';
            x.onclick = async () => {
                if (!confirm('Delete "' + (p.title || pad(p.number)) + '"?')) {
                    return;
                }
                await fetch(SUPABASE_URL + '/rest/v1/poems_db?number=eq.' + p.number, {
                    method: 'DELETE', headers: H()
                });
                load();
            };
            const a = document.createElement('div');
            a.className = 'acts';
            a.append(e, x);
            d.append(s, a);
            $('list').append(d);
        });
        if (!rows.length) {
            $('list').textContent = 'No poems found.';
        }
        $('more').hidden = rows.length <= shown;
    }

    $('q').oninput = () => {
        shown = 50;
        render();
    };

    $('more').onclick = () => {
        shown += 50;
        render();
    };

    let PEND = [];
    function renderSubs() {
        const el = $('subList');
        el.replaceChildren();
        const tb = document.querySelector('#tabs button[data-t="subs"]');
        if (tb) {
            tb.textContent = 'Submissions' + (PEND.length ? ' (' + PEND.length + ')' : '');
        }
        if (!PEND.length) {
            el.textContent = 'Nothing waiting.';
            return;
        }
        PEND.forEach(p => {
            const d = document.createElement('div');
            d.style.cssText = 'border-top:1px solid #3a4020;padding:12px 0';
            const h = document.createElement('div');
            h.style.cssText = 'font:italic 600 20px var(--serif)';
            h.textContent = p.title;
            const by = document.createElement('small');
            by.textContent = 'by ' + p.author;
            const t = document.createElement('div');
            t.style.cssText = 'white-space:pre-wrap;margin:8px 0;max-height:220px;overflow:auto;font:15px/1.5 var(--serif)';
            t.textContent = p.text;
            d.append(h, by, t);
            if (p.image_url) {
                const i = document.createElement('img');
                i.src = p.image_url;
                i.style.cssText = 'max-width:100%;max-height:200px;border-radius:10px;display:block;margin:6px 0';
                d.append(i);
            }
            if (p.music_url) {
                const a = document.createElement('audio');
                a.controls = true;
                a.preload = 'none';
                a.src = p.music_url;
                a.style.cssText = 'width:100%;margin:6px 0';
                d.append(a);
            }
            const acts = document.createElement('div');
            acts.className = 'acts';
            const mk = (n, f) => {
                const b = document.createElement('button');
                b.className = 's';
                b.textContent = n;
                b.onclick = f;
                return b;
            };
            acts.append(mk('Approve', async () => {
                await fetch(SUPABASE_URL + '/rest/v1/poems_db?number=eq.' + p.number, {
                    method: 'PATCH', headers: {
                        ...H(), Prefer: 'return=minimal'
                    }, body: JSON.stringify({ status: 'approved' })
                });
                load();
            }), mk('Edit', () => startEdit(p)), mk('Reject', async () => {
                if (!confirm('Reject and delete "' + p.title + '"?')) {
                    return;
                }
                await fetch(SUPABASE_URL + '/rest/v1/poems_db?number=eq.' + p.number, {
                    method: 'DELETE', headers: H()
                });
                load();
            }));
            d.append(acts);
            el.append(d);
        });
    }

    async function load() {
        let r = await fetch(SUPABASE_URL + '/rest/v1/poems_db?select=number,title,author,text,category,image_url,music_url,guest,status&order=number.desc&limit=2000', { headers: H() });
        if (r.status === 401) {
            if (await refreshSession()) {
                return load();
            }
            clearSession();
            show();
            return;
        }
        if (!r.ok) {
            r = await fetch(SUPABASE_URL + '/rest/v1/poems_db?select=number,title,author,text,category,image_url,music_url&order=number.desc&limit=2000', { headers: H() });
        }
        const rows = await r.json();
        PEND = rows.filter(x => x.status === 'pending').reverse();
        ALL = rows.filter(x => x.status !== 'pending');
        render();
        renderSubs();
    }

    $('imp').onclick = async () => {
        const f = $('file').files[0];
        if (!f) {
            alert('Choose poems.json first');
            return;
        }
        const rows = JSON.parse(await f.text());
        for (let i = 0; i < rows.length; i += 25) {
            const r = await fetch(SUPABASE_URL + '/rest/v1/poems_db?on_conflict=number', {
                method: 'POST', headers: {
                    ...H(), Prefer: 'resolution=ignore-duplicates'
                }, body: JSON.stringify(rows.slice(i, i + 25))
            });
            if (!r.ok) {
                $('impmsg').textContent = 'Failed at ' + i + ': ' + ((await r.json()).message || r.status);
                return;
            }
            $('impmsg').textContent = 'Imported ' + Math.min(i + 25, rows.length) + ' / ' + rows.length;
        }
        load();
    };

    suggest();

    let canRemember = true;
    try {
        localStorage.setItem('fow_test', '1');
        localStorage.removeItem('fow_test');
    } catch (e) {
        canRemember = false;
    }
    $('loginNote').textContent = canRemember
        ? 'You will stay logged in on this device.'
        : 'This browser cannot remember your login (private mode?).';

    restoreSession().then(show);
}

document.addEventListener('DOMContentLoaded', () => {
    if (byId('modal')) {
        startIndexPage();
    } else if (byId('login')) {
        startAdminPage();
    }
});
