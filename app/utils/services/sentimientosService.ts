import { Stores, openDB } from '~/utils/db';
import type { Sentimiento } from '../db/models';

export function addSentimiento(sentimiento: Sentimiento): Promise<unknown> {
    return new Promise((resolve, reject) => {
        openDB((db) => {
            const transaction = db.transaction(Stores.Sentimiento, "readwrite");
            const store = transaction.objectStore(Stores.Sentimiento);
            const request = store.add(sentimiento);
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

export function getSentimientos() {
    return new Promise((resolve, reject) => {
        openDB((db) => {
            const transaction = db.transaction(Stores.Sentimiento, "readwrite");
            const store = transaction.objectStore(Stores.Sentimiento);
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

export function updateSentimientos() {

}
export function deleteSentimientos() {

}