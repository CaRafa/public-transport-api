import { Database } from '../database';
import { Estadistica } from '../models/library';
import { ObjectId } from 'mongodb';

export class EstadisticaRepo {
    private db: Database;

    constructor(db: Database){
        this.db = db;
    }

    public async get(id: string): Promise <Estadistica | null>{
        return this.db.Estadisticas.findOne({'_id': new ObjectId(id)});
    }

    public async getAll(): Promise <Estadistica[] | null>{
        console.log('LLAMADA A GET ALL');
        if(this.db){
             
        }

        return this.db.Estadisticas.find().toArray();
    }

    public async create(data: Estadistica): Promise <Estadistica | null>{

        let insertion = await this.db.Estadisticas.insertOne(data);
        if(insertion.insertedId){
            return this.db.Estadisticas.findOne({'_id': new ObjectId(insertion.insertedId)});
        }
        else{
            return null;
        }
    }

    public async remove(id: string): Promise<Estadistica | null>{
        let found = await this.db.Estadisticas.findOne({'_id': new ObjectId(id)});
        if (found._id){
            this.db.Estadisticas.deleteOne({'_id': new ObjectId(found._id)});
            return found;
        }
        else{
            return null;
        }
    }

    public async update(id: string, data: Estadistica): Promise<Estadistica | null>{
        let updated = await this.db.Estadisticas.updateOne({'_id': new ObjectId(id)}, { $set: data });
        if(updated.matchedCount === 1){
            return this.db.Estadisticas.findOne({'_id': new ObjectId(id)});
        }
        else{
            return null
        }
    }
}