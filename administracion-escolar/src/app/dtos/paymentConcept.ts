

export class PaymentConcept{
    constructor(public title:string, public amount:number, public stageChoolId:number, public status:string, public isOption:boolean,public dues:boolean ,  public id?:number, public checked?:boolean, public duesCounter?:number){}

    public static fromJson(element: any){
        return new PaymentConcept(element.Concepto, element.Monto,element.DivisionId, element.Estado, element.Opcional,element.ManejaCuotas,element.Id);
    }
    public static fromJsonList(elements:any){
        var list=[];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }
}

