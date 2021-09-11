import { Component, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-copyright-claims',
  templateUrl: './copyright-claims.component.html',
  styleUrls: ['./copyright-claims.component.scss'],
})
export class CopyrightClaimsComponent implements OnInit {

  copyrightClaims = '';

  constructor(private translocoService: TranslocoService) { }

  ngOnInit() {
    this.copyrightClaims = this.translocoService.translate('components.copyrightClaims.information');
  }

}
