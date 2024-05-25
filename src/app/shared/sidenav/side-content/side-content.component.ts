import { Component } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { DataSharedService } from 'src/app/services/data-shared.service';
import { NavsService } from 'src/app/services/navs.service';
import { SideNav } from './sidenav.model';


/*
  Es un menú recursivo
*/
@Component({
  selector: 'app-side-content',
  templateUrl: './side-content.component.html',
  styleUrls: ['./side-content.component.scss']
})
export class SideContentComponent {

  constructor(
    public navServices: NavsService,
    private dataSharedService: DataSharedService
  ) { }

  onClickHeader(matExpandPanel: MatExpansionPanel): void {
    matExpandPanel.toggle();
  }

  // tslint:disable-next-line:variable-name
  removeRuta(_ruta: SideNav): void {
    this.navServices.findMenu(_ruta, (sideNav, index, array) => {
      array.splice(index, 1);
      setTimeout(() => this.dataSharedService.nav._container?.updateContentMargins());
    });
  }

}
