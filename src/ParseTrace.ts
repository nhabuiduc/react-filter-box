import * as _ from "lodash";

export default class ParseTrace {
    private arr: Array<TraceItem> = [];
    constructor() {
        this.arr = [];
    }

    push(item: TraceItem) {
        this.arr.push(item);
        // console.log(item);;
    }

    clear() {
        this.arr = [];
    }

    getLastOperator() {
        // console.log("last");
        return _.findLast(this.arr, f => f.type == "operator").value;
    }

    getLastCategory() {
        return _.findLast(this.arr, f => f.type == "category").value;
    }

    getLastTokenType() {
        if (this.arr.length <= 0) return null;
        return _.last(this.arr).type;
    }

    pushOperator(operator: string) {
        this.push({ type: "operator", value: operator })
    }

    pushCategory(category: string) {
        this.push({ type: "category", value: category })
    }

    pushValue(value: string) {
        this.push({ type: "value", value: value })
    }

}

interface TraceItem {
    type: string;
    value: string;
}