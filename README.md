>## React Filter Box

![alt tag](https://github.com/nhabuiduc/react-filter-box/raw/master/images/react-filter-box-demo.png)

A Simple filter box mainly used to filter data in Grid or Table,  which supports Condition AND/OR, 
and struture Category-operator-Value. This library is inspired by React Structured Filter library,
but built completely different based on PEGjs and CodeMirror

For example: Column1 contains value1 AND (Column2 == Ok)

Demo: https://nhabuiduc.github.io

## Features:

- Support Syntax Highlight
- Support AutoComplete
- Allow to add/custom Operator
- Allow to custom AutoComplete rendering 
- The result of filter is in Json format

## Getting started:

Install react-filter-box using npm.

``npm install react-filter-box``

Import library, and default stylesheet.

``import ReactFilterBox, {AutoCompleteOption,SimpleResultProcessing} from "react-filter-box";``   
``import "react-filter-box/lib/react-filter-box.css"``   

## How to use:


Demo: https://nhabuiduc.github.io , which includes source code.

Simple case:

```javascript
import ReactFilterBox, {SimpleResultProcessing} from "react-filter-box";
import "react-filter-box/lib/react-filter-box.css"


export default class App extends React.Component {
    
    constructor(props){
        super(props);

         this.options = [
            {
                columnField: "Name",
                type:"text"
            },
            {
                columnField: "Description",
                type:"text"
            },
            {
                columnField: "Status",
                type:"selection" // when using type selection, it will automatically sugest all posible values
            },
            {
                columnText: "Email @",
                columnField: "Email",
                type:"text"
            }
        ];
    }

    onParseOk(expressions){
        var data = [];
        var newData = new SimpleResultProcessing(this.options).process(data,expressions);
        //your new data here, which is filtered out of the box by SimpleResultProcessing
    }

    render(){
         return <div className="main-container"> 
                    <h2>React Filter Box</h2>
         
                        <ReactFilterBox 
                            
                            data={data}
                            options={this.options}
                            onParseOk={this.onParseOk.bind(this)}
                            />
                    
                    </div>
    }
}
```

## Properties

**query:string**: binding your text to query of Component

**options:Option[]**: array of option which helps to construct AutoComplete information.

```typescript
export interface Option {
    columnField:string; // required
    columnText?:string; // optional
    type: string; // require "text" or "selection"
}
```
**data: any[]**: (optional) data is used to construct AutoComplete only if 
you specify in **options** with **type = "selection"**, which it will
show all posibles values get from data

**editorConfig**: CodeMirror configuration options that will be passed through
to the CodeMirror editor.  
See https://codemirror.net/doc/manual.html#config

**strictMode: boolean** defaults to false.  Set to true to enforce that all categories and operators in the
filter query are valid based on the options config.  This validation is applied after the query is successfully parsed.  When the onChange or onParseError events are raised the last argument will indicate if the filter is valid based and also indicate the first invalid item when the validation fails.


## Events

**onChange(query: String, expressions: Expression[]|Error, validationResult: { isValid: boolean, message?: string })**: event raised every change of query, together with expressions if parse is ok, otherwise is error.
When strictMode is true, the validiationResult argument will indicate if the filter matches the options config,

```typescript
interface Expression {
    conditionType?: "OR" | "AND";
    category?: string;
    operator?: string;
    value?: string;
    expressions?:Expression[];    
}
```

to see more about the structure of Expression which parsed from query, please
take a look at: [unit test](https://github.com/nhabuiduc/react-filter-box/blob/master/test/FilterQUeryParser.spec.ts)

**onParseOk(expressions:Expression[])**: event raised when parsing is ok.  When strictMode is true, this also indicates that all categories and operators are valid based on the options config.


**onParseError(error:Error, validationResult: { isValid: boolean, message?: string })**: 
event raised when parsing error.  When strictMode is true, the validiationResult argument will indicate if the filter matches the options config,


## Custom Functions
**customRenderCompletionItem(self:HintResult,data:Completion, registerAndGetPickFunc:Function): ReactComponent**:
provide your custom AutoComplete Rendering for each Item.

- **self:HintResult**: ignore for now
- **data:Completion**:

```typescript
export interface Completion{
    value:string | Object; // Your value as text, Object if your custom AutoCompleteHandler return Object
    type?:string;    // "catetory" or "value" or "operator" or "literal"
}
``` 


- **registerAndGetPickFunc:Function**: you only call this function in case you want 
to handle the way user wants to select your value in AutoComplete popup. 

In default behavior, user will  press enter to select an item.
But if for example, your component is DatePicker, and you want user to select any date,
by clicking on your component, in order to achive that, you must call this method to 
register with system you want to handle this by yourself.

This method will return another function ** (value:string):void **, which you can call it
 and provide the value will be inserted into query.

 You can look into file [demo3.js](https://github.com/nhabuiduc/react-filter-box/blob/master/js-example/src/demo3.js) for detail

 **autoCompleteHandler: BaseAutoCompleteHandler**

## How to work this project

- Run demo application ```yarn start```
- Run test ```yarn test```
- Package as library ```yarn component-package```
 

##License:  
[MIT](https://github.com/nhabuiduc/react-filter-box/blob/master/LICENSE.md)
