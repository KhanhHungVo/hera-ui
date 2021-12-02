import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'heraCurrency'
})
export class HeraCurrency implements PipeTransform {

  transform(value: any, args?: any): any {
    return parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }
}