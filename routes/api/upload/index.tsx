import { Handlers, PageProps } from "$fresh/server.ts";
import { JSX } from "preact";
import { isXML, toolRepository } from "../../../data/toolsrepository.ts";
import { join } from "$std/path/join.ts";
import { TOOL_CONF, TOOL_DIR } from "../../../env.ts";
import { Head } from "$fresh/runtime.ts";
import {
  configurationRepository,
  fileConfigurationManager,
} from "../../../data/configurationRepository.ts";

export const handler: Handlers = {
  async POST(req, ctx) {
    const cfgRepository = configurationRepository(
      toolRepository,
      fileConfigurationManager(TOOL_CONF),
    );

    const form = await req.formData();
    const file = form.get("tool-file") as File;
    if (!file) {
      return ctx.render({ message: "Try again.", status: Status.ok });
    }
    const name = file.name;
    if (!isXML(name)) {
      return ctx.render({
        message: "The uploaded file is not an xml file.",
        status: Status.warn,
      });
    }
    await Deno.writeTextFile(join(TOOL_DIR, name), await file.text()).then(
      () => {
        cfgRepository.update();
      },
    );
    return ctx.render({ message: `${name} uploaded.`, status: Status.ok });
  },
};

enum Status {
  ok,
  warn,
  err,
}

interface Props {
  message: string | null;
  status: Status | Status.warn;
}

export default function index(props: PageProps<Props>) {
  const message = props.data?.message || "No message set.";
  const StatusIcon: { [key in Status]: JSX.Element } = {
    [Status.ok]: <CheckIcon />,
    [Status.warn]: <WarningIcon />,
    [Status.err]: <XIcon />,
  };
  return (
    <>
      <Head>
        <meta http-equiv="refresh" content="3;url=/" />
      </Head>
      <div className="max-w-prose mx-auto w-full px-2 flex flex-col gap-8 min-h-screen">
        <main className="mt-8">
          {StatusIcon[props.data?.status ?? Status.warn]}
          <p>{message}</p>
        </main>
        <a
          href="/"
          className="bg-green-800 font-bold p-2 text-white rounded-md inline-flex self-end"
        >
          Go Home
        </a>
      </div>
    </>
  );
}

const WarningIcon = () => (
  <div className="text-yellow-500">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
      />
    </svg>
  </div>
);

const CheckIcon = () => (
  <div className="text-green-500">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  </div>
);

const XIcon = () => (
  <div className="text-red-500">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  </div>
);
