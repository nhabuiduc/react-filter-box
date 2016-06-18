import * as _ from "lodash";
import * as PEG from "pegjs";

import {ExtendedParser} from "./FilterQueryParser";
import {HintInfo} from "./models/ExtendedCodeMirror";

export default class BaseAutoCompleteHandler {
    constructor() {

    }

  

    quote(text:string){
        if( /\s/g.test(text)){
            return `"${text}"`;
        }

        return text;
    }

    handleParseError(parser: ExtendedParser, error: PEG.PegjsError):HintInfo[] {

        var trace = parser.parseTrace;
        return _.flatMap(error.expected, (f: PEG.ExpectedItem) => {
            var result:HintInfo[] = [];
            if (f.type == "literal") {
                result= _.map([f.value],f=> { return { value:f, type:"literal" } });
            }

            if (f.type == "other") {
                var lastTokenType = trace.getLastTokenType() || "value";
                
                if (lastTokenType == "value") {
                    result= _.map( this.needCategories(), f=> { return { value:this.quote(f), type:"category" } });
                }

                if (lastTokenType == "category") {
                    result= _.map( this.needOperators(trace.getLastCategory()), f=> { return { value:this.quote(f), type:"operator" } });
                    // result= this.needOperators(trace.getLastCategory());
                }

                if (lastTokenType == "operator") {
                    result= _.map( this.needValues(trace.getLastCategory(), trace.getLastOperator()), f=> { return { value:this.quote(f), type:"value" } });
                    // result= this.needValues(trace.getLastCategory(), trace.getLastOperator());
                }                                
            }

            return result;
        })
    }

    needCategories(): string[] {
        return []
    }

    needOperators(lastOperator: string): string[] {
        return []
    }

    needValues(lastCategory: string, lastOperator: string): string[] {
        return []
    }

}