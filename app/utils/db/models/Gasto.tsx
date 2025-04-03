export interface Gasto {
  id: number;
  nombre: string;
  precio: number;
  fecha: string;
  imagen?: string;
  recurrencia: Recurrencia;
  frecuencia?: Frecuencia;
  finRecurrencia?: string;
  numMeses?: number;
  pagosRestantes?: number;
  sentimientoId: number;
  paymentTypeId: number;
  categoriaId: number;
  categoriaPresupuestoId: number;
}

export enum Recurrencia {
  Unico = "unico",
  MSI = "msi",
  Recurrente = "recurrente",
}

export enum Frecuencia {
  Diario = "Diario",
  Semanal = "Semanal",
  Quincenal = "Quincenal",
  Mensual = "Mensual",
  Bimenstral = "Bimenstral",
  Trimestral = "trimestral",
  Semestral = "Semestral",
  Anual = "Anual",
}
