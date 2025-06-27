import { App, PluginSettingTab, Setting } from "obsidian";

import { DEFAULT_MONTH_FORMAT, DEFAULT_YEAR_FORMAT } from "./constants";

import type CalendarPlugin from "./main";
import CalendarPlusPlugin from "./main";

export interface ISettings {
	wordsPerDot: number;
	shouldConfirmBeforeCreate: boolean;

	MonthFormat: string;
	MonthlyNoteTemplate: string;
	MonthlyNoteFolder: string;

	YearFormat: string;
	YearlyNoteTemplate: string;
	YearlyNoteFolder: string;
}

export const defaultSettings = Object.freeze({
	shouldConfirmBeforeCreate: true,

	MonthFormat: DEFAULT_MONTH_FORMAT,
	MonthlyNoteFolder: "",
	MonthlyNoteTemplate: "",

	YearFormat: DEFAULT_YEAR_FORMAT,
	YearlyNoteFolder: "",
	YearlyNoteTemplate: "",
});

export class CalendarPlusSettingsTab extends PluginSettingTab {
	private plugin: CalendarPlugin;

	constructor(app: App, plugin: CalendarPlusPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		this.containerEl.empty();

		this.containerEl.createEl("h3", {
			text: "General Settings",
		});
		this.addConfirmCreateSetting();

		this.containerEl.createEl("h3", {
			text: "Monthly Note Settings",
		});
		this.addMonthlyNoteFormatSetting();
		this.addMonthlyNoteTemplateSetting();
		this.addMonthlyNoteFolderSetting();

		this.containerEl.createEl("h3", {
			text: "Yearly Note Settings",
		});
		this.addYearlyNoteFormatSetting();
		this.addYearlyNoteTemplateSetting();
		this.addYearlyNoteFolderSetting();
	}

	addConfirmCreateSetting(): void {
		new Setting(this.containerEl)
			.setName("Confirm before creating new note")
			.setDesc("Show a confirmation modal before creating a new note")
			.addToggle((toggle) => {
				toggle.setValue(this.plugin.settings.shouldConfirmBeforeCreate);
				toggle.onChange(async (value) => {
					this.plugin.writeOptions({
						shouldConfirmBeforeCreate: value,
					});
				});
			});
	}
	addMonthlyNoteFormatSetting(): void {
		new Setting(this.containerEl)
			.setName("Monthly note format")
			.setDesc("For more syntax help, refer to format reference")
			.addText((textfield) => {
				textfield.setValue(this.plugin.settings.MonthFormat);
				textfield.setPlaceholder(DEFAULT_MONTH_FORMAT);
				textfield.onChange(async (value) => {
					this.plugin.writeOptions({
						MonthFormat: value,
					});
				});
			});
	}

	addMonthlyNoteTemplateSetting(): void {
		new Setting(this.containerEl)
			.setName("Monthly note template")
			.setDesc(
				"Choose the file you want to use as the template for your monthly notes (example: MyTemplate.md)"
			)
			.addText((textfield) => {
				textfield.setValue(
					this.plugin.settings.MonthlyNoteTemplate || ""
				);
				textfield.onChange(async (value) => {
					this.plugin.writeOptions({
						MonthlyNoteTemplate: value,
					});
				});
			});
	}

	addMonthlyNoteFolderSetting(): void {
		new Setting(this.containerEl)
			.setName("Monthly note folder")
			.setDesc(
				"New monthly notes will be placed here (You should create the foloder in advance)"
			)
			.addText((textfield) => {
				textfield.setValue(this.plugin.settings.MonthlyNoteFolder);
				textfield.onChange(async (value) => {
					this.plugin.writeOptions({
						MonthlyNoteFolder: value,
					});
				});
			});
	}

	addYearlyNoteFormatSetting(): void {
		new Setting(this.containerEl)
			.setName("Yearly note format")
			.setDesc("For more syntax help, refer to format reference")
			.addText((textfield) => {
				textfield.setValue(this.plugin.settings.YearFormat);
				textfield.setPlaceholder(DEFAULT_YEAR_FORMAT);
				textfield.onChange(async (value) => {
					this.plugin.writeOptions({
						YearFormat: value,
					});
				});
			});
	}

	addYearlyNoteTemplateSetting(): void {
		new Setting(this.containerEl)
			.setName("Yearly note template")
			.setDesc(
				"Choose the file you want to use as the template for your yearly notes (example: MyTemplate.md)"
			)
			.addText((textfield) => {
				textfield.setValue(this.plugin.settings.YearlyNoteTemplate);
				textfield.onChange(async (value) => {
					this.plugin.writeOptions({
						YearlyNoteTemplate: value,
					});
				});
			});
	}

	addYearlyNoteFolderSetting(): void {
		new Setting(this.containerEl)
			.setName("Yearly note folder")
			.setDesc(
				"New yearly notes will be placed here (You should create the foloder in advance)"
			)
			.addText((textfield) => {
				textfield.setValue(this.plugin.settings.YearlyNoteFolder);
				textfield.onChange(async (value) => {
					this.plugin.writeOptions({
						YearlyNoteFolder: value,
					});
				});
			});
	}
}
