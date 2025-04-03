export interface CategoriasPresupuesto {
  id: number;
  nombre: string;
  porcentaje: number;
}

export const categoriasPresupuestoDefault = [
  { id: 1, nombre: "Basico", porcentaje: 50 },
  { id: 2, nombre: "Lujo", porcentaje: 20 },
  { id: 3, nombre: "Ahorro", porcentaje: 30 },
];
