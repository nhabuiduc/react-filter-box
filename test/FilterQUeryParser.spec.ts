import * as React from "react";
import { expect } from 'chai';
import FilterQueryParser from "../src/FilterQueryParser";
import Expression from "../src/Expression";

describe("#FilterQueryParser",()=>{
    var parser:FilterQueryParser;
     beforeEach(()=>{
         
        parser = new FilterQueryParser();

    })

    function assertExpression(expression:Expression, category:string,operator:string,value:string){
        expect(expression.category).to.eq(category);
        expect(expression.operator).to.eq(operator);
        expect(expression.value).to.eq(value); 
            
    }

    describe("#parse", ()=>{
        it("should parse empty string correctly",()=>{
            var result = parser.parse("") as Expression[];

            expect(result.length).to.eq(0); 
        })

        it("should return one expression ",()=>{
            var result = parser.parse("category == 2") as Expression[];
             expect(result).to.deep.eq(JSON.parse(`[
   {
      "category":"category",
      "operator":"==",
      "value":"2"
   }
]`));

           
        })

         it("should return one expression in one level bracket",()=>{
            var result = parser.parse("(category == 2)") as Expression[];
             
            expect(result).to.deep.eq(JSON.parse(`[
   {
      "expressions":[
         {
            "category":"category",
            "operator":"==",
            "value":"2"
         }
      ]
   }
]`));
            
        })

        it("should return one expression in 2 level bracket",()=>{
            var result = parser.parse("((category == 2))") as Expression[];
             expect(result).to.deep.eq(JSON.parse(`[
   {
      "expressions":[
         {
            "expressions":[
               {
                  "category":"category",
                  "operator":"==",
                  "value":"2"
               }
            ]
         }
      ]
   }
]`));

            
        })

         it("should return 2 expressions",()=>{
            var result = parser.parse("category == 2 OR category2 == 3") as Expression[];
             expect(result).to.deep.eq(JSON.parse(`[
   {
      "category":"category",
      "operator":"==",
      "value":"2"
   },
   {
      "category":"category2",
      "operator":"==",
      "value":"3",
      "conditionType":"OR"
   }
]`));
        })

        it("should return 2 expressions in bracket",()=>{
            var result = parser.parse("(category == 2 OR category2 == 3)") as Expression[];

            
           expect(result).to.deep.eq(JSON.parse(`[
   {
      "expressions":[
         {
            "category":"category",
            "operator":"==",
            "value":"2"
         },
         {
            "category":"category2",
            "operator":"==",
            "value":"3",
            "conditionType":"OR"
         }
      ]
   }
]`));
        })

        it("should return 2 expressions in double level bracket",()=>{
            var result = parser.parse("((category == 2 OR category2 == 3))") as Expression[];

            expect(result).to.deep.eq(JSON.parse(`[
   {
      "expressions":[
         {
            "expressions":[
               {
                  "category":"category",
                  "operator":"==",
                  "value":"2"
               },
               {
                  "category":"category2",
                  "operator":"==",
                  "value":"3",
                  "conditionType":"OR"
               }
            ]
         }
      ]
   }
]`))
        })

        it("should return 3 expressions with correct nested structure ",()=>{
            var result = parser.parse("category == 2 AND (category2 == 3 OR c3 == 4 )") as Expression[];

            expect(result).to.deep.eq(JSON.parse(`[
   {
      "category":"category",
      "operator":"==",
      "value":"2"
   },
   {
      "expressions":[
         {
            "category":"category2",
            "operator":"==",
            "value":"3"
         },
         {
            "category":"c3",
            "operator":"==",
            "value":"4",
            "conditionType":"OR"
         }
      ],
      "conditionType":"AND"
   }
]`));
            
        })

         it("should return correct expressions with complex query ",()=>{
            var result = parser.parse("c1 == v1 AND (((c2 == v2)) OR c3 == v3 OR ( (c4 == v4) AND (c5 == v5) ) )") as Expression[];

            //console.log(JSON.stringify(result));

            var obj = JSON.parse(`[
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

        expect(result).to.deep.eq(obj);
            
        })
    })
})