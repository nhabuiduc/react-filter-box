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

    buildDefaultObjOrGetOriginal(value:string|Object, type:string): HintInfo{
        if(_.isString(value)){
            return {
                value: this.quote(value),
                type:type
            }
        }

        return {
                value: value,
                type:type
            }
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
                    result= _.map( this.needCategories(), f=> { return this.buildDefaultObjOrGetOriginal(f,"category") });
                }

                if (lastTokenType == "category") {
                    result= _.map( this.needOperators(trace.getLastCategory()), f=> { return this.buildDefaultObjOrGetOriginal(f,"operator") });
                }

                if (lastTokenType == "operator") {
                    result= _.map( this.needValues(trace.getLastCategory(), trace.getLastOperator()), f=> { return this.buildDefaultObjOrGetOriginal(f,"value") });
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