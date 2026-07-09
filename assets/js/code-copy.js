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

export function initCodeCopy() {
  const clipboard = new ClipboardJS(".code-copy-button", {
    text(trigger) {
      return (
        trigger.closest(".code-window")?.querySelector("code")?.textContent ||
        ""
      );
    },
  });

  clipboard.on("success", (event) => {
    const button = event.trigger;
    const originalText = button.textContent;

    button.textContent = "Copied";
    button.classList.add("border-emerald-500", "text-emerald-300");
    event.clearSelection();
    resetCopyButton(button, originalText);
  });

  clipboard.on("error", (event) => {
    const button = event.trigger;
    const originalText = button.textContent;

    button.textContent = "Failed";
    button.classList.add("border-red-500", "text-red-300");
    resetCopyButton(button, originalText);
  });
}
