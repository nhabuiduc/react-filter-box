import * as React from 'react';
import * as _ from "lodash";

import {Table, Column, Cell} from 'fixed-data-table';
import "fixed-data-table/dist/fixed-data-table.min.css";
import data from "./data";

import ReactFilterBox, {AutoCompleteOption,SimpleResultProcessing,Expression} from "../ReactFilterBox";
import "../ReactFilterBox.less";
import "./app.less";

export default class App extends React.Component<any,any> {
    
    options:AutoCompleteOption[];
    constructor(props:any){
        super(props);
        this.state = {
            data: data
        }

         this.options = [
            {
                columField: "Name",
                type:"text"
            },
            {
                columField: "Description",
                type:"text"
            },
            {
                columField: "Status",
                type:"selection"
            },
            {
                columnText: "Email @",
                columField: "Email",
                type:"text"
            }
        ];
    }

    onParseOk(expressions: Expression[]){

        var newData = new SimpleResultProcessing(this.options).process(data,expressions);
        this.setState({data:newData});
        console.log(newData);
    }

    render(){
        var rows = this.state.data;
         return <div className="main-container"> 
         <h2>React Filter Box</h2>
         <h3>Default setting, support filter data out of the box </h3>
         
         <ReactFilterBox 
                    query={this.state.query}
                    data={data}
                    options={this.options}
                    onParseOk={this.onParseOk.bind(this)}
                     />
                     <Table
                    rowHeight={50}
                    rowsCount={rows.length}
                    width={800}
                    height={400}
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