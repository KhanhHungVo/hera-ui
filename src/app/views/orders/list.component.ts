import { error } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { OrderService } from '@app/core/services';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    orders = null;
    isLoading = false;
    constructor(private orderService: OrderService) {}

    ngOnInit() {
        this.getOrders();
    }

    getOrders(){
        this.isLoading = true;
        this.orderService.getAll()
            .pipe(first())
            .subscribe(
                orders => this.orders = orders,
                () => this.isLoading = false,
                () => this.isLoading = false
            );
    }

    deleteOrder(id: string) {
        const user = this.orders.find(x => x.id === id);
        user.isDeleting = true;
        this.orderService.delete(id)
            .pipe(first())
            .subscribe(() => this.orders = this.orders.filter(x => x.id !== id));
    }
}