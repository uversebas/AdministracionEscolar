export class StudentDocument{
    name:string;
    type:string;
    value:string|any;

    constructor(name:string, type:string, value: string|any){
        this.name = name;
        this.type = type;
        this.value = value;
    }
}