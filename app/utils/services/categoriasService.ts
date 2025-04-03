import { DB_NAME, DB_VERSION, Stores, getDB } from '~/utils/db';
import type { CategoriasGasto } from '../db/models/Categorias';

export async function addCategoria(cateogria: CategoriasGasto): Promise<unknown> {
    const db = await getDB();
    const transaction = db.transaction(Stores.CategoriasGasto, "readwrite");
    const store = transaction.objectStore(Stores.CategoriasGasto);
    const request = await store.add(cateogria);
    await transaction.done
    return request;
}

export async function getCategorias() {
    const db = await getDB();
    const transaction = db.transaction(Stores.CategoriasGasto, "readwrite");
    const store = transaction.objectStore(Stores.CategoriasGasto);
    const request = await store.getAll();
    await transaction.done
    return request;

}

export function updateCategorias() {

}
export function deleteCategorias() {

}