import {
    Genre,
    Parada,
    Ruta
} from '../models/library';
import { Collection } from 'mongodb';

export interface Database {
    
    Genres: Collection<Genre>
    Paradas: Collection<Parada>
    Rutas: Collection<Ruta>

}