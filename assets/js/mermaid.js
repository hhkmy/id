export const initMermaid = async () => {
  const nodes = document.querySelectorAll(".mermaid");
  if (!nodes.length) {
    return;
  }

  try {
    const { default: mermaid } = await import("mermaid");
    const isDark = document.documentElement.classList.contains("dark");
    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? "dark" : "neutral",
      themeVariables: {
        background: "transparent",
        mainBkg: "transparent",
      },
      securityLevel: "loose",
      fontFamily:
        'Myanmar, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    });
    await mermaid.run({
      nodes: Array.from(nodes),
    });
  } catch (error) {
    console.error("Failed to render Mermaid diagram:", error);
  }
};
