import _ from "lodash";

export default class BaseResultProcessing {
    constructor(){
        
    }   
    
    process(data,parsedResult){
        return _.filter(data, f => {
            return this.predicate(f, parsedResult);
        })
    }
    
    predicateSingle(item, parsedResult){
        return this.filter(item,parsedResult.category,parsedResult.operator,parsedResult.value);
    }
    
    predicate(item,parsedResult){
        
        var expressions= null;
        if(_.isArray(parsedResult)){
            expressions = parsedResult;
        } else if(_.isArray(parsedResult.expressions)){
            expressions = parsedResult.expressions;
        }else{
            return  this.predicateSingle(item, parsedResult);  
        }
        
        var result = null;
        
        expressions.forEach(f=> {
            if(result == null){
                result = this.predicateSingle(item, f);
            }else{
                if(f.conditionType.toLowerCase() == "and"){
                    result = result && this.predicate(item, f);
                }
                if(f.conditionType.toLowerCase() == "or"){
                    result = result || this.predicate(item, f);
                }
            }
        })
        
        return result;
    }
    
    filter(row, field, operator, value){
        return true;
    }
}