import Filelist from "../components/Filelist.tsx";
import { Tool, toolRepository } from "../data/toolsrepository.ts";

export default async function Home() {
  const tools: Tool[] = await toolRepository.list();
  return (
    <div className="max-w-prose mx-auto w-full px-2 flex flex-col gap-8">
      <main className="mt-8">
        Lemaître is a web portal to upload tools into your Galaxy installation.
      </main>
      <section className="-mx-2 bg-slate-100 px-2 py-2 border-slate-400 border rounded-lg flex flex-col gap-4">
        <h2 className="text-xl font-bold">
          Upload tool
        </h2>
        <input type="file" />
        <input
          type="button"
          value="Upload"
          className="bg-green-800 font-bold p-2 text-white rounded-md"
        />
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">
          Installed Tools
        </h2>
        <Filelist tools={tools} />
      </section>
    </div>
  );
}