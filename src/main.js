import './js/artists-section.js';
import './js/menu';
import './js/artist-modal';
import './js/feedback';
import './js/artists-section';
import './js/modal-feedback';
import './js/modal';
import './js/artist-filtr.js';

import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getReviewsByQuery, handleReviews } from './js/feedback.js';
import { getArtists, renderArtists } from './js/artists-section.js';
import { listenArtistsSection } from './js/artist-modal.js';

import './css/artists-section.css';

axios.defaults.baseURL = 'https://sound-wave.b.goit.study/api';

async function fetchData() {
  const currentPage = 1;
  const limit = 8;

  const artistLoader = document.querySelector('[data-artists-loader]');
  artistLoader.hidden = false;

  const feedbackLoader = document.querySelector('[data-feedbacks-loader]');
  feedbackLoader.hidden = false;

  try {
    const artists = await getArtists(currentPage);
    console.log(`Artists: ${JSON.stringify(artists)}`);
    const reviews = await getReviewsByQuery();
    console.log(`Review: ${JSON.stringify(reviews)}`);

    await renderArtists(artists, currentPage, limit);
    listenArtistsSection();
    await handleReviews(reviews.data);
  } catch (error) {
    const message = `Error while executing the request: ${error}`;
    console.error(message);
    alert(`❌${message}`);
  } finally {
    artistLoader.hidden = true;
    feedbackLoader.hidden = true;
  }
}

fetchData();