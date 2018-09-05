

export class PendingStudentDocument{
    public id: number;
    public file: File;

    constructor(id: number, file: File) {
        this.id = id;
        this.file = file;
      }
}