import axios from 'axios';
(() => {
  const refs = {
    openModalBtn: document.querySelector("[data-modal-feedback-open]"),
    closeModalBtn: document.querySelector("[data-modal-feedback-close]"),
    modal: document.querySelector("[data-modal-feedback]"),
    form: document.querySelector(".feedback-form"),
  };

  refs.openModalBtn.addEventListener("click", toggleModal);
  refs.closeModalBtn.addEventListener("click", toggleModal);

  // закрытие по backdrop
  refs.modal.addEventListener("click", (e) => {
    if (e.target === refs.modal) closeModal();
  });

  // закрытие по Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !refs.modal.classList.contains("is-hidden")) {
      closeModal();
    }
  });

  function toggleModal() {
    refs.modal.classList.toggle("is-hidden");
    document.body.classList.toggle("no-scroll");
  }

  function closeModal() {
    refs.modal.classList.add("is-hidden");
    document.body.classList.remove("no-scroll");
  }

  // рейтинг
  const stars = document.querySelectorAll(".rating-feedback-modal .star");
  let currentRating = 0;

  stars.forEach((star, index) => {
    star.addEventListener("click", () => {
      currentRating = index + 1;
      stars.forEach((s, i) => {
        s.classList.toggle("active", i < currentRating);
      });
    });
  });

  // отправка формы
  refs.form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = refs.form.elements["name"].value.trim();
  const descr = refs.form.elements["message"].value.trim();
  const rating = currentRating;

  if (name.length < 2 || name.length > 16) {
    alert("Ім’я має бути від 2 до 16 символів.");
    return;
  }
  if (rating < 1 || rating > 5) {
    alert("Оберіть рейтинг від 1 до 5 зірок.");
    return;
  }
  if (descr.length < 10 || descr.length > 512) {
    alert("Повідомлення має бути від 10 до 512 символів.");
    return;
  }

  try {
    const response = await axios.post('/feedbacks', { name, rating, descr });

    closeModal();
    refs.form.reset();
    currentRating = 0;
    stars.forEach((s) => s.classList.remove("active"));

    alert("Дякуємо за відгук!");
  } catch (err) {
    alert("Не вдалося відправити відгук: " + err.message);
  }
});

})();
