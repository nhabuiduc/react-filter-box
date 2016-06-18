import * as _ from "lodash";
class GrammarUtils {

    isSeparator(c: string) {
        return c == " " || c == "\r" || c == "\n" || c == "\t" || c == "(" || c == ")";
    }

    isWhiteSpace(c:string) {
        return c == " " || c == "\r" || c == "\n" || c == "\t";
    }

    findLastSeparatorIndex(text: string) {
        return _.findLastIndex(text, f => this.isSeparator(f));
    }

    needSpaceAfter(char: string) {
        return !(char == "(");
    }

    isLastCharacterWhiteSpace(text:string){
        return !!text && this.isWhiteSpace(text[text.length - 1]); 
    }

    stripEndWithNonSeparatorCharacters(text: string) {
        if (!text) return text;

        if (this.isSeparator(text[text.length - 1])) {
            return text;
        }

        var index = this.findLastSeparatorIndex(text);
        if (index < 0) return "";
        return text.substr(0, index + 1) ;
    }

    getEndNotSeparatorCharacers(text: string) {
        if (!text) return text;

        if (this.isSeparator(text[text.length - 1])) {
            return "";
        }

        var index = this.findLastSeparatorIndex(text);
        if (index < 0) return text;

        return text.substr(index + 1);
    }
}

export default new GrammarUtils();