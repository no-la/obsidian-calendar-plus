import type { Moment } from "moment";
import { TFile } from "obsidian";
import { createConfirmationDialog } from "./modal";
import CalendarPlusPlugin from "./main";

export class Periodic {
	format: string;
	template: string;
	folder: string;
	type: string;
	constructor(
		private readonly plugin: CalendarPlusPlugin,
		format: string,
		template: string,
		folder: string,
		type = "periodic"
	) {
		this.format = format;
		this.template = template;
		this.folder = folder;
		this.type = type;
	}

	async tryToGetExistingPeriodicNote(date: Moment): Promise<TFile | null> {
		return this.plugin.app.vault.getFileByPath(this.fullPath(date));
	}

	async tryToCreatePeriodicNote(
		date: Moment,
		inNewSplit: boolean,
		cb?: (newFile: TFile) => void
	): Promise<void> {
		const createFile = async () => {
			const periodicNote = await this.createPeriodicNote(date);

			console.log(`Created ${this.type} note:`, periodicNote);

			const leaf = this.plugin.app.workspace.getLeaf(inNewSplit);
			await leaf.openFile(periodicNote, { active: true });
			cb?.(periodicNote);
		};
		if (this.plugin.settings.shouldConfirmBeforeCreate) {
			createConfirmationDialog(
				{
					cta: "Create",
					onAccept: createFile,
					text: `File ${this.fullPath(
						date
					)} does not exist. Would you like to create it?`,
					title: `New ${this.type} Note`,
				},
				this.plugin.app
			);
		} else {
			await createFile();
		}
	}

	private async createPeriodicNote(date: Moment): Promise<TFile> {
		let content = "";
		if (this.template) {
			const templateFile = this.plugin.app.vault.getFileByPath(
				this.template
			);
			if (!templateFile) {
				throw new Error(`Template file not found: ${this.template}`);
			}
			content = await this.plugin.app.vault.cachedRead(templateFile);
			content = this.replaceNormalDatePlaceholders(content, date);
			content = this.replaceComplexDatePlaceholders(content, date);
		}
		return await this.plugin.app.vault.create(this.fullPath(date), content);
	}

	private fullPath(date: Moment): string {
		return this.folder
			? `${this.folder}/${date.format(this.format)}.md`
			: `${date.format(this.format)}.md`;
	}

	private replaceNormalDatePlaceholders(
		template: string,
		date: Moment
	): string {
		return template.replace(/{{date}}/g, date.format(this.format));
	}

	private replaceComplexDatePlaceholders(
		template: string,
		date: Moment
	): string {
		return template.replace(/\{\{date:(.*?)\}\}/g, (_, format) => {
			const escapedFormat = format
				.replace(/\[/g, "\\[")
				.replace(/\]/g, "\\]");

			console.log(
				"Replacing date with format:",
				escapedFormat,
				"for date:",
				date.format(),
				"->",
				date.format(escapedFormat)
			);
			return date.format(escapedFormat);
		});
	}
}
