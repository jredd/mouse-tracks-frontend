import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'dateRange'
})
export class DateRangePipe implements PipeTransform {

  transform(startDate: Date, endDate: Date): string {
    const start = moment(startDate);
    const end = moment(endDate);

    let format = 'MMMM Do';
    if (start.year() !== end.year()) {
      format += ', YYYY';
    }

    return `${start.format(format)} - ${end.format('MMMM Do, YYYY')}`;
  }
}
