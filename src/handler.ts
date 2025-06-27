import { Notice, Plugin } from "obsidian";

export default class Handler {
	constructor(private readonly plugin: Plugin) {}
	addMonthClickListener() {
		const monthEl = document.querySelector<HTMLElement>(
			"#calendar-container > div > h3 > span.month.svelte-1vwr9dd"
		);
		// const yearEl = document.querySelector(
		// 	"#calendar-container > div > h3 > span.month.svelte-1vwr9dd"
		// );
		if (!monthEl) {
			console.error("Month element not found.");
			return;
		}

		this.plugin.registerDomEvent(monthEl, "click", () => {
			new Notice("Month clicked!");
			const COMMAND_ID = "periodic-notes:open-monthly-note";
			const commands = (this.plugin.app as any).commands;
			const exists = commands
				.listCommands()
				.some((cmd: any) => cmd.id === COMMAND_ID);

			if (!exists) {
				new Notice(`Command with ID "${COMMAND_ID}" does not exist.`);
				return;
			}

			commands.executeCommandById(COMMAND_ID);
		});
	}
}
