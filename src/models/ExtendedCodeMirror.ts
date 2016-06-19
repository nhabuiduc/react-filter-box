import * as CodeMirror from "codemirror";


export interface HintResult {
    from: CodeMirror.Position;
    to:CodeMirror.Position;
    list: Completion[];
}

export interface HintFunc {
    (): HintResult;
    supportsSelection:boolean;
}

export class HintOptions {
    hint: HintFunc;
    completeSingle: boolean = false;
    hintValues: HintInfo[]=[];
}

export interface ExtendedCodeMirror  extends CodeMirror.Editor{
    showHint(hintOptions: HintOptions):void;
    replaceRange(text:string,from:CodeMirror.Position,to:CodeMirror.Position,action:string):void;
}

export interface Completion{
    value:string | Object;
    type?:string;
    displayText?:string;
    className?:string;
    render?:(element:any,self:HintResult,data:Completion)=>void;
    hint?:(cm:ExtendedCodeMirror, self:HintResult, data:Completion)=>void;
}

export interface HintInfo {
    value:string|Object;
    type:string;

}