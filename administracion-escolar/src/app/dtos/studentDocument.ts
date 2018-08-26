export class StudentDocument{
    name:string;
    content:string|any;

    constructor(name:string, content: string|any){
        this.name = name;
        this.content = content;
    }
}