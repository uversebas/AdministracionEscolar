export class Group{
    constructor(public title:string, public gradeId:number, public id?:number){}

    public static fromJson(element: any){
        return new Group(element.Title, element.GradoId, element.Id);
    }
    public static fromJsonList(elements:any){
        var list=[];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }
}