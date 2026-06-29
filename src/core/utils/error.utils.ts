import { APIErrorResult, FieldError } from "../types/validationError";

export const createErrorMessages = (errors: FieldError[]): APIErrorResult => {
    return { errorsMessages: errors };
}