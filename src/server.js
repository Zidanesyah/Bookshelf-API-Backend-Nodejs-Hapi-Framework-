const Hapi = require('@hapi/hapi');
const route = require('./routes');

const app = async () =>{
    const server = Hapi.server({
        port: 9000,
        host : process.env.NODE_ENV === 'production' ? 'localhost' : '0.0.0.0',
        routes:{
            cors:{
                origin: ['*'],
            }
        }
    })

    server.route(route);
    await server.start();
    console.log(`Server Running at ${server.info.uri}`);
}

app()