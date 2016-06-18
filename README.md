>## React Filter Box

A Simple filter box mainly used to filter DataTable,  which supports Condition AND/OR, 
and condition with struture Category-operator-Value. This library is inspired by React Structured Filter library,
but built completely different based on PEGjs and CodeMirror

For example: Column1 contains value1 AND (Column2 == Ok)

Demo: https://nhabuiduc.github.io

##Features:

- Support Syntax Highlight
- Support AutoComplete
- Allow to add/custom Operator
- The result of filter is in Json format

##How to use:

Simple case:

```javascript
import ReactFilterBox, {SimpleResultProcessing} from "../ReactFilterBox";    
import "../ReactFilterBox.less";


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
                            query={this.state.query}
                            data={data}
                            options={this.options}
                            onParseOk={this.onParseOk.bind(this)}
                            />
                    
                    </div>
    }
}
```


##License: MIT
