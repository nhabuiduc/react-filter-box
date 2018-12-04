import * as CodeMirror from "codemirror";

CodeMirror.defineMode<ModeState>("filter-mode", function (config: CodeMirror.EditorConfiguration, modeOptions?: any) {
    function getNextFieldState(fieldState: FieldStates) {
        if (fieldState == FieldStates.category) return FieldStates.operator;
        if (fieldState == FieldStates.operator) return FieldStates.value;
        if (fieldState == FieldStates.value) return FieldStates.category;
    }

    function setNextFieldState(state: ModeState): string {
        var nextFieldState = getNextFieldState(state.fieldState);
        var currentFieldState = state.fieldState;

        state.fieldState = nextFieldState;

        return currentFieldState.toString();
    }

    function isEmpty(char: string) {
        return char == " " || char == "\r" || char == "\n" || char == "\t";
    }

    return {
        startState: function (): ModeState {
            return {
                inString: false,
                fieldState: FieldStates.category
            };
        },
        token: function (stream: CodeMirror.StringStream, state: ModeState): string {

            if (isEmpty(stream.peek())) {
                stream.eatSpace();
                return null;
            }

            if (stream.peek() == "(" || stream.peek() == ")") {
                stream.next();
                return "bracket";
            }

            if (stream.match("AND", true, true) || stream.match("OR", true, true)) {
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

class FieldStates {
    static none = "none";
    static category = "category";
    static operator = "operator";
    static value = "value";
}

interface ModeState {
    inString: boolean;
    fieldState: FieldStates;
}