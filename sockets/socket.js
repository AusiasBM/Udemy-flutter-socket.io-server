
const {io} = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands();

bands.addBand( new Band('Queen') );
bands.addBand( new Band('Bon Jovi') );
bands.addBand( new Band('Heroes del silencio') );
bands.addBand( new Band('Metallica') );

// Mensajes de Sockets
io.on('connection', client => {
    
    console.log('Cliente conectado');

    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => { 
        console.log('Cliente desconectado') 
    }); // 


    client.on('mensaje', (payload) => {
        console.log('Mensaje!!!!', payload)

        io.emit('mensaje', {admin: 'Nuevo Mensaje'}); // emite un mensaje a todos los clientes conectados

    });

    client.on('vote-band', (idBand) => {
        bands.voteBand(idBand.id);
        io.emit('active-bands', bands.getBands());
    });

    client.on('add-band', (band) => {
        bands.addBand(new Band(band.name));
        io.emit('active-bands', bands.getBands());
    });

    client.on('delete-band', (band) => {
        bands.deleteBand(band.id);
        io.emit('active-bands', bands.getBands());
    });

    // client.on('emitir-mensaje', (payload) => {
    //     console.log(payload)
    //     //io.emit('nuevo-mensaje', payload); // emite a todos
    //     client.broadcast.emit('nuevo-mensaje', payload); // emite a todos menos el que lo emitió
    // });

});