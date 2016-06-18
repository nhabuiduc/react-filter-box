import BaseAutoCompleteHandler from "./BaseAutoCompleteHandler";
import Expression from "./Expression";
import * as _ from "lodash";

export default class GridDataAutoCompleteHandler extends BaseAutoCompleteHandler {

    parseResult: Expression[];
    categories: string[];
    cache:any;

    constructor(private data:any[], private options?:Option[]) {
        super();
        
        this.options = [
            {
                columnText: "Name",
                columField: "Name",
                type:"text"
            },
            {
                columnText: "Description",
                columField: "Description",
                type:"text"
            },
            {
                columnText: "Status",
                columField: "Status",
                type:"selection"
            },
            {
                columnText: "Email",
                columField: "Email",
                type:"text"
            }
        ];
        
        this.parseResult = null;
        
        this.categories = _.map(this.options, f=> f.columnText);
    }

    needCategories() {
        return this.categories;
    }

    needOperators(lastOperator:string) {
        return ["==", "!=","contains","!contains"];
    }

    needValues(lastCategory:string, lastOperator:string):any[] {
        var found = _.find(this.options, f=>f.columField == lastCategory);

        if(found != null && found.type == "selection"){
            if(!this.cache[lastCategory]) {
                this.cache[lastCategory] = _.chain(this.data).map(f=>f[lastCategory]).uniq().value();
            }
            return this.cache[lastCategory];
        }
        return [];
    }
}

interface Option{
    columField:string;
    columnText:string;
    type: "text"|"selection";
}