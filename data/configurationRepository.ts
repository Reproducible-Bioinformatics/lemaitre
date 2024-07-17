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

export const configurationRepository = (
	toolRepository: ToolRepository,
): ConfigurationRepository => {
	return {
		update: async () => {
			const xmldoc = await parse_xml("./tool_conf.xml").catch(
				(error) => {
					throw error;
				},
			) as Configuration;

			const toolList = await toolRepository.list();
			const updatedConfig = updateConfiguration(
				toolList,
				xmldoc,
			);
			await Deno.writeTextFile(
				"./tool_conf.xml",
				stringify(updatedConfig),
			);
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
	label?: Label | null;
}

export interface ToolEntry {
	"@file": string;
}

export interface Label {
	id: string;
	text: string;
}

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
