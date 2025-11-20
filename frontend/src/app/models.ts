export interface User {
	id?: number;
	username: string;
	password?: string;
	email?: string;
	rol?: string;
	laboratorio?: number; // ID of lab
}

export interface Laboratorio {
	id?: number;
	nombre: string;
	direccion: string;
	telefono: string;
}
