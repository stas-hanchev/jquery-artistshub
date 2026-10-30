import '../css/artist-modal.css';

import $ from 'jquery';
import axios from 'axios';
import icons from '../img/icons.svg';

export function listenArtistsSection() {
  const learnBtns = $('.learn-more');
  const loader = $('[data-artist-loader]');

  learnBtns.off('click').on('click', async function () {
    loader.prop('hidden', false);
    const artistId = $(this).attr('data-id');

    try {
      const response = await axios.get(`/artists/${artistId}/albums`);
      const artist = response.data;

      const modalContent = $('.artist-info');
      modalContent.html(renderArtistModal(artist));
      modal.removeClass('hidden-artist-modal');
      $('body').toggleClass('no-scroll');
    } catch (error) {
      const message = `Error while executing the request: ${error}`;
      console.error(message);
      alert(`❌${message}`);
    } finally {
      loader.prop('hidden', true);
    }
  });
}

const modal = $('.artist-modal');
const closeBtn = $('.close-artist-modal');

function closeModal() {
  modal.addClass('hidden-artist-modal');
  $('body').removeClass("no-scroll");
}

closeBtn.on('click', closeModal);

modal.on("click", e => {
  if (e.target === e.currentTarget) {
    closeModal();
  }
});

$(document).on("keydown", e => {
  if (e.key === "Escape" && !modal.hasClass("hidden-artist-modal")) {
    closeModal();
  }
});



function renderArtistModal(artist) {
  return `
    <h2 class="artist-name">${artist.strArtist}</h2>
    <div class="det_info">
      <img src="${artist.strArtistThumb}" class="artist-img" alt="${artist.strArtist}">
      <ul class="artist-details">
        <li>Years active<br>
        ${artist.intFormedYear || '?'} – ${artist.intDiedYear || 'present'}</li>
        <li>Sex<br>
        ${artist.strGender || '?'}</li>
        <li>Members<br>
        ${artist.intMembers || '?'}</li>
        <li>Country<br>
        ${artist.strCountry || '?'}</li>
        <li>Biography<br>
        ${artist.strBiographyEN || 'No info'}</li>
        <li>
          <ul class="artist-modal-genres">
            ${artist.genres?.map(g => `<li>${g}</li>`).join('') || 'No genres'}
          </ul>
        </li>
      </ul>
    </div>
    <div class="album-full">
      <h3 class="alb">Albums</h3>
      <div class="albums-grid">
        ${artist.albumsList?.map(album => `
          <div class="album-modal-card">
            <h4>${album.strAlbum}</h4>
            <div class="track-table">
              <div class="track-header">
                <div>Track</div>
                <div>Time</div>
                <div>Link</div>
              </div>
              <div class="track-body">
                ${album.tracks?.map(track => `
                  <div class="track-row">
                    <div class="track-name">${track.strTrack}</div>
                    <div class="track-time">${(track.intDuration / 60000).toFixed(2) || ''}</div>
                    <div class="track-link">
                      ${track.movie ? `
                        <a href="${track.movie}" target="_blank">
                          <svg width="24px" height="24px" class="youtube-modal">
                            <use xlink:href="${icons}#icon-Youtube"></use>
                          </svg>
                        </a>` : ''}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
