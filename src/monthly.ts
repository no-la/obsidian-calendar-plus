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
		const format = this.plugin.settings.MonthFormat;
		const filename = date.format(format);

		const createFile = async () => {
			const monthlyNote = await this.createMonthlyNote(filename);

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

	private async createMonthlyNote(filename: string): Promise<TFile> {
		return await this.plugin.app.vault.create(`${filename}.md`, "content");
	}
}
