import * as React from 'react';
import * as _ from "lodash";
import FilterQueryParser from "./FilterQueryParser";
import BaseAutoCompleteHandler from "./BaseAutoCompleteHandler";
import FilterInput from "./FilterInput";
import {Table, Column, Cell} from 'fixed-data-table';
import "fixed-data-table/dist/fixed-data-table.min.css";
import data from "./data";
import SimpleResultProcessing from "./SimpleResultProcessing";

import GridDataAutoCompleteHandler from "./GridDataAutoCompleteHandler";
import Expression from "./Expression";


export default class App extends React.Component<any,any> {

    parser:FilterQueryParser;
    parsedResult: Expression[];
    constructor(props:any) {
        super(props);
        this.state = {
            query: `Status == Divorced AND (Description contains "t")`,
            data: data
        }

        var parser = new FilterQueryParser();
        parser.setAutoCompleteHandler(new GridDataAutoCompleteHandler(data));
        this.parser = parser;
    }

    onChange(text:string) {
        this.setState({ query: text });
        this.parsedResult = this.parser.parse(text);

    }

    needAutoCompleteValues(codeMirror:any, text:string) {
        return this.parser.getSugessions(text);
    }
    
    onSubmit(){
        this.parsedResult = this.parser.parse(this.state.query);
        if(!this.parsedResult){
            console.log("no result");
            return;
        }
        
        console.log(this.parsedResult);
        
        var processing = new SimpleResultProcessing();
        var newData = processing.process(data, this.parsedResult);
        this.setState({data:newData});
    }

    render() {
        // var result = parser.parse(`nha == nhat AND (nhat == nha or "nhat " contains t) AND  `);
        var rows = this.state.data;
        return (
            <div>
                
                <FilterInput value={this.state.query}
                    onSubmit={this.onSubmit.bind(this)}
                    onChange={this.onChange.bind(this) }
                    needAutoCompleteValues={this.needAutoCompleteValues.bind(this) }/>

                <Table
                    rowHeight={50}
                    rowsCount={rows.length}
                    width={800}
                    height={800}
                    headerHeight={50}>
                    <Column
                        header={<Cell>Name</Cell>}

                        cell={({ rowIndex, props}) => (
                            <Cell {...props}>
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
                </Table>,
            </div>


        );
    }
}


