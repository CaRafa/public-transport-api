//Se importa todo lo necesario para correr la API
  import App from './app'
  import * as mongodb from 'mongodb'
  import { GenreRepo } from './repositories/genre.repo';
  import { ParadaRepo } from './repositories/parada.repo';
  import { Db, MongoClient } from 'mongodb';
  import { Genre, Parada } from './models/library';
  import * as mcache from 'memory-cache';

//Creamos el objeto api, que representará la API RESTful
  const api = new App();

//Para poder hacer llamadas asíncronas, creamos una funcion run
const run = async () =>{

  //Creamos la conexión con la BDD correspondiente
  const mc = await MongoClient.connect('mongodb://publicTransport:1234@ds215380.mlab.com:15380/heroku_tzlnxnvb');
  const mongo: Db = mc.db('library');
  const db = {
    
    Genres: mongo.collection<Genre>('genres'),
    Paradas: mongo.collection<Parada>('parada'),

  }

  //Creamos los objetos que representan los repositorios de datos
   
    const genres = new GenreRepo(db);
    const parada = new ParadaRepo(db);
 
  //Puerto a usar para servir el backend de forma local
    const port = 3001;
  
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

          console.log('Pedido index',req.body);

          if(req.body.coordinates){
              let par: Parada;
              //Si se enviaron además los links relevantes para el género, se incluyen
              if(req.body.title){
                par =  {
                  title: req.body.title,
                  coordinates : req.body.coordinates,
                };
              }
              //Sino, no se incluyen
              else{
                par =  {
                  coordinates : req.body.coordinates,
                };
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
          console.log(result);
          //Una vez lista la búsqueda, se envían los géneros conseguidos devuelta
          res.status(200).json({
            message: 'Paradas buscadas',
            par: result
          });
        });
        


  //Se inicia la aplicación, para que corra en el puerto provisto
    api.express.listen(port, (err) => {
      if (err) {
        return console.log(err)
      }

      return console.log(`server is listening on http://localhost:${port}`)
    });
}





run();
