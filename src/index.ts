//Se importa todo lo necesario para correr la API
  import App from './app'
  import * as mongodb from 'mongodb'
  import { GenreRepo } from './repositories/genre.repo';
  import { ParadaRepo } from './repositories/parada.repo';
  import { RutaRepo } from './repositories/ruta.repo';
  import { TransporteRepo } from './repositories/transporte.repo';
  import { PropietarioRepo } from './repositories/propietario.repo';
  import { Db, MongoClient } from 'mongodb';
  import {  Propietario, Genre, Parada, Ruta, Transporte } from './models/library';
  import * as mcache from 'memory-cache';

//Creamos el objeto api, que representará la API RESTful
  const api = new App();

//Para poder hacer llamadas asíncronas, creamos una funcion run
const run = async () =>{

  //Creamos la conexión con la BDD correspondiente
  const mc = await MongoClient.connect('mongodb://localhost:27017/library');
  const mongo: Db = mc.db('library');
  const db = {
    
    Genres: mongo.collection<Genre>('genres'),
    Paradas: mongo.collection<Parada>('parada'),
    Rutas: mongo.collection<Ruta>('ruta'),
    Transportes: mongo.collection<Transporte>('transporte'),
    Propietarios: mongo.collection<Propietario>('propietario'),

  }

  //Creamos los objetos que representan los repositorios de datos
   
    const genres = new GenreRepo(db);
    const parada = new ParadaRepo(db);
    const ruta = new RutaRepo(db);
    const transporte = new TransporteRepo(db);
    const propietario = new PropietarioRepo(db);
 
  //Puerto a usar para servir el backend de forma local
    const port = 3000;
  
        // .delete(async function(req, res){ //Operador para eliminar un género específico

        //   //Se busca y elimina en la base de datos el género especificado
        //   let result = await genres.remove(req.params.genre_id);

        //   //Se retorna el género que fue borrado
        //   res.status(200).json({
        //     message: 'Género borrado',
        //     genres: result
        //   });
        // });


        api.express.route('/api/parada')
        .post(async function(req, res){ 

          if(req.body.coordinates){
              let par: Parada;
              
                par =  {
                  title: req.body.title,
                  coordinates : req.body.coordinates,
                  description : req.body.description,
                  terminal:  req.body.type,
                  density: req.body.density
                };
              
             
            
              let result = await parada.create(par);
              res.status(201).json({
                message: 'Parada creada',
                par: result
              });
          }
          else{
            res.status(422).json({message:'Missing parameters'});
          } 
        })
        .get( async function(req, res){ 
          
          let result = await parada.getAll();
          res.status(200).json({
            message: 'Paradas buscadas',
            par: result
          });
        });
        


        api.express.route('/api/ruta')
        .post(async function(req, res){
          if(req.body.route && req.body.title && req.body.description && req.body.type){
              let route: Ruta;
              if(req.body.title && req.body.description && req.body.type){
                route =  {
                  title: req.body.title,
                  route: req.body.route,
                  description: req.body.description,
                  type: req.body.type,
                  distance: req.body.distance,
                  stops: req.body.paradas
                };
              }
              else{
                route =  {
                  route : req.body.route,
                };
              }
        
              let result = await ruta.create(route);
              res.status(201).json({
                message: 'Ruta creada',
                route: result
              });
          }
          else{
            res.status(422).json({message:'Missing parameters'});
          } 
        }).get( async function(req, res){ 
          let result = await ruta.getAll();
          res.status(200).json({
            message: 'Rutas buscadas',
            route: result
          });
        })

        api.express.route('/api/transporte')
        .post(async function(req, res){
          if(req.body.route ){
              let tran: Transporte;
              if(req.body.numero){
                tran =  {
                  number: req.body.numero,
                  description: req.body.description,
                  model: req.body.modelo,
                  year: req.body.year,
                  route: req.body.route,
                  licPlate: req.body.placa,
                  vehType: req.body.t_type,
                  active: req.body.active,
                  seats: req.body.seats,
                  color: req.body.color
                };
              }
              else{
                tran =  {
                  route : req.body.route,
                };
              }
        
              let result = await transporte.create(tran);
              res.status(201).json({
                message: 'Ruta creada',
                tran: result
              });
          }
          else{
            res.status(422).json({message:'Missing parameters'});
          } 
        }).get( async function(req, res){ 
          let result = await transporte.getAll();
          res.status(200).json({
            message: 'transportes buscados',
            transporte: result
          });
        })

  
        api.express.route('/api/propietario')
        .post(async function(req, res){
          if(req.body.ci ){
                let con: Propietario;
                con =  {
                  name: req.body.name,
                  lastName: req.body.lastName,
                  ci: req.body.ci,
                  transports: req.body.tran,
                  birthday: req.body.fN,
                  cell: req.body.tel
                };
              
              let result = await propietario.create(con);
              res.status(201).json({
                message: 'Ruta creada',
                con: result
              });
          }
          else{
            res.status(422).json({message:'Missing parameters'});
          } 
        }).get( async function(req, res){ 
          let result = await propietario.getAll();
          res.status(200).json({
            message: 'conductores buscados',
            conductor: result
          });
        })

        api.express.route('/api/propietario/:propietario_id')
        .put(async function(req, res){ 

          if(!req.body.horario && req.body.data == false){
              res.status(422).json({message:'Missing parameters'});
            }
          else{
            let old: Propietario = await propietario.get(req.params.propietario_id);

            
            let cond: Propietario
            let result
            if(req.body.data == false){
            //  cond = {
            //   schedule: typeof req.body.horario !== "undefined" ? req.body.horario : old.schedule
            // };
          
            //  result = await conductor.update(req.params.conductor_id, cond);
          }else if(req.body.data == true ){
              cond = {
                cell:  req.body.tel !== undefined ? req.body.tel : old.cell,
                transports:  (req.body.tran.length > 0) ? req.body.tran : old.transports}

               result = await propietario.update(req.params.propietario_id, cond);
            }
            else{
              result = 'nada'
            }
            
            res.status(200).json({
              message: 'Género actualizado',
              cond: result
            });
          } 
        })

        api.express.route('/api/tranporte/:transporte_id')
        .put(async function(req, res){ 
          
            let old: Transporte = await transporte.get(req.params.transporte_id);

            
            let tran: Transporte
            let result

            console.log('solicitud', req.body);
            if(req.body.data == false){
              tran = {
                schedule: typeof req.body.horario !== "undefined" ? req.body.horario : old.schedule}
  
                 result = await transporte.update(req.params.transporte_id, tran);
              
            }else if(req.body.data == true ){
              tran = {
                description:  req.body.description !== undefined ? req.body.description : old.description,
                active:  req.body.active !== undefined ? req.body.active : old.active}
  
                 result = await transporte.update(req.params.transporte_id, tran);
              }
              else{
                tran = {
                  owner:  req.body.owner !== undefined ? req.body.owner : old.owner}
    
                   result = await transporte.update(req.params.transporte_id, tran);
              }
            
           
            
            res.status(200).json({
              message: 'transporte actualizado',
              trans: result
            });
          // } 
        })

        api.express.route('/api/ruta/:ruta_id')
        .put(async function(req, res){

          if(!req.body.title && !req.body.route){
              res.status(422).json({message:'Missing parameters'});
            }
          else{
            let old: Ruta = await ruta.get(req.params.ruta_id);

            
            let rut: Ruta
            let result
            
            rut = {
              title:  req.body.title !== undefined ? req.body.title : old.title,
              route:  (req.body.route.length > 0) ? req.body.route : old.route,
              description:  req.body.description !== undefined ? req.body.description : old.description,
              type:  req.body.type !== undefined ? req.body.type : old.type,
              distance:  req.body.distance !== 0 && req.body.distance  !== undefined ? req.body.distance : old.distance,
              stops:  (req.body.paradas.length > 0) ? req.body.paradas : old.stops
              
              }

               result = await ruta.update(req.params.ruta_id, rut);
            
            
            res.status(200).json({
              message: 'ruta actualizada',
              ruta: result
            });
          } 
        })

    api.express.listen(port, (err) => {

      if (err) {
        return console.log(err)
      }

      return console.log(`server is listening on http://localhost:${port}`)
    });



}





run();

