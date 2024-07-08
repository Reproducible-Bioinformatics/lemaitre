import { Tool } from "../data/toolsrepository.ts";
import { TOOL_DIR } from "../env.ts";
import { FilelistElement } from "../islands/FilelistElement.tsx";

interface FileListProps {
  tools: Tool[];
}

export default function Filelist(props: FileListProps) {
  if (props.tools.length == 0) {
    return <p>There are no installed tools in {TOOL_DIR}</p>;
  }
  return (
    <>
      <p>{TOOL_DIR}</p>
      <ul className="flex flex-col gap-2">
        {props.tools.map((e, i) => (
          <li
            className={`flex gap-4 w-full items-center align-middle ${
              i % 2 === 0 ? "bg-slate-100" : ""
            }`}
          >
            <FilelistElement name={e.name} />
          </li>
        ))}
      </ul>
    </>
  );
}
