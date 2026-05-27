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

		const tryRegister = () => {
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

			// 同一 leaf でも Svelte が DOM を再生成した場合を検出
			const monthEl = this.handler.getMonthElement();
			if (monthEl && !monthEl.hasClass("calendar-plus-button")) {
				this.isMonthActive = false;
			}
			const yearEl = this.handler.getYearElement();
			if (yearEl && !yearEl.hasClass("calendar-plus-button")) {
				this.isYearActive = false;
			}

			if (this.isMonthActive && this.isYearActive) {
				return;
			}

			if (!this.isMonthActive) {
				this.isMonthActive = this.handler.addMonthClickListener();
			}
			if (!this.isYearActive) {
				this.isYearActive = this.handler.addYearClickListener();
			}
		};

		// ワークスペース切り替え時に即時再登録
		this.registerEvent(
			this.app.workspace.on("layout-change", tryRegister)
		);

		// フォールバック用ポーリング（Calendar の遅延レンダリング対策）
		this.registerInterval(window.setInterval(tryRegister, 3000));

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
