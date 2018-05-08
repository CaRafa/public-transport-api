import {
    Genre,
    Parada,
    Ruta,
    Transporte,
    Conductor
} from '../models/library';
import { Collection } from 'mongodb';

export interface Database {
    
    Genres: Collection<Genre>
    Paradas: Collection<Parada>
    Rutas: Collection<Ruta>
    Transportes: Collection<Transporte>
    Conductores: Collection<Conductor>

}