
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation');

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }

      form.classList.add('was-validated');
    }, false);
  });
})();


document.addEventListener("DOMContentLoaded", () => {
  const flash = document.querySelector(".flash-message");
  const closeBtn = document.querySelector(".flash-close");

  if (!flash) return;

  const autoHide = setTimeout(() => {
    flash.classList.add("hide");
  }, 2500);

  setTimeout(() => {
    flash.remove();
  }, 3200);

  closeBtn?.addEventListener("click", () => {
    clearTimeout(autoHide);
    flash.classList.add("hide");
    setTimeout(() => flash.remove(), 400);
  });
});
