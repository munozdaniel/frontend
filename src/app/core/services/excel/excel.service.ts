import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
// import * as Excel from 'exceljs/dist/exceljs.min.js';
import { Workbook } from 'exceljs/dist/exceljs.min.js';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  constructor() {}

  /*
   * Export As Excel File
   * -- Variables --
   * json: JSON DATA to Export
   * excelFileName: Excel File Name to the final user
   * replaceValues: True or false to replace 'EMPRESA' and 'ACTIVO' to the correct values
   * rowsToDelete: Delete rows in the export excel file
   */
  exportAsExcelFile(
    json: any[],
    excelFileName: string,
    replaceValues: boolean = false,
    rowsToDelete: Array<string> = null,
    type: string = ''
  ): void {
    // copyData for not modify data-binding
    const copyData = JSON.parse(JSON.stringify(json));

    // Checking values to replace or delete
    if (replaceValues) {
      this._findAndReplace(copyData, type);
    }
    if (rowsToDelete) {
      this._deleteRows(copyData, rowsToDelete);
    }

    // Magic import (excel)
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(copyData);
    const workbook: XLSX.WorkBook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelArray: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this._saveAsExcelFile(excelArray, excelFileName);
  }

  informesDataExportAsExcelFile(
    json: any[],
    columns: any[],
    excelFileName: string,
    replaceValues: boolean = false,
    rowsToDelete: Array<string> = null,
    type: string = ''
  ): void {
    // Initiliaze excel workbook
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('export-excel');

    // Checking values to replace or delete
    if (replaceValues) {
      this._findAndReplace(json, type);
    }
    if (rowsToDelete) {
      this._deleteRows(json, rowsToDelete);
    }

    // Data
    worksheet.columns = columns;
    // Change background and font weight
    const cellStyle = ['A1', 'B1', 'C1', 'D1'];
    if (worksheet.columns.length > 4) {
      cellStyle.push('E1');
    }
    cellStyle.map((key) => {
      worksheet.getCell(key).fill = {
        type: 'pattern',
        pattern: 'darkTrellis',
        fgColor: { argb: 'C9C9C9' },
        bgColor: { argb: 'C9C9C9' },
      };
      worksheet.getCell(key).font = {
        bold: true,
      };
    });

    // Set row data
    json.forEach((item, index) => {
      worksheet.addRow({
        login: item.login,
        apellidonombre: item.apellido + ', ' + item.nombre,
        email: item.email,
        plantillas: item.plantillas,
        aplicaciones: item.aplicaciones,
      });

      const cell = index + 1;
      ['A' + cell, 'B' + cell, 'C' + cell, 'D' + cell, 'E' + cell].map((key) => {
        // Aligment option: https://github.com/guyonroche/exceljs#alignment
        worksheet.getCell(key).alignment = { vertical: 'middle', wrapText: true };
      });
    });

    // Create a xlsx file
    const strFilename = `${excelFileName}__${Date.now()}.xlsx`;
    workbook.xlsx
      .writeBuffer(strFilename)
      .then((buffer) => FileSaver.saveAs(new Blob([buffer]), strFilename))
      .catch((err) => console.error('Error writing excel export', err));
  }

  plantillaDataExportAsExcelFile(
    jsonData: any[],
    excelFileName: string = 'default',
    rowsToDelete: Array<string> = null,
    type: string = '',
    title: Array<string> = null,
    titleColumns: Array<string> = null
  ): void {
    // Initiliaze excel workbook
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet(title);

    // Title
    worksheet.mergeCells('A1', 'D1');
    worksheet.getCell('A1').value = title[2];
    worksheet.getCell('A1').font = {
      size: 16,
      bold: true,
    };

    // Data
    let cell = 5;
    jsonData.forEach((data, index) => {
      // Title table
      const rowCell = cell - 1;
      worksheet.mergeCells('A' + rowCell, 'D' + rowCell);
      worksheet.getCell('A' + rowCell).value = title[index];
      worksheet.getCell('A' + rowCell).font = {
        size: 14,
        bold: true,
      };

      // Title columns
      worksheet.getRow(cell).values = titleColumns;

      // Change background and font weight
      ['A' + cell, 'B' + cell, 'C' + cell, 'D' + cell].map((key) => {
        worksheet.getCell(key).fill = {
          type: 'pattern',
          pattern: 'darkTrellis',
          fgColor: { argb: 'C9C9C9' },
          bgColor: { argb: 'C9C9C9' },
        };
        worksheet.getCell(key).font = {
          bold: true,
        };
      });

      // Check data
      if (data.length > 0) {
        this._findAndReplace(data, type);
        this._deleteRows(data, rowsToDelete);
        worksheet.columns = [
          { key: 'login', width: 30 },
          { key: 'apellidonombre', width: 30 },
          { key: 'empresa', width: 30 },
          { key: 'activo', width: 30 },
        ];
        data.forEach((item) => {
          worksheet.addRow({
            login: item.login,
            apellidonombre: item.apellido + ', ' + item.nombre,
            empresa: item.empresa,
            activo: item.activo,
          });
        });
        cell += data.length + 4;
      } else {
        cell++;
        worksheet.mergeCells('A' + cell, 'D' + cell);
        worksheet.getCell('A' + cell).value = 'No hay usuarios ' + (index > 0 ? 'externos' : 'internos') + ' asignados a esta plantilla.';
        worksheet.getCell('A' + cell).font = {
          size: 12,
          bold: true,
          italic: true,
        };
        cell += 3;
      }
    });

    // Create a xlsx file
    const strFilename = `${excelFileName}__${Date.now()}.xlsx`;
    workbook.xlsx
      .writeBuffer(strFilename)
      .then((buffer) => FileSaver.saveAs(new Blob([buffer]), strFilename))
      .catch((err) => console.log('Error writing excel export', err));
  }

  // Save As Excel File
  private _saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  // Find and replace values
  private _findAndReplace(object, type = ''): any {
    switch (type) {
      case 'sugerencias':
        object.map((key) => {
          key.fecha = key.fecha;
          key.usuario = key.usuario.login;
          key.activo = key.activo ? 'Activo' : 'Inactivo';
          key.aplicacion = key.aplicacion.nombre;
        });
        break;
      case 'informe':
        for (const key of object) {
          let aplicaciones: string = null;
          let plantillas = null;
          if (key.aplicaciones && key.aplicaciones.length > 0) {
            for (const [idxApp, app] of key.aplicaciones.entries()) {
              if (!aplicaciones) {
                aplicaciones = `${app.nombre}`;
              } else {
                aplicaciones += `\n ${app.nombre}`;
              }

              if (idxApp === key.aplicaciones.length - 1) {
                key.aplicaciones = aplicaciones;
              }
            }
          } else {
            key.aplicaciones = '-';
          }

          if (key.plantillas && key.plantillas.length > 0) {
            for (const [idxTemp, temp] of key.plantillas.entries()) {
              if (!plantillas) {
                plantillas = `${temp.nombre}`;
              } else {
                plantillas += `\n ${temp.nombre}`;
              }

              if (idxTemp === key.plantillas.length - 1) {
                key.plantillas = plantillas;
              }
            }
          } else {
            key.plantillas = '-';
          }
        }
        break;
      case 'empresa-usuarios-export':
        object.map((key) => {
          key.activo = key.activo ? 'Activo' : 'Inactivo';
          key.empresa = key.empresa.nombre;
        });
        break;
      case 'plantilla-empresa-usuario':
        object.map((key) => {
          key.activo = key.activo ? 'Activo' : 'Inactivo';
          key.empresa = key.empresa;
        });
        break;
      default:
        object.map((key) => {
          key.empresa = key.empresa.nombre !== undefined && key.empresa.nombre;
          key.activo = key.activo ? 'Activo' : 'Inactivo';
        });
    }
  }

  // Find and delete rows. If doesn't exist, will be ignored
  private _deleteRows(object, rowsToDelete): void {
    object.map((key) => {
      for (const row of rowsToDelete) {
        delete key[row];
      }
    });
  }
}
