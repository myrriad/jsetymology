// cached stuff
// let wtffetch: (titleOrId: string | number | number[] | string[], options?: Record<string, any>, callback?: (error: unknown, result: null | wtf.Document | wtf.Document[]) => void) => Promise<null | wtf.Document | wtf.Document[]>;
// let wtffetch = typeof wtffetch;
declare let wtffetch: (titleOrId: string | number | number[] | string[], 
    options?: Record<string, any> | undefined, 
    cachedresponse?: wtf.Document | undefined, 
    callback?: ((error: unknown, result: null | wtf.Document | wtf.Document[]) => void) | undefined) 
    => Promise<null | wtf.Document | wtf.Document[]>; // 
