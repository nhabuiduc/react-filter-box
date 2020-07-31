import * as _ from "lodash";
import Expression from './Expression';
import BaseAutoCompleteHandler from './BaseAutoCompleteHandler';

interface ValidationResult {
  isValid: boolean;
  message?: string;
}

const validateExpression = (
  expression: Expression,
  autoCompleteHandler: BaseAutoCompleteHandler
) : ValidationResult => {

  let result: ValidationResult = { isValid: true };
  const expressions = expression.expressions;

  if (expressions === undefined) {
    if (autoCompleteHandler.hasCategory(expression.category) === false) {
      result = {
        isValid: false,
        message: `Invalid category '${expression.category}' in expression ${expression.category} ${expression.operator} ${expression.value}`
      };
    } else if (autoCompleteHandler.hasOperator(expression.category, expression.operator) === false) {
      result = {
        isValid: false,
        message: `Invalid operator '${expression.operator}' in expression ${expression.category} ${expression.operator} ${expression.value}`
      };
    }
  } else if (expressions) {
    _.find(expressions, expr => {
      result = validateExpression(expr, autoCompleteHandler);
      return result.isValid === false;
    });
  } 

  return result;
}


const validateQuery = (
    parsedQuery: Expression [],
    autoCompleteHandler: BaseAutoCompleteHandler
  ) : ValidationResult => {

  let result: ValidationResult = { isValid: true };
  _.find(parsedQuery, expr => {
    result = validateExpression(expr, autoCompleteHandler);
    return result.isValid === false;
  });

  return result;
}

export default validateQuery;

export {
  ValidationResult
}