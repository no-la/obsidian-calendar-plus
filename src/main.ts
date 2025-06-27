import { Notice, Plugin } from "obsidian";
import Handler from "./handler";
import { CalendarPlusSettingsTab, defaultSettings, ISettings } from "./setting";

export default class CalendarPlusPlugin extends Plugin {
	settings: ISettings;
	handler: Handler;

	async onload() {
		await this.loadSettings();

		this.handler = new Handler(this);
		const monthInterval = window.setInterval(() => {
			if (this.handler.addMonthClickListener()) {
				clearInterval(monthInterval);
				new Notice("Calendar Plus: Successfuly set Month button");
			} else {
				new Notice(
					"Calendar Plus: Please enable Calendar plugin or disable Calendar Plus plugin"
				);
			}
		}, 5000);
		this.registerInterval(monthInterval);
		const yearInterval = window.setInterval(() => {
			if (this.handler.addYearClickListener()) {
				clearInterval(yearInterval);
				new Notice("Calendar Plus: Successfuly set Year button");
			} else {
				new Notice(
					"Calendar Plus: Please enable Calendar plugin or disable Calendar Plus plugin"
				);
			}
		}, 5000);
		this.registerInterval(monthInterval);
		this.registerInterval(yearInterval);

		this.addSettingTab(new CalendarPlusSettingsTab(this.app, this));
	}

	onunload() {}

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
