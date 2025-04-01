import { DB_NAME, DB_VERSION, Stores } from '~/utils/db';
import type { Sentimiento } from '../db/models';
import { openDB } from 'idb';

export async function addSentimiento(sentimiento: Sentimiento): Promise<unknown> {
    const db = await openDB(DB_NAME, DB_VERSION);
    const transaction = db.transaction(Stores.Sentimiento, "readwrite");
    const store = transaction.objectStore(Stores.Sentimiento);
    const request = await store.add(sentimiento);
    return request

}

export async function getSentimientos() {
    const db = await openDB(DB_NAME, DB_VERSION);
    const transaction = db.transaction(Stores.Sentimiento, "readwrite");
    const store = transaction.objectStore(Stores.Sentimiento);
    const request = await store.getAll();
    return request;
}

export function updateSentimientos() {

}
export function deleteSentimientos() {

}