/*
 * Grammar
 * ==========================
 *
 * Accepts expressions like: nha == nhat AND (nhat == nha or "nhat " contains "tt") OR nhat == "test"
 */

Expression
  = _ head:Condition tail:(ws ("AND"i / "OR"i) ws Condition)* _ {
      var result = [head]

      for (var i = 0; i < tail.length; i++) {
        var current = tail[i][3];
        current.conditionType = tail[i][1];
        result.push(current);
      }

      return result;
    }

Condition
  = "(" _ expr:Expression _ ")" 
  		{   
        	return {expressions:expr}; 
        }
  / ThreeFactorCondition 
  
ThreeFactorCondition
  = category:ValidName ws operator:Operator ws value:ValidValue 
  			{ 
            	
            	return {
                	category : category,
                    operator: operator,
                    value: value
                }; 
            } 
  
Operator "operator"
  = ValidToken+  { parser.parseTrace.pushOperator(text()); return text(); }
  

ValidValue "value"
  = ValidToken+ { parser.parseTrace.pushValue(text() ); return text(); }  
  /"\"" name:[^\"]* "\"" {
        var value = name.join("");
        parser.parseTrace.pushValue(value);
        return value;
      }
ValidName  "category"
  = ValidToken+ { parser.parseTrace.pushCategory(text() ); return text(); }  
  /"\"" name:[^\"]* "\"" {
        var value = name.join("");
        parser.parseTrace.pushCategory(value);
        return value;
      }
ValidToken
  = [^ \(\)\"\t\n\r]

ws "whitespace"
  = [ \t\n\r]+
  
_ "whitespace"
  = [ \t\n\r]*