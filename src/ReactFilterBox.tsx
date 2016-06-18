import * as React  from 'react';
import * as _  from "lodash";
import FilterInput from "./FilterInput";
import SimpleResultProcessing from "./SimpleResultProcessing";

import GridDataAutoCompleteHandler, {Option} from "./GridDataAutoCompleteHandler";
import Expression from "./Expression";
import FilterQueryParser from "./FilterQueryParser";
import BaseResultProcessing from "./BaseResultProcessing";
import BaseAutoCompleteHandler from "./BaseAutoCompleteHandler";


export default class ReactFilterBox extends React.Component<any,any> {

    public static defaultProps: any = {
        onParseOk: ()=>{},
        onParseError: ()=>{},
        onChange: ()=>{},
        onDataFiltered: ()=>{},
        autoCompleteHandler:null
    };

    parser = new FilterQueryParser();

    constructor(props:any){
        super(props);

        var autoCompleteHandler = this.props.autoCompleteHandler || 
                                new GridDataAutoCompleteHandler(this.props.data, this.props.options)
        
        this.parser.setAutoCompleteHandler(autoCompleteHandler);

        //need onParseOk, onParseError, onChange, options, data
    }

    needAutoCompleteValues(codeMirror:any, text:string) {
        return this.parser.getSugessions(text);
    }

    onSubmit(query:string){
        var result = this.parser.parse(query);
        if(result.isError){
            return this.props.onParseError(result);
        }

        return this.props.onParseOk(result);
    }

    onChange(query:string){
        this.props.onChange(query);
    }

    render(){
        return <div className="filter-input">
            <FilterInput
            value={this.props.query}
            needAutoCompleteValues={this.needAutoCompleteValues.bind(this) } 
            onSubmit={this.onSubmit.bind(this)} 
            onChange={this.onChange.bind(this) }/>
        </div>
    }
}

export {
    SimpleResultProcessing,
    BaseResultProcessing,
    GridDataAutoCompleteHandler,
    BaseAutoCompleteHandler,
    Option as AutoCompleteOption,
    Expression
};