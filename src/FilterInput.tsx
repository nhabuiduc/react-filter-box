import * as React  from 'react';
import * as _  from "lodash";
import FilterQueryParser from "./FilterQueryParser";
import BaseAutoCompleteHandler from "./BaseAutoCompleteHandler";
// import ReactCodeMirror from "react-codemirror";
var ReactCodeMirror:any = require("react-codemirror");
import "codemirror/addon/hint/show-hint";

import * as CodeMirror from "codemirror";
import "./FilterMode"

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';
import "codemirror/addon/hint/show-hint.css";
import "./FilterInput.less";


export default class FilterInput extends React.Component<any,any> {

    options:CodeMirror.EditorConfiguration;
    hintOptions: HintOptions;
    completionShow = false;
    codeMirror:ExtendedCodeMirror;

    constructor(props:any) {
        super(props);

        this.options = {
            // lineNumbers: true,
            mode: "filter-mode",
        }

        this.hintOptions = this.createHintOption();
    }

    createHintOption() {

        var hintOptions = new HintOptions();

        hintOptions.hint = (() => {
            var {hintValues, from} = hintOptions;
            var cursor = this.codeMirror.getDoc().getCursor();
            var text = this.codeMirror.getDoc().getRange(from, cursor);
            var values = hintValues;
            if (text) {
                values = _.filter(hintValues, f => _.startsWith(f.toLowerCase(), text.toLowerCase()))
            }
            

            return {
                list: values,
                from: from,
                to: cursor
            }
        } ) as HintFunc;

        hintOptions.hint.supportsSelection = true;

        return hintOptions;
    }

    raiseShowAutoComplete(codeMirror:CodeMirror.Editor) {

        var doc = this.codeMirror.getDoc();
        if (this.props.needAutoCompleteValues) {
            var text = doc.getRange({ line: 0, ch: 0 }, doc.getCursor());
            return this.props.needAutoCompleteValues(codeMirror, text);
        }

        return [];
    }

    handlePressingSpace() {
        this.handleAutoComplete();
    }

    handlePressingAnyCharacter() {
        if (this.completionShow) {
            return;
        }

        this.handleAutoComplete();
    }

    handleAutoComplete() {
        this.hintOptions.hintValues = this.raiseShowAutoComplete(this.codeMirror);
        var cursor = this.codeMirror.getDoc().getCursor();
        this.hintOptions.from = { line: cursor.line, ch: cursor.ch };

        this.codeMirror.showHint(this.hintOptions);
        this.completionShow = true;
    }

    onSubmit() {
        if (this.props.onSubmit) {
            this.props.onSubmit();
        }
    }

    codeMirrorRef(ref:{codeMirror:ExtendedCodeMirror}) {
        if (ref == null) return;
        if (this.codeMirror == ref.codeMirror) {
            return;
        }

        this.codeMirror = ref.codeMirror;

        ref.codeMirror.on("endCompletion", () => {
            this.completionShow = false;
        })

        ref.codeMirror.on("beforeChange", function (instance, change) {
            var newtext = change.text.join("").replace(/\n/g, ""); // remove ALL \n !
            change.update(change.from, change.to, [newtext] as any);
            return true;
        });


        ref.codeMirror.on("keyup", (cm:ExtendedCodeMirror,e?:KeyboardEvent) => {

            //escape
            if (e.keyCode == 27) {
                return;
            }

            //space,tab
            if (e.keyCode == 32 || e.keyCode == 9) {
                return this.handlePressingSpace();
            }


            if (e.keyCode == 13) {
                console.log("enter" + Math.random());
                this.onSubmit();
                if (!this.completionShow) {
                    e.preventDefault();
                }

                return;

            }

            this.handlePressingAnyCharacter();
        })
    }

    render() {
        return (
            <div className="filter-input">
                <ReactCodeMirror
                    ref={this.codeMirrorRef.bind(this) }
                    onChange={this.props.onChange}
                    options={this.options}  value={this.props.value}/>
            </div>


        );
    }
}


interface HintResult {
    from: CodeMirror.Position;
    to:CodeMirror.Position;
    list: string[];
}

interface HintFunc {
    (): HintResult;
    supportsSelection:boolean;
}

class HintOptions {
    hint: HintFunc;
    completeSingle: boolean = false;
    hintValues: string[]=[];
    from: CodeMirror.Position;
}

interface ExtendedCodeMirror  extends CodeMirror.Editor{
    showHint(hintOptions: HintOptions):void
}