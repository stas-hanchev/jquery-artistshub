import $ from 'jquery';
import axios from 'axios';

import { listenArtistsSection } from './artist-modal.js';
import icons from '../img/icons.svg';

export async function getArtists(page = 1, limit = 8) {
  const response = await axios.get('/artists', {
    params: { page, limit },
  });

  return response.data;
}

function createArtistCard(artist) {
  return `
    <li class="artist-card">
      <img
        class="artist-photo"
        src="${artist.strArtistThumb || 'https://via.placeholder.com/150'}"
        alt="${artist.strArtist}"
      />

      <ul class="artist-genres">
        ${artist.genres?.map(genre => `<li>${genre}</li>`).join('') || ''}
      </ul>

      <h3 class="artist-name">${artist.strArtist}</h3>

      <p class="artist-description">
        ${
          artist.strBiographyEN
            ? artist.strBiographyEN.slice(0, 100) + '...'
            : 'No description'
        }
      </p>

      <button class="learn-more" data-id="${artist._id}">
        Learn More
        <svg class="icon-artists-learn-more" width="8" height="24">
          <use xlink:href="${icons}#icon-artist-svg-1"></use>
        </svg>
      </button>
    </li>
  `;
}

export async function renderArtists(data, page, limit) {
  const grid = $('[data-artists-grid]');
  const loadMoreBtn = $('[data-artists-load]');
  const loader = $('[data-artists-loader]');

  loader.prop('hidden', false);
  loadMoreBtn.prop('hidden', true);

  grid.append(data.artists.map(createArtistCard).join(''));

  loader.prop('hidden', true);

  if (page * limit < data.totalArtists) {
    loadMoreBtn.prop('hidden', false);
  }

  loadMoreBtn.off('click').on('click', async () => {
    page++;
    const artists = await getArtists(page);
    await renderArtists(artists, page, limit);
    listenArtistsSection();
  });
}