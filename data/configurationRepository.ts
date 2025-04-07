import {
  parse,
  stringify,
  xml_document,
} from "https://deno.land/x/xml@5.4.12/mod.ts";
import { Tool, ToolRepository } from "./toolsrepository.ts";
import { TOOL_DIR } from "../env.ts";
import { join } from "$std/path/join.ts";

interface ConfigurationRepository {
  update: () => Promise<void>;
}

interface ConfigurationManager {
  read: () => Promise<Configuration>;
  write: (_: Configuration) => Promise<void>;
}

export const fileConfigurationManager = (
  filename: string,
): ConfigurationManager => {
  const read = async (): Promise<Configuration> => {
    return await parse_xml(filename);
  };

  const write = async (configuration: Configuration) => {
    const xmlString = stringify(configuration);
    if (!xmlString || typeof xmlString !== "string") {
      throw new Error("Failed to stringify XML configuration.");
    }
    await Deno.writeTextFile(filename, xmlString);
  };

  return {
    read,
    write,
  };
};

export const configurationRepository = (
  toolRepository: ToolRepository,
  configurationManager: ConfigurationManager,
): ConfigurationRepository => {
  function updateConfiguration(
    toolList: Tool[],
    configuration: Configuration,
  ): Configuration {
    const customSection: SectionEntity = generateSection(toolList);

    configuration.toolbox.monitor = "true";

    if (!Array.isArray(configuration.toolbox.section)) {
      configuration.toolbox.section = [];
    }

    configuration.toolbox.section = (
      configuration.toolbox.section ?? []
    ).filter((item) => item["@id"] !== customSection["@id"]);

    configuration.toolbox.section.push(customSection);
    return configuration;
  }

  function generateSection(
    toolList: Tool[],
    id: string = "customsection",
    name: string = "Custom Section",
  ): SectionEntity {
    return {
      "@id": id,
      "@name": name,
      tool:
        toolList.length > 0
          ? toolList.map((tool) => ({
              "@file": join(TOOL_DIR, tool.name),
            }))
          : undefined,
    };
  }

  return {
    update: async () => {
      const xmldoc = await configurationManager.read();
      const toolList = await toolRepository.list();
      const updatedConfig = updateConfiguration(toolList, xmldoc);
      await configurationManager.write(updatedConfig);
    },
  };
};

export interface Configuration extends xml_document {
  toolbox: Toolbox;
}

export interface Toolbox {
  monitor: string;
  section?: SectionEntity[] | null;
}

async function parse_xml(filename: string): Promise<Configuration> {
  try {
    const text_file = await Deno.readTextFile(filename);
    return parse(text_file) as Configuration;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      console.warn(
        `Configuration file not found: ${filename}. Creating a new one.`,
      );
      return { toolbox: {} } as Configuration;
    }
    throw error;
  }
}

export interface SectionEntity {
  "@id": string;
  "@name": string;
  tool?: ToolEntry[] | null;
}

export interface ToolEntry {
  "@file": string;
}
