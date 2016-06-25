import  React from 'react';
import  _ from "lodash";

import ReactFilterBox, {AutoCompleteOption,SimpleResultProcessing,Expression} from "react-filter-box";

 import IconHappy  from 'react-icons/lib/fa/smile-o';
 import IconSad  from 'react-icons/lib/fa/frown-o';


export default class Demo4 extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            isOk:true
        }

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
                type:"selection"
            },
            {
                columnText: "Email @",
                columField: "Email",
                type:"text"
            }
        ];
    }

    onChange(query,result){
        this.setState({isOk:!result.isError})
    }

    renderIcon(){
        var style = {
            marginTop: 10,
            marginLeft:5
        }
        return this.state.isOk ? <IconHappy size={20} color="#2196F3" style={style}/> : 
        <IconSad size={20} style={style} color="red" />
    }

    render(){
        var rows = this.state.data;
         return <div className="main-container"> 
        
         <h3> Add your ok or error icon <span style={{fontSize:12,color:"darkgray"}}>(select Status will show values auto complete) </span>
            <a style={{fontSize:12, color:"#2196F3"}} href="https://github.com/nhabuiduc/react-filter-box/blob/master/js-example/src/demo4.js">Source</a>
         </h3>
         
         <div className="demo-4-filter-wrapper">
            <div className="demo-4-filter">
            <ReactFilterBox 
                    
                    query={this.state.query}
                    options={this.options}
                    onChange={this.onChange.bind(this)}
                     />
            </div>
            

            {this.renderIcon()}

         </div>
                            
        </div>
    }
}