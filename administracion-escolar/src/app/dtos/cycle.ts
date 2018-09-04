export class Cycle{
    constructor(public title:string, public startDate:string, public endDate:string, public status:string, public id?:number){

    }

    public static fromJson(element: any){
        return new Cycle(element.Title, element.FechaIncial, element.FechaFinal, element.Estado, element.Id);
    }
    public static fromJsonList(elements:any){
        var list=[];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }
}