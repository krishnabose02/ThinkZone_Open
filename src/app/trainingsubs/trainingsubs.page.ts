import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { ModalController, NavController } from '@ionic/angular';
import { Training2Page } from '../pages/training2/training2.page';

@Component({
  selector: 'app-trainingsubs',
  templateUrl: './trainingsubs.page.html',
  styleUrls: ['./trainingsubs.page.scss'],
})
export class TrainingsubsPage implements OnInit {
  list;
  constructor(public dataServ: DataService, public navCtrl: NavController, public modalController: ModalController) {
    this.list = dataServ.getData('submodules');
    console.log(this.list);
   }

  ngOnInit() {
  }

  async submodule_click(submodule) {
    console.log('@@@Selected Submodule: ', JSON.stringify(submodule));

    this.dataServ.setData('submodule', submodule);
    this.navCtrl.navigateForward('training2');

      // call eng assessment modal
      // const modal = await this.modalController.create({
      //   component: Training2Page,
      //   componentProps: { res: {submodule: submodule} }
      // });
      // modal.onDidDismiss()
      //   .then((data) => {
      //     console.log('@@@Modal Data: ' + JSON.stringify(data));
      //     // this.get_attendance_by_teacher_by_date(this._userid, this.attendance_date);
      // });
      // return await modal.present();
  }
}
