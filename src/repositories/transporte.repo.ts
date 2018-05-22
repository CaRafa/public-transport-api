import { Database } from '../database';
import { Transporte } from '../models/library';
import { ObjectId } from 'mongodb';

export class TransporteRepo {
    private db: Database;

    constructor(db: Database){
        this.db = db;
    }

    public async get(id: string): Promise <Transporte | null>{
        return this.db.Transportes.findOne({'_id': new ObjectId(id)});
    }

    public async getAll(): Promise <Transporte[] | null>{
        console.log('LLAMADA A GET ALL');
        if(this.db){
            console.log('EXISTE BDD');
        }

        return this.db.Transportes.find().toArray();
    }

    public async create(data: Transporte): Promise <Transporte | null>{

        let insertion = await this.db.Transportes.insertOne(data);
        if(insertion.insertedId){
            return this.db.Transportes.findOne({'_id': new ObjectId(insertion.insertedId)});
        }
        else{
            return null;
        }
    }

    public async remove(id: string): Promise<Transporte | null>{
        let found = await this.db.Transportes.findOne({'_id': new ObjectId(id)});
        if (found._id){
            this.db.Transportes.deleteOne({'_id': new ObjectId(found._id)});
            return found;
        }
        else{
            return null;
        }
    }

    public async update(id: string, data: Transporte): Promise<Transporte | null>{
        let updated = await this.db.Transportes.updateOne({'_id': new ObjectId(id)}, { $set: data });
        if(updated.matchedCount === 1){
            return this.db.Transportes.findOne({'_id': new ObjectId(id)});
        }
        else{
            return null
        }
    }
}