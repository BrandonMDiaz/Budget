import { Stores, openDB } from '~/utils/db';
import type { CategoriasGasto } from '../db/models/Categorias';

export function addCategoria(cateogria: CategoriasGasto): Promise<unknown> {
    return new Promise((resolve, reject) => {
        openDB((db) => {
            const transaction = db.transaction(Stores.CategoriasGasto, "readwrite");
            const store = transaction.objectStore(Stores.CategoriasGasto);
            const request = store.add(cateogria);
            request.onsuccess = () => {
                console.log(request.result)
                resolve(request.result);
            }
            request.onerror = () => {
                reject(request.error)
            }
        }, (error) => {
            console.log("Error: ", error)
            reject(error.type);
        })
    });
}

export function getCategorias() {
    return new Promise((resolve, reject) => {
        openDB((db) => {
            const transaction = db.transaction(Stores.CategoriasGasto, "readwrite");
            const store = transaction.objectStore(Stores.CategoriasGasto);
            const request = store.getAll();
            request.onsuccess = () => {
                resolve(request.result);
            }
            request.onerror = () => {
                reject(request.error)
            }
        }, (error) => {
            console.log("Error: ", error)
            reject(error.type);
        })
    });
}

export function updateCategorias() {

}
export function deleteCategorias() {

}