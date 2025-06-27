import { Notice } from "obsidian";
import { Monthly } from "./monthly";
import moment from "moment";
import CalendarPlusPlugin from "./main";

export default class Handler {
	monthly: Monthly;
	constructor(private readonly plugin: CalendarPlusPlugin) {
		this.monthly = new Monthly(this.plugin);
	}

	async clickMonthHandler(e: MouseEvent): Promise<void> {
		const tarDate = this.getTargetDate();
		if (!tarDate) {
			new Notice(
				'Target date not found.\nPlease check if the "Calendar" plugin is enabled.'
			);
			return;
		}
		await this.monthly.tryToCreatePeriodicNote(moment(tarDate), false);
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
