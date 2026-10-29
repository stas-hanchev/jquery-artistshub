// // ==================== ДАННЫЕ ====================

// const BASE_URL = 'https://sound-wave.b.goit.study/api/artists';
// let items = [];
// let allItems = [];
// let state = { page: 1, perPage: 8, search: '', genre: '', sort: '' };

// // ==================== DOM ====================

// const searchInput = document.querySelector('#artist-search');
// const searchBtn   = document.querySelector('.filters__search-btn');
// const resetBtn    = document.querySelector('.filters__reset');

// const sortingSelect = document.querySelector('[data-name="sorting"]');
// const sortBtn       = sortingSelect?.querySelector('.filters__select-label');
// const sortMenu      = sortingSelect?.querySelector('.filters__menu');

// const genreSelect = document.querySelector('[data-name="genre"]');
// const genreBtn    = genreSelect?.querySelector('.filters__select-label');
// const genreMenu   = document.querySelector('[data-genres]');

// const artistsGrid  = document.querySelector('[data-artists-grid]');
// const loadMoreBtn  = document.querySelector('[data-artists-load]');

// // ==================== УТИЛИТЫ ====================


// function buildUrl({ page = 1, perPage = 8 } = {}) {
//   const p = new URLSearchParams();
//   p.set('page', Number(page) || 1);
//   p.set('limit', Number(perPage) || 8);
//   return `${BASE_URL}?${p.toString()}`;
// }


// function normalizeArtist(a = {}) {
//   const name = a.name || a.title || a.artistName || a.strArtist || '';

//   const image =
//     a.image ||
//     a.img ||
//     a.photo ||
//     a.picture ||
//     a.avatar ||
//     a.strArtistThumb ||
//     (Array.isArray(a.images) && a.images[0]) ||
//     '';

//   const genresRaw =
//     a.genre ||
//     a.genres ||
//     a.categories ||
//     a.styles ||
//     [];

//   const genresArr = Array.isArray(genresRaw)
//     ? genresRaw
//     : typeof genresRaw === 'string'
//     ? [genresRaw]
//     : [];

//   const genres = genresArr.map(g => String(g).trim()).filter(Boolean);
//   const primaryGenre = genres[0] || '';

//   return { ...a, name, image, genres, primaryGenre };
// }

// // 3) Применение фильтров/сортировки локально
// function applyFilters(list) {
//   let result = list.map(normalizeArtist);

//   if (state.search) {
//     const q = state.search.toLowerCase();
//     result = result.filter(a => a.name?.toLowerCase().includes(q));
//   }

//   if (state.genre) {
//     const g = state.genre.toLowerCase();
//     result = result.filter(a =>
//       (a.genres || []).some(x => String(x).toLowerCase() === g)
//     );
//   }

//   if (state.sort === 'name_asc') {
//     result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
//   } else if (state.sort === 'name_desc') {
//     result.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
//   }

//   return result;
// }


// function renderCard(artist) {
//   const tpl = document.querySelector('#artist-item-tpl');
//   const el  = tpl.content.cloneNode(true);

//   const imgEl   = el.querySelector('.artist-card__img');
//   const nameEl  = el.querySelector('.artist-card__name');
//   const genreEl = el.querySelector('.artist-card__genre');

  
//   const fallbackImg = '/img/no-image.png';
//   imgEl.src = artist.image && artist.image.trim() ? artist.image : fallbackImg;
//   imgEl.alt = artist.name || 'Unknown Artist';


//   nameEl.textContent = artist.name?.trim() || 'Unknown';


//   genreEl.textContent = artist.primaryGenre || artist.genres?.[0] || 'Unknown';

//   return el;
// }


// function renderGrid(list) {
//   artistsGrid.innerHTML = '';
//   list.forEach(a => artistsGrid.appendChild(renderCard(a)));
//   loadMoreBtn.hidden = list.length < state.perPage && state.page === 1;
// }


// function setSelectLabel(selectRoot, text) {
//   const span = selectRoot?.querySelector('.filters__select-label span');
//   if (span) span.textContent = text;
// }


// export function initDropdown(selectRoot) {
//   if (!selectRoot) return;
//   const btn  = selectRoot.querySelector('.filters__select-label');
//   const menu = selectRoot.querySelector('.filters__menu');

//   if (!btn || !menu) return;

//   btn.addEventListener('click', () => {
//     const open = btn.getAttribute('aria-expanded') === 'true';
//     btn.setAttribute('aria-expanded', String(!open));
//     menu.classList.toggle('open', !open);
//   });

//   document.addEventListener('click', e => {
//     if (!selectRoot.contains(e.target)) {
//       btn.setAttribute('aria-expanded', 'false');
//       menu.classList.remove('open');
//     }
//   });
// }

// // ==================== API ====================

// async function fetchArtists(opts = {}) {
//   const url = buildUrl(opts);
//   const res = await fetch(url);
//   if (!res.ok) {
//     const text = await res.text().catch(() => '');
//     throw new Error(`Bad Request ${res.status}: ${text}`);
//   }
//   const data = await res.json();
//   items = Array.isArray(data) ? data : data?.results || data?.artists || [];
//   return items;
// }

// async function fetchGenres() {
//   try {
//     const orderedGenres = [
//       'All Genres',
//       'Rock',
//       'Pop',
//       'Hip-hop',
//       'Jazz',
//       'Classical',
//       'Electronic',
//       'Reggae'
//     ];

//     const html = orderedGenres
//       .map(g => {
//         const value = g === 'All Genres' ? '' : g;
//         return `<li role="option" tabindex="0" data-value="${value}">${g}</li>`;
//       })
//       .join('');

//     genreMenu.innerHTML = html;
//   } catch (e) {
//     console.error('Не удалось получить жанры:', e);
//     genreMenu.innerHTML =
//       `<li role="option" tabindex="0" data-value="">All Genres</li>`;
//   }
// }

// // ==================== ОБНОВЛЕНИЕ UI ====================

// function updateResetBtnState() {
//   resetBtn.disabled = !(state.search || state.genre || state.sort);
// }

// // ==================== ОБРАБОТЧИКИ ====================

// searchBtn.addEventListener('click', () => {
//   state.page = 1;
//   state.search = searchInput.value.trim();
//   renderGrid(applyFilters(allItems));
//   updateResetBtnState();
// });

// sortMenu?.addEventListener('click', e => {
//   const value = e.target?.dataset?.value;
//   if (value === undefined) return;
//   state.sort = value;
//   state.page = 1;

//   setSelectLabel(sortingSelect, e.target.textContent.trim());
//   renderGrid(applyFilters(allItems));
//   updateResetBtnState();

//   sortBtn.setAttribute('aria-expanded', 'false');
//   sortMenu.classList.remove('open');
// });

// genreMenu?.addEventListener('click', e => {
//   const value = e.target?.dataset?.value;
//   if (value === undefined) return;
//   state.genre = value;
//   state.page = 1;

//   setSelectLabel(genreSelect, e.target.textContent.trim());
//   renderGrid(applyFilters(allItems));
//   updateResetBtnState();

//   genreBtn.setAttribute('aria-expanded', 'false');
//   genreMenu.classList.remove('open');
// });

// loadMoreBtn.addEventListener('click', async () => {
//   try {
//     state.page += 1;
//     const next = await fetchArtists(state);
//     allItems.push(...next);
//     renderGrid(applyFilters(allItems));
//   } catch (e) {
//     console.error(e);
//   }
// });

// resetBtn.addEventListener('click', () => {
//   state = { page: 1, perPage: 8, search: '', genre: '', sort: '' };
//   searchInput.value = '';
//   setSelectLabel(sortingSelect, 'Sorting');
//   setSelectLabel(genreSelect, 'Genre');

//   sortBtn?.setAttribute('aria-expanded', 'false');
//   sortMenu?.classList.remove('open');
//   genreBtn?.setAttribute('aria-expanded', 'false');
//   genreMenu?.classList.remove('open');

//   renderGrid(applyFilters(allItems));
//   updateResetBtnState();
// });

// // ==================== ИНИЦИАЛИЗАЦИЯ ====================

// document.addEventListener('DOMContentLoaded', async () => {
//   try {
//     initDropdown(sortingSelect);
//     initDropdown(genreSelect);

//     const first = await fetchArtists(state);
//     allItems = [...first];
//     renderGrid(applyFilters(allItems));

//     await fetchGenres();
//     updateResetBtnState();
//   } catch (e) {
//     console.error(e);
//   }
// });
