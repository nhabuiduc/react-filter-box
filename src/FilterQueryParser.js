import parser from "./example.pegjs"
import _ from "lodash";
import BaseAutoCompleteHandler from "./BaseAutoCompleteHandler";
import ParseTrace from "./ParseTrace";

parser.parseTrace = new ParseTrace();

export default class FilterQueryParser {
    constructor() {
        this.autoCompleteHandler = new BaseAutoCompleteHandler();
        this.lastError=null;
    }

    

    parse(query) {
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
    
    isEmptySpace(c){
        return c == " " || c=="\r" || c == "\n" || c == "\t";
    }
    
    stripEndNonSpaceCharacters(text){
        if(!text) return text;
        if(this.isEmptySpace(text[text.length - 1])){
            return text;
        }
        
        var index = _.findLastIndex(text.split(""), f=> this.isEmptySpace(f));
        if(index < 0 ) return "";
        return text.substr(0,index) + " ";
    }
    
    getSugessions(query){
        if(query == null){
            if(this.lastError == null){
                return ["AND","OR"];
            }
            
             return this.autoCompleteHandler.handleParseError(parser, ex);
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
    
    setAutoCompleteHandler(autoCompleteHandler){
        this.autoCompleteHandler = autoCompleteHandler;        
    }
}