import { Notice, Plugin } from "obsidian";
import { off } from "process";

export default class Handler {
	constructor(private readonly plugin: Plugin) {}

	clickMonthHandler(e: MouseEvent): void {
		if (!(e.target instanceof HTMLElement)) {
			console.error("Event target is not an HTMLElement.");
			return;
		}

		new Notice(`Month clicked! ${e.target.textContent}`);

		const targetDate = this.getTargetDate();
		if (!targetDate) {
			new Notice(
				'Target date not found.\nPlease check if the "Calendar" plugin is enabled.'
			);
			return;
		}

		const offset = this.calcMonthOffset(targetDate);
		if (offset < -1 || offset > 1) {
			new Notice(
				"You can only click on the current/next/previous month."
			);
			return;
		}
		const COMMAND_ID = [
			"periodic-notes:prev-monthly-note",
			"periodic-notes:open-monthly-note",
			"periodic-notes:next-monthly-note",
		][offset + 1];
		const commands = (this.plugin.app as any).commands;
		const exists = commands
			.listCommands()
			.some((cmd: any) => cmd.id === COMMAND_ID);

		if (!exists) {
			new Notice(
				`Command "${COMMAND_ID}" does not exist.\nPlease check if the "Periodic Notes" plugin is enabled.`
			);
			return;
		}
		commands.executeCommandById(COMMAND_ID);
	}

	addMonthClickListener() {
		const monthEl = this.getMonthElement();
		// const yearEl = document.querySelector(
		// 	"#calendar-container > div > h3 > span.month.svelte-1vwr9dd"
		// );
		if (!monthEl) {
			new Notice(
				'Month element not found.\nPlease check if the "Calendar" plugin is enabled.'
			);
			return;
		}

		this.plugin.registerDomEvent(
			monthEl,
			"click",
			this.clickMonthHandler.bind(this)
		);
	}

	calcMonthOffset(date: Date): number {
		const currentDate = new Date();
		const currentNum =
			currentDate.getFullYear() * 12 + currentDate.getMonth();
		const targetNum = date.getFullYear() * 12 + date.getMonth();
		return targetNum - currentNum;
	}

	calcYearOffset(date: Date): number {
		const currentDate = new Date();
		return date.getFullYear() - currentDate.getFullYear();
	}

	getMonthElement(): HTMLElement | null {
		return document.querySelector(
			"#calendar-container > div > h3 > span.month.svelte-1vwr9dd"
		);
	}

	getYearElement(): HTMLElement | null {
		return document.querySelector(
			"#calendar-container > div > h3 > span.year.svelte-1vwr9dd"
		);
	}

	monthStringToNumber(monthStr: string): number | null {
		const months = [
			"jan",
			"feb",
			"mar",
			"apr",
			"may",
			"jun",
			"jul",
			"aug",
			"sep",
			"oct",
			"nov",
			"dec",
		];
		const index = months.indexOf(monthStr.toLowerCase());
		return index !== -1 ? index : null;
	}

	getTargetDate(): Date | null {
		const monthEl = this.getMonthElement();
		const yearEl = this.getYearElement();

		if (!monthEl || !yearEl) {
			return null;
		}
		const year = parseInt(yearEl.textContent || "", 10);
		const month = this.monthStringToNumber(monthEl.textContent || "");

		if (month === null || isNaN(year)) {
			console.error("Invalid month or year value.");
			return null;
		}

		return new Date(year, month, 1);
	}
}
