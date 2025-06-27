import { Notice } from "obsidian";
import { Monthly } from "./monthly";
import moment from "moment";
import CalendarPlusPlugin from "./main";
import { Yearly } from "./yearly";

export default class Handler {
	monthly: Monthly;
	yearly: Yearly;
	constructor(private readonly plugin: CalendarPlusPlugin) {
		this.monthly = new Monthly(this.plugin);
		this.yearly = new Yearly(this.plugin);
	}

	addMonthClickListener() {
		const monthEl = this.getMonthElement();
		if (!monthEl) {
			new Notice(
				'Month element not found.\nPlease check if the "Calendar" plugin is enabled.'
			);
			return;
		}

		monthEl.addClass("calendar-plus-button");
		this.plugin.registerDomEvent(
			monthEl,
			"click",
			this.openOrCreateMonthlyNote.bind(this)
		);
	}

	addYearClickListener() {
		const yearEl = this.getYearElement();
		if (!yearEl) {
			new Notice(
				'Month element not found.\nPlease check if the "Calendar" plugin is enabled.'
			);
			return;
		}

		yearEl.addClass("calendar-plus-button");
		this.plugin.registerDomEvent(
			yearEl,
			"click",
			this.openOrCreateYearlyNote.bind(this)
		);
	}

	async openOrCreateMonthlyNote(e: MouseEvent): Promise<void> {
		const tarDate = this.getTargetDate();
		if (!tarDate) {
			new Notice(
				'Target date not found.\nPlease check if the "Calendar" plugin is enabled.'
			);
			return;
		}
		const tarDateMoment = moment(tarDate);
		const existingNote = await this.monthly.tryToGetExistingPeriodicNote(
			tarDateMoment
		);
		if (existingNote) {
			await this.plugin.app.workspace
				.getLeaf(false)
				.openFile(existingNote, { active: true });
		} else {
			await this.monthly.tryToCreatePeriodicNote(tarDateMoment, false);
		}
	}

	async openOrCreateYearlyNote(e: MouseEvent): Promise<void> {
		const tarDate = this.getTargetDate();
		if (!tarDate) {
			new Notice(
				'Target date not found.\nPlease check if the "Calendar" plugin is enabled.'
			);
			return;
		}
		const tarDateMoment = moment(tarDate);
		const existingNote = await this.yearly.tryToGetExistingPeriodicNote(
			tarDateMoment
		);
		if (existingNote) {
			await this.plugin.app.workspace
				.getLeaf(false)
				.openFile(existingNote, { active: true });
		} else {
			await this.yearly.tryToCreatePeriodicNote(tarDateMoment, false);
		}
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
