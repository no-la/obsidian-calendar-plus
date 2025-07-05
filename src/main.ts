import { Notice, Plugin, WorkspaceLeaf } from "obsidian";
import Handler from "./handler";
import { CalendarPlusSettingsTab, defaultSettings, ISettings } from "./setting";
import { VIEW_TYPE_CALENDAR } from "./constants";

export default class CalendarPlusPlugin extends Plugin {
	settings: ISettings;
	handler: Handler;
	currentCalendarView: WorkspaceLeaf;
	isMonthActive = false;
	isYearActive = false;

	async onload() {
		await this.loadSettings();

		this.handler = new Handler(this);

		const fetchCalendarViewInterval = window.setInterval(() => {
			const view = this.getCalendarView();

			if (view === null) {
				new Notice(
					"⚠️Calendar Plus: Please enable Calendar plugin or disable Calendar Plus plugin"
				);
				return;
			}

			if (view !== this.currentCalendarView) {
				this.isMonthActive = false;
				this.isYearActive = false;
				this.currentCalendarView = view;
			}

			if (this.isMonthActive && this.isYearActive) {
				return;
			}

			if (!this.isMonthActive) {
				this.isMonthActive = this.handler.addMonthClickListener();
				if (this.isMonthActive) {
					new Notice("Successfuly add month click listener");
				} else {
					new Notice("Failed to add month click listener");
				}
			}
			if (!this.isYearActive) {
				this.isYearActive = this.handler.addYearClickListener();
				if (this.isMonthActive) {
					new Notice("Successfuly add year click listener");
				} else {
					new Notice("Failed to add year click listener");
				}
			}
		}, 3000);
		this.registerInterval(fetchCalendarViewInterval);

		this.addSettingTab(new CalendarPlusSettingsTab(this.app, this));
	}

	onunload() {}

	getCalendarView(): WorkspaceLeaf | null {
		return (
			this.app.workspace.getLeavesOfType(VIEW_TYPE_CALENDAR).at(0) ?? null
		);
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			defaultSettings,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
	async writeOptions(newOptions: Partial<ISettings>): Promise<void> {
		this.settings = { ...this.settings, ...newOptions };
		await this.saveData(this.settings);
	}
}
