import BaseAutoCompleteHandler from "./BaseAutoCompleteHandler";
import Expression from "./Expression";
import * as _ from "lodash";

export default class GridDataAutoCompleteHandler extends BaseAutoCompleteHandler {

    parseResult: Expression[];
    categories: string[];
    cache:any = {};

    constructor(private data:any[], private options?:Option[]) {
        super();              
        
        this.parseResult = null;
        
        this.categories = _.map(this.options, f=> {
            if(f.columnText) return f.columnText;
            f.columnText
        });
    }

    needCategories() {
        return this.categories;
    }

    needOperators(lastCategory:string) {
        var found = _.find(this.options,f =>{
            return f.customOperatorFunc != null && (
                f.columnText == lastCategory || f.columField == lastCategory
            )
        })

        if(found){
            return found.customOperatorFunc(lastCategory); 
        }
        return ["==", "!=","contains","!contains"];
    }

    needValues(lastCategory:string, lastOperator:string):any[] {
        var found = _.find(this.options, f=>f.columField == lastCategory || f.columnText == lastCategory);

        if(found != null && found.type == "selection" && this.data != null){
            if(!this.cache[lastCategory]) {
                this.cache[lastCategory] = _.chain(this.data).map(f=>f[lastCategory]).uniq().value();
            }
            return this.cache[lastCategory];
        }

        if(found != null && found.customValuesFunc){
            return found.customValuesFunc(lastCategory, lastOperator);
        }

        return [];
    }
}

export interface Option{
    columField:string;
    columnText:string;
    type: string;
    customOperatorFunc?: (category:string)=>string[]
    customValuesFunc?: (category:string,operator:string)=>string[]
}