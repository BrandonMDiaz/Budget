import { openDB } from 'idb';
import { categoriasDefault } from './models/Categorias';
import { sentimientoDefault } from './models/Sentimiento';
import { categoriasPresupuestoDefault } from './models/CategoriaPresupuesto';

export const DB_NAME = "ControlGastos";
export const DB_VERSION = 50;

export enum Stores {
    Gastos = 'gastos',
    PaymentType = 'paymentTypes',
    Sentimiento = 'sentimientos',
    CategoriasGasto = 'categoriasGasto',
    Ingresos = 'ingresos',
    Notes = 'notes',
    CategoriaPresupuesto = 'categoriaPresupuesto'
}

// init db
export function initDB() {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);
        request.onerror = (event) => {
            console.log('An error ocurred while opening indexedb')
            console.log(event);
            reject(request.error)
        };

        request.onupgradeneeded = function (event) {
            const db = request.result;
            console.log('que esta pasando;')
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
                gastosStore.createIndex("categoriaPresupuestoId", "categoriaPresupuestoId", { unique: false });
            }

            if (!db.objectStoreNames.contains(Stores.Sentimiento)) {
                db.createObjectStore(Stores.Sentimiento, { keyPath: "id", autoIncrement: true });
            }
            if (!db.objectStoreNames.contains(Stores.CategoriasGasto)) {
                db.createObjectStore(Stores.CategoriasGasto, { keyPath: "id", autoIncrement: true });
            }
            if (!db.objectStoreNames.contains(Stores.Ingresos)) {
                const ingresoStore = db.createObjectStore(Stores.Ingresos, { keyPath: "id", autoIncrement: true });
                ingresoStore.createIndex("fechaInicio", "fechaInicio", { unique: false });
                ingresoStore.createIndex("fechaFin", "fechaFin", { unique: false });
            }
            if (!db.objectStoreNames.contains(Stores.Notes)) {
                const noteStore = db.createObjectStore(Stores.Notes, { keyPath: "id", autoIncrement: true });
                noteStore.createIndex("fecha", "fecha", { unique: false });
            }
            if (!db.objectStoreNames.contains(Stores.CategoriaPresupuesto)) {
                db.createObjectStore(Stores.CategoriaPresupuesto, { keyPath: "id", autoIncrement: true });
            }

            const storeGasto = db.transaction(Stores.Gastos, 'readwrite').objectStore(Stores.Gastos);
            console.log('crealo antes de if')

            if (!storeGasto.indexNames.contains('categoriaPresupuestoId')) {
                console.log('crealo porfis')
                storeGasto.createIndex("categoriaPresupuestoId", "categoriaPresupuestoId", { unique: false })
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

            const storeCategoriaPresupuesto = db.transaction(Stores.CategoriaPresupuesto, "readwrite")
                .objectStore(Stores.CategoriaPresupuesto);
            categoriasPresupuestoDefault.forEach((categoria) => {
                storeCategoriaPresupuesto.put(categoria)
            })

            db.close();
        };

    });
}


export async function getDB() {
    return openDB(DB_NAME, DB_VERSION, {
        upgrade: (db, oldVersion, newVersion, transaction, event) => {
            console.log('que esta pasando;')
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
                gastosStore.createIndex("categoriaPresupuestoId", "categoriaPresupuestoId", { unique: false });
            }

            if (!db.objectStoreNames.contains(Stores.Sentimiento)) {
                db.createObjectStore(Stores.Sentimiento, { keyPath: "id", autoIncrement: true });
            }
            if (!db.objectStoreNames.contains(Stores.CategoriasGasto)) {
                db.createObjectStore(Stores.CategoriasGasto, { keyPath: "id", autoIncrement: true });
            }
            if (!db.objectStoreNames.contains(Stores.Ingresos)) {
                const ingresoStore = db.createObjectStore(Stores.Ingresos, { keyPath: "id", autoIncrement: true });
                ingresoStore.createIndex("fechaInicio", "fechaInicio", { unique: false });
                ingresoStore.createIndex("fechaFin", "fechaFin", { unique: false });
            }
            if (!db.objectStoreNames.contains(Stores.Notes)) {
                const noteStore = db.createObjectStore(Stores.Notes, { keyPath: "id", autoIncrement: true });
                noteStore.createIndex("fecha", "fecha", { unique: false });
            }
            if (!db.objectStoreNames.contains(Stores.CategoriaPresupuesto)) {
                db.createObjectStore(Stores.CategoriaPresupuesto, { keyPath: "id", autoIncrement: true });
            }

            const storeGasto = transaction.objectStore(Stores.Gastos)

            if (!storeGasto.indexNames.contains('categoriaPresupuestoId')) {
                storeGasto.createIndex("categoriaPresupuestoId", "categoriaPresupuestoId", { unique: false })
            }

        }
    });
}