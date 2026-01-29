// -------- Loading data -------- //
import researchData from '../data/researchData.json';
import eventsData from '../data/eventsData.json';
import pressData from '../data/pressData.json';

type Research = {
    id: string;
    title: string;
    category: string;
    menuTitle: string;
    dateISO: string;
    thumbnail: string;
    desc: string;
    research: {
        title: string;
        date: string;
        desc: string;
        images: string[];
    }[];
}

type Event = {
    id: string;
    title: string;
    category: string;
    start: string;
    end: string;
    place: string;
    participants: string;
    keyword: string[];
    desc: string;
    photos: string[];
    links: {
        label: string;
        source: string;
        href: string;
    }[];
    time: string;
}

type Press = {
    id: string;
    title: string;
    category: string;
    date: string;
    keyword: string[];
    desc: string;
    summary: string;
    image: string;
    writer: string;
    link_kr: string;
    link_en: string;
    link_others: {
        id: number;
        title: string;
        source: string;
        href: string;
    }[];
}

const research = researchData as Research[];
const events = eventsData as Event[];
const press = pressData as Press[];

const latestResearch = research.slice(0, Math.min(3, research.length));
const latestEvents = events.slice(0, Math.min(5, events.length));
const latestPress = press.slice(0, Math.min(5, press.length));

// function getBasePath() {
//     // /repo/  -> /repo
//     // /repo/index.html -> /repo
//     const p = location.pathname;
//     return p.endsWith("/") ? p.replace(/\/$/, "") : p.replace(/\/[^\/]*$/, "");
// }



// Render recent events list (left section)
function renderRecentList(latestResearch: Research[], latestEvents: Event[]) {
    console.log('renderRecentList called with:', { latestResearch: latestResearch?.length, latestEvents: latestEvents?.length });

    const recentResearchList = document.getElementById('recent-research-list');
    const recentEventsList = document.getElementById('recent-events-list');
    if (!recentResearchList || !recentEventsList) return;

    // Clear
    recentResearchList.innerHTML = '';
    recentEventsList.innerHTML = '';

    // ✅ Research 렌더
    if (!latestResearch || latestResearch.length === 0) {
        recentResearchList.innerHTML = '<p class="text-sm text-slate-500">No recent research</p>';
    } else {
        latestResearch.forEach((item) => {
            const dateStr =
                item.research?.[0]?.date ||
                item.dateISO || "";

            // date 파싱이 안되면 month/day는 —로 표시
            const d = new Date(dateStr);
            const month = isNaN(d.getTime()) ? "—" : d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
            const day = isNaN(d.getTime()) ? "—" : String(d.getDate()).padStart(2, "0");

            const title = item.menuTitle || item.title || "Untitled research";

            const row = document.createElement('div');
            row.className = 'flex items-start gap-3 py-2 border-b border-slate-100 last:border-0 hover:bg-slate-50 rounded px-2 -mx-2 transition-colors cursor-pointer';
            row.innerHTML = `
        <div class="flex flex-col items-center min-w-[50px]">
          <span class="text-xs font-bold text-slate-600">${month}</span>
          <span class="text-lg font-bold text-slate-900">${day}</span>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            <span class="text-xs font-medium text-slate-500">research</span>
          </div>
          <div class="text-sm font-medium text-slate-900 break-words">${title}</div>
        </div>
      `;
            row.addEventListener('click', () => {
                const id = encodeURIComponent(item.id);
                window.location.href = `projects.html?view=research&research=${id}`;
            });
            recentResearchList.appendChild(row);
        });
    }

    // Events 렌더는 네 기존 코드 그대로 유지
    if (!latestEvents || latestEvents.length === 0) {
        recentEventsList.innerHTML = '<p class="text-sm text-slate-500">No recent events</p>';
        return;
    }

    latestEvents.forEach((item) => {
        const date = new Date(item.start);
        const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
        const day = date.getDate();

        let categoryColor = 'bg-slate-500';
        if (item.category === 'presentation') categoryColor = 'bg-green-600';
        else if (item.category === 'conference') categoryColor = 'bg-purple-600';
        else if (item.category === 'workshop') categoryColor = 'bg-orange-600';
        else if (item.category === 'seminar') categoryColor = 'bg-teal-600';
        else if (item.category === 'meeting') categoryColor = 'bg-indigo-600';

        const itemEl = document.createElement('div');
        itemEl.className = 'flex items-start gap-3 py-2 border-b border-slate-100 last:border-0 hover:bg-slate-50 rounded px-2 -mx-2 transition-colors cursor-pointer';
        itemEl.innerHTML = `
      <div class="flex flex-col items-center min-w-[50px]">
        <span class="text-xs font-bold text-slate-600">${month}</span>
        <span class="text-lg font-bold text-slate-900">${day}</span>
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <span class="w-1.5 h-1.5 rounded-full ${categoryColor}"></span>
          <span class="text-xs font-medium text-slate-500">${item.category}</span>
        </div>
        <div class="text-sm font-medium text-slate-900 break-words">${item.title}</div>
      </div>
    `;
        itemEl.addEventListener('click', () => {
            window.location.href = `events-detail.html?id=${encodeURIComponent(item.id)}`;
        });
        recentEventsList.appendChild(itemEl);
    });

    console.log('Finished rendering. Total children:', recentEventsList.children.length);
}

function goToEventDetail(eventId: string) {
    document.body.classList.remove("page-loaded");
    document.body.classList.add("page-transition");

    setTimeout(() => {
        window.location.href = `events-detail.html?id=${encodeURIComponent(eventId)}`;
    }, 300); // CSS transition 시간과 맞춤
}

// Render press slider items dynamically
function renderPressSlider(pressData: Press[]) {
    const pressTrack = document.querySelector('.press-track');
    if (!pressTrack) {
        console.log('Press track not found');
        return;
    }

    if (!Array.isArray(pressData) || pressData.length === 0) {
        console.log('No press data to render');
        return;
    }

    // Clear existing content
    pressTrack.innerHTML = '';

    // Create slides from pressData
    pressData.forEach((item, index) => {
        const isActive = index === 0;
        const slide = document.createElement('div');
        slide.className = `press-item ${isActive ? 'is-active' : ''}`;
        slide.setAttribute('aria-hidden', String(!isActive));
        slide.setAttribute('aria-label', 'UAII press article');

        // Use summary if available, otherwise use desc, otherwise use first 300 chars of desc
        const summary = item.summary || item.desc || '';
        const displaySummary = summary.length > 300 ? summary.substring(0, 300) + '...' : summary;

        // Determine which link to use (prefer link_kr, fallback to first link_others)
        const externalLink = item.link_kr || (item.link_others && item.link_others[0]?.href) || '#';

        slide.innerHTML = `
            <!-- IMAGE → 외부 기사 -->
            <a class="press-media"
               href="${externalLink}"
               target="_blank"
               rel="noopener noreferrer"
               aria-label="Read full article on ${item.writer} (opens in new tab)">
                <img src="${item.image}"
                     alt="${item.title}" />
                <span class="press-overlay-title">
                    ${item.title}
                </span>
                <span class="press-hover-cta">
                    ↗
                </span>
            </a>

            <!-- TEXT → 내부 press.html -->
            <a class="press-body press-card-link"
               href="press-detail.html?id=${item.id}"
               aria-label="View article summary on UAII press page">
                <p class="press-summary">
                    ${displaySummary}
                </p>
                <p class="press-meta">
                    <span class="press-outlet">${item.writer}</span>
                    <span class="press-sep">·</span>
                    <time datetime="${item.date}">${item.date}</time>
                </p>
                <div class="press-cta">
                    <span>View on press page</span>
                    <svg class="press-cta-icon" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M9 5l7 7-7 7"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"></path>
                    </svg>
                </div>
            </a>
        `;

        pressTrack.appendChild(slide);
    });

    console.log('Press slider rendered with', pressData.length, 'items');
}

// Initialize press slider functionality
function initPressSlider() {
    const pressSlider = document.querySelector('.press-slider') as HTMLElement;
    if (!pressSlider) {
        console.log('Press slider not found');
        return;
    }

    const track = pressSlider.querySelector('.press-track') as HTMLElement;
    const slides = Array.from(pressSlider.querySelectorAll('.press-item')) as HTMLElement[];
    const prevButton = document.querySelector('.press-control.prev') as HTMLElement;
    const nextButton = document.querySelector('.press-control.next') as HTMLElement;

    if (!track || slides.length === 0) {
        console.log('Press slider track or slides not found');
        return;
    }

    let current = slides.findIndex((slide) => slide.classList.contains('is-active'));
    if (current === -1) current = 0;

    const showSlide = (index: number, { focus = false } = {}) => {
        slides.forEach((slide: HTMLElement, idx: number) => {
            const isActive = idx === index;
            slide.classList.toggle('is-active', isActive);
            slide.setAttribute('aria-hidden', String(!isActive));
        });

        track.style.transform = `translateX(-${index * 100}%)`;

        if (focus) pressSlider.focus?.();
    };

    const moveTo = (index: number) => {
        current = (index + slides.length) % slides.length;
        showSlide(current);
    };

    const nextMove = () => moveTo(current + 1);
    const prevMove = () => moveTo(current - 1);

    showSlide(current);

    const loopIntervalMs = 5000;
    let loopInterval: number | null = null;

    const startLoop = () => {
        if (slides.length <= 1) return;
        stopLoop();
        loopInterval = setInterval(nextMove, loopIntervalMs);
    };

    const stopLoop = () => {
        if (loopInterval) clearInterval(loopInterval);
        loopInterval = null;
    };

    const resetLoop = () => {
        startLoop();
    };

    startLoop();

    prevButton?.addEventListener('click', () => {
        prevMove();
        resetLoop();
    });

    nextButton?.addEventListener('click', () => {
        nextMove();
        resetLoop();
    });

    pressSlider.addEventListener('mouseenter', stopLoop);
    pressSlider.addEventListener('mouseleave', startLoop);
    pressSlider.addEventListener('focusin', stopLoop);
    pressSlider.addEventListener('focusout', startLoop);

    pressSlider.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevMove();
            resetLoop();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextMove();
            resetLoop();
        }
    });
}

// set current year for footer
// const y = document.getElementById('year') as HTMLElement;
// if (y) y.textContent = new Date().getFullYear().toString();

// mobile menu toggle
// const toggle = document.querySelector('.nav-toggle') as HTMLElement;
// const menu = document.querySelector('.menu') as HTMLElement;
// if (toggle && menu) {
//     toggle.addEventListener('click', () => {
//         const isOpen = menu.style.display === 'block';
//         menu.style.display = isOpen ? 'none' : 'block';
//         toggle.setAttribute('aria-expanded', String(!isOpen));
//     });
// }

function copyEmail(email: string) {
    
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email)
            .then(() => {
                alert('Email copied to clipboard');
            })
            .catch(() => {
                fallbackCopy(email);
            });
    } else {
        fallbackCopy(email);
    }
}

function fallbackCopy(text: string) {
    const textarea = document.createElement('textarea') as HTMLTextAreaElement;
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
        document.execCommand('copy');
        alert('Email copied to clipboard');
    } catch (e) {
        alert('Copy failed');
    }

    document.body.removeChild(textarea);
}

// dropdowns: open ONLY on click (desktop + mobile)
const dropdowns = document.querySelectorAll('.dropdown') as NodeListOf<HTMLElement>;

function closeAll(except: HTMLElement | null = null) {
    dropdowns.forEach(d => {
        if (d !== except) {
            const btn = d.querySelector('.dropbtn') as HTMLElement;
            const panel = d.querySelector('.dropdown-menu') as HTMLElement;
            if (panel) panel.hidden = true;                 // force hidden
            if (btn) btn.setAttribute('aria-expanded', 'false');
        }
    });
}

// ensure all panels start hidden
closeAll();

dropdowns.forEach((d: HTMLElement) => {
    const btn = d.querySelector('.dropbtn') as HTMLElement;
    const panel = d.querySelector('.dropdown-menu') as HTMLElement;
    if (!btn || !panel) return;

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const willOpen = panel.hidden;                    // open if currently hidden
        closeAll(d);                                      // close others
        (panel as HTMLElement).hidden = !willOpen;                         // toggle
        btn.setAttribute('aria-expanded', String(willOpen));
    });
});

// click outside to close
document.addEventListener('click', (e) => {
    const inside = (e.target as HTMLElement).closest('.dropdown') || (e.target as HTMLElement).closest('.menu') || (e.target as HTMLElement).closest('.nav-toggle');
    if (!inside) closeAll();
});

// close on ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAll();
});

const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

// 260128 research update

async function fetchJsonUtf8(url: string) {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed: ${res.status} ${res.statusText}`);
    const buf = await res.arrayBuffer();
    const text = new TextDecoder("utf-8").decode(buf).replace(/^\uFEFF/, "");
    return JSON.parse(text);
}

function getMonthDay(dateStr: string) {
    if (!dateStr) return { month: "—", day: "—" };
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return { month: "—", day: "—" };
    const month = d.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
    const day = String(d.getDate()).padStart(2, "0");
    return { month, day };
}

async function loadResearchDataIndex() {
    const basePath = location.pathname.replace(/\/[^\/]*$/, "");
    const url = `${basePath}/data/researchData.json`;
    const data = await fetchJsonUtf8(url);

    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.researchData)) return data.researchData;
    if (data && data.id) return [data];
    console.log("[Research] fetching:", url);
    return [];
}

function renderIndexResearchRecent(researchList: Research[], limit = 3) {
    const el = document.getElementById("recent-research-list");
    if (!el) return;

    el.innerHTML = "";

    if (!researchList || researchList.length === 0) {
        el.innerHTML = '<p class="text-sm text-slate-500">No recent research</p>';
        return;
    }

    const items = researchList.slice(0, limit) as Research[];

    items.forEach((item: Research) => {
        // ✅ Month/Day를 위한 날짜 소스 우선순위
        const dateStr =
            item.research?.[0]?.date ||      // "~ October 2025"면 파싱 실패 가능
            item.dateISO ||
            "";

        const { month, day } = getMonthDay(dateStr);

        const title = item.menuTitle || item.title || "Untitled research";

        const row = document.createElement("div");
        row.className =
            "flex items-start gap-3 py-2 border-b border-slate-100 last:border-0 hover:bg-slate-50 rounded px-2 -mx-2 transition-colors cursor-pointer";

        row.innerHTML = `
      <div class="flex flex-col items-center min-w-[50px]">
        <span class="text-xs font-bold text-slate-600">${month}</span>
        <span class="text-lg font-bold text-slate-900">${day}</span>
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
          <span class="text-xs font-medium text-slate-500">research</span>
        </div>
        <div class="text-sm font-medium text-slate-900 break-words">${title}</div>
      </div>
    `;

        // ✅ projects.html의 research update로 이동 (id 전달)
        row.addEventListener("click", () => {
            goToEventDetail(item.id);
        });

        el.appendChild(row);
    });
}
(async function initIndexResearchRecent() {
    try {
        const research = await loadResearchDataIndex();
        renderIndexResearchRecent(research, 3);
    } catch (e) {
        console.error("Index research init failed:", e);
    }
})();

// Old press slider initialization - now handled by initPressSlider() after dynamic content is loaded
/*
// press slider (auto-advance)
const pressSlider = document.querySelector('.press-slider');
if (pressSlider) {
    const track = pressSlider.querySelector('.press-track');
    const slides = Array.from(pressSlider.querySelectorAll('.press-item'));
    const prevButton = document.querySelector('.press-control.prev');
    const nextButton = document.querySelector('.press-control.next');

    if (!track || slides.length === 0) {
        
    } else {
        let current = slides.findIndex((slide) => slide.classList.contains('is-active'));
        if (current === -1) current = 0;

        const showSlide = (index, { focus = false } = {}) => {
            slides.forEach((slide, idx) => {
                const isActive = idx === index;
                slide.classList.toggle('is-active', isActive);
                slide.setAttribute('aria-hidden', String(!isActive));
            });

            
            track.style.transform = `translateX(-${index * 100}%)`;

            
            if (focus) pressSlider.focus?.();
        };

        const moveTo = (index) => {
            current = (index + slides.length) % slides.length;
            showSlide(current);
        };

        const nextMove = () => moveTo(current + 1);
        const prevMove = () => moveTo(current - 1);

        
        showSlide(current);

        
        const loopIntervalMs = 5000;
        let loopInterval = null;

        const startLoop = () => {
            if (slides.length <= 1) return;
            stopLoop();
            loopInterval = setInterval(nextMove, loopIntervalMs);
        };

        const stopLoop = () => {
            if (loopInterval) clearInterval(loopInterval);
            loopInterval = null;
        };

        const resetLoop = () => {
            startLoop();
        };

        startLoop();

        
        prevButton?.addEventListener('click', () => {
            prevMove();
            resetLoop();
        });

        nextButton?.addEventListener('click', () => {
            nextMove();
            resetLoop();
        });

        
        pressSlider.addEventListener('mouseenter', stopLoop);
        pressSlider.addEventListener('mouseleave', startLoop);

        
        pressSlider.addEventListener('focusin', stopLoop);
        pressSlider.addEventListener('focusout', startLoop);

        
        pressSlider.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevMove();
                resetLoop();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextMove();
                resetLoop();
            }
        });
    }
}
*/
renderRecentList(latestResearch, latestEvents);
renderPressSlider(latestPress);
initPressSlider();

document.addEventListener('DOMContentLoaded', async () => {
    const btn = document.getElementById('menuBtn');
    const menu = document.getElementById('mobileMenu');

    if (!btn || !menu) return;

    const openMenu = () => {
        btn.setAttribute('aria-expanded', 'true');
        menu.classList.remove('opacity-0');
        menu.classList.add('opacity-100');
        menu.style.maxHeight = menu.scrollHeight + 'px';
    };

    const closeMenu = () => {
        btn.setAttribute('aria-expanded', 'false');
        menu.style.maxHeight = '0px';
        menu.classList.remove('opacity-100');
        menu.classList.add('opacity-0');
    };

    btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        expanded ? closeMenu() : openMenu();
    });

    menu.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => closeMenu());
    });

    window.addEventListener('resize', () => {
        if (window.matchMedia('(min-width: 768px)').matches) {
            closeMenu();
        }
    });

    try {
        const research = await loadResearchDataIndex();
        renderIndexResearchRecent(research, 3);
    } catch (e) {
        console.error("Index research init failed:", e);
    }

    initUpdates();
});