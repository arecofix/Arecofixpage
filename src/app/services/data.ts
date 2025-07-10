import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Producto {
  id?: string;
  nombre: string;
  precio: number;
  // …otros campos
}

export interface Categoria {
  id?: string;
  nombre: string;
  // …otros campos
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private BASE = 'https://arecofix-20698-default-rtdb.firebaseio.com';

  constructor(private http: HttpClient) {}

  private mapToArray<T>(obj: any): T[] {
    if (!obj) return [];
    return Object.entries(obj)
      .map(([key, value]) => ({ id: key, ...value as T }));
  }

  getProductos(): Observable<Producto[]> {
    return this.http
      .get<{ [key: string]: Omit<Producto, 'id'> }>(`${this.BASE}/productos.json`)
      .pipe(map(obj => this.mapToArray<Producto>(obj)));
  }

  getProducto(id: string): Observable<Producto | null> {
    return this.http
      .get<Omit<Producto, 'id'>>(`${this.BASE}/productos/${id}.json`)
      .pipe(map(p => p ? { id, ...p } : null));
  }

  addProducto(prod: Omit<Producto, 'id'>): Observable<{ name: string }> {
    return this.http.post<{ name: string }>(
      `${this.BASE}/productos.json`, prod
    );
  }

  updateProducto(id: string, prod: Omit<Producto, 'id'>): Observable<null> {
    return this.http.put<null>(
      `${this.BASE}/productos/${id}.json`, prod
    );
  }

  deleteProducto(id: string): Observable<null> {
    return this.http.delete<null>(`${this.BASE}/productos/${id}.json`);
  }

  getCategorias(): Observable<Categoria[]> {
    return this.http
      .get<{ [key: string]: Omit<Categoria, 'id'> }>(`${this.BASE}/categorias.json`)
      .pipe(map(obj => this.mapToArray<Categoria>(obj)));
  }

  // Podés agregar addCategoria, updateCategoria, deleteCategoria de forma análoga
}
