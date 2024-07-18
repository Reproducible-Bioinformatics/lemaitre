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
    return await parse_xml(filename).catch(
      (error) => {
        throw error;
      },
    ) as Configuration;
  };

  const write = async (configuration: Configuration) => {
    await Deno.writeTextFile(
      filename,
      stringify(configuration),
    );
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

    if (!configuration.toolbox.section) {
      configuration.toolbox.section = [];
    }

    configuration.toolbox.section = configuration.toolbox.section!.filter((
      item,
    ) => item["@id"] != customSection["@id"]);

    configuration.toolbox.section!.push(customSection);
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
      tool: toolList.map((tool) => {
        return {
          "@file": join(TOOL_DIR, tool.name),
        };
      }) as [ToolEntry],
    };
  }
  return {
    update: async () => {
      const xmldoc = await configurationManager.read();
      const toolList = await toolRepository.list();
      const updatedConfig = updateConfiguration(
        toolList,
        xmldoc,
      );
      await configurationManager.write(updatedConfig);
    },
  };
};

export interface Configuration extends xml_document {
  toolbox: Toolbox;
}

export interface Toolbox {
  monitor: string;
  section?: (SectionEntity)[] | null;
}

async function parse_xml(filename: string): Promise<Configuration> {
  const text_file = await Deno.readTextFile(filename).catch((error) => {
    throw error;
  });
  return parse(text_file) as Configuration;
}

export interface SectionEntity {
  "@id": string;
  "@name": string;
  tool?: ToolEntry[] | null;
}

export interface ToolEntry {
  "@file": string;
}
