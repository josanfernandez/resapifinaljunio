const { Schema, model } = require('mongoose');
const mongoose = require('mongoose')

const territorio = mongoose.connection.useDb('territorio');

const municipio = territorio.model('Municipio', new Schema({
  nombre:String,
  confirmados:Number,
  fallecidos:Number,
  comunidad:{type:Number, ref:'Comunidad'},
  provincia:{type:Number, ref:"Provincia"}
}))

const ProvinciaSchema = new Schema({
      _id:Number,
      nombre:String,
      id_comunidad:Number
})

const ComunidadSchema = new Schema({
  _id:Number,
  nombre:String
  //municipios:{type:mongoose.Schema.Types.ObjectId, ref:'Municipio'}
})


module.exports = {municipios:municipio,provincias:territorio.model('provincias',ProvinciaSchema),comunidades:territorio.model('comunidades',ComunidadSchema)}
//module.exports = myDB.model('comunidades',ComunidadSchema)
