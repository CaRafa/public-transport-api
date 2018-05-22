import { Database } from '../database';
import { Conductor } from '../models/library';
import { ObjectId } from 'mongodb';

export class ConductorRepo {
    private db: Database;

    constructor(db: Database){
        this.db = db;
    }

    public async get(id: string): Promise <Conductor | null>{
        return this.db.Conductores.findOne({'_id': new ObjectId(id)});
    }

    public async getAll(): Promise <Conductor[] | null>{
        if(this.db){
            console.log('EXISTE BDD');
        }

        return this.db.Conductores.find().toArray();
    }

    public async create(data: Conductor): Promise <Conductor | null>{

        console.log('Pedido',data);
        let insertion = await this.db.Conductores.insertOne(data);
        if(insertion.insertedId){
            return this.db.Conductores.findOne({'_id': new ObjectId(insertion.insertedId)});
        }
        else{
            return null;
        }
    }

    public async remove(id: string): Promise<Conductor | null>{
        let found = await this.db.Conductores.findOne({'_id': new ObjectId(id)});
        if (found._id){
            this.db.Conductores.deleteOne({'_id': new ObjectId(found._id)});
            return found;
        }
        else{
            return null;
        }
    }

    public async update(id: string, data: Conductor): Promise<Conductor | null>{
        let updated = await this.db.Conductores.updateOne({'_id': new ObjectId(id)}, { $set: data });
        if(updated.matchedCount === 1){
            return this.db.Conductores.findOne({'_id': new ObjectId(id)});
        }
        else{
            return null
        }
    }
}