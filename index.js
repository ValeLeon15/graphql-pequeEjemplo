import { ApolloServer, UserInputError } from 'apollo-server';
import { gql } from 'graphql-tag';
import {v1 as uuid} from 'uuid'; //para generar id unicos
//datos para hacer consultas con graphql, esto seria la "base de datos"
const personas =[
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
//todo se tiene que definir en graphql queries, mutations
const typeDescripfs = gql`
    #el signo de admiración indica que es obligatorio
    #definir que tipo de consulta se puede hacer
   
    type Direccion{
        barrio: String!
        ciudad: String!
    }

    type Persona {
        nombre: String!
        edad: Int
        celular: String
        direccion: Direccion!
        id: ID!
    }

    type Query {  
        personaCount: Int!
        allPersonas: [Persona]!
        findPersona(nombre: String!): Persona #con parametros, le damos el nombre y 
        #nos devuelve un objeto de tipo Persona
    }

    type Mutation {
        addPersona(
            nombre: String!
            edad: Int
            celular: String
            barrio: String!
            ciudad: String!
        ): Persona
        editNumber(
            nombre: String!
            celular: String!
        ): Persona
    }
`

const resolvers = {
    Query: {
        personaCount: () => personas.length, //una forma de resolver la primera query
        allPersonas: () => personas,
        findPersona: (root, args) => { //root es el objeto que contiene la query
            const {nombre} = args //extraemos el nombre de los argumentos
            return persona.find(person => person.nombre === nombre)
        }
    },

    Mutation: {
        addPersona: (root, args) => {
            if(personas.find(person => person.nombre === args.nombre)){ //si ya existe una persona con ese nombre
                throw new UserInputError('El nombre ya existe',{invalidArgs: args.nombre}) //lanzamos un error
            }
            //args= {nombre, edad, celular, barrio, ciudad}
            const newPersona = {...args, id: uuid()} //creamos un nuevo objeto con los argumentos y un id
            personas.push(newPersona) //Actualizamos la base de datos con el nuevo objeto
            return newPersona //retornamos el nuevo objeto
        },
        editNumber: (root, args) => {
            const personIndex = personas.findIndex(person => person.nombre === args.nombre) //buscamos la persona con el nombre
            if(personIndex==-1){ //si no existe
                return null}

            const persona = personas[personIndex] //obtenemos el objeto
            const updatedPersona = {...persona, celular: args.celular} //creamos un nuevo objeto con el nuevo numero
            personas[personIndex] = updatedPersona //actualizamos la base de datos
            return updatedPersona //retornamos el objeto actualizado
        }
    },
    Persona: { //person ahora tiene una propiedad dirreccion que en la base de datos no existe
        direccion: (root) => { //root es el objeto que contiene la query
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