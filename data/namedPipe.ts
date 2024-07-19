enum commands {
  restart = "restart",
}

export const namedPipe = () => {
  const ctrl = pipeWriter("./test");
  const send = async (command: commands) => {
    await ctrl.writeToPipe(command);
  };
  return {
    send,
  };
};

const pipeWriter = (pipeFile: string) => {
  const encoder = new TextEncoder();
  const writeToPipe = async (command: string) => {
    const file = await Deno.open(pipeFile, { write: true });
    const writer = file.writable.getWriter();
    await writer.write(encoder.encode(command + "\n"));
    await writer.close();
  };
  return {
    writeToPipe,
  };
};
