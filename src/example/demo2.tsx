import * as React from 'react';
import * as _ from "lodash";

import {Table, Column, Cell} from 'fixed-data-table';
import "fixed-data-table/dist/fixed-data-table.min.css";
import data from "./data";

import ReactFilterBox, {AutoCompleteOption, SimpleResultProcessing, Expression, GridDataAutoCompleteHandler} from "../ReactFilterBox";


//extend this class to add your custom operator
class CustomAutoComplete extends GridDataAutoCompleteHandler {

    // override this method
    needOperators(parsedCategory: string) {
        var result = super.needOperators(parsedCategory);
        return result.concat(["startsWith"]);
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
        console.log(newData);
    }

    render() {
        var rows = this.state.data;
        return <div className="main-container">
            <h3>Custom Rendering AutoComplete, add your owner operator</h3>

            <ReactFilterBox
                autoCompleteHandler = {this.customAutoComplete}
                customRenderCompletionItem = {this.customRenderCompletionItem.bind(this) }
                query={this.state.query}
                data={data}
                options={this.options}
                onParseOk={this.onParseOk.bind(this) }
                />
            <Table
                rowHeight={50}
                rowsCount={rows.length}
                width={800}
                height={300}
                headerHeight={50}>
                <Column
                    header={<Cell>Name</Cell>}

                    cell={({ rowIndex}) => (
                        <Cell>
                            {rows[rowIndex].Name}
                        </Cell>
                    ) }
                    width={200}
                    />
                <Column
                    header={<Cell>Description</Cell>}
                    cell={({ rowIndex }) => (
                        <Cell >
                            {rows[rowIndex].Description}
                        </Cell>
                    ) }
                    width={200}
                    />
                <Column
                    header={<Cell>Status</Cell>}
                    cell={({ rowIndex }) => (
                        <Cell >
                            {rows[rowIndex].Status}
                        </Cell>
                    ) }
                    width={200}
                    />
                <Column
                    header={<Cell>Email</Cell>}
                    cell={({ rowIndex }) => (
                        <Cell >
                            {rows[rowIndex].Email}
                        </Cell>
                    ) }
                    width={200}
                    />
            </Table>
        </div>
    }
}