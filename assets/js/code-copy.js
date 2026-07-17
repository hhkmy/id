import ClipboardJS from "clipboard";

const resetCopyButton = (button, originalText) => {
  window.setTimeout(() => {
    button.textContent = originalText;
    button.classList.remove(
      "border-emerald-500",
      "text-emerald-300",
      "border-red-500",
      "text-red-300",
    );
  }, 1600);
};

const addCopyFeedback = (clipboard) => {
  clipboard.on("success", (event) => {
    const button = event.trigger;
    const originalText = button.textContent.trim();

    button.textContent = "Copied";
    button.classList.add("border-emerald-500", "text-emerald-300");
    event.clearSelection();
    resetCopyButton(button, originalText);
  });

  clipboard.on("error", (event) => {
    const button = event.trigger;
    const originalText = button.textContent.trim();

    button.textContent = "Failed";
    button.classList.add("border-red-500", "text-red-300");
    resetCopyButton(button, originalText);
  });
};

export function initCodeCopy() {
  const codeClipboard = new ClipboardJS(".code-copy-button", {
    text(trigger) {
      return (
        trigger.closest(".code-window")?.querySelector("code")?.textContent ||
        ""
      );
    },
  });
  const paymentClipboard = new ClipboardJS(".payment-copy-button");

  addCopyFeedback(codeClipboard);
  addCopyFeedback(paymentClipboard);
}
