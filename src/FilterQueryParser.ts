var grammar: string = require<string>("raw!./example.pegjs");
import * as PEG from "pegjs";
import * as _ from "lodash";
import BaseAutoCompleteHandler from "./BaseAutoCompleteHandler";
import ParseTrace from "./ParseTrace";
import grammarUtils from "./GrammarUtils";


var parser: ExtendedParser = <ExtendedParser>PEG.buildParser(grammar);

parser.parseTrace = new ParseTrace();

export default class FilterQueryParser {
    autoCompleteHandler = new BaseAutoCompleteHandler();
    lastError: PEG.PegjsError = null;

    constructor() {
    }

    parse(query: string) {
        try {
            parser.parseTrace.clear();
            var result = parser.parse(query);
            this.lastError = null;
        } catch (ex) {
            console.log(ex);
            this.lastError = ex;

        }

        return result;
    }

    getSugessions(query: string) {

        console.log("query:", query)

        query = grammarUtils.stripEndWithNonSeparatorCharacters(query);

        console.log("stripped query:", query)

        try {
            parser.parseTrace.clear();
            var result = parser.parse(query);
            return ["AND", "OR"];
        } catch (ex) {
            return this.autoCompleteHandler.handleParseError(parser, ex);
        }
    }

    setAutoCompleteHandler(autoCompleteHandler: BaseAutoCompleteHandler) {
        this.autoCompleteHandler = autoCompleteHandler;
    }
}

export interface ExtendedParser extends PEG.Parser {
    parseTrace: ParseTrace;
}