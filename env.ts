import { resolve } from "$std/path/resolve.ts";

export const TOOL_DIR = resolve(
  Deno.env.get("TOOL_DIR") ||
    "/srv/galaxy/server/tools/custom",
);

export const GIT_REVISION = Deno.env.get("DENO_DEPLOYMENT_ID") || "unknown";
