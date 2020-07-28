import * as React from 'react';
import * as _ from "lodash";
import FilterInput from "./FilterInput";
import SimpleResultProcessing from "./SimpleResultProcessing";

import GridDataAutoCompleteHandler, { Option } from "./GridDataAutoCompleteHandler";
import Expression from "./Expression";
import FilterQueryParser from "./FilterQueryParser";
import BaseResultProcessing from "./BaseResultProcessing";
import BaseAutoCompleteHandler from "./BaseAutoCompleteHandler";
import ParsedError from "./ParsedError";
import validateQuery from './validateQuery';

export default class ReactFilterBox extends React.Component<any, any> {

    public static defaultProps: any = {
        onParseOk: () => { },
        onParseError: () => { },
        onChange: () => { },
        onDataFiltered: () => { },
        autoCompleteHandler: null,
        onBlur: () => { },
        onFocus: () => { },
        editorConfig: { },
        strictMode: false
    };

    parser = new FilterQueryParser();

    constructor(props: any) {
        super(props);

        var autoCompleteHandler = this.props.autoCompleteHandler ||
            new GridDataAutoCompleteHandler(this.props.data, this.props.options)

        this.parser.setAutoCompleteHandler(autoCompleteHandler);

        this.state = {
            isFocus: false,
            isError: false
        }
        //need onParseOk, onParseError, onChange, options, data
    }

    needAutoCompleteValues(codeMirror: any, text: string) {
        return this.parser.getSuggestions(text);
    }

    onSubmit(query: string) {
        var result = this.parser.parse(query);
        if ((result as ParsedError).isError) {
            return this.props.onParseError(result);
        } else if (this.props.strictMode) {
            const validationResult = validateQuery(result as Expression[], this.parser.autoCompleteHandler);
            if (validationResult.isValid === false) {
                const validationError = new Error(validationResult.message)
                console.log(validationResult.message);
                return this.props.onParseError(validationError);
            }
        }

        return this.props.onParseOk(result);
    }

    onChange(query: string) {
        var result = this.parser.parse(query);
        if ((result as ParsedError).isError ||
            (this.props.strictMode && !validateQuery(result as Expression[], this.parser.autoCompleteHandler).isValid)) {
          this.setState({ isError: true })
        } else {
          this.setState({ isError: false })
        }

        this.props.onChange(query, result);
    }

    onBlur() {
        this.setState({ isFocus: false });
    }

    onFocus() {
        this.setState({ isFocus: true });
    }

    render() {
        var className = "react-filter-box";
        if (this.state.isFocus) {
            className += " focus"
        }
        if (this.state.isError) {
            className += " error"
        }

        return <div className={className}>
            <FilterInput
                autoCompletePick={this.props.autoCompletePick}
                customRenderCompletionItem={this.props.customRenderCompletionItem}
                onBlur={this.onBlur.bind(this)}
                onFocus={this.onFocus.bind(this)}
                value={this.props.query}
                needAutoCompleteValues={this.needAutoCompleteValues.bind(this)}
                onSubmit={this.onSubmit.bind(this)}
                onChange={this.onChange.bind(this)}
                editorConfig={this.props.editorConfig} />
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
