export interface ModificationNote {
    modified_on: Date;
    modified_by: String;
    modification_note: String;
}

export const ModificationNote = {
    modified_on: Date,
    modified_by: String,
    modification_note: String
}


interface ResponseStatusCodes{
    success : number,
    bad_request : number,
    internal_server_error : number
}

export const ResponseStatusCodes:ResponseStatusCodes = {
    success: 200,
    bad_request: 400,
    internal_server_error: 500
}

export interface ResponseObject{
    status:String,
    message:String,
    data:any
}