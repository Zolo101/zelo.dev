import { cpSync, mkdirSync, rmSync } from "node:fs";
import { join, relative, sep } from "node:path";

// URL prefixes kept in local development but excluded from production builds.
// Remove a prefix here when the section is ready to publish.
export const disabledProductionRoutes = ["/fsplash", "/blog", "/expert", "/more", "/zeal"];

/** @param {string} routePath A path relative to src/routes. */
export function isProductionRoute(routePath) {
    // SvelteKit route groups, such as (wares), are not part of the URL.
    const url =
        "/" +
        routePath
            .split(sep)
            .filter((part) => !/^\(.*\)$/.test(part))
            .join("/");
    return !disabledProductionRoutes.some(
        (prefix) => url === prefix || url.startsWith(prefix + "/")
    );
}

/** @param {string} root Project directory. */
export function prepareProductionRoutes(root) {
    const source = join(root, "src/routes");
    // Keep the same depth as src/routes so relative imports still work.
    const destination = join(root, "src/.production-routes");
    rmSync(destination, { recursive: true, force: true });
    mkdirSync(destination, { recursive: true });
    cpSync(source, destination, {
        recursive: true,
        filter: (path) => isProductionRoute(relative(source, path))
    });
    return destination;
}
