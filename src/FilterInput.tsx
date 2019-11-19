import * as React from 'react';
import * as _ from "lodash";
import * as CodeMirror from "codemirror";
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/display/placeholder";
import "./FilterMode"
import 'codemirror/lib/codemirror.css';
import "codemirror/addon/hint/show-hint.css";
import { UnControlled as ReactCodeMirror, IInstance } from 'react-codemirror2'

import grammarUtils from "./GrammarUtils";
import { ExtendedCodeMirror } from "./models/ExtendedCodeMirror";
import AutoCompletePopup from "./AutoCompletePopup";

export default class FilterInput extends React.Component<any, any> {
    options: CodeMirror.EditorConfiguration;
    codeMirror: ExtendedCodeMirror;
    doc: CodeMirror.Doc;
    autoCompletePopup: AutoCompletePopup;

    public static defaultProps: any = {
        onBlur: () => { },
        onFocus: () => { },
        editorConfig: { }
    };

    constructor(props: any) {
        super(props);

        if (props.editorConfig) {
            this.options = { ...props.editorConfig, mode: "filter-mode" }
        }
    }


    findLastSeparatorPositionWithEditor() {
        var doc = this.codeMirror.getDoc();
        var currentCursor = doc.getCursor();
        var text = doc.getRange({ line: 0, ch: 0 }, currentCursor);
        var index = grammarUtils.findLastSeparatorIndex(text);
        return {
            line: currentCursor.line,
            ch: currentCursor.ch - (text.length - index) + 1
        }
    }


    private handlePressingAnyCharacter() {
        if (this.autoCompletePopup.completionShow) {
            return;
        }

        this.autoCompletePopup.show();
    }

    private onSubmit(text: string) {
        if (this.props.onSubmit) {
            this.props.onSubmit(text);
        }
    }

    private codeMirrorRef(ref: { editor: ExtendedCodeMirror }) {
        if (ref == null) return;
        if (this.codeMirror == ref.editor) {
            return;
        }

        this.codeMirror = ref.editor;
        this.doc = ref.editor.getDoc();
        this.autoCompletePopup = new AutoCompletePopup(this.codeMirror, (text) => {
            return this.props.needAutoCompleteValues(this.codeMirror, text);
        })

        this.autoCompletePopup.customRenderCompletionItem = this.props.customRenderCompletionItem;
        this.autoCompletePopup.pick = this.props.autoCompletePick;

        ref.editor.on("beforeChange", function (instance, change) {
            var newtext = change.text.join("").replace(/\n/g, ""); // remove ALL \n !
            change.update(change.from, change.to, [newtext] as any);
            return true;
        });

        ref.editor.on("changes", () => {
            this.handlePressingAnyCharacter();
        })

        ref.editor.on("focus", (cm, e?) => {
            this.handlePressingAnyCharacter();
            this.props.onFocus(e);
        })

        ref.editor.on("blur", (cm, e?) => {
            this.onSubmit(this.doc.getValue());
            this.props.onBlur(e)
        })

        ref.editor.on("keyup", (cm: ExtendedCodeMirror, e?: KeyboardEvent) => {
            if (e.keyCode == 13) {
                this.onSubmit(this.doc.getValue());
            }
        });
    }

    private handleEditorChange(_editor: IInstance, _data: CodeMirror.EditorChange, value: string) {
        this.props.onChange(value);
    }

    render() {
        return (
            <ReactCodeMirror
                ref={this.codeMirrorRef.bind(this)}
                onChange={this.handleEditorChange.bind(this)}
                options={this.options}
                value={this.props.value} />
        );
    }
}
