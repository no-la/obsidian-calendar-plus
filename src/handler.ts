import { Notice, Plugin } from "obsidian";

export default class Handler {
	constructor(private readonly plugin: Plugin) {}

	clickMonthHandler(e: MouseEvent): void {
		if (!(e.target instanceof HTMLElement)) {
			console.error("Event target is not an HTMLElement.");
			return;
		}

		new Notice(`Month clicked! ${e.target.textContent}`);
		const COMMAND_ID = "periodic-notes:open-monthly-note";
		const commands = (this.plugin.app as any).commands;
		const exists = commands
			.listCommands()
			.some((cmd: any) => cmd.id === COMMAND_ID);

		if (!exists) {
			new Notice(
				`Command with ID "${COMMAND_ID}" does not exist.\nPlease check if the "Periodic Notes" plugin is enabled.`
			);
			return;
		}

		commands.executeCommandById(COMMAND_ID);
	}

	addMonthClickListener() {
		const monthEl = document.querySelector<HTMLElement>(
			"#calendar-container > div > h3 > span.month.svelte-1vwr9dd"
		);
		// const yearEl = document.querySelector(
		// 	"#calendar-container > div > h3 > span.month.svelte-1vwr9dd"
		// );
		if (!monthEl) {
			console.error(
				'Month element not found.\nPlease check "Calendar" plugin is enabled.'
			);
			return;
		}

		this.plugin.registerDomEvent(
			monthEl,
			"click",
			this.clickMonthHandler.bind(this)
		);
	}
}
