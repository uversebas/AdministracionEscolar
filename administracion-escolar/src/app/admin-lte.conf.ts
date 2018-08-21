import { environment } from '../environments/environment';
export var adminLteConf = {
    skin: 'blue',
    sidebarLeftMenu: [
      {label: 'Menu', route: '/menu', iconClasses: 'fa fa-th'},
      {label: 'Registrar nuevo alumno', route: '/registrar-alumno', iconClasses: 'fa fa-th'},
      {label: 'Actualizar datos de alumno', route: '/registrar-pago', iconClasses: 'fa fa-th'},
      {label: 'Reinscribir alumno', route: '/actualizar-alumno', iconClasses: 'fa fa-th'},
      {label: 'Registrar pago', route: '/reeinscribir-alumno', iconClasses: 'fa fa-th'},
      {label: 'Asignar o cambiar beca', route: '/beca', iconClasses: 'fa fa-th'},
      {label: 'Buscar alumno', route: '/buscar-alumno', iconClasses: 'fa fa-th'},
      {label: 'Volver al sitio', route: environment.web, iconClasses: 'fa fa-th'},

    ]
  };