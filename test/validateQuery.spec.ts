import { expect } from 'chai';
import validateQuery from "../src/validateQuery";
import Expression from "../src/Expression";
import GridDataAutoCompleteHandler, { Option } from '../src/GridDataAutoCompleteHandler';
// import sinon = require("sinon");

describe("#validateQuery", () => {

    // common fixture data
    var options: Option[] = [
        {
            columnField: 'column1',
            columnText: 'Column1',
            type: 'text'
        },
        {
            columnField: 'column2',
            type: 'text'
        },
        {
            columnField: 'column3',
            columnText: 'Column3',
            type: 'text',
            customOperatorFunc: (category: string): string[] => {
                return ['**', 'in'];
            }
        }
    ];
    var autoCompleteHandler = new GridDataAutoCompleteHandler([], options);

    describe("#category validation (all operators are valid)", () => {
        
        it("with catogory matching columnField should return isValid set to true", () => {
            var expression: Expression[] = [
                {
                    category: 'column2',
                    operator: '==',
                }
            ];

            var result = validateQuery(expression, autoCompleteHandler);
            console.log(result);
            expect(result.isValid).to.be.true;
        });

        it("with catogory matching columnText should return isValid set to true", () => {
            var expression: Expression[] = [
                {
                    category: 'Column1',
                    operator: '==',
                }
            ];

            var result = validateQuery(expression, autoCompleteHandler);
            expect(result.isValid).to.be.true;
        });

        it("with non-matching category should return isValid set to false and set message", () => {
            var expression: Expression[] = [
                {
                    category: 'FakeColumn1',
                    operator: '==',
                }
            ];

            var result = validateQuery(expression, autoCompleteHandler);
            expect(result.isValid).to.be.false;
            expect(result.message.indexOf('Invalid category')).to.eq(0);
        });
    });

    describe("#operator validation (all categories are valid)", () => {
        it("with matching operator should return isValid set to true", () => {
            var expression: Expression[] = [
                {
                    category: 'Column1',
                    operator: '==',
                }
            ];

            var result = validateQuery(expression, autoCompleteHandler);
            expect(result.isValid).to.be.true;
        });

        it("with matching against custom operator function should return isValid set to true", () => {
            var expression: Expression[] = [
                {
                    category: 'Column3',
                    operator: '**',
                }
            ];

            var result = validateQuery(expression, autoCompleteHandler);
            expect(result.isValid).to.be.true;
        });

        it("with non-matching operator should return isValid set to false and set message", () => {
            var expression: Expression[] = [
                {
                    category: 'column1',
                    operator: '=',
                }
            ];

            var result = validateQuery(expression, autoCompleteHandler);
            expect(result.isValid).to.be.false;
            expect(result.message.indexOf('Invalid operator')).to.eq(0);
        });

        it("with non-matching custom operator should return isValid set to false and set message", () => {
            var expression: Expression[] = [
                {
                    category: 'column3',
                    operator: '==',
                }
            ];

            var result = validateQuery(expression, autoCompleteHandler);
            expect(result.isValid).to.be.false;
            expect(result.message.indexOf('Invalid operator')).to.eq(0);
        });
    });

    describe("#complex expression", () => {
        it("query with two conditions should return isValid set to true", () => {
            var expression: Expression[] = [
                {
                    conditionType: 'OR',
                    expressions: [
                        {
                            category: 'column2',
                            operator: '==',
                        },
                        {
                            category: 'column3',
                            operator: '**',
                        }
                    ]
                }
            ];

            var result = validateQuery(expression, autoCompleteHandler);
            expect(result.isValid).to.be.true;
        });

        it("query with two invalid conditions should return isValid set to false", () => {
            var expression: Expression[] = [
                {
                    conditionType: 'OR',
                    expressions: [
                        {
                            category: 'column4',  // invalid column
                            operator: '==',
                        },
                        {
                            category: 'column3',
                            operator: '<>',       // invalid operator
                        }
                    ]
                }
            ];

            var result = validateQuery(expression, autoCompleteHandler);
            expect(result.isValid).to.be.false;
            expect(result.message.indexOf('Invalid category')).to.eq(0);
        });

        it("valid query with nested conditions should return isValid set to true", () => {
            var expression: Expression[] = [
                {
                    conditionType: 'OR',
                    expressions: [
                        {
                            category: 'column1',
                            operator: '==',
                        },
                        {
                            conditionType: 'AND',
                            expressions: [
                                {
                                    category: 'column2',
                                    operator: 'contains',
                                },
                                {
                                    category: 'column3',
                                    operator: 'in',
                                }
                            ]
                        }
                    ]
                }
            ];

            var result = validateQuery(expression, autoCompleteHandler);
            expect(result.isValid).to.be.true;
        });

        it("query with invalid nested condition should return isValid set to false", () => {
            var expression: Expression[] = [
                {
                    conditionType: 'OR',
                    expressions: [
                        {
                            category: 'column1',
                            operator: '==',
                        },
                        {
                            conditionType: 'AND',
                            expressions: [
                                {
                                    category: 'column2',
                                    operator: 'contains',
                                },
                                {
                                    category: 'column3',
                                    operator: '==',  // invalid operator
                                }
                            ]
                        }
                    ]
                }
            ];

            var result = validateQuery(expression, autoCompleteHandler);
            expect(result.isValid).to.be.false;
            expect(result.message.indexOf('Invalid operator')).to.eq(0);
        });
    });
});