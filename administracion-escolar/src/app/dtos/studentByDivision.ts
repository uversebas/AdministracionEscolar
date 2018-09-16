export class StudentByDivision {
    constructor(public name: string,public key:string ,public status:string, public division:string, public grade:string, public group:string) { }

    public static fromJson(element: any) {
        return new StudentByDivision(element.Title, element.ClaveAlumno, element.EstatusAlumno.Title,element.Division.Title,element.Grado.Title,element.Grupo.Title);
    }
    public static fromJsonList(elements: any) {
        var list = [];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }
}