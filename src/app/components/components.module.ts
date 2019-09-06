import { NgModule } from '@angular/core';
import { PeriodSelectorComponent } from './period-selector/period-selector.component';
import { CommonModule } from '@angular/common';
import { ActivitySelectorComponent } from './activity-selector/activity-selector.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
    imports: [CommonModule, IonicModule.forRoot()],
    declarations: [PeriodSelectorComponent, ActivitySelectorComponent],
    exports: [PeriodSelectorComponent, ActivitySelectorComponent]
})

export class ComponentsModule {

}
