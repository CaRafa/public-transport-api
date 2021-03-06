import {
    Genre,
    Parada,
    Ruta,
    Transporte,
    Propietario,
    Estadistica
} from '../models/library';
import { Collection } from 'mongodb';

export interface Database {
    
    Genres: Collection<Genre>
    Paradas: Collection<Parada>
    Rutas: Collection<Ruta>
    Transportes: Collection<Transporte>
    Propietarios: Collection<Propietario>
    Estadisticas: Collection<Estadistica>

}