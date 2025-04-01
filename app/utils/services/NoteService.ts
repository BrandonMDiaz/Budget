import { Stores, getDB } from '~/utils/db';
import type { Note } from '../db/models/Note';

export async function addNote(note: Note): Promise<void> {
    const db = await getDB();
    const transaction = db.transaction(Stores.Notes, "readwrite");
    const store = transaction.objectStore(Stores.Notes);
    await store.add(note);
    await transaction.done
}

export async function getNote() {
    const db = await getDB();
    const transaction = db.transaction(Stores.Ingresos, "readwrite");
    const store = transaction.objectStore(Stores.Ingresos);
    const request = await store.getAll();
    await transaction.done
    return request;

}

export function updateNote() {

}

export function deleteNote() {

}