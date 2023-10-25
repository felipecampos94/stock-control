import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {ProductsService} from "../../../../services/products/products.service";
import {ProductsDataTransferService} from "../../../../shared/services/products/products-data-transfer.service";
import {Router} from "@angular/router";
import {GetAllProductsResponse} from "../../../../models/interfaces/products/response/GetAllProductsResponse";
import {ConfirmationService, MessageService} from "primeng/api";
import {EventAction} from "../../../../models/interfaces/products/event/EventAction";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {ProductsFormComponent} from "../../components/products-form/products-form.component";

@Component({
  selector: 'app-products-home',
  templateUrl: './products-home.component.html',
  styleUrls: []
})
export class ProductsHomeComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  private ref!: DynamicDialogRef;
  public productsDatas: Array<GetAllProductsResponse> = [];

  constructor(private productsService: ProductsService,
              private productsDtService: ProductsDataTransferService,
              private router: Router,
              private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private dialogService: DialogService,) {
  }

  ngOnInit(): void {
    this.getServiceProductsDatas();
  }

  getServiceProductsDatas(): void {
    const productsLoaded = this.productsDtService.getProductsDatas();

    if (productsLoaded.length > 0) {
      this.productsDatas = productsLoaded;
    } else this.getAPIProductsDatas();
  }

  getAPIProductsDatas() {
    this.productsService
      .getAllProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.productsDatas = response;
          }
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao buscar produtos',
            life: 2500,
          });
          this.router.navigate(['/dashboard']);
        },
      });
  }

  handleProductAction(event: EventAction): void {
    if (event) {
      this.ref = this.dialogService.open(ProductsFormComponent, {
        header: event?.action,
        width: '70%',
        contentStyle: {overflow: 'auto'},
        baseZIndex: 10000,
        maximizable: true,
        data: {
          event: event,
          productDatas: this.productsDatas,
        },
      });
      this.ref.onClose.pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => this.getAPIProductsDatas(),
        });
    }
  }

  handleDeletarProdutoAction(event: {
    product_id: string;
    productName: string;
  }): void {
    this.confirmationService.confirm({
      message: `Confirma a exclusão do produto: ${event?.productName}?`,
      header: 'Confirma a exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => this.deleteProduct(event?.product_id),
    })
  }

  private deleteProduct(product_id: string) {
    if (product_id) {
      this.productsService.deleteProduct(product_id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Produto removido com sucesso!',
                life: 2500,
              });
              this.getAPIProductsDatas();
            }
          }, error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao remover produto!',
              life: 2500,
            });
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
