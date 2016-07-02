import * as React from 'react';
import * as _ from "lodash";

import {Table, Column, Cell} from 'fixed-data-table';
import "fixed-data-table/dist/fixed-data-table.min.css";
import data from "./data";

import ReactFilterBox, {AutoCompleteOption,SimpleResultProcessing,Expression} from "../ReactFilterBox";
import "../ReactFilterBox.less";
import "./app.less";
import Demo1 from "./demo1";
import Demo2 from "./demo2";
import Demo3 from "./demo3";

export default class App extends React.Component<any,any> {
    
    constructor(props:any){
        super(props);
        
    }

   

    render(){
        return (
            <div>
             <h2 style={{textAlign:"center"}}>React Filter Box</h2>
                <Demo1/> 
                <Demo2/>
                <Demo3/> 
            </div>
         )
    }
}