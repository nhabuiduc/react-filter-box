import * as CodeMirror from "codemirror";
import * as _  from "lodash";
import {HintResult,HintFunc,HintOptions,ExtendedCodeMirror,Completion, HintInfo} from "./models/ExtendedCodeMirror";
import grammarUtils from "./GrammarUtils";
import * as ReactDOM from 'react-dom';
import * as React from 'react';

export default class AutoCompletePopup {
    doc:CodeMirror.Doc;
    hintOptions: HintOptions;
    completionShow = false;
    appendSpace=true;
    customRenderCompletionItem:(self:HintResult,data:Completion)=>React.ReactElement<any>;

    constructor(private cm: ExtendedCodeMirror, private needAutoCompletevalues:(text:string)=>HintInfo[]) {
        this.doc = cm.getDoc();

        cm.on("endCompletion", () => {
            this.completionShow = false;
        })

        this.hintOptions = this.createHintOption();
        
    }

    processText(text:string):string{
        if(grammarUtils.needSpaceAfter(text)){
            return text + " ";
        }

        return text;
    }

    onPick(cm:ExtendedCodeMirror, self:HintResult, data:Completion){
        cm.replaceRange(this.processText(data.text),self.from,self.to,"complete");
    }

    renderHintElement(element:HTMLElement,self:HintResult,data:Completion){
        var div = document.createElement("div");
        var className = ` hint-value cm-${data.type}`
        if(this.customRenderCompletionItem){
            ReactDOM.render(this.customRenderCompletionItem(self,data),div);
        }else{
            ReactDOM.render(<div className={className}>{data.text}</div>,div);
        }
        
        element.appendChild(div);
    }

    buildComletionObj(info:HintInfo):Completion{
        return {
                text:info.value,
                type:info.type,
                hint:this.onPick.bind(this),
                render: this.renderHintElement.bind(this)
            }
    }

    findLastSeparatorPositionWithEditor(){
        var doc =  this.cm.getDoc();
        var currentCursor = doc.getCursor();
        var text = doc.getRange({ line: 0, ch: 0 }, currentCursor);
        var index = grammarUtils.findLastSeparatorIndex(text);
        return {
            line: currentCursor.line,
            ch: currentCursor.ch - (text.length - index) + 1
        }

    }    


    show() {
        var cursor = this.doc.getCursor();
        var text = this.doc.getRange({line:0,ch:0}, cursor)
        this.hintOptions.hintValues = this.needAutoCompletevalues(text);

        this.cm.showHint(this.hintOptions);
        this.completionShow = true;
    }


    createHintOption() {

        var hintOptions = new HintOptions();

        hintOptions.hint = (() => {
            var {hintValues} = hintOptions;
            var doc =  this.cm.getDoc();
            var cursor = doc.getCursor();
            var lastSeparatorPos = this.findLastSeparatorPositionWithEditor();
            var text = doc.getRange(lastSeparatorPos, cursor);

            var values = hintValues;
            if (text) {
                values = _.filter(hintValues, f => _.startsWith(f.value.toLowerCase(), text.toLowerCase()))
            }
            
            return {
                list: _.map(values,c=>this.buildComletionObj(c)),
                from: lastSeparatorPos,
                to: cursor
            }
        } ) as HintFunc;

        hintOptions.hint.supportsSelection = true;

        return hintOptions;
    }

    
}