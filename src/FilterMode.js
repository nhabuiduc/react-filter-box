import CodeMirror from "codemirror";

CodeMirror.defineMode("filter-mode", function () {


    var fieldStates = {
        none: "none",
        category: "category",
        operator: "operator",
        value: "value"
    }

    function getNextFieldState(fieldState) {
        if (fieldState == fieldStates.category) return fieldStates.operator;
        if (fieldState == fieldStates.operator) return fieldStates.value;
        if (fieldState == fieldStates.value) return fieldStates.category;
    }

    function setNextFieldState(state) {
        var nextFieldState = getNextFieldState(state.fieldState);
        var currentFieldState = state.fieldState;

        state.fieldState = nextFieldState;

        return currentFieldState;
    }

    function isEmpty(char) {
        return char == " " || char == "\r" || char == "\n" || char == "\t";
    }

    return {
        startState: function () {
            return {
                inString: false,
                fieldState: fieldStates.category
            };
        },
        token: function (stream, state) {
            
            if(isEmpty(stream.peek())){
                stream.eatSpace();
                return null;    
            }            
            
            if (stream.peek() == "(" || stream.peek() == ")") {
                stream.next();
                return "bracket";
            }
            
            if(stream.match("AND", true, true) || stream.match("OR", true,true)) {
                return "condition"
            }

            // If a string starts here
            if (!state.inString && stream.peek() == '"') {
                stream.next();            // Skip quote
                state.inString = true;    // Update state
            }

            if (state.inString) {
                if (stream.skipTo('"')) { // Quote found on this line
                    stream.next();          // Skip quote
                    state.inString = false; // Clear flag
                } else {
                    stream.skipToEnd();    // Rest of line is string
                }
                return setNextFieldState(state);          // Token style
            }

            stream.eatWhile(/[^\r\n\t\s\(\)]+/)
            return setNextFieldState(state);
            
        }
    };
});