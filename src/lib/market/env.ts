import "@tanstack/react-start/server-only";

/**
 * Read-only access to server-side environment variables for the market data
 * providers.
 *
 * Why this exists
 * ---------------
 * On local Node (`npm run dev`) and on Node-based Nitro deployments,
 * `process.env` is populated from `.env` files and the OS environment.
 *
 * On Cloudflare Workers / Pages (the production target for this app,
 * configured by `@lovable.dev/vite-tanstack-config` and the Nitro
 * Cloudflare module preset), regular `process.env` does NOT expose the
 * bindings the Cloudflare platform hands to the worker — even with
 * `nodejs_compat` enabled. Instead, those bindings arrive as the second
 * argument of the worker's `fetch(request, env, ctx)` handler and are
 * stashed by Nitro's Cloudflare module handler into two well-known
 * places:
 *
 *   1. `globalThis.__env__` (set by `nitro/.../cloudflare-module.mjs`)
 *   2. `req.runtime.cloudflare.env` (set by `augmentReq`)
 *
 * Because neither of those is reliably accessible from arbitrary module
 * scope (top-level imports run before any request hits), we expose a
 * single `getServerEnv()` helper that:
 *
 *   - tries `globalThis.__env__` (Cloudflare production),
 *   - then `process.env` (local Node dev, anything with Node compat),
 *   - then falls back to the values baked into the bundle by Vite via
 *     `import.meta.env` for the small set of names we explicitly
 *     whitelist (only `VITE_MARKET_PROVIDER` — never the access token).
 *
 * Security
 * --------
 * This module NEVER exports the access token to the browser. The
 * `VITE_MARKET_ACCESS_TOKEN` variable (if it was ever set in the
 * dashboard) is intentionally ignored — only the non-`VITE_` names
 * `MARKET_PROVIDER`, `MARKET_ACCESS_TOKEN` and `UPSTOX_ACCESS_TOKEN`
 * are read here, and they are server-only by construction (Vite will
 * not inline them into the client bundle).
 */

type EnvSource = {
  read(name: string): string | undefined;
};

function fromGlobalThis(): EnvSource {
  return {
    read(name) {
      const env = (globalThis as { __env__?: Record<string, unknown> }).__env__;
      if (!env || typeof env !== "object") return undefined;
      const value = (env as Record<string, unknown>)[name];
      return typeof value === "string" && value.length > 0 ? value : undefined;
    },
  };
}

function fromProcessEnv(): EnvSource {
  return {
    read(name) {
      const proc = (globalThis as { process?: { env?: Record<string, string | undefined> } })
        .process;
      const value = proc?.env?.[name];
      return value && value.length > 0 ? value : undefined;
    },
  };
}

/**
 * Source for the small set of values the client bundle is allowed to know
 * about. The Upstox access token MUST NEVER be added here.
 */
function fromImportMeta(): EnvSource {
  return {
    read(name) {
      if (name === "MARKET_PROVIDER") {
        const value = (import.meta.env as Record<string, unknown>)["VITE_MARKET_PROVIDER"];
        return typeof value === "string" && value.length > 0 ? value : undefined;
      }
      return undefined;
    },
  };
}

/**
 * Order matters: Cloudflare runtime env takes precedence so that any
 * runtime-set secret/override wins over a value baked into the bundle.
 */
const SOURCES: EnvSource[] = [fromGlobalThis(), fromProcessEnv(), fromImportMeta()];

export function getServerEnv(name: string): string | undefined {
  for (const source of SOURCES) {
    const value = source.read(name);
    if (value !== undefined) return value;
  }
  return undefined;
}

/**
 * Convenience: read the first non-empty value among a list of candidate
 * names. Used to keep backward-compatible names (e.g. MARKET_ACCESS_TOKEN
 * vs UPSTOX_ACCESS_TOKEN) without changing provider call sites.
 */
export function getServerEnvAny(...names: string[]): string | undefined {
  for (const name of names) {
    const value = getServerEnv(name);
    if (value !== undefined) return value;
  }
  return undefined;
}

/**
 * True iff at least one server-side env source is present at all. Lets
 * the diagnostic function tell apart "no env at all" from "env present
 * but missing the specific key".
 */
export function hasAnyServerEnv(): boolean {
  return SOURCES.some((source) => {
    for (const probe of [
      "MARKET_PROVIDER",
      "MARKET_ACCESS_TOKEN",
      "UPSTOX_ACCESS_TOKEN",
      "FINNHUB_API_KEY",
    ]) {
      if (source.read(probe) !== undefined) return true;
    }
    return false;
  });
}
