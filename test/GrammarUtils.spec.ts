import { expect } from 'chai';
import grammarUtils from "../src/GrammarUtils";

describe("#GrammarUtils", () => {
    describe("#stripEndSeparatorCharacters", () => {

        it("should return text end with separator character", () => {

            expect(grammarUtils.stripEndWithNonSeparatorCharacters("category contains something"))
                .to.eq("category contains ");

            expect(grammarUtils.stripEndWithNonSeparatorCharacters("category contains "))
                .to.eq("category contains ");

            expect(grammarUtils.stripEndWithNonSeparatorCharacters(""))
                .to.eq("");

            expect(grammarUtils.stripEndWithNonSeparatorCharacters("category contains )something"))
                .to.eq("category contains )");
        })
    })

    describe("#getEndNotSeparatorCharacers", () => {

        it("should return text have been trim", () => {

            expect(grammarUtils.getEndNotSeparatorCharacers("category contains something"))
                .to.eq("something");

            expect(grammarUtils.getEndNotSeparatorCharacers("category contains "))
                .to.eq("");

            expect(grammarUtils.getEndNotSeparatorCharacers(""))
                .to.eq("");

            expect(grammarUtils.getEndNotSeparatorCharacers("category contains )something"))
                .to.eq("something");

            expect(grammarUtils.getEndNotSeparatorCharacers("category"))
                .to.eq("category");
        })
    })
})