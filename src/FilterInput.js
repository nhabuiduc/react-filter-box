import React, { Component } from 'react';
import _ from "lodash";
import FilterQueryParser from "./FilterQueryParser";
import BaseAutoCompleteHandler from "./BaseAutoCompleteHandler";
import ReactCodeMirror from "react-codemirror";
import "codemirror/addon/hint/show-hint";

import CodeMirror from "codemirror";
import "./FilterMode"


import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';
import "codemirror/addon/hint/show-hint.css";
import "./FilterInput.less";



export default class FilterInput extends React.Component {
    constructor(props) {
        super(props);

        this.options = {
            // lineNumbers: true,
            mode: "filter-mode",
            height: 50
        }

        this.hintValues = [];

        this.hintOptions = this.createHintOption();
        this.completionShow = false;
    }

    createHintOption() {


        var hintFunc = () => {
            var {hintValues, from} = this.hintOptions;
            var cursor = this.codeMirror.doc.getCursor();
            var text = this.codeMirror.doc.getRange(from, cursor);
            var values = hintValues;
            if (text) {
                values = _.filter(hintValues, f => _.startsWith(f.toLowerCase(), text.toLowerCase()))
            }

            return {
                list: values,
                from: from,
                to: cursor
            }
        }

        hintFunc.supportsSelection = true;
        return {
            // text: "text",
            // displayText: "displayText",
            hint: hintFunc,
            completeSingle: false,
            hintValue: [],

        };
    }

    raiseShowAutoComplete(codeMirror) {

        var doc = this.codeMirror.doc;
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
        var cursor = this.codeMirror.doc.getCursor();
        this.hintOptions.from = { line: cursor.line, ch: cursor.ch };

        this.codeMirror.showHint(this.hintOptions);
        this.completionShow = true;
    }

    onSubmit() {
        if (this.props.onSubmit) {
            this.props.onSubmit();
        }
    }

    codeMirrorRef(ref) {
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
            change.update(change.from, change.to, [newtext]);
            return true;
        });


        ref.codeMirror.on("keyup", (cm, e) => {
            // var doc = this.codeMirror.doc;
            // var cursor = doc.getCursor();
            //  var text = doc.getRange({line:0,ch:0},cursor);

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