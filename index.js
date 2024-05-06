import { ApolloServer } from 'apollo-server';
import { gql } from 'graphql-tag';

//datos para hacer consultas con graphql, esto seria la "base de datos"
const persona =[
    {
        nombre: "Juan",
        celular: "123-456-7890",
        barrio: "castilla",
        edad: 20,
        ciudad: "medellin",
        id: "1"
    },
    {
        nombre: "Valentina",
        celular: "098-765-4321",
        barrio: "robledo",
        ciudad: "medellin",
        id: "2"
    },
    {
        nombre: "Juan Perez",
        barrio: "belen",
        ciudad: "medellin",
        id: "3"
    }
]

//describir los datos (usando graphql) que se pueden consultar
const typeDescripfs = gql`
    #el signo de admiración indica que es obligatorio
    #definir que tipo de consulta se puede hacer
    type Query {  
        personaCount: Int!
        allPersonas: [Persona]!
        findPersona(nombre: String!): Persona #con parametros, le damos el nombre y 
        #nos devuelve un objeto de tipo Persona
    }
    type Direccion{
        barrio: String!
        ciudad: String!
    }

    type Persona {
        nombre: String!
        edad: Int
        celular: String
        dirreccion: Direccion!
        id: ID!
    }
`

const resolvers = {
    Query: {
        personaCount: () => persona.length, //una forma de resolver la primera query
        allPersonas: () => persona,
        findPersona: (root, args) => { //root es el objeto que contiene la query
            const {nombre} = args //extraemos el nombre de los argumentos
            return persona.find(person => person.nombre === nombre)
        }
    },
    Persona: {
        dirreccion: (root) => { //root es el objeto que contiene la query
            return {
                barrio: root.barrio,
                ciudad: root.ciudad
            }
        }
    }

}

//crear el servidor
const server = new ApolloServer({
    typeDefs: typeDescripfs,
    resolvers
})

//iniciar el servidor
server.listen().then(({url}) => { //listen inicializa el serv y cuando lo hace devuelve una promesa
    console.log(`Servidor listo ${url}`)
})