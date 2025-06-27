import type { Moment } from "moment";
import { App, TFile, Vault, Workspace } from "obsidian";
import { ISettings } from "./setting";
import { createConfirmationDialog } from "./modal";

/**
 * Create a Daily Note for a given date.
 */
export const tryToCreateMonthlyNote = async (
	date: Moment,
	inNewSplit: boolean,
	workspace: Workspace,
	vault: Vault,
	settings: ISettings,
	app: App,
	cb?: (newFile: TFile) => void
): Promise<void> => {
	const format = settings.MonthFormat;
	const filename = date.format(format);

	const createFile = async () => {
		const monthlyNote = await vault.create(`${filename}.md`, "content");

		console.log("Created monthly note:", monthlyNote);

		const leaf = workspace.getLeaf(inNewSplit);
		await leaf.openFile(monthlyNote, { active: true });
		cb?.(monthlyNote);
	};
	if (settings.shouldConfirmBeforeCreate) {
		createConfirmationDialog(
			{
				cta: "Create",
				onAccept: createFile,
				text: `File ${filename} does not exist. Would you like to create it?`,
				title: "New Monthly Note",
			},
			app
		);
	} else {
		await createFile();
	}
};
