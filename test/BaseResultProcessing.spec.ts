import * as React from "react";
import { expect } from 'chai';
import BaseResultProcessing from "../src/BaseResultProcessing";
import Expression from "../src/Expression";

describe("#BaseResultProcessing",()=>{
    var processing: BaseResultProcessing ;
    var object1 = {field:"value"}
    var data = [object1];
    var filterStub: Sinon.SinonStub;
    beforeEach(()=>{
        processing = new BaseResultProcessing();
        filterStub = sinon.stub();
        
        processing.filter = filterStub;

    })

    function buildExpression(conditionType?:"OR"|"AND", category?:string,operator?:string,value?:string, nestedExpressions?:Expression[]):Expression {
        return {
            conditionType: conditionType,
            category:category || "category",
            operator:operator || "operator",
            value:value || "value",
            expressions: nestedExpressions
        }
    }

    describe("#process",()=>{
        it("should process ok with result empty", ()=>{
                  
            var result = processing.process(data,[]);
            expect(filterStub.calledWith(sinon.match.any,"category","operator","value")).to.be.false;

            expect(result[0].field).to.eq("value");            
        })

        it("should process ok with expression has only one condition", ()=>{
            var expression = buildExpression();
            filterStub.returns(true);

            var result = processing.process(data,[expression]);
            
            expect(filterStub.calledWith(sinon.match.any,"category","operator","value")).to.be.true;
            expect(filterStub.callCount).to.eq(1);

            expect(result[0].field).to.eq("value");            
        })

        it("should process ok with expression has in one level of bracket", ()=>{
            var expression:Expression = {
                expressions: [buildExpression()]
            }
            filterStub.returns(true);

            var result = processing.process(data,[expression]);
            
            expect(filterStub.calledWith(sinon.match.any,"category","operator","value")).to.be.true;
            expect(filterStub.callCount).to.eq(1);

            expect(result[0].field).to.eq("value");            
        })

        it("should process ok with expression has in 2 level of bracket", ()=>{
            var expression:Expression = {
                expressions: [{
                    expressions:[buildExpression()]
                }]
            }
            filterStub.returns(true);

            var result = processing.process(data,[expression]);
            
            expect(filterStub.calledWith(sinon.match.any,"category","operator","value")).to.be.true;
            expect(filterStub.callCount).to.eq(1);

            expect(result[0].field).to.eq("value");            
        })

         it("should process in correct order and operator with 2 expressions", ()=>{
            var expressions:Expression[] = [buildExpression(),buildExpression("OR","c1","!=","v1")];
            filterStub.onCall(0).returns(false);
            filterStub.onCall(1).returns(true);

            var result = processing.process(data,expressions); 
            
            expect(filterStub.callCount).to.eq(2);
            expect(filterStub.getCall(0).calledWith(sinon.match.any,"category","operator","value")).to.be.true;
            expect(filterStub.getCall(1).calledWith(sinon.match.any,"c1","!=","v1")).to.be.true;

            expect(result[0].field).to.eq("value");            
        })

        it("should process in correct order and operator with 2 expressions in bracket", ()=>{
            var expressions:Expression[] = [{
                expressions: [buildExpression(),buildExpression("OR","c1","!=","v1")]
            }];
            filterStub.onCall(0).returns(false);
            filterStub.onCall(1).returns(false);

            var result = processing.process(data,expressions); 
            
            expect(filterStub.callCount).to.eq(2);
            expect(filterStub.getCall(0).calledWith(sinon.match.any,"category","operator","value")).to.be.true;
            expect(filterStub.getCall(1).calledWith(sinon.match.any,"c1","!=","v1")).to.be.true;

            expect(result.length).to.eq(0);            
        })

        it("should process in correct order and operator with 2 expressions in double level bracket", ()=>{
            var expressions:Expression[] = [{
                expressions:[{
                    expressions: [buildExpression(),buildExpression("OR","c1","!=","v1")]
                }]
            }];
            filterStub.onCall(0).returns(false);
            filterStub.onCall(1).returns(false);

            var result = processing.process(data,expressions); 
            
            expect(filterStub.callCount).to.eq(2);
            expect(filterStub.getCall(0).calledWith(sinon.match.any,"category","operator","value")).to.be.true;
            expect(filterStub.getCall(1).calledWith(sinon.match.any,"c1","!=","v1")).to.be.true;

            expect(result.length).to.eq(0);            
        })

         it("should process in correct order with 3 expressions", ()=>{
            var expressions:Expression[] = [buildExpression(),{
                conditionType:"AND",
                expressions:[buildExpression(undefined, "c1","!=","v1"),buildExpression("OR", "c2","!=","v2")]
            }];

            filterStub.onCall(0).returns(true);
            filterStub.onCall(1).returns(false);
            filterStub.onCall(2).returns(false);

            var result = processing.process(data,expressions); 
            
            expect(filterStub.callCount).to.eq(3);
            expect(filterStub.getCall(0).calledWith(sinon.match.any,"category","operator","value")).to.be.true;
            expect(filterStub.getCall(1).calledWith(sinon.match.any,"c1","!=","v1")).to.be.true;
            expect(filterStub.getCall(2).calledWith(sinon.match.any,"c2","!=","v2")).to.be.true;

            expect(result.length).to.eq(0);            
        })

        it("should process in correct order with complex strucuter", ()=>{
            var expressions = JSON.parse(`[
   {
      "category":"c1",
      "operator":"==",
      "value":"v1"
   },
   {
      "expressions":[
         {
            "expressions":[
               {
                  "expressions":[
                     {
                        "category":"c2",
                        "operator":"==",
                        "value":"v2"
                     }
                  ]
               }
            ]
         },
         {
            "category":"c3",
            "operator":"==",
            "value":"v3",
            "conditionType":"OR"
         },
         {
            "expressions":[
               {
                  "expressions":[
                     {
                        "category":"c4",
                        "operator":"==",
                        "value":"v4"
                     }
                  ]
               },
               {
                  "expressions":[
                     {
                        "category":"c5",
                        "operator":"==",
                        "value":"v5"
                     }
                  ],
                  "conditionType":"AND"
               }
            ],
            "conditionType":"OR"
         }
      ],
      "conditionType":"AND"
   }
]`);

            filterStub.onCall(0).returns(true);
            filterStub.onCall(1).returns(false);
            filterStub.onCall(2).returns(false);
            filterStub.onCall(3).returns(true);
            filterStub.onCall(4).returns(false);

            var result = processing.process(data,expressions); 
            
            expect(filterStub.callCount).to.eq(5);            
            expect(filterStub.getCall(0).calledWith(sinon.match.any,"c1","==","v1")).to.be.true;
            expect(filterStub.getCall(1).calledWith(sinon.match.any,"c2","==","v2")).to.be.true;
            expect(filterStub.getCall(2).calledWith(sinon.match.any,"c3","==","v3")).to.be.true;
            expect(filterStub.getCall(3).calledWith(sinon.match.any,"c4","==","v4")).to.be.true;
            expect(filterStub.getCall(4).calledWith(sinon.match.any,"c5","==","v5")).to.be.true;

        })
    });
})