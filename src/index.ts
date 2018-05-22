//Se importa todo lo necesario para correr la API
  import App from './app'
  import * as mongodb from 'mongodb'
  import { GenreRepo } from './repositories/genre.repo';
  import { ParadaRepo } from './repositories/parada.repo';
  import { RutaRepo } from './repositories/ruta.repo';
  import { TransporteRepo } from './repositories/transporte.repo';
  import { ConductorRepo } from './repositories/conductor.repo';
  import { Db, MongoClient } from 'mongodb';
  import {  Conductor, Genre, Parada, Ruta, Transporte } from './models/library';
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
    Conductores: mongo.collection<Conductor>('conductor'),

  }

  //Creamos los objetos que representan los repositorios de datos
   
    const genres = new GenreRepo(db);
    const parada = new ParadaRepo(db);
    const ruta = new RutaRepo(db);
    const transporte = new TransporteRepo(db);
    const conductor = new ConductorRepo(db);
 
  //Puerto a usar para servir el backend de forma local
    const port = 3000;
  
  //Creamos la función que será utilizada de middleware para manejar el caché en la aplicación
    
  
      //Rutas relacionadas con todos los géneros
        api.express.route('/api/genres')
        .post(async function(req, res){ //Operador para crear un género
          //Si la data que se manda tiene todas las propiedades de un género, se procede
          if(req.body.title){
              let genre: Genre;
              //Si se enviaron además los links relevantes para el género, se incluyen
              if(req.body.links){
                genre =  {
                  title: req.body.title,
                  links: req.body.links
                };
              }
              //Sino, no se incluyen
              else{
                genre =  {
                  title: req.body.title
                };
              }

              //Se crea el género en la base de datos respectiva
              let result = await genres.create(genre);

              //Una vez lista la creación, se envía el género creado devuelta
              res.status(201).json({
                message: 'Género creado',
                genre: result
              });
          }
          //Si no se tiene la data necesaria para crear un género, se envía un mensaje de error
          else{
            res.status(422).json({message:'Missing parameters'});
          } 
        })
        .get( async function(req, res){ //Operador para retornar todos los géneros disponibles
          
          //Se pide a la base de datos todos los géneros disponibles
          let result = await genres.getAll();

          //Una vez lista la búsqueda, se envían los géneros conseguidos devuelta
          res.status(200).json({
            message: 'Géneros buscados',
            genres: result
          });
        });


      //Rutas relacionadas con un género en particular 
        api.express.route('/api/genres/:genre_id')
        .put(async function(req, res){ //Operador para actualizar un género
          //Si no se tiene ningún campo disponible con el que actualizar, se retorna un mensaje de error
          if(!req.body.title
            && !req.body.links){
              res.status(422).json({message:'Missing parameters'});
            }
          //Si no, se puede proseguir
          else{
            //Se busca el género a actualizar, para encontrar las diferencias
            let old: Genre = await genres.get(req.params.genre_id);

            //Se construye el género con las características viejas y las características nuevas
            if(req.body.links){
              req.body.links.books = typeof req.body.links.books !== "undefined" ? req.body.links.books : old.links.books;
              req.body.links.authors = typeof req.body.links.authors !== "undefined" ? req.body.links.authors : old.links.authors;
            }
            let genre: Genre = {
              title: typeof req.body.title !== "undefined" ? req.body.title : old.title,
              links: typeof req.body.links !== "undefined" ? req.body.links : old.links
            };

            //Con el género actualizado en una variable, se inserta en la base de datos
            let result = await genres.update(req.params.genre_id, genre);

            //Se envía el género actualizado
            res.status(200).json({
              message: 'Género actualizado',
              genre: result
            });
          } 
        })
        .get( async function(req, res){ //Operador para buscar un género específico
          
          //Se busca en la base de datos el género especificado
          let result = await genres.get(req.params.genre_id);

          //Se retorna el género que fue buscado
          res.status(200).json({
            message: 'Género buscado',
            genres: result
          });
        })

        .delete(async function(req, res){ //Operador para eliminar un género específico

          //Se busca y elimina en la base de datos el género especificado
          let result = await genres.remove(req.params.genre_id);

          //Se retorna el género que fue borrado
          res.status(200).json({
            message: 'Género borrado',
            genres: result
          });
        });


        api.express.route('/api/parada')
        .post(async function(req, res){ //Operador para crear un género
          //Si la data que se manda tiene todas las propiedades de un género, se procede


          if(req.body.coordinates){
              let par: Parada;
              if(req.body.title && req.body.description && req.body.type != null){
                par =  {
                  title: req.body.title,
                  coordinates : req.body.coordinates,
                  description : req.body.description,
                  type:  req.body.type,
                  density: req.body.density
                };
              }
              else{
                par= {
                  coordinates : req.body.coordinates
                }
              }
            
              //Se crea el género en la base de datos respectiva
              let result = await parada.create(par);
              //Una vez lista la creación, se envía el género creado devuelta
              res.status(201).json({
                message: 'Parada creada',
                par: result
              });
          }
          //Si no se tiene la data necesaria para crear un género, se envía un mensaje de error
          else{
            res.status(422).json({message:'Missing parameters'});
          } 
        })
        .get( async function(req, res){ //Operador para retornar todos los géneros disponibles
          
          //Se pide a la base de datos todos los géneros disponibles
          let result = await parada.getAll();
          //Una vez lista la búsqueda, se envían los géneros conseguidos devuelta
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
                  paradas: req.body.paradas
                };
              }
              //Sino, no se incluyen
              else{
                route =  {
                  route : req.body.route,
                };
              }
        
              let result = await ruta.create(route);
              //Una vez lista la creación, se envía el género creado devuelta
              res.status(201).json({
                message: 'Ruta creada',
                route: result
              });
          }
          //Si no se tiene la data necesaria para crear un género, se envía un mensaje de error
          else{
            res.status(422).json({message:'Missing parameters'});
          } 
        }).get( async function(req, res){ 
          let result = await ruta.getAll();
          //Una vez lista la búsqueda, se envían los géneros conseguidos devuelta
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
                  numero: req.body.numero,
                  description: req.body.description,
                  modelo: req.body.modelo,
                  year: req.body.year,
                  route: req.body.route,
                  type: req.body.type,
                  placa: req.body.placa,
                  t_type: req.body.t_type
                };
              }
              //Sino, no se incluyen
              else{
                tran =  {
                  route : req.body.route,
                };
              }
        
              let result = await transporte.create(tran);
              //Una vez lista la creación, se envía el género creado devuelta
              res.status(201).json({
                message: 'Ruta creada',
                tran: result
              });
          }
          //Si no se tiene la data necesaria para crear un género, se envía un mensaje de error
          else{
            res.status(422).json({message:'Missing parameters'});
          } 
        }).get( async function(req, res){ 
          let result = await transporte.getAll();
          //Una vez lista la búsqueda, se envían los géneros conseguidos devuelta
          res.status(200).json({
            message: 'transportes buscados',
            transporte: result
          });
        })

  
        api.express.route('/api/conductor')
        .post(async function(req, res){
          if(req.body.ci ){
                let con: Conductor;
                con =  {
                  name: req.body.name,
                  lastName: req.body.lastName,
                  ci: req.body.ci,
                  transporte: req.body.tran,
                  licencia: req.body.licencia,
                  fechaNac: req.body.fN,
                  tel: req.body.tel,
                  status: req.body.status
                };
              
              let result = await conductor.create(con);
              //Una vez lista la creación, se envía el género creado devuelta
              res.status(201).json({
                message: 'Ruta creada',
                con: result
              });
          }
          //Si no se tiene la data necesaria para crear un género, se envía un mensaje de error
          else{
            res.status(422).json({message:'Missing parameters'});
          } 
        }).get( async function(req, res){ 
          let result = await conductor.getAll();
          //Una vez lista la búsqueda, se envían los géneros conseguidos devuelta
          res.status(200).json({
            message: 'conductores buscados',
            conductor: result
          });
        })

        //Rutas relacionadas con un género en particular 
        api.express.route('/api/conductor/:conductor_id')
        .put(async function(req, res){ //Operador para actualizar un género
          //Si no se tiene ningún campo disponible con el que actualizar, se retorna un mensaje de error

          if(!req.body.horario && req.body.data == false){
              res.status(422).json({message:'Missing parameters'});
            }
          //Si no, se puede proseguir
          else{
            //Se busca el género a actualizar, para encontrar las diferencias
            let old: Conductor = await conductor.get(req.params.conductor_id);

            
            let cond: Conductor
            let result
            if(req.body.data == false){
             cond = {
              horario: typeof req.body.horario !== "undefined" ? req.body.horario : old.horario
            };
          
             result = await conductor.update(req.params.conductor_id, cond);
          }else if(req.body.data == true ){
              cond = {
                tel:  req.body.tel !== undefined ? req.body.tel : old.tel,
                transporte:  (req.body.tran.length > 0) ? req.body.tran : old.transporte,
               status:  req.body.status !== undefined ? req.body.status : old.status}

               result = await conductor.update(req.params.conductor_id, cond);
            }
            else{
              result = 'nada'
            }
            //Con el género actualizado en una variable, se inserta en la base de datos
            

            //Se envía el género actualizado
            res.status(200).json({
              message: 'Género actualizado',
              cond: result
            });
          } 
        })

        //Rutas relacionadas con un género en particular 
        api.express.route('/api/tranporte/:transporte_id')
        .put(async function(req, res){ //Operador para actualizar un género
          //Si no se tiene ningún campo disponible con el que actualizar, se retorna un mensaje de error
          if(!req.body.des && !req.body.route){
              res.status(422).json({message:'Missing parameters'});
            }
          //Si no, se puede proseguir
          else{
            //Se busca el género a actualizar, para encontrar las diferencias
            let old: Transporte = await transporte.get(req.params.transporte_id);

            
            let tran: Transporte
            let result
            
            tran = {
              description:  req.body.description !== undefined ? req.body.description : old.description,
              route:  (req.body.route.length > 0) ? req.body.route : old.route}

               result = await transporte.update(req.params.transporte_id, tran);
            
            //Con el género actualizado en una variable, se inserta en la base de datos
            

            //Se envía el género actualizado
            res.status(200).json({
              message: 'transporte actualizado',
              trans: result
            });
          } 
        })

        //Update de la ruta
        api.express.route('/api/ruta/:ruta_id')
        .put(async function(req, res){ //Operador para actualizar un género
          //Si no se tiene ningún campo disponible con el que actualizar, se retorna un mensaje de error

          if(!req.body.title && !req.body.route){
              res.status(422).json({message:'Missing parameters'});
            }
          //Si no, se puede proseguir
          else{
            //Se busca el género a actualizar, para encontrar las diferencias
            let old: Ruta = await ruta.get(req.params.ruta_id);

            
            let rut: Ruta
            let result
            
            rut = {
              title:  req.body.title !== undefined ? req.body.title : old.title,
              route:  (req.body.route.length > 0) ? req.body.route : old.route,
              description:  req.body.description !== undefined ? req.body.description : old.description,
              type:  req.body.type !== undefined ? req.body.type : old.type,
              distance:  req.body.distance !== 0 && req.body.distance  !== undefined ? req.body.distance : old.distance,
              paradas:  (req.body.paradas.length > 0) ? req.body.paradas : old.paradas
              
              }

               result = await ruta.update(req.params.ruta_id, rut);
            
            //Con el género actualizado en una variable, se inserta en la base de datos
            

            //Se envía el género actualizado
            res.status(200).json({
              message: 'ruta actualizada',
              ruta: result
            });
          } 
        })

  //Se inicia la aplicación, para que corra en el puerto provisto
    api.express.listen(port, (err) => {

      if (err) {
        return console.log(err)
      }

      return console.log(`server is listening on http://localhost:${port}`)
    });



}





run();

