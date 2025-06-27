import { Plugin } from "obsidian";
import Handler from "./handler";
import { CalendarPlusSettingsTab, defaultSettings, ISettings } from "./setting";

export default class CalendarPlusPlugin extends Plugin {
	settings: ISettings;
	handler: Handler;

	async onload() {
		await this.loadSettings();

		this.handler = new Handler(this);
		this.handler.addMonthClickListener();
		// This adds an editor command that can perform some operation on the current editor instance
		// This adds a settings tab so the user can configure various aspects of the plugin
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
