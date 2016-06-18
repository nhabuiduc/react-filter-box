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
    hintValues: string[]=[];
    from: CodeMirror.Position;
}

export interface ExtendedCodeMirror  extends CodeMirror.Editor{
    showHint(hintOptions: HintOptions):void
}

export interface Completion{
    text:string;
    displayText?:string;
    className?:string;
    render?:(element:any,self:HintOptions,data:Completion)=>void;
    hint?:(cm:ExtendedCodeMirror, self:HintOptions, data:Completion)=>void;
}