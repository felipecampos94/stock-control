import {Component} from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";
import {DialogService} from "primeng/dynamicdialog";
import {ProductEvent} from "../../../models/enums/products/ProductEvent";
import {ProductsFormComponent} from "../../../modules/products/components/products-form/products-form.component";

@Component({
  selector: 'app-toolbar-navigation',
  templateUrl: './toolbar-navigation.component.html',
  styleUrls: []
})
export class ToolbarNavigationComponent {
  constructor(private cookieService: CookieService,
              private router: Router,
              private dialogService: DialogService) {
  }

  handleLogout(): void {
    this.cookieService.delete('USER_INFO');
    void this.router.navigate(['/home']);
  }

  handleSaleProduct(): void {
    const saleProductAction = ProductEvent.SALE_PRODUCT_EVENT;

    this.dialogService.open(ProductsFormComponent, {
      header: saleProductAction,
      width: '70%',
      contentStyle: {overflow: 'auto'},
      baseZIndex: 10000,
      maximizable: true,
      data: {
        event: {action: saleProductAction},
      },
    });
  }
}
