export class MenuAdministracionEscolar{
    constructor(public Title:string, public Descripcion:string, public NombreRouter:string, public Image?:string,public RouterFinal?:string,public Id?:number){}

    public static fromJson(element: any){
            return new MenuAdministracionEscolar(element.Title,element.Descripcion,element.NombreRouter,element.ImagenMenu.Url,element.RouterFinal,element.ID);
    }
    public static fromJsonList(elements:any){
        var list=[];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }

}