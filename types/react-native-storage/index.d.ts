export default class Storage{
    private size:number;
    private storageBackend:any;
    private defaultExpires:number;
    private enableCache:boolean
    private sync : any
    constructor(a: any):Storage;
    load:any;
    save:any;
};
