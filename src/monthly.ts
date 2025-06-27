import type { Moment } from "moment";
import { TFile, Vault, Workspace } from "obsidian";

/**
 * Create a Daily Note for a given date.
 */
export const tryToCreateMonthlyNote = async (
	date: Moment,
	inNewSplit: boolean,
	workspace: Workspace,
	vault: Vault,
	cb?: (newFile: TFile) => void
): Promise<void> => {
	const format = "YYYY-MM"; // Replace with your desired date format
	const filename = date.format(format);

	const createFile = async () => {
		const monthlyNote = await vault.create(`${filename}.md`, "content");

		console.log("Created monthly note:", monthlyNote);

		const leaf = workspace.getLeaf(inNewSplit);
		await leaf.openFile(monthlyNote, { active: true });
		cb?.(monthlyNote);
	};

	await createFile();
};
