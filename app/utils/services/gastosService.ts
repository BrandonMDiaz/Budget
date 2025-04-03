import type { Gasto } from '~/utils/db/models';
import dayjs from "dayjs";
import { Recurrencia } from '../db/models/Gasto';
import { Stores, getDB } from '../db';

export async function addGasto(gasto: Gasto): Promise<unknown> {
    const db = await getDB();
    const transaction = db.transaction(Stores.Gastos, "readwrite");
    const store = transaction.objectStore(Stores.Gastos);
    const response = await store.add(gasto);
    transaction.done;
    return response
}

export async function getGastosByIndex(startDate: dayjs.Dayjs, endDate: dayjs.Dayjs, storeName: string, value?: string | number) {
    try {
        const db = await getDB();
        const transaction = db.transaction(Stores.Gastos, "readwrite");
        const index = transaction.store.index(storeName);
        const data: Gasto[] = []
        for await (const cursor of index.iterate(value)) {
            const gasto = cursor.value as Gasto;
            const gastoDate = dayjs(gasto.fecha.toString());

            if (gasto.recurrencia && gasto.recurrencia !== Recurrencia.Unico
                && startDate.isAfter(gasto.fecha) && endDate.isBefore(gasto.finRecurrencia)) {
                data.push(gasto);
            } else if (gastoDate.isBefore(endDate) && gastoDate.isAfter(startDate)
                || gastoDate.isSame(startDate) || gastoDate.isSame(endDate)) {
                data.push(gasto);
            }
        }
        await transaction.done
        return data;
    }
    catch (err) {
        console.log(err);
    }
}

export async function getGastos(startDate: dayjs.Dayjs, endDate: dayjs.Dayjs) {
    const db = await getDB();
    const transaction = db.transaction(Stores.Gastos, "readwrite");
    const store = transaction.objectStore(Stores.Gastos);
    const data: Gasto[] = []
    for await (const cursor of store.iterate()) {
        const gasto = cursor.value as Gasto;
        const gastoDate = dayjs(gasto.fecha.toString());

        if (gasto.recurrencia && gasto.recurrencia !== Recurrencia.Unico
            && startDate.isAfter(gasto.fecha) && endDate.isBefore(gasto.finRecurrencia)) {
            data.push(gasto);
        } else if (gastoDate.isBefore(endDate) && gastoDate.isAfter(startDate)
            || gastoDate.isSame(startDate) || gastoDate.isSame(endDate)) {
            data.push(gasto);
        }
    }
    transaction.done
    return data;
}

export async function updateGastos(gasto: Gasto) {
    const db = await getDB();
    const transaction = db.transaction(Stores.Gastos, "readwrite");
    const store = transaction.objectStore(Stores.Gastos);
    const request = await store.put(gasto);
    transaction.done;
    return request;
}

export function deleteGastos() {

}