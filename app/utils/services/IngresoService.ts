import { DB_NAME, DB_VERSION, Stores, getDB } from '~/utils/db';
import type { CategoriasGasto } from '../db/models/Categorias';
import { openDB } from 'idb';
import type { Ingresos } from '../db/models/Ingresos';

export async function addIngreso(ingreso: Ingresos): Promise<void> {
    const db = await getDB();
    const transaction = db.transaction(Stores.Ingresos, "readwrite");
    const store = transaction.objectStore(Stores.Ingresos);
    await store.add(ingreso);
    await transaction.done
}

export async function getIngresos() {
    const db = await getDB();
    const transaction = db.transaction(Stores.Ingresos, "readwrite");
    const store = transaction.objectStore(Stores.Ingresos);
    const request = await store.getAll();
    await transaction.done
    return request;

}

export function updateIngreso() {

}

export function deleteIngreso() {

}