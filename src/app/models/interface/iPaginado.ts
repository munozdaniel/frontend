export interface IPaginado {
  //   previousPageIndex: number;
  //   pageIndex: number;
  //   pageSize: number;
  //   length: number;
  // Nueva paginacion
  currentPage?: number; // number
  pageSize?: number; // number
  //   orderBy?: any;
  sortField: string;
  sortBy: string; //{nombre:valor}
  search: string; // string
  //   list?: any;
}
