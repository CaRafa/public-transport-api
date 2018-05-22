import { Database } from '../database';
import { Parada } from '../models/library';
import { ObjectId } from 'mongodb';

export class ParadaRepo {
    private db: Database;

    constructor(db: Database){
        this.db = db;
    }

    public async get(id: string): Promise <Parada | null>{
        return this.db.Paradas.findOne({'_id': new ObjectId(id)});
    }

    public async getAll(): Promise <Parada[] | null>{
        if(this.db){
            console.log('EXISTE BDD');
        }

        return this.db.Paradas.find().toArray();
    }

    public async create(data: Parada): Promise <Parada | null>{

        let insertion = await this.db.Paradas.insertOne(data);
        if(insertion.insertedId){
            return this.db.Paradas.findOne({'_id': new ObjectId(insertion.insertedId)});
        }
        else{
            return null;
        }
    }

    public async remove(id: string): Promise<Parada | null>{
        let found = await this.db.Paradas.findOne({'_id': new ObjectId(id)});
        if (found._id){
            this.db.Paradas.deleteOne({'_id': new ObjectId(found._id)});
            return found;
        }
        else{
            return null;
        }
    }

    public async update(id: string, data: Parada): Promise<Parada | null>{
        let updated = await this.db.Paradas.updateOne({'_id': new ObjectId(id)}, { $set: data });
        if(updated.matchedCount === 1){
            return this.db.Paradas.findOne({'_id': new ObjectId(id)});
        }
        else{
            return null
        }
    }
}