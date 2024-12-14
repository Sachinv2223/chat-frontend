export const commonService = {
    catchError: async <T>(promise: Promise<T>): Promise<any[] | [undefined, T]> => {
        return promise
            .then(data => [undefined, data] as [undefined, T])
            .catch(error => [error]);
    }
};