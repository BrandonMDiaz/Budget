import type { Gasto } from '~/utils/db/models';
import { Stores, openDB, openDB2 } from '~/utils/db';
import dayjs from "dayjs";
import { Recurrencia } from '../db/models/Gasto';

export function addGasto(gasto: Gasto): Promise<unknown> {
    return new Promise((resolve, reject) => {
        openDB((db) => {
            const transaction = db.transaction(Stores.Gastos, "readwrite");
            const store = transaction.objectStore(Stores.Gastos);
            const request = store.add(gasto);
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

export function getGasto(id: number) {
    return new Promise((resolve, reject) => {
        openDB((db) => {
            const transaction = db.transaction(Stores.Gastos, "readwrite");
            const store = transaction.objectStore(Stores.Gastos);
            const request = store.get(id);
            request.result;
            resolve(request.result);
        }, (error) => {
            console.log("Error: ", error)
            reject(error.type);
        })
    });
}

export async function getGastosByIndex(startDate: dayjs.Dayjs, endDate: dayjs.Dayjs, storeName: string, value?: string | number) {
    const db = await openDB2();
    const transaction = db.transaction(Stores.Gastos, "readwrite");
    const store = transaction.objectStore(Stores.Gastos);
    const index = store.index(storeName);

    const request = index.openCursor(value);
    const data: Gasto[] = []
    return new Promise((resolve, reject) => {
        request.onsuccess = (event: any) => {
            const cursor = event.target!.result;
            if (cursor) {
                const date = dayjs(cursor.value.fecha.toString())
                if (date.isBefore(endDate) || date.isAfter(startDate) || date.isSame(startDate) || date.isSame(endDate)) {
                    data.push(cursor.value);
                }
                cursor.continue();
            } else {
                resolve(data);
            }
        }
        request.onerror = () => {
            reject(request.error)
        }
    })
}

export function getGastos(startDate: dayjs.Dayjs, endDate: dayjs.Dayjs,) {
    return new Promise((resolve, reject) => {
        openDB((db) => {
            const transaction = db.transaction(Stores.Gastos, "readwrite");
            const store = transaction.objectStore(Stores.Gastos);
            const request = store.openCursor();
            const data: Gasto[] = []
            request.onsuccess = (event: any) => {
                const cursor = event.target!.result;
                if (cursor) {
                    const gasto = cursor.value as Gasto;
                    const date = dayjs(gasto.fecha);
                    if (gasto.recurrencia && gasto.recurrencia !== Recurrencia.Unico
                        && startDate.isBefore(gasto.finRecurrencia) && endDate.isBefore(gasto.fecha)) {
                        data.push(gasto);
                    }
                    else if (date.isBefore(endDate) && date.isAfter(startDate)) {
                        data.push(gasto);
                    }
                    cursor.continue();
                } else {
                    resolve(data);
                }
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

export function updateGastos(gasto: Gasto) {
    return new Promise((resolve, reject) => {
        openDB((db) => {
            const transaction = db.transaction(Stores.Gastos, "readwrite");
            const store = transaction.objectStore(Stores.Gastos);
            const request = store.put(gasto);
            request.onsuccess = (event: any) => {
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