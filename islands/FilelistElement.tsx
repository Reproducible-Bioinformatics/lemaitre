import { Tool } from "../data/toolsrepository.ts";

export function FilelistElement({ name }: Tool) {
  return (
    <>
      <button
        type="button"
        className="font-bold bg-red-500 text-white py-1 px-2 rounded-md"
        onClick={async () => {
          await fetch(`/api/delete/${name}`, { method: "DELETE" });
          globalThis.location.reload();
        }}
      >
        Delete
      </button>
      <p>{name}</p>
    </>
  );
}
