import BaseAutoCompleteHandler from "./BaseAutoCompleteHandler";

export default class GridDataAutoCompleteHandler extends BaseAutoCompleteHandler {
    constructor(data, options) {
        super();
        this.data = data;
        
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
        this.cache = {};
    }

    needCategories() {
        return this.categories;
    }

    needOperators(lastOperator) {
        return ["==", "!=","contains","!contains"];
    }

    needValues(lastCategory, lastOperator) {
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