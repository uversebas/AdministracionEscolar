export class SchoolStatus{
    constructor(public Title:string, public Id:number){}

    public static fromJson(element: any){
        return new SchoolStatus(element.Title,element.ID);
}
public static fromJsonList(elements:any){
    var list=[];
    for (var i = 0; i < elements.length; i++) {
        list.push(this.fromJson(elements[i]));
    }
    return list;
}
}