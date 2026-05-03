import { Component, input, Input, InputSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TableColumn } from '../../interfaces/tableColumn.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table',
  imports: [
    RouterLink,
    CommonModule
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent<T> {
  @Input() data: T[] = [];
  columns: InputSignal<TableColumn<T>[]> = input.required<TableColumn<T>[]>();
  title: InputSignal<string> = input.required<string>();

  getCellValue(row: T, column: TableColumn<T>) {
    if(column.formatter){
      return column.formatter(row);
    }
    return row[column.key as keyof T];
  }

}
