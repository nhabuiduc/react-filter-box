import _ from "lodash";
import BaseResultProcessing from "./BaseResultProcessing";

export default class SimpleResultProcessing extends BaseResultProcessing {
    constructor(){
        super();
    }   
    
    filter(row, field, operator, value){
        
        switch(operator){
            case "==": return row[field] == value;
            case "!=": return row[field] != value;
            case "contains": return row[field].toLowerCase().indexOf(value.toLowerCase()) >=0;
            case "!contains": return row[field].toLowerCase().indexOf(value.toLowerCase()) <0;
        }
        
        return false;
    }
}