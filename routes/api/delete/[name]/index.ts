import { Handlers } from "$fresh/server.ts";
import {
  configurationRepository,
  fileConfigurationManager,
} from "../../../../data/configurationRepository.ts";
import { toolRepository } from "../../../../data/toolsrepository.ts";
import { TOOL_CONF } from "../../../../env.ts";

export const handler: Handlers = {
  async DELETE(_, ctx) {
    const cfgRepository = configurationRepository(
      toolRepository,
      fileConfigurationManager(TOOL_CONF),
    );
    const { name } = ctx.params;
    await toolRepository.delete(name).catch(() => {
      return new Response("", { status: 404 });
    }).then(() => {
      cfgRepository.update();
    });
    return new Response(JSON.stringify(""), { status: 200 });
  },
};
