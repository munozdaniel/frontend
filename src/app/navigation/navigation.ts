import { DesignNavigation } from '@design/types';

export const navigation: DesignNavigation[] = [
  {
    id: 'home',
    title: 'Home',
    type: 'item',
    icon: 'home',
    url: '/home',
  },
  {
    id: 'parametrizar',
    title: 'Parametrización',
    type: 'collapsable',
    children: [
      {
        id: 'parametrizar_alumnos',
        title: 'Alumnos',
        type: 'item',
        icon: 'group',
        url: '/parametrizar/alumnos',
      },
      {
        id: 'parametrizar_asignatura',
        title: 'Asignatura',
        type: 'item',
        icon: 'assignment',
        url: '/parametrizar/asignaturas',
      },
      {
        id: 'parametrizar_profesores',
        title: 'Profesores',
        type: 'item',
        icon: 'school',
        url: '/parametrizar/profesores',
      },
    ],
  },
  {
    id: 'taller',
    title: 'Taller',
    type: 'collapsable',
    children: [
      {
        id: 'taller_seguimiento_alumnos',
        title: 'Ficha de Alumnos',
        type: 'item',
        icon: 'portrait',
        url: '/taller/ficha-alumno',
      },
      {
        id: 'taller_seguimiento',
        title: 'Seguimiento de Alumnos',
        type: 'item',
        icon: 'supervised_user_circle',
        url: '/taller/seguimiento-alumnos',
      },
      {
        id: 'taller_planilla',
        title: 'Planillas de Taller',
        type: 'item',
        icon: 'build',
        url: '/taller/planillas',
      },
      {
        id: 'taller_inasistencias_alumnos',
        title: 'Email de Inasistencias',
        type: 'item',
        icon: 'email',
        url: '/taller/inasistencias-alumno',
      },
      //   {
      //     id: 'taller_tomar_asistencia',
      //     title: 'Tomar Asistencia',
      //     type: 'item',
      //     icon: 'pan_tool',
      //     url: '/lite/tomar-asistencia',
      //   },
    ],
  },
  {
    id: 'informes',
    title: 'Informes',
    type: 'collapsable',
    children: [
      {
        id: 'informes_por_plailla',
        title: 'Planilla Taller',
        type: 'item',
        icon: 'assignment',
        url: '/informes/asistencia-por-taller',
      },
      {
        id: 'informes_asistencias_por_fecha',
        title: 'Asistencias por Fecha',
        type: 'item',
        icon: 'assignment',
        url: '/informes/asistencias-por-fecha',
      },
      //   {
      //     id: 'informes_por_inasistencias',
      //     title: 'Inasistencias Diarias',
      //     type: 'item',
      //     icon: 'assignment',
      //     url: '/informes/inasistencias-diarias',
      //   },
      //   {
      //     id: 'informes_por_inasistencias_semanal',
      //     title: 'Inasistencias Semanal',
      //     type: 'item',
      //     icon: 'assignment',
      //     url: '/informes/inasistencias-semanal',
      //   },
    ],
  },
];
