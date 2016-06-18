import * as _ from "lodash";
import * as PEG from "pegjs";

import {ExtendedParser} from "./FilterQueryParser";

export default class BaseAutoCompleteHandler{
  constructor(){
    
  }
  
  handleParseError(parser: ExtendedParser, error:PEG.PegjsError){
    
    var trace = parser.parseTrace;
    return _.flatMap(error.expected, (f:PEG.ExpectedItem)=>{
      if(f.type == "literal"){
        return [f.value];
      }
      
      if(f.type == "other"){
          var lastTokenType = trace.getLastTokenType() || "value";
          if(lastTokenType == "value") {
            return this.needCategories();
          }
          
          if(lastTokenType == "category"){
            return this.needOperators(trace.getLastCategory());
          }
          
          if(lastTokenType == "operator"){
            return this.needValues(trace.getLastCategory(), trace.getLastOperator());
          }
      }
      
      return[];
    })
  }
  
  needCategories():string[]{
    return []
  }
  
  needOperators(lastOperator:string):string[]{
    return []
  }
  
  needValues(lastCategory:string, lastOperator:string):string[]{
    return []
  }
  
}