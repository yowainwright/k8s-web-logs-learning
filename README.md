# K9s Web Logs Learning

This is a project to learn how to stream kubernetes logs to a web page. It works. Try it out!

---

## Try it out

- Copy `.env.example` as `.env.local` and follow the text instructions.
- Then, run \*`n i auto` and `pnpm i`.
- Finally, run `tilt up` to start the server.

> [!NOTE]
> *These commands assume you have `n` (or `nvm`) for node, `pnpm` for package management, and `kind` and `tilt` for Kubernetes installed.<br>
> _Run `brew install n kind tilt ctlptrl` and `npm install pnpm -g` if not._

---

## About

This project is a learning project to understand/learn/explain how to stream logs from a Kubernetes cluster to a web page.

The project uses a simple [Next.js](https://nextjs.org/) app, [ShadCn](https://ui.shadcn.com/), and [Xterm.js](https://xtermjs.org/) to create a terminal-like experience in the browser.
