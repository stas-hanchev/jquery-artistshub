import '../css/artist-modal.css';
import axios from 'axios';
import icons from '../img/icons.svg';

export async function listenArtistsSection() {
  const learnBtns = document.querySelectorAll('.learn-more');
  const loader = document.querySelector('[data-artist-loader]');

  learnBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      loader.hidden = false;
      const artistId = btn.dataset.id;

      try {
        const response = await axios.get(`/artists/${artistId}/albums`);
        const artist = response.data;

        const modal = document.querySelector('.artist-modal');
        const modalContent = document.querySelector('.artist-info');
        modalContent.innerHTML = renderArtistModal(artist);
        modal.classList.remove('hidden-artist-modal');
        document.body.classList.toggle("no-scroll");
      } catch (error) {
        const message = `Error while executing the request: ${error}`; 
        console.error(message);
        alert(`❌${message}`)
      } finally {
        loader.hidden = true;
      }
    });
  });
}


const modal = document.querySelector('.artist-modal');
const closeBtn = document.querySelector('.close-artist-modal');

function closeModal() {
  modal.classList.add('hidden-artist-modal');
  document.body.classList.remove("no-scroll");
}

closeBtn.addEventListener('click', closeModal);

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.classList.contains("hidden-artist-modal")) {
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
