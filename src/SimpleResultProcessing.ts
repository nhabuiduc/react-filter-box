import * as _ from "lodash";
import BaseResultProcessing from "./BaseResultProcessing";
import { Option } from "./GridDataAutoCompleteHandler"

export default class SimpleResultProcessing extends BaseResultProcessing {
    constructor(protected options?: Option[]) {
        super();
    }

    tryToGetFieldCategory(fieldOrLabel: string) {
        var found = _.find(this.options, f => f.columnText == fieldOrLabel);
        return found ? found.columField : fieldOrLabel;
    }

    filter(row: any, fieldOrLabel: string, operator: string, value: string) {
        var field = this.tryToGetFieldCategory(fieldOrLabel);
        switch (operator) {
            case "==": return row[field] == value;
            case "!=": return row[field] != value;
            case "contains": return row[field].toLowerCase().indexOf(value.toLowerCase()) >= 0;
            case "!contains": return row[field].toLowerCase().indexOf(value.toLowerCase()) < 0;
        }

        return false;
    }
}