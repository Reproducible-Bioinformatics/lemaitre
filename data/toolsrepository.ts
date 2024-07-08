import { join } from "$std/path/join.ts";
import { TOOL_DIR } from "../env.ts";

interface ToolRepository {
  list: () => Promise<Tool[]>;
  delete: (filename: string) => Promise<void>;
}

export const toolRepository: ToolRepository = {
  list: async (): Promise<Tool[]> => {
    return await readDirectory(TOOL_DIR);
  },
  delete: function (filename: string): Promise<void> {
    if (!isXML(filename)) {
      throw "Not xml";
    }
    const toolPath = join(TOOL_DIR, filename);
    return Deno.remove(toolPath);
  },
};

async function readDirectory(directory: string): Promise<Tool[]> {
  const tools: Tool[] = [];
  for await (const dirEntry of Deno.readDir(directory)) {
    if (
      dirEntry.isFile && isXML(dirEntry.name)
    ) {
      tools.push({ name: dirEntry.name });
    }
  }
  return tools;
}

function isXML(filename: string): boolean {
  return filename.split(".").pop()!.toLowerCase() == "xml";
}

export interface Tool {
  name: string;
}