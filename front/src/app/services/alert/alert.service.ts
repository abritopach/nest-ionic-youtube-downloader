import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private alertController: AlertController) { }

  async presentAlert(alertData: {header: string; message: string}) {
    const alert = await this.alertController.create({
        header: alertData.header,
        message: alertData.message,
        buttons: ['OK']
    });
    await alert.present();
  }

  async presentAlertConfirm(alertData: {header: string; message: string}, context: object,
    confirmAction: () => void) {
    const alert = await this.alertController.create({
      header: alertData.header,
      message: alertData.message,
      buttons: [
        {
          text: 'OK',
          id: 'confirm-button',
          handler: confirmAction.bind(context)
        }
      ]
    });

    await alert.present();
  }
}
