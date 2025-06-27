import type { Moment } from "moment";
import { TFile } from "obsidian";
import { createConfirmationDialog } from "./modal";
import CalendarPlusPlugin from "./main";

export class Monthly {
	constructor(private readonly plugin: CalendarPlusPlugin) {}

	async tryToCreateMonthlyNote(
		date: Moment,
		inNewSplit: boolean,
		cb?: (newFile: TFile) => void
	): Promise<void> {
		const filename = date.format(this.plugin.settings.MonthFormat);

		const createFile = async () => {
			const monthlyNote = await this.createMonthlyNote(filename, date);

			console.log("Created monthly note:", monthlyNote);

			const leaf = this.plugin.app.workspace.getLeaf(inNewSplit);
			await leaf.openFile(monthlyNote, { active: true });
			cb?.(monthlyNote);
		};
		if (this.plugin.settings.shouldConfirmBeforeCreate) {
			createConfirmationDialog(
				{
					cta: "Create",
					onAccept: createFile,
					text: `File ${filename} does not exist. Would you like to create it?`,
					title: "New Monthly Note",
				},
				this.plugin.app
			);
		} else {
			await createFile();
		}
	}

	private async createMonthlyNote(
		filename: string,
		date: Moment
	): Promise<TFile> {
		let content = "";
		if (this.plugin.settings.MonthlyNoteTemplate) {
			const templateFile = this.plugin.app.vault.getFileByPath(
				this.plugin.settings.MonthlyNoteTemplate
			);
			if (!templateFile) {
				throw new Error(
					`Template file not found: ${this.plugin.settings.MonthlyNoteTemplate}`
				);
			}
			content = await this.plugin.app.vault.cachedRead(templateFile);
			content = this.replaceNormalDatePlaceholders(content, date);
			content = this.replaceComplexDatePlaceholders(content, date);
		}
		return await this.plugin.app.vault.create(`${filename}.md`, content);
	}

	private replaceNormalDatePlaceholders(
		template: string,
		date: Moment
	): string {
		return template.replace(
			/{{date}}/g,
			date.format(this.plugin.settings.MonthFormat)
		);
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
