import * as React from 'react';
import * as _ from "lodash";

import {Table, Column, Cell} from 'fixed-data-table';
import "fixed-data-table/dist/fixed-data-table.min.css";
import data from "./data";

import ReactFilterBox, {AutoCompleteOption, SimpleResultProcessing, Expression, GridDataAutoCompleteHandler} from "../ReactFilterBox";


//extend this class to add your custom operator
class CustomAutoComplete extends GridDataAutoCompleteHandler {

    // override this method to add new your operator
    needOperators(parsedCategory: string) {
        var result = super.needOperators(parsedCategory);
        return result.concat(["startsWith"]);
    }
}

class CustomResultProcessing extends SimpleResultProcessing {

    // override this method to add your handler for startsWith operator
    filter(row:any, fieldOrLabel:string, operator:string, value:string){
        var field = this.tryToGetFieldCategory(fieldOrLabel);
        switch(operator){
            case "==": return row[field] == value;
            case "!=": return row[field] != value;
            case "contains": return row[field].toLowerCase().indexOf(value.toLowerCase()) >=0;
            case "!contains": return row[field].toLowerCase().indexOf(value.toLowerCase()) <0;
            case "startsWith": return  _.startsWith(row[field].toLowerCase(), value.toLowerCase() ) ;
        }
        
        return false;
    }
}


export default class Demo2 extends React.Component<any, any> {

    options: AutoCompleteOption[];
    customAutoComplete:CustomAutoComplete;
    constructor(props: any) {
        super(props);
        this.state = {
            data: data
        }

        this.options = [
            {
                columnField: "Name",
                type: "text"
            },
            {
                columnField: "Description",
                type: "text"
            },
            {
                columnField: "Status",
                type: "selection"
            },
            {
                columnText: "Email @",
                columnField: "Email",
                type: "text"
            }
        ];

        this.customAutoComplete = new CustomAutoComplete(data,this.options);
        
    }

    //customer your rendering item in auto complete
    customRenderCompletionItem(self: any, data: any, pick: any) {
        var className = ` hint-value cm-${data.type}`
        
        return <div className={className}  >
                    <span style={{ fontWeight: "bold" }}>{data.value}</span>
                    <span style={{color:"gray", fontSize:10}}> [{data.type}] </span>
                </div>
    }

    onParseOk(expressions: Expression[]) {

        var newData = new CustomResultProcessing(this.options).process(data, expressions);
        this.setState({ data: newData });
        // console.log(newData);
    }

    render() {
        var rows = this.state.data;
        return <div className="main-container">
            <h3>Custom Rendering (AutoComplete, Operator) <a style={{fontSize:12, color:"#2196F3"}} href="https://github.com/nhabuiduc/react-filter-box/blob/master/js-example/src/demo2.js">Source</a></h3>

            <ReactFilterBox
                autoCompleteHandler = {this.customAutoComplete}
                customRenderCompletionItem = {this.customRenderCompletionItem.bind(this) }
                query={this.state.query}
                data={data}
                options={this.options}
                onParseOk={this.onParseOk.bind(this) }
                />
           
        </div>
    }
}