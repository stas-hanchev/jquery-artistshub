import $ from 'jquery';

$(function () {
  const refs = {
    openModalBtn: $('[data-menu-open]'),
    closeModalBtn: $('[data-menu-close]'),
    modal: $('[data-menu]'),
    menuLinks: $('.mobile-nav-style'),
  };

  function toggleModal() {
    refs.modal.toggleClass('is-open');
  }

  refs.openModalBtn.on('click', toggleModal);
  refs.closeModalBtn.on('click', toggleModal);
  refs.menuLinks.on('click', () => {
    refs.modal.removeClass('is-open');
  });
});
