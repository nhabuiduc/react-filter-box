// import * as parser from "./example.pegjs"
// var parser = require("./example.pegjs");
var grammar:string = require<string>( "raw!./example.pegjs");
import * as PEG from "pegjs";
import * as _ from "lodash";
import  BaseAutoCompleteHandler from "./BaseAutoCompleteHandler";
import  ParseTrace from "./ParseTrace";


var parser:ExtendedParser = <ExtendedParser>PEG.buildParser(grammar);

parser.parseTrace = new ParseTrace();

export default class FilterQueryParser {
    autoCompleteHandler = new BaseAutoCompleteHandler();
    lastError:PEG.PegjsError = null;

    constructor() {
    }

    parse(query: string) {
        try {
            parser.parseTrace.clear();
            var result = parser.parse(query);
            this.lastError = null;
        } catch (ex) {
            console.log(ex);
            // console.log(ex.expected);
            this.lastError = ex;
            
        }
        
        return result;
    }
    
    //for auto complete, we want parser to report error which we need the last space
    
    isEmptySpace(c:string){
        return c == " " || c=="\r" || c == "\n" || c == "\t";
    }
    
    stripEndNonSpaceCharacters(text:string){
        if(!text) return text;
        if(this.isEmptySpace(text[text.length - 1])){
            return text;
        }
        
        var index = _.findLastIndex(text.split(""), f=> this.isEmptySpace(f));
        if(index < 0 ) return "";
        return text.substr(0,index) + " ";
    }
    
    getSugessions(query:string){
        if(query == null){
            if(this.lastError == null){
                return ["AND","OR"];
            }
            
             return this.autoCompleteHandler.handleParseError(parser, this.lastError);
        }
        
        console.log("query:", query)
        
        query = this.stripEndNonSpaceCharacters(query);
        
        console.log("stripped query:", query)
        
         try {
            parser.parseTrace.clear();
            var result = parser.parse(query);
            return ["AND","OR"];
        } catch (ex) {
            return this.autoCompleteHandler.handleParseError(parser, ex);
        }
    }
    
    setAutoCompleteHandler(autoCompleteHandler:BaseAutoCompleteHandler){
        this.autoCompleteHandler = autoCompleteHandler;        
    }
}

export interface ExtendedParser extends PEG.Parser {
    parseTrace: ParseTrace;
}