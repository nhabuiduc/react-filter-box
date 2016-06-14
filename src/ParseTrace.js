export default class ParseTrace {
  constructor(){
    this.arr = [];  
  }
  
  push(item){
    this.arr.push(item);
    console.log(item);; 
  }
  
  clear(){
    this.arr = [];
  }
  
  getLastOperator(){
    return _.findLast(this.arr, f=>f.type == "operator").value;
  }
  
  getLastCategory(){
    return _.findLast(this.arr, f=>f.type == "category").value;
  }
  
  getLastTokenType(){
    if(this.arr.length <=0) return null;
    return _.last(this.arr).type;
  }
  
  pushOperator(operator){
    this.push({type:"operator", value:operator})
  }
  
  pushCategory(category){
    this.push({type:"category", value:category})
  }
  
  pushValue(value){
    this.push({type:"value", value:value})
  }
  
}
