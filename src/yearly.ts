import CalendarPlusPlugin from "./main";
import { Periodic } from "./periodic";

export class Yearly extends Periodic {
	constructor(plugin: CalendarPlusPlugin) {
		super(
			plugin,
			plugin.settings.YearFormat,
			plugin.settings.YearlyNoteTemplate,
			plugin.settings.YearlyNoteFolder
		);
	}
}
