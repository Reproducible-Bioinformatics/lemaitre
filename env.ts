import { resolve } from "$std/path/resolve.ts";

export const TOOL_DIR = resolve(
  Deno.env.get("TOOL_DIR") ||
    "/srv/galaxy/server/tools/custom",
);

export const TOOL_CONF = resolve(
  Deno.env.get("TOOL_CONF") ||
    "/srv/galaxy/server/tools/custom/tool_conf.xml",
);

export const COMMAND_PIPE = Deno.env.get("COMMAND_PIPE") || "";

export const GIT_REVISION = Deno.env.get("DENO_DEPLOYMENT_ID") || "unknown";
