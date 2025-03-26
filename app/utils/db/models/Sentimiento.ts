export interface Sentimiento {
    id: number;
    nombre: string;
}
export enum SentimientoEnum {
    Feliz = "Feliz",
    Triste = "Triste",
    Arrepentido = "Arrepentido",
    Necesidad = "Era necesario",
    Enojo = "Enojo",
    Indiferente = "Indiferente",
}

export const sentimientoDefault = [
    { id: 1, nombre: SentimientoEnum.Feliz },
    { id: 2, nombre: SentimientoEnum.Triste },
    { id: 3, nombre: SentimientoEnum.Arrepentido },
    { id: 4, nombre: SentimientoEnum.Necesidad },
    { id: 5, nombre: SentimientoEnum.Enojo },
    { id: 6, nombre: SentimientoEnum.Indiferente }
]

export const sentimientoArr = [
    { label: SentimientoEnum.Feliz, value: 1 },
    { label: SentimientoEnum.Triste, value: 2 },
    { label: SentimientoEnum.Arrepentido, value: 3 },
    { label: SentimientoEnum.Necesidad, value: 4 },
    { label: SentimientoEnum.Enojo, value: 5 },
    { label: SentimientoEnum.Indiferente, value: 6 },
];
