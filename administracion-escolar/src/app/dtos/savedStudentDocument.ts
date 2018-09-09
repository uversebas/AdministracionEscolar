import { environment } from '../../environments/environment';
export class SavedStudentDocument {

    constructor(public name: string, public urlDownload: string, public urlPreview: string, public validity: string, public id?: number) {

    }

    public static fromJson(element: any) {
        return new SavedStudentDocument(element.Title, environment.web + element.UrlDescarga, element.ServerRedirectedEmbedUri, element.Vigencia, element.Id);
    }

    public static fromJsonList(elements: any) {
        var list = [];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }
}