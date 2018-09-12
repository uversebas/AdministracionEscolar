export class StudentPayment{
    constructor(public studentId:number, public conceptId:number, public amount:number, public monthId?:number, public id?:number, public conceptName?:string, public monthName?:string){}

    public static fromJson(element: any){
        return new StudentPayment(element.AlumnoId,element.ConceptoId,element.Monto,element.MesId, element.Id);
    }
    public static fromJsonList(elements:any){
        var list=[];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }

    public static fromJsonExpand(element: any){
        return new StudentPayment(element.AlumnoId,element.Concepto.ID,element.Monto,element.Mes.ID, element.Id, element.Concepto.ConceptoCalculado, element.Mes.Title);
    }
    public static fromJsonListExpan(elements:any){
        var list=[];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJsonExpand(elements[i]));
        }
        return list;
    }
}