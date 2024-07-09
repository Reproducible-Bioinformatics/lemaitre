import { type PageProps } from "$fresh/server.ts";
import Navbar from "../components/Navbar.tsx";
import { GIT_REVISION } from "../env.ts";

export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>lemaitre</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body className="flex flex-col">
        <Navbar />
        <Component />
        <footer className="max-w-prose mx-auto w-full px-2 py-2">
          Version: <span className="font-mono">{GIT_REVISION}</span>
        </footer>
      </body>
    </html>
  );
}
