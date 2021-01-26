
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import * as moment from 'moment';
import { OrderService, AlertService } from '@app/core/services';
// import { MustMatch } from '@app/core/helper';
import { combineLatest } from 'rxjs';

@Component({ templateUrl: 'add-edit.component.html'})
export class AddEditComponent implements OnInit {
    orderForm: FormGroup;
    id: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private orderService: OrderService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;
        this.initialOrderFormGroup();
        // password not required in edit mode
        // const passwordValidators = [Validators.minLength(6)];
        // if (this.isAddMode) {
        //     passwordValidators.push(Validators.required);
        // }
        this.orderForm.valueChanges.subscribe(val => {
            if(val.investmentValue > 0 && val.orderPrice > 0) {
                const volume = Math.round(val.investmentValue/val.orderPrice);
                this.orderForm.controls.volume.patchValue(volume, {emitEvent:false});
            }
            if(val.volume > 0 && val.currentPrice > 0){
                const marketValue = val.currentPrice*val.volume;
                this.orderForm.controls.marketValue.patchValue(marketValue, {emitEvent:false});
            }
            if(val.investmentValue > 0 && val.marketValue > 0){
                const gainLoss = val.marketValue - val.investmentValue;
                const gainLossPercentage = gainLoss/val.investmentValue;
                this.orderForm.controls.gainLoss.patchValue(gainLoss, {emitEvent:false});
                this.orderForm.controls.gainLossPercentage.patchValue(gainLossPercentage, {emitEvent:false});
            }
        });
        

        if (!this.isAddMode) {
            this.orderService.getById(this.id)
                .pipe(first())
                .subscribe(x => {
                    this.orderForm.patchValue(x); 
                    this.orderForm.get('orderDate').patchValue(moment(x.orderDate).format("YYYY-MM-DD"));
                });
        }

    }

    initialOrderFormGroup(): void {
        let now = moment().format("YYYY-MM-DD");
        //let now = (new Date()).toISOString().substring(0, 10);
        console.log(now);
        this.orderForm = this.formBuilder.group({
            id: [],
            orderDate: [now, Validators.required],
            name: ['', Validators.required],
            symbol: ['', Validators.required],
            volume: [''],
            reason: [''],
            investmentValue: ['', Validators.required],
            orderPrice: ['', Validators.required],
            currentPrice: [''],
            marketValue: [''],
            gainLossPercentage: [''],
            gainLoss: [''],
            done: [false]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.orderForm.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();
        console.log(this.orderForm.value);
        // stop here if form is invalid
        if (this.orderForm.invalid) {
            return;
        }

        this.loading = true;
        
        if (this.isAddMode) {
            this.createOrder();
        } else {
            this.updateOrder();
        }

    }

    private createOrder() {
        this.orderService.create(this.orderForm.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('User added', { keepAfterRouteChange: true });
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }

    private updateOrder() {
        this.orderService.update(this.id, this.orderForm.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('User updated', { keepAfterRouteChange: true });
                    this.router.navigate(['../../'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }

    
}