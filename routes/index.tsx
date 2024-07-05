export default function Home() {
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
        <ul className="flex flex-col gap-2">
          {new Array(8).fill(true).map((_, i) => (
            <li
              className={`flex gap-4 w-full items-center align-middle ${
                i % 2 === 0 ? "bg-slate-100" : ""
              }`}
            >
              <a className="font-bold bg-red-500 text-white py-1 px-2 rounded-md">
                Delete
              </a>
              <p>cellranger.xml</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
