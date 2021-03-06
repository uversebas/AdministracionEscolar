export class Turn{
    constructor(public title:string, public id?:number, public loadDefault?:boolean){}

    public static fromJson(element: any){
        return new Turn(element.Title, element.Id, element.ValorPorDefecto);
    }
    public static fromJsonList(elements:any){
        var list=[];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }
}