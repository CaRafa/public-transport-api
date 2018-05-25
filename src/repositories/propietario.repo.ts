import { Database } from '../database';
import { Propietario } from '../models/library';
import { ObjectId } from 'mongodb';

export class PropietarioRepo {
    private db: Database;

    constructor(db: Database){
        this.db = db;
    }

    public async get(id: string): Promise <Propietario | null>{
        return this.db.Propietarios.findOne({'_id': new ObjectId(id)});
    }

    public async getAll(): Promise <Propietario[] | null>{
        if(this.db){
            console.log('EXISTE BDD');
        }

        return this.db.Propietarios.find().toArray();
    }

    public async create(data: Propietario): Promise <Propietario | null>{

        console.log('Pedido',data);
        let insertion = await this.db.Propietarios.insertOne(data);
        if(insertion.insertedId){
            return this.db.Propietarios.findOne({'_id': new ObjectId(insertion.insertedId)});
        }
        else{
            return null;
        }
    }

    public async remove(id: string): Promise<Propietario | null>{
        let found = await this.db.Propietarios.findOne({'_id': new ObjectId(id)});
        if (found._id){
            this.db.Propietarios.deleteOne({'_id': new ObjectId(found._id)});
            return found;
        }
        else{
            return null;
        }
    }

    public async update(id: string, data: Propietario): Promise<Propietario | null>{
        let updated = await this.db.Propietarios.updateOne({'_id': new ObjectId(id)}, { $set: data });
        if(updated.matchedCount === 1){
            return this.db.Propietarios.findOne({'_id': new ObjectId(id)});
        }
        else{
            return null
        }
    }
}