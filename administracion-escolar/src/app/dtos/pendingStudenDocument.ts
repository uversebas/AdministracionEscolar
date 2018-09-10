export class PendingStudentDocument{
    public id: number;
    public validity: string;
    public file: File;

    constructor(id: number, validity: string, file: File) {
        this.id = id;
        this.validity = validity;
        this.file = file;
      }
}