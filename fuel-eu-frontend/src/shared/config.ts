export const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:3000";
// Debug: print the resolved API base at runtime so you can confirm which
// environment value the running dev server is using in the browser console.
try {
	// eslint-disable-next-line no-console
	console.log('[CONFIG] API_BASE =', API_BASE);
} catch (e) {}
export const TARGET_GHG = 89.3368; // gCO₂e/MJ target
