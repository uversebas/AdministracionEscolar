import { environment } from '../../environments/environment';
export class SavedStudentDocument{
    constructor(public name:string,public url:string){}

    public static fromJson(element: any){
        return new SavedStudentDocument(element.FileName,environment.baseUrl+ element.ServerRelativeUrl);
    }
public static fromJsonList(elements:any){
    var list=[];
    for (var i = 0; i < elements.length; i++) {
        list.push(this.fromJson(elements[i]));
    }
    return list;
}
}