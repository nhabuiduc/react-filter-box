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
import grammarUtils from "./GrammarUtils";
import {HintResult,HintFunc,HintOptions,ExtendedCodeMirror,Completion} from "./models/ExtendedCodeMirror";
import AutoCompletePopup from "./AutoCompletePopup";

export default class FilterInput extends React.Component<any,any> {

    options:CodeMirror.EditorConfiguration;
    
    codeMirror:ExtendedCodeMirror;
    doc: CodeMirror.Doc;
    autoCompletePopup:AutoCompletePopup;
    

    constructor(props:any) {
        super(props);

        this.options = {
            // lineNumbers: true,
            mode: "filter-mode",
        }
    }

    findLastSeparatorPositionWithEditor(){
        var doc =  this.codeMirror.getDoc();
        var currentCursor = doc.getCursor();
        var text = doc.getRange({ line: 0, ch: 0 }, currentCursor);
        var index = grammarUtils.findLastSeparatorIndex(text);
        return {
            line: currentCursor.line,
            ch: currentCursor.ch - (text.length - index) + 1
        }

    }


    handlePressingSpace() {
        this.autoCompletePopup.show();
    }

    handlePressingAnyCharacter() {
        if (this.autoCompletePopup.completionShow) {
            return;
        }

        this.autoCompletePopup.show();
    }

    onSubmit() {
        if (this.props.onSubmit) {
            this.props.onSubmit();
        }
    }

    getLastCharacter(){
         var cursor = this.doc.getCursor();
         if(cursor.ch ==0 ) return "";
         return this.doc.getRange({line:cursor.line,ch:cursor.ch-1}, cursor);
    }
    codeMirrorRef(ref:{codeMirror:ExtendedCodeMirror}) {
        if (ref == null) return;
        if (this.codeMirror == ref.codeMirror) {
            return;
        }

        this.codeMirror = ref.codeMirror;
        this.doc = ref.codeMirror.getDoc();   
        this.autoCompletePopup = new AutoCompletePopup(this.codeMirror,(text)=>{
            return this.props.needAutoCompleteValues(this.codeMirror, text);
        })

        ref.codeMirror.on("beforeChange", function (instance, change) {
            var newtext = change.text.join("").replace(/\n/g, ""); // remove ALL \n !
            change.update(change.from, change.to, [newtext] as any);
            return true;
        });

        ref.codeMirror.on("changes", ()=>{
            this.handlePressingAnyCharacter();
        })

        ref.codeMirror.on("focus", ()=>{
            this.handlePressingAnyCharacter();
        })

        // ref.codeMirror.on("keyup", (cm:ExtendedCodeMirror,e?:KeyboardEvent) => {

        //     //escape
        //     if (e.keyCode == 27) {
        //         return;
        //     }

        //     //space,tab
        //     if (e.keyCode == 32 || e.keyCode == 9) {
        //         return this.handlePressingSpace();
        //     }

        //     if (e.keyCode == 13) {
        //         console.log("enter" + Math.random());
        //         this.onSubmit();

        //         if(grammarUtils.isSeparator(this.getLastCharacter())){
        //             this.handlePressingAnyCharacter();
        //         }

        //         return;
        //     }

        //     if(e.keyCode >=37 && e.keyCode <= 40 ){
        //         return
        //     }

        //     if(e.ctrlKey || e.altKey || e.shiftKey) return;

        //     this.handlePressingAnyCharacter();
        // })
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
