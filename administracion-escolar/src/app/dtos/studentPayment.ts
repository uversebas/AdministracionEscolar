export class StudentPayment{
    constructor(public studentId:number, public conceptId:number, public amount:number, public isPayment:boolean,public id?:number,public monthId?:number ,public paymentDate?:string,public cycleName?:string, public conceptName?:string, public monthName?:string){}

    public static fromJson(element: any){
        return new StudentPayment(element.AlumnoId,element.ConceptoId,element.Monto,element.Pagado, element.Id,element.MesId);
    }
    public static fromJsonList(elements:any){
        var list=[];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }

    public static fromJsonExpand(element: any){
        return new StudentPayment(element.AlumnoId,element.Concepto.ID,element.Monto,element.Pagado,element.Id,element.Mes.ID,element.FechaPago,element.Ciclo.Title, element.Concepto.ConceptoCalculado, element.Mes.Title);
    }
    public static fromJsonListExpan(elements:any){
        var list=[];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJsonExpand(elements[i]));
        }
        return list;
    }
}