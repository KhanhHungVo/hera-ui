import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Order } from '../models';
import { Injectable } from '@angular/core';

const orderUrl = `${environment.apiUrl}/Orders`;
@Injectable({
    providedIn: 'root'
})
export class OrderService {
    constructor(private http: HttpClient){

    }

    getAll() {
        return this.http.get<Order[]>(orderUrl);
    }

    getById(id: string) {
        return this.http.get<Order>(`${orderUrl}/${id}`);
    }

    create(params: Order) {
        return this.http.post(orderUrl, params);
    }

    update(id: string, params) {
        return this.http.put(`${orderUrl}/${id}`, params);
    }

    delete(id: string) {
        return this.http.delete(`${orderUrl}/${id}`);
    }
}
