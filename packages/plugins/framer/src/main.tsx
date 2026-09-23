import { framer } from "framer-plugin";
import "framer-plugin/framer.css";
import "./ui.css";

/**
 * Branch on the mode before doing anything else.
 *
 * `syncManagedCollection` renders no UI at all, so that path is code-split:
 * a background re-sync never pays to load React.
 */
async function boot(): Promise<void> {
  if (framer.mode === "syncManagedCollection") {
    const { runHeadlessSync } = await import("./headless");
    await runHeadlessSync();
    return;
  }

  const [{ StrictMode }, { createRoot }, { App }] = await Promise.all([
    import("react"),
    import("react-dom/client"),
    import("./App"),
  ]);

  void framer.showUI({ position: "top right", width: 320, height: 500, resizable: false });

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

void boot();
