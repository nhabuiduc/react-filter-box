import * as React from "react";
import { expect } from 'chai';
import FilterInput from "../src/FilterInput";
import {shallow, mount} from "enzyme";

describe("#FilterInput",()=>{
    describe("#findLastSeparatorPositionWithEditor",()=>{
        function getMockCodeMirro(query:string) {
            return {
                getDoc: sinon.stub().returns({
                    getCursor: sinon.stub().returns({
                        line: 10,
                        ch:query.length
                    }),
                    getRange: sinon.stub().returns(query)
                })
            } as any
        }
        it("should return correct index", ()=>{
            var instance = shallow(<FilterInput />).instance() as FilterInput; 
            var currentQuery = "category contains something";
            
            instance.codeMirror =getMockCodeMirro(currentQuery);

            var result = instance.findLastSeparatorPositionWithEditor();

            expect(result.line).to.eq(10);
            expect(result.ch).to.eq("category contains ".length);
        })
    })
})