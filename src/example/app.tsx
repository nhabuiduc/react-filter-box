import * as React from 'react';
import * as _ from "lodash";

import {Table, Column, Cell} from 'fixed-data-table';
import "fixed-data-table/dist/fixed-data-table.min.css";
import data from "./data";

import ReactFilterBox, {AutoCompleteOption,SimpleResultProcessing,Expression} from "../ReactFilterBox";
import "../ReactFilterBox.less";

export default class App extends React.Component<any,any> {
    
    options:AutoCompleteOption[];
    constructor(props:any){
        super(props);
        this.state = {
            query: `Status == Divorced AND (Description contains "t") `,
            data: data
        }

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
    }

    onParseOk(expressions: Expression[]){

        var newData = new SimpleResultProcessing().process(data,expressions);
        this.setState({data:newData});
        console.log(newData);
    }

    onParseError(error:any){
        console.log(error);
    }

    onChange(query:string){
        this.setState({query:query})
    }

    render(){
        var rows = this.state.data;
         return <div> 
         <ReactFilterBox 
                    query={this.state.query}
                    onChange={this.onChange.bind(this)}
                    data={data}
                    options={this.options}
                    onParseOk={this.onParseOk.bind(this)}
                    onParseError={this.onParseError.bind(this)}
                     />
                     <Table
                    rowHeight={50}
                    rowsCount={rows.length}
                    width={800}
                    height={800}
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