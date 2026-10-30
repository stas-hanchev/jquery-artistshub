import $ from 'jquery';
import axios from 'axios';

$(function () {
  const refs = {
    openModalBtn: $('[data-modal-feedback-open]'),
    closeModalBtn: $('[data-modal-feedback-close]'),
    modal: $('[data-modal-feedback]'),
    form: $('.feedback-form'),
  };

  refs.openModalBtn.on('click', toggleModal);
  refs.closeModalBtn.on('click', toggleModal);

  refs.modal.on('click', e => {
    if (e.target === refs.modal[0]) closeModal();
  });

  $(document).on('keydown', e => {
    if (e.key === 'Escape' && !refs.modal.hasClass('is-hidden')) {
      closeModal();
    }
  });

  function toggleModal() {
    refs.modal.toggleClass('is-hidden');
    $('body').toggleClass('no-scroll');
  }

  function closeModal() {
    refs.modal.addClass('is-hidden');
    $('body').removeClass('no-scroll');
  }

  const stars = $('.rating-feedback-modal .star');
  let currentRating = 0;

  stars.on('click', function () {
    currentRating = stars.index(this) + 1;
    stars.each((i, s) => {
      $(s).toggleClass('active', i < currentRating);
    });
  });

  refs.form.on('submit', async e => {
    e.preventDefault();

    const name = refs.form.find('[name="name"]').val().trim();
    const descr = refs.form.find('[name="message"]').val().trim();
    const rating = currentRating;

    if (name.length < 2 || name.length > 16) {
      alert('Ім’я має бути від 2 до 16 символів.');
      return;
    }
    if (rating < 1 || rating > 5) {
      alert('Оберіть рейтинг від 1 до 5 зірок.');
      return;
    }
    if (descr.length < 10 || descr.length > 512) {
      alert('Повідомлення має бути від 10 до 512 символів.');
      return;
    }

    try {
      await axios.post('/feedbacks', { name, rating, descr });

      closeModal();
      refs.form[0].reset();
      currentRating = 0;
      stars.removeClass('active');

      alert('Дякуємо за відгук!');
    } catch (err) {
      alert('Не вдалося відправити відгук: ' + err.message);
    }
  });
});
