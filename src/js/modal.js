import $ from 'jquery';

$(function() {
  const refs = {
    openModalBtn: $('[data-modal-open]'),
    closeModalBtn: $('[data-modal-close]'),
    modal: $('[data-modal]'),
  };

  if (refs.openModalBtn.length && refs.closeModalBtn.length && refs.modal.length) {
    refs.openModalBtn.on('click', toggleModal);
    refs.closeModalBtn.on('click', toggleModal);

    function toggleModal() {
      refs.modal.toggleClass('is-open');
    }
  }
})

