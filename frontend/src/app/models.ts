export interface User {
	id?: number;
	username: string;
	password?: string;
	email?: string;
	rol?: string;
	laboratorioId?: number;
	laboratorio?: any;
}

export interface Laboratorio {
	id?: number;
	nombre: string;
	direccion: string;
	telefono: string;
}
export interface Resultado {
	id?: number;
	paciente?: User;
	laboratorio?: Laboratorio;
	analisis: string;
	fecha: Date;
}
