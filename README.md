>## React Filter Box

![alt tag](https://mskxxa-dm2306.files.1drv.com/y3mthZuvqevAuYkXsYFKwmnNtgAlPk7dmhPKCGtpvJf4YnxhYVMA0xUe7Q1wqVbEysoPMoJda7raS716lg8eJbjBCUFWzocAqcoMLc8hoXVERmOOsYKO4lPpoqLJVOZXhHhuwkGMU9MpfofIfWDhQo2Xke9VK1YP3uaaqvZLG41I4A?width=660&height=241&cropmode=none)
![alt tag](https://nmkxxa-dm2306.files.1drv.com/y3m_Os8n7CY2O1r8Xtv8KwNdyayHC2b3skubNpEOaM6USk1W4xBSeY-MB9GQB5alnv_02-3YUzHOlFCG9mmBBtCKpWopjHqMDDJ-b9SIHwO5nhG1Mogt7a_8Mjyzab_ofkkj5ooe7UGzUkYyj_SOd8BRl6SXo1jOqTYMg_3e90dHIk?width=660&height=247&cropmode=none)

A Simple filter box mainly used to filter data in Grid or Table,  which supports Condition AND/OR, 
and struture Category-operator-Value. This library is inspired by React Structured Filter library,
but built completely different based on PEGjs and CodeMirror

For example: Column1 contains value1 AND (Column2 == Ok)

Demo: https://nhabuiduc.github.io

##Features:

- Support Syntax Highlight
- Support AutoComplete
- Allow to add/custom Operator
- Allow to custom AutoComplete rendering 
- The result of filter is in Json format

##Getting started:

Install react-filter-box using npm.

``npm install react-filter-box``

Import library, and default stylesheet.

``import ReactFilterBox, {AutoCompleteOption,SimpleResultProcessing} from "react-filter-box";``   
``import "react-filter-box/lib/react-filter-box.css"``   

##How to use:


Demo: https://nhabuiduc.github.io , which includes source code.

Simple case:

```javascript
import ReactFilterBox, {AutoCompleteOption,SimpleResultProcessing} from "react-filter-box";
import "react-filter-box/lib/react-filter-box.css"


export default class App extends React.Component {
    
    constructor(props){
        super(props);

         this.options = [
            {
                columField: "Name",
                type:"text"
            },
            {
                columField: "Description",
                type:"text"
            },
            {
                columField: "Status",
                type:"selection" // when using type selection, it will automatically sugest all posible values
            },
            {
                columnText: "Email @",
                columField: "Email",
                type:"text"
            }
        ];
    }

    onParseOk(expressions){

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


##License: 

MIT License

Copyright (c) 2016 Bui Duc Nha

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
