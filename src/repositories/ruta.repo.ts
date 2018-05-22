import { Database } from '../database';
import { Ruta } from '../models/library';
import { ObjectId } from 'mongodb';

export class RutaRepo {
    private db: Database;

    constructor(db: Database){
        this.db = db;
    }

    public async get(id: string): Promise <Ruta | null>{
        return this.db.Rutas.findOne({'_id': new ObjectId(id)});
    }

    public async getAll(): Promise <Ruta[] | null>{
        console.log('LLAMADA A GET ALL');
        if(this.db){
            console.log('EXISTE BDD');
        }

        return this.db.Rutas.find().toArray();
    }

    public async create(data: Ruta): Promise <Ruta | null>{

        let insertion = await this.db.Rutas.insertOne(data);
        if(insertion.insertedId){
            return this.db.Rutas.findOne({'_id': new ObjectId(insertion.insertedId)});
        }
        else{
            return null;
        }
    }

    public async remove(id: string): Promise<Ruta | null>{
        let found = await this.db.Rutas.findOne({'_id': new ObjectId(id)});
        if (found._id){
            this.db.Rutas.deleteOne({'_id': new ObjectId(found._id)});
            return found;
        }
        else{
            return null;
        }
    }

    public async update(id: string, data: Ruta): Promise<Ruta | null>{
        let updated = await this.db.Rutas.updateOne({'_id': new ObjectId(id)}, { $set: data });
        if(updated.matchedCount === 1){
            return this.db.Rutas.findOne({'_id': new ObjectId(id)});
        }
        else{
            return null
        }
    }
}