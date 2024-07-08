import { Handlers } from "$fresh/server.ts";
import { toolRepository } from "../../../../data/toolsrepository.ts";

export const handler: Handlers = {
	async DELETE(_, ctx) {
		const { name } = ctx.params;
		await toolRepository.delete(name).catch(() => {
			return new Response("", { status: 404 });
		});
		return new Response(JSON.stringify(""), { status: 200 });
	},
};
