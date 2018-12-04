import * as PEG from "pegjs";


interface ParsedError extends PEG.PegjsError {
    isError: boolean
}

export default ParsedError;