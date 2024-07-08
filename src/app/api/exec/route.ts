import { NextResponse } from 'next/server';
import { spawn } from 'child_process';

export async function POST(request: Request) {
  try {
    const { command } = await request.json();
    console.log({ command, log: 'command' });
    const childProcess = spawn(command[0], command.slice(1));
    let output = '';

    childProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    childProcess.stderr.on('data', (data) => {
      output += data.toString();
    });

    await new Promise((resolve) => {
      childProcess.on('close', resolve);
    });

    return NextResponse.json({ output }, { status: 200 });
  } catch (error) {
    console.error("Error executing command:", error);
    return NextResponse.json({ error: "Error fetching logs" }, { status: 500 });
  }
}
