import { Stores, openDB } from '~/utils/db';

export function addPaymentType(paymentType: PaymentType): Promise<unknown> {
    return new Promise((resolve, reject) => {
        openDB((db) => {
            const transaction = db.transaction(Stores.PaymentType, "readwrite");
            const store = transaction.objectStore(Stores.PaymentType);
            const request = store.add(paymentType);
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

export function getPaymentTypes() {
    return new Promise((resolve, reject) => {
        openDB((db) => {
            const transaction = db.transaction(Stores.PaymentType, "readwrite");
            const store = transaction.objectStore(Stores.PaymentType);
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


export function deleteGastos() {

}