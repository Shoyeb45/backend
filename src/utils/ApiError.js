// We'll define our own API error which will extend Error class, and we can modify the error format as per our requirement

/**
 * A class to handle the error in application
 */
class ApiError extends Error {

    let 
    
    /**
     * 
     * @param {*} statusCode Represents the HTTP status code of the error, making it easy to identify the type of error.
     * @param {*} message Stores the error message, which is already set by super(message) but is explicitly assigned here for clarity.
     * @param {*} errors Stores additional error details, such as validation errors or nested error information.
     * @param {*} stack Optional parameter to specify the stack trace manually. Defaults to an empty string if not provided.
     */
    constructor(
        statusCode,
        message = "Something went wrong", // If no message is provided then default message
        errors = [],
        stack = ""
    ) {
        super(message);
        this.statusCode = statusCode;

        /**
         * A placeholder property for any additional data related to the error. This can be useful for API responses where you want to include extra context.
         */
        this.data = null;               
        this.message = message;

        /**
         * Indicates the failure of the operation. Typically, a property like this is included in API error objects for consistency with successful responses.
         */
        this.success = false;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor); // It generates a stack trace and excludes the ApiError constructor itself from the trace, focusing only on the relevant part of the call stack.
        }
    }
}

export { ApiError };