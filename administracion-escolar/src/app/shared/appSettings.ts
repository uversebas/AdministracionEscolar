export class AppSettings{

    public static generateStudentKey(idStudent:number, month:number, year:number, abbreviationStage:string){
        return abbreviationStage+year+("0" + (month + 1)).slice(-2)+'-'+this.generateID(idStudent);
    }

    static generateID(number) {
        if (number < 10) {
            return '00' + number;
        } else {
            return (number < 99 ? '0' : '') + number;
        }
     }

     static getDataTableConfiguration(){
        let dtOptions = {
            destroy:true,
            // Declare the use of the extension in the dom parameter
            dom: 'Bfrtip',
            // Configure the buttons
            buttons: [
              'copy',
              'print',
              'pdf',
              'excel'
            ],
            language:{
              'info':'Pagina _PAGE_ de _PAGES_',
              'zeroRecords':'No hay estudiantes.',
              'search': 'Buscar',
              'paginate': {
                "first":      "Primero",
                "last":       "Último",
                "next":       "Siguiente",
                "previous":   "Previo"
              },
              "loadingRecords": "Cargando...",
              "processing":     "Procesando...",
            },
            pagingType: 'full_numbers',
            pageLength: 10
          };

          return dtOptions;
     }
}