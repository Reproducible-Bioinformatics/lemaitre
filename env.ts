import { resolve } from "$std/path/resolve.ts";

export const TOOL_DIR = resolve(
  Deno.env.get("TOOL_DIR") ||
    "/srv/galaxy/server/tools/custom",
);
