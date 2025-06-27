import type { Moment } from "moment";
import { Notice, TFile, Workspace } from "obsidian";
// import {
// 	createDailyNote,
// 	getDailyNoteSettings,
// } from "obsidian-daily-notes-interface";

// import type { ISettings } from "src/settings";
// import { createConfirmationDialog } from "src/ui/modal";

/**
 * Create a Daily Note for a given date.
 */
export async function tryToCreateMonthlyNote(
	date: Moment,
	inNewSplit: boolean,
	workspace: Workspace,
	// settings: ISettings,
	cb?: (newFile: TFile) => void
): Promise<void> {
	// const { format } = getDailyNoteSettings();
	const format = "YYYY-MM"; // Replace with your desired date format
	const filename = date.format(format);

	const createFile = async () => {
		new Notice(`Creating monthly note: ${filename}`);
		// const monthlyNote = new TFile(); // await createDailyNote(date);
		// monthlyNote.name = filename;
		// const leaf = workspace.getLeaf(inNewSplit);

		// await leaf.openFile(monthlyNote, { active: true });
		// cb?.(monthlyNote);
	};

	// if (settings.shouldConfirmBeforeCreate) {
	// 	createConfirmationDialog({
	// 		cta: "Create",
	// 		onAccept: createFile,
	// 		text: `File ${filename} does not exist. Would you like to create it?`,
	// 		title: "New Daily Note",
	// 	});
	// } else {
	await createFile();
	// }
}

// if (!(e.target instanceof HTMLElement)) {
// 	console.error("Event target is not an HTMLElement.");
// 	return;
// }

// new Notice(`Month clicked! ${e.target.textContent}`);

// const targetDate = this.getTargetDate();
// if (!targetDate) {
// 	new Notice(
// 		'Target date not found.\nPlease check if the "Calendar" plugin is enabled.'
// 	);
// 	return;
// }

// const offset = this.calcMonthOffset(targetDate);
// if (offset < -1 || offset > 1) {
// 	new Notice("You can only click on the current/next/previous month.");
// 	return;
// }
