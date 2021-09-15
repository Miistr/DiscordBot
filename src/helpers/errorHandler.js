/**
 * @class ResponseError
 * @extends {Error} @native
 * @example
 * if (error instanceOf 'ResponseError'){
 *  console.log(error.cause)
 *  console.log(error.response)
 * }
 */
export class ResponseError extends Error {
    /**
     * @param {object} response Axios response object.
     * @param {object} error Native JavaScript `Error` object
     */
    constructor(response, error) {
        const { data, headers, status, statusText } = response
        const sanitizedError = {
            ...(data && data.errors && { errors: JSON.stringify(data.errors) }),
            ...(status && { status }),
            ...(statusText && { statusText }),
            ...(headers && { headers }),
        }
        const errorMessage = `ResponseError: ${JSON.stringify(sanitizedError)}`

        super(errorMessage)
        this.cause = error
        this.response = response
    }
}

const handleError = (error, description) => {
    let capturedError = error

    if (error.response) {
        capturedError = new ResponseError(error.response, error)
    }

    // Adds the description to the capturedError.message if description is defined.
    if (description) {
        capturedError.message += ` - ${description}`
    }

    throw capturedError
}

export default handleError
