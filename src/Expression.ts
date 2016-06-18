 interface Expression {
    conditionType?: "OR" | "AND";
    category: string;
    operator: string;
    value: string;
    expressions?:Expression[];
}

export default Expression;