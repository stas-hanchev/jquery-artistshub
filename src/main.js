import './js/menu';
import './js/artist-modal';
import './js/feedback';
import './js/artists-section';
import './js/modal-feedback';
import './js/modal';

import $ from 'jquery';
import axios from 'axios';

import { getReviewsByQuery, handleReviews } from './js/feedback.js';
import { getArtists, renderArtists } from './js/artists-section.js';
import { listenArtistsSection } from './js/artist-modal.js';

import './css/artists-section.css';

axios.defaults.baseURL = 'https://sound-wave.b.goit.study/api';

async function fetchData() {
  const currentPage = 1;
  const limit = 8;

  const artistLoader = $('[data-artists-loader]');
  artistLoader.prop('hidden', false);

  const feedbackLoader = $('[data-feedbacks-loader]');
  feedbackLoader.prop('hidden', false);

  try {
    const artists = await getArtists(currentPage);
    const reviews = await getReviewsByQuery();

    await renderArtists(artists, currentPage, limit);
    listenArtistsSection();
    await handleReviews(reviews.data);
  } catch (error) {
    const message = `Error while executing the request: ${error}`;
    console.error(message);
    alert(`❌${message}`);
  } finally {
    artistLoader.prop('hidden', true);
    feedbackLoader.prop('hidden', true);
  }
}

fetchData();