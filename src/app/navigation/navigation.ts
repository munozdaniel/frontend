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
        icon: 'tab',
        url: '/parametrizar/asignaturas',
      },
      {
        id: 'parametrizar_profesores',
        title: 'Profesores',
        type: 'item',
        icon: 'accessibility_new',
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
    ],
  },
  {
    id: 'informes',
    title: 'Informes',
    type: 'collapsable',
    children: [
      {
        id: 'informes_asistencia_por_taller',
        title: 'Asistencia por Taller',
        type: 'item',
        icon: 'users',
        url: '/informes/asistencia-por-taller',
      },
      {
        id: 'informes_asistencia_por_dia',
        title: 'Asistencia por Día',
        type: 'item',
        icon: 'users',
        url: '/informes/asistencia-por-dia',
      },
      {
        id: 'informes_calificaciones_por_taller',
        title: 'Calificaciones Por Taller',
        type: 'item',
        icon: 'users',
        url: '/informes/calificaciones-por-taller',
      },
      {
        id: 'informes_calificaciones_por_taller_resumido',
        title: 'Calificaciones Por Taller (Resumen)',
        type: 'item',
        icon: 'users',
        url: '/informes/calificaciones-por-taller-resumen',
      },
      {
        id: 'informes_libro_tema',
        title: 'Libro de Temas',
        type: 'item',
        icon: 'users',
        url: '/informes/libro_temas',
      },
      {
        id: 'informes_alumno_por_taller',
        title: 'Alumnos por Taller',
        type: 'item',
        icon: 'users',
        url: '/informes/alumnos-por-taller',
      },
      {
        id: 'informes_taller_por_alumno',
        title: 'Taller por Alumnos',
        type: 'item',
        icon: 'users',
        url: '/informes/taller-por-alumno',
      },
    ],
  },
];
