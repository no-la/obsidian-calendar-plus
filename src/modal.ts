// https://github.com/liamcain/obsidian-calendar-plugin/blob/master/src/ui/modal.ts
import { App, Modal } from "obsidian";

interface IConfirmationDialogParams {
	cta: string;
	// eslint-disable-next-line
	onAccept: (...args: any[]) => Promise<void>;
	text: string;
	title: string;
}

export class ConfirmationModal extends Modal {
	constructor(app: App, config: IConfirmationDialogParams) {
		super(app);

		const { cta, onAccept, text, title } = config;

		this.contentEl.createEl("h2", { text: title });
		this.contentEl.createEl("p", { text });

		this.contentEl.createDiv("modal-button-container", (buttonsEl) => {
			buttonsEl
				.createEl("button", { text: "Never mind" })
				.addEventListener("click", () => this.close());

			buttonsEl
				.createEl("button", {
					cls: "mod-cta",
					text: cta,
				})
				.addEventListener("click", async (e) => {
					await onAccept(e);
					this.close();
				});
		});
	}
}

export const createConfirmationDialog = (
	{ cta, onAccept, text, title }: IConfirmationDialogParams,
	app: App
): void => {
	new ConfirmationModal(app, { cta, onAccept, text, title }).open();
};
