import { Component } from '@angular/core';
import { FormatType } from '../models/format.model';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {

    currentYear = new Date().getFullYear();
    format: FormatType;

    constructor() {}

}
