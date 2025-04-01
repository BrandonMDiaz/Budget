export interface CategoriasGasto {
  id: number;
  nombre: string;
  porcentaje: number;
}

export const categoriasDefault = [
  { id: 1, nombre: "Basico", porcentaje: 50 },
  { id: 2, nombre: "Lujo", porcentaje: 30 },
  { id: 3, nombre: "Ahorro", porcentaje: 20 },
  { id: 4, nombre: "Comida" },
  { id: 5, nombre: "Social" },
  { id: 6, nombre: "Medico" },
  { id: 7, nombre: "Seguros" },
  { id: 8, nombre: "Regalos" },
  { id: 9, nombre: "Diversion" },
  { id: 10, nombre: "Cuidado personal" },
  { id: 11, nombre: "Otros" },
  { id: 12, nombre: "Subscripciones" },
  { id: 13, nombre: "Casa" },
  { id: 14, nombre: "Transporte" },
  { id: 15, nombre: "Carro" },
];
