import express from "express"
import dotenv from "dotenv"
import conectarDB from "./config/db.js"
import usuarioRoutes from "./routes/usuarioRoutes.js"
import proyectosRoutes from "./routes/proyectoRoutes.js"
import tareasRoutes from "./routes/tareasRoutes.js"
import cors from "cors"

const app = express()
dotenv.config()
conectarDB()
// configurar CORS
const whiteList = [process.env.FRONTEND_URL]
const corsOptions = {
    origin: function(origin,callback){
        if(whiteList.includes(origin)){
            // puede consultar la API
            callback(null,true)
        }else{
            // no esta permitido su request
            callback(new Error("Error de cors"))
        }
    }
}
app.use(cors(corsOptions))

app.use(express.json())

// ? ROUTING
app.use("/api/usuarios",usuarioRoutes)
app.use("/api/proyectos",proyectosRoutes)
app.use("/api/tareas",tareasRoutes)




const PORT = process.env.PORT || 4000


const servidor = app.listen(PORT,()=>{
    console.log("server on port ",`http://localhost:${PORT}`)
})

// socket io
import {Server} from "socket.io"

const io = new Server(servidor,{
    pingTimeout:60000,
    cors:{
        origin: process.env.FRONTEND_URL,    
    }
})

io.on("connection", socket => {
    console.log("conectado a socket.io")

    // definir los eventos de socket io
  socket.on("abrir proyecto",(proyecto)=>{
    socket.join(proyecto)
  })

  socket.on("nueva tarea",data =>{
    socket.to(data.proyecto).emit("tarea agregada",data)
  })

  socket.on("eliminar tarea",data =>{
    socket.to(data.proyecto).emit("tarea eliminada",data)
  })

  socket.on("editar tarea",data =>{
    const proyecto = data.proyecto._id
    socket.to(proyecto).emit("tarea editada",data)
  })
  socket.on("completar tarea",data =>{
    console.log(data)
    const proyecto = data.proyecto._id
    socket.to(proyecto).emit("tarea completada",data)
  })


})

