export default class BaseAutoCompleteHandler{
  constructor(){
    
  }
  
  handleParseError(parser, error){
    
    var trace = parser.parseTrace;
    return _.flatMap(error.expected, f=>{
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
  
  needCategories(){
    return []
  }
  
  needOperators(lastOperator){
    return []
  }
  
  needValues(lastCategory, lastOperator){
    return []
  }
  
}