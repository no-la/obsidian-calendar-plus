import CalendarPlusPlugin from "./main";
import { Periodic } from "./periodic";

export class Monthly extends Periodic {
	constructor(plugin: CalendarPlusPlugin) {
		super(
			plugin,
			plugin.settings.MonthFormat,
			plugin.settings.MonthlyNoteTemplate,
			plugin.settings.MonthlyNoteFolder,
			"Monthly"
		);
	}
}
