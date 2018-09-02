export class Grade{
    constructor(public Title:string, public abbreviation:string, public Id?:number){}

    public static fromJson(element: any){
        return new Grade(element.Title, element.Abreviatura, element.Id);
    }
    public static fromJsonList(elements:any){
        var list=[];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }
}