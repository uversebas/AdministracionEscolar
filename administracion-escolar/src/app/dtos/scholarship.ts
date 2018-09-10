export class Scholarship{
    constructor(public studentId:number, public conceptId:number, public amount:number, public porcentage:number, public statusId:number, public paymentDay:number,
                 public id?:number, public conceptName?:string, public conceptAmount?:number){}

    public static fromJson(element: any){
        return new Scholarship(element.AlumnoId, element.ConceptoId, element.Monto, element.Porcentaje, element.EstatusId, element.PagoOportuno, element.Id);
    }
    public static fromJsonList(elements:any){
        var list=[];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }
}