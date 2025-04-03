import { DB_NAME, DB_VERSION, Stores, getDB } from '~/utils/db';
import type { CategoriasPresupuesto } from '../db/models/CategoriaPresupuesto';

export async function addCategoriaPresupuesto(cateogria: CategoriasPresupuesto): Promise<unknown> {
    const db = await getDB();
    const transaction = db.transaction(Stores.CategoriaPresupuesto, "readwrite");
    const store = transaction.objectStore(Stores.CategoriaPresupuesto);
    const request = await store.add(cateogria);
    await transaction.done
    return request;
}

export async function getCategoriasPresupuesto() {
    const db = await getDB();
    const transaction = db.transaction(Stores.CategoriaPresupuesto, "readwrite");
    const store = transaction.objectStore(Stores.CategoriaPresupuesto);
    const request = await store.getAll();
    await transaction.done
    return request;

}

export function updateCategorias() {

}
export function deleteCategorias() {

}