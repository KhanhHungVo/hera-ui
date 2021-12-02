import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Order } from '../models';
import { Injectable } from '@angular/core';

const baseUrl = `${environment.apiUrl}/Orders`;
@Injectable({
    providedIn: 'root'
})
export class OrderService {
    constructor(private http: HttpClient){

    }

    getAll() {
        return this.http.get<Order[]>(baseUrl);
    }

    getById(id: string) {
        return this.http.get<Order>(`${baseUrl}/${id}`);
    }

    create(params: Order) {
        return this.http.post(baseUrl, params);
    }

    update(id: string, params) {
        return this.http.put(`${baseUrl}/${id}`, params);
    }

    delete(id: string) {
        return this.http.delete(`${baseUrl}/${id}`);
    }
}