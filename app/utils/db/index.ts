import { resolve } from 'path';
import { categoriasDefault } from './models/Categorias';
import { sentimientoDefault } from './models/Sentimiento';

const DB_NAME = "ControlGastos";
const DB_VERSION = 36;

export enum Stores {
    Gastos = 'gastos',
    PaymentType = 'paymentTypes',
    Sentimiento = 'sentimientos',
    CategoriasGasto = 'categoriasGasto'
}

// Abrir la base de datos
export function initDB() {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);
        request.onerror = (event) => {
            console.log('An error ocurred while opening indexedb')
            console.log(event);
            reject(request.error)
        };

        request.onupgradeneeded = function (event) {
            console.log('versino changed')
            const db = request.result;
            if (!db.objectStoreNames.contains(Stores.PaymentType)) {
                db.createObjectStore(Stores.PaymentType, { keyPath: "id", autoIncrement: true });

            }

            if (!db.objectStoreNames.contains(Stores.Gastos)) {
                const gastosStore = db.createObjectStore(Stores.Gastos, { keyPath: "id", autoIncrement: true });
                gastosStore.createIndex("paymentTypeId", "paymentTypeId", { unique: false });
                gastosStore.createIndex("sentimientoId", "sentimientoId", { unique: false });
                gastosStore.createIndex("categoriaId", "categoriaId", { unique: false });
                gastosStore.createIndex("recurrencia", "recurrencia", { unique: false });
                gastosStore.createIndex("fecha", "fecha", { unique: false });
                gastosStore.createIndex("finRecurrencia", "finRecurrencia", { unique: false });
            }

            if (!db.objectStoreNames.contains(Stores.Sentimiento)) {
                db.createObjectStore(Stores.Sentimiento, { keyPath: "id", autoIncrement: true });
            }
            if (!db.objectStoreNames.contains(Stores.CategoriasGasto)) {
                db.createObjectStore(Stores.CategoriasGasto, { keyPath: "id", autoIncrement: true });
            }
        };

        request.onsuccess = (event) => {
            const db = request.result;
            const storePaymentType = db.transaction(Stores.PaymentType, 'readwrite').objectStore(Stores.PaymentType);
            storePaymentType.put({ id: 1, nombre: 'Efectivo' });
            const storeSentimiento = db
                .transaction(Stores.Sentimiento, "readwrite")
                .objectStore(Stores.Sentimiento)
            sentimientoDefault.forEach((sentimiento) => {
                storeSentimiento.put(sentimiento);
            })
            const storeCategorias = db
                .transaction(Stores.CategoriasGasto, "readwrite")
                .objectStore(Stores.CategoriasGasto)
            categoriasDefault.forEach((categoria) => {
                storeCategorias.put(categoria)
            })


            db.close();
        };

    });
}


export function openDB(fn: (db: IDBDatabase) => void, err: (error: Event) => void) {
    const openRequest = indexedDB.open(DB_NAME, DB_VERSION);
    openRequest.onsuccess = () => {
        const db = openRequest.result;
        fn(db);
        db.close()
    };
    openRequest.onerror = (error: Event) => {
        err(error);

    }
}

export async function openDB2() {
    return new Promise<IDBDatabase>((resolve, reject) => {
        const openRequest = indexedDB.open(DB_NAME, DB_VERSION);
        openRequest.onsuccess = () => {
            const db = openRequest.result;
            resolve(db);
        };
        openRequest.onerror = (error: Event) => {
            reject(error)
        }
    })

}

