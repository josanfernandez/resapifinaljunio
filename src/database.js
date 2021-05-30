const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://josanProyecto:proyectoFinal@cluster0.vrka3.mongodb.net/proyectoFinal?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(db => console.log('Database is connected'))
    .catch(err => console.log(err));
