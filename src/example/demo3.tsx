import * as React from 'react';
import * as _ from "lodash";

import {Table, Column, Cell} from 'fixed-data-table';
import "fixed-data-table/dist/fixed-data-table.min.css";
import data from "./data";
import * as DayPicker from "react-day-picker";

import ReactFilterBox, {AutoCompleteOption, SimpleResultProcessing, Expression, GridDataAutoCompleteHandler} from "../ReactFilterBox";
import 'react-day-picker/lib/style.css';

//extend this class to add your custom operator
class CustomAutoComplete extends GridDataAutoCompleteHandler {

    // override this method to add new your operator
    needOperators(parsedCategory: string) {
        var result = super.needOperators(parsedCategory);
        return result.concat(["startsWith", "after"]);
    }

    //override to custom to indicate you want to show your custom date time
    needValues(parsedCategory:string, parsedOperator:string):any[]{
        if(parsedOperator == "after"){
            return [{ customType:"date"}]
        }

        return super.needValues(parsedCategory, parsedOperator);
    }
}

class CustomResultProcessing extends SimpleResultProcessing {

    // override this method
    filter(row:any, fieldOrLabel:string, operator:string, value:string){
        var field = this.tryToGetFieldCategory(fieldOrLabel);
        switch(operator){
            case "==": return row[field] == value;
            case "!=": return row[field] != value;
            case "contains": return row[field].toLowerCase().indexOf(value.toLowerCase()) >=0;
            case "!contains": return row[field].toLowerCase().indexOf(value.toLowerCase()) <0;
            case "startsWith": return  _.startsWith(row[field].toLowerCase(), value.toLowerCase() ) ;
            case "after": return  true;
            
        }
        
        return false;
    }
}


export default class Demo3 extends React.Component<any, any> {

    options: AutoCompleteOption[];
    customAutoComplete:CustomAutoComplete;
    constructor(props: any) {
        super(props);
        this.state = {
            data: data,
            query: "Name after "
        }

        this.options = [
            {
                columField: "Name",
                type: "text"
            },
            {
                columField: "Description",
                type: "text"
            },
            {
                columField: "Status",
                type: "selection"
            },
            {
                columnText: "Email @",
                columField: "Email",
                type: "text"
            }
        ];

        this.customAutoComplete = new CustomAutoComplete(data,this.options);
        
    }

    //customer your rendering item in auto complete
    customRenderCompletionItem(self: any, data: any, registerAndGetPickFunc: any) {
        if(!_.isString(data.value)){
            var pick = registerAndGetPickFunc();
            return  <div className="day-picker-selection"  ><DayPicker onDayClick={ (day:any) => pick(day.toLocaleDateString())  }/> </div>
        }
        
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
            <h3>Add your react component to AutoComplete! <a style={{fontSize:12, color:"#2196F3"}} href="https://github.com/nhabuiduc/react-filter-box/blob/master/js-example/src/demo3.js">Source</a></h3>

            <ReactFilterBox
                onChange={(query:string) => this.setState({query:query})}
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