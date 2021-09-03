import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';
import { MoreOptionsPopover } from '@models/option.model';

@Component({
  selector: 'app-more-options',
  templateUrl: './more-options.component.html',
  styleUrls: ['./more-options.component.scss'],
})
export class MoreOptionsComponent implements OnInit {

  options: MoreOptionsPopover;

  constructor(private popoverController: PopoverController, private navParams: NavParams) { }

  ngOnInit() {
    this.options = [...this.navParams.data.popoverProps.options];
    console.log('this.options', this.options);
  }

  dismissPopover(option?: any) {
    this.popoverController.dismiss({
        dismissed: true,
        option
    });
  }

  onClickOptionHandler(value: string) {
    this.dismissPopover({value});
  }

}
