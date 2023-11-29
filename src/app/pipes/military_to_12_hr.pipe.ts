import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'militaryTo12Hr'
})
export class MilitaryTo12HrPipe implements PipeTransform {
  transform(value: string): string {
    // Ensure the input value is valid
    if (!value || value.split(':').length !== 3) {
      return value;
    }

    // Create a moment object with the military time
    const militaryTime = moment(value, 'HH:mm:ss');

    // Format the moment object to a 12-hour string with AM/PM
    return militaryTime.format('h:mm A');
  }
}
