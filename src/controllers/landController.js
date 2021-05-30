//https://www.freecodecamp.org/news/securing-node-js-restful-apis-with-json-web-tokens-9f811a92bb52/
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var modelos = require('../models/Territorio');
const { comunidades, municipios } = require('../models/Territorio');


router.use(express.urlencoded({ extended: false }));
router.use(express.json());

Comunidad = modelos.comunidades
Provincia = modelos.provincias
Municipio = modelos.municipios

router.get('/', async(req, res) =>{
  /*const result = await(Comunidad.find({}))

  try {
      res.send(result);
    } catch (error) {
      res.status(500).send(error);
    }
*/

  /*Comunidad.aggregate([
    {
      "$lookup":{
        "from":"Provincia",
        "localField":"_id",
        "foreignField":"id_comunidad",
        "as":"provincias"
      },
    }
  ]).exec(function(err, result){
    console.log(err)
    console.log(result)
  })*/


  Comunidad.aggregate([
    { "$lookup":
        {
          "from": "provincias",
           "localField": "_id",
           "foreignField": "id_comunidad",
           "as": "provincias"
        }
    },
    {
            $unwind:
            {
                path:"$provincias",
                 preserveNullAndEmptyArrays: true
            },
    },
    {
        $lookup:{
            from:"municipios",
            localField:"provincias._id",
            foreignField:"id_provincia",
            as:"municipios"
        },

    },
    {
        $group:{
            _id:"$_id",
            nombre:{$first:"$nombre"},
            provincias:{$push:"$provincias"},
            municipios:{$push:"$municipios"}
    }
    }


]).exec(function(err, result){
  dict_comunidades = {}
  dict_provincias = {}
  dict_municipios = {}
  result.forEach((el)=>{
    dict_comunidades[el._id] = [el._id, el.nombre]
    el.provincias.forEach((prov)=>{
      dict_provincias[prov._id] = prov
      el.municipios.forEach((muni)=>{
        muni.forEach((mun)=>{
          if (mun.id_provincia == prov._id) dict_municipios[mun._id] = mun
        })



        
      })
      prov['municipios'] = dict_municipios
      dict_municipios = {}
    })    
    dict_comunidades[el._id].push(dict_provincias)
    dict_provincias = {}
  })
  res.send(dict_comunidades)
})


})

module.exports = router
