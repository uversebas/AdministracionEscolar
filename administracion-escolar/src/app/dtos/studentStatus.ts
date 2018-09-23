export class StudentStatus{
    constructor(public title:string, public id:number, public loadDefault?:boolean){}

    public static fromJson(element: any){
        return new StudentStatus(element.Title,element.ID, element.ValorPorDefecto);
    }
    public static fromJsonList(elements:any){
        var list=[];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }
}