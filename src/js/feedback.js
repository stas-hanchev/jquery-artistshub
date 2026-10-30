import $ from 'jquery';
import axios from 'axios';
import iziToast from 'izitoast';
import Swiper from 'swiper';
import Raty from 'raty-js';

import { Navigation, Pagination } from 'swiper/modules';

import 'izitoast/dist/css/iziToast.min.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'css-star-rating/css/star-rating.min.css';
import starSprite from '../img/star-rating.icons.svg?raw';

export async function getReviewsByQuery() {
  const response = await axios.get('/feedbacks', {
    params: { limit: 10, page: 1 },
  });

  return response.data;
}

export async function handleReviews(reviews) {
  const wrapper = $('div.swiper-wrapper');

  const markup = reviews
    .map(
      ({ name, rating, descr }) =>
        `<div class="swiper-slide">
            <div class="feedback-card">
                ${setRating(rating)}
                <p class="review">"${descr}"</p>
                <p class="review-author-name">${name}</p>
            </div>
        </div>`
    )
    .join('');

  wrapper.append(markup);

  createCustomPagination(reviews.length);
  const swiper = new Swiper('.swiper', {
    modules: [Navigation, Pagination],
    direction: 'horizontal',
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      type: 'custom',
      renderCustom: function (swiper, current, total) {
        return renderCustomPagination(current, total);
      },
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    on: {
      slideChange: function () {
        updateCustomPagination(this.realIndex + 1, reviews.length);
      },
    },
  });

  $('.swiper-button-next').on('click', () => swiper.slideNext());
  $('.swiper-button-prev').on('click', () => swiper.slidePrev());
  updateCustomPagination(1, reviews.length);
}

function createCustomPagination(totalSlides) {
  const paginationContainer = $('.swiper-pagination');
  paginationContainer.html(`
    <span class="swiper-pagination-bullet custom-bullet" data-position="first" aria-label="First slide"></span>
    <span class="swiper-pagination-bullet custom-bullet" data-position="middle" aria-label="Middle slides"></span>
    <span class="swiper-pagination-bullet custom-bullet" data-position="last" aria-label="Last slide"></span>
  `);
}

function renderCustomPagination(current, total) {
  return `
    <span class="swiper-pagination-bullet custom-bullet" data-position="first"></span>
    <span class="swiper-pagination-bullet custom-bullet" data-position="middle"></span>
    <span class="swiper-pagination-bullet custom-bullet" data-position="last"></span>
  `;
}

function updateCustomPagination(currentSlide, totalSlides) {
  const bullets = $('.custom-bullet');
  bullets.removeClass('swiper-pagination-bullet-active');
  if (currentSlide === 1) {
    bullets.eq(0).addClass('swiper-pagination-bullet-active');
  } else if (currentSlide === totalSlides) {
    bullets.eq(2).addClass('swiper-pagination-bullet-active');
  } else {
    bullets.eq(1).addClass('swiper-pagination-bullet-active');
  }
}

function setRating(rating) {
  const SPRITE_MOUNT_ID = 'star-rating-sprite';
  if (!$(`#${SPRITE_MOUNT_ID}`).length) {
    const div = $('<div>', {
      id: SPRITE_MOUNT_ID,
      css: {
        position: 'absolute',
        width: 0,
        height: 0,
        overflow: 'hidden',
      },
      html: starSprite,
    });
    $('body').prepend(div);
  }
  const rounded = Math.round(rating);
  const stars = Array.from({ length: 5 }, (_, i) => {
    const filled = i < rounded;
    return `
            <svg class="star ${filled ? 'filled' : 'empty'}" aria-hidden="true" width="20" height="20">
                <use href="#star-filled"></use>
            </svg>`;
  }).join('');

  return `<div class="rating star-svg value-${rounded}" aria-label="Rating ${rounded} out of 5">
        <div class="star-container">${stars}</div>
        </div>`;
}
