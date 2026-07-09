export function initQrModal() {
  const qrTrigger = document.getElementById("qr-image-trigger");
  const qrModal = document.getElementById("qr-modal");
  let previousFocus = null;

  const openQrModal = () => {
    if (!qrModal) return;

    const modalImage = document.getElementById("qr-modal-image");
    if (modalImage instanceof HTMLImageElement && !modalImage.src) {
      modalImage.src = modalImage.dataset.src || "";
    }
    previousFocus = document.activeElement;
    qrModal.classList.remove("hidden");
    qrModal.classList.add("flex");
    document.body.classList.add("overflow-hidden");
    qrModal.focus({ preventScroll: true });
  };

  const closeQrModal = () => {
    if (!qrModal) return;

    qrModal.classList.add("hidden");
    qrModal.classList.remove("flex");
    document.body.classList.remove("overflow-hidden");
    if (previousFocus instanceof HTMLElement) {
      previousFocus.focus({ preventScroll: true });
    }
    previousFocus = null;
  };

  qrTrigger?.addEventListener("click", (event) => {
    event.preventDefault();
    openQrModal();
  });

  qrModal?.addEventListener("click", (event) => {
    if (event.target === qrModal) closeQrModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !qrModal?.classList.contains("hidden")) {
      closeQrModal();
    }
  });
}
