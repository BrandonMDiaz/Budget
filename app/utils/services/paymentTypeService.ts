import { openDB } from 'idb';
import { DB_NAME, DB_VERSION, Stores } from '~/utils/db';

export async function addPaymentType(paymentType: PaymentType): Promise<unknown> {
    const db = await openDB(DB_NAME, DB_VERSION);
    const transaction = db.transaction(Stores.PaymentType, "readwrite");
    const store = transaction.objectStore(Stores.PaymentType);
    const request = store.add(paymentType);
    transaction.done
    return request;

}

export async function getPaymentTypes() {
    const db = await openDB(DB_NAME, DB_VERSION);
    const transaction = db.transaction(Stores.PaymentType, "readwrite");
    const store = transaction.objectStore(Stores.PaymentType);
    const request = await store.getAll();
    transaction.done

    return request;
}


export function deleteGastos() {

}