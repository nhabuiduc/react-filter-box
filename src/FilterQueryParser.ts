var grammar: string = require<string>("raw!./grammar.pegjs");
import * as PEG from "pegjs";
import * as _ from "lodash";
import BaseAutoCompleteHandler from "./BaseAutoCompleteHandler";
import ParseTrace from "./ParseTrace";
import grammarUtils from "./GrammarUtils";


export default class FilterQueryParser {
    autoCompleteHandler = new BaseAutoCompleteHandler();
    lastError: PEG.PegjsError = null;
     parser: ExtendedParser = <ExtendedParser>PEG.buildParser(grammar);

    constructor() {
        this.parser.parseTrace = new ParseTrace();
    }

    parse(query: string) {
        try {
            this.parser.parseTrace.clear();
            return this.parser.parse(query);
            // this.lastError = null;
        } catch (ex) {
            console.log(ex);
            ex.isError = true;
            return ex;            
        }
    }

    getSugessions(query: string) {

        // console.log("query:", query)

        query = grammarUtils.stripEndWithNonSeparatorCharacters(query);

        // console.log("stripped query:", query)

        try {
            this.parser.parseTrace.clear();
            var result = this.parser.parse(query);
            if(!query || grammarUtils.isLastCharacterWhiteSpace(query)){
                return ["AND", "OR"];
            }

            return [];
            
        } catch (ex) {
            console.log("sugession:",ex);
            return this.autoCompleteHandler.handleParseError(this.parser, ex);
        }
    }

    setAutoCompleteHandler(autoCompleteHandler: BaseAutoCompleteHandler) {
        this.autoCompleteHandler = autoCompleteHandler;
    }
}

export interface ExtendedParser extends PEG.Parser {
    parseTrace: ParseTrace;
}