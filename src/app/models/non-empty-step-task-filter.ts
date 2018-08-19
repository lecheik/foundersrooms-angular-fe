import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
 name: 'emptyTaskFilter'
})

@Injectable()
export class NonEmptyStepTaskFilter implements PipeTransform{
 transform(items: any[]): any[] {
   if (!items) return [];
   return items.filter(it => it['stepTasks'].length >0);
 }	
}
