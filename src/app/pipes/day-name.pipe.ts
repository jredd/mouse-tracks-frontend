import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'dayName'
})
export class DayNamePipe implements PipeTransform {
  transform(value: string): string {
    const dayName = moment(value, 'YYYY-MM-DD').format('dddd');
    const formattedDate = moment(value, 'YYYY-MM-DD').format('DD.MM.YYYY');
    return `${dayName}, ${formattedDate}`;
  }
}
