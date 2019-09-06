import { NgModule } from '@angular/core';
import { PeriodSelectorComponent } from './period-selector/period-selector.component';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [CommonModule],
    declarations: [PeriodSelectorComponent],
    exports: [PeriodSelectorComponent]
})

export class ComponentsModule {

}
