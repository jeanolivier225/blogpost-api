
export const extractResponseValidationErrors = ({ errors }: any) => {
    
    const responseErrors = [];
    
    for(let error in errors) {
        responseErrors.push(errors[error][0]);
    }
    
    return responseErrors;
    
}

