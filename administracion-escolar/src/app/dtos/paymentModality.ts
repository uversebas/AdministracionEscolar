export class PaymentModality{
    constructor(public title:string, public monthsIds:number[], public monthCounter:number , public id?:number){

    }

    public static fromJson(element: any){
        return new PaymentModality(element.Title, element.MesesId, element.NumeroMeses , element.Id);
    }
    public static fromJsonList(elements:any){
        var list=[];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }
}