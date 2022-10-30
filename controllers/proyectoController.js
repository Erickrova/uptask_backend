import Proyecto from "../models/Proyecto.js"
import Tarea from "../models/Tarea.js"
import Usuario from "../models/Usuario.js"

const nuevoProyecto = async (req,res) =>{
    const proyecto = new Proyecto(req.body)  
    proyecto.creador = req.usuario._id
    try {
        const proyectoAlmacenado = await proyecto.save()
        return res.json(proyectoAlmacenado)
    } catch (error) {
        console.log(error)
    } 
}
const obtenerProyectos = async (req,res) =>{
    const proyectos = await Proyecto.find({
        "$or":[
            {"colaboradores":{$in: req.usuario._id}},
            {"creador":{$in: req.usuario._id}}
        ]
    })
    .select("-tareas")
    return res.json(proyectos)
}
const obtenerProyecto = async (req,res) =>{
    const {id} = req.params

    const proyecto = await Proyecto.findById(id)
        .populate({path: "tareas", populate : {path : "completado",select: "nombre"}})
        .populate("colaboradores", "nombre email")

    if(!proyecto){
        const error = new Error("Proyecto no encontrado")
        return res.status(404).json({msg:error.message})
    }
    if(proyecto.creador.toString() !== req.usuario._id.toString() && !proyecto.colaboradores.some(colaborador => colaborador._id.toString() === req.usuario._id.toString() )){
        const error = new Error("No tienes permisos")
        return res.status(401).json({msg:error.message})
    }
   
    return res.json(proyecto)
}
const editarProyecto = async (req,res) =>{
    const {id} = req.params

    const proyecto = await Proyecto.findById(id)
    if(!proyecto){
        const error = new Error("Proyecto no encontrado")
        return res.status(404).json({msg:error.message})
    }
    if(proyecto.creador.toString() === req.usuario._id.toString()){
        proyecto.nombre = req.body.nombre || proyecto.nombre
        proyecto.descripcion = req.body.descripcion || proyecto.descripcion
        proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega
        proyecto.cliente = req.body.cliente || proyecto.cliente
        try {
            const proyectoActualizado = await proyecto.save()
            return res.json({proyectoActualizado})
        } catch (error) {
            error = new Error("Hubo un error")
            return res.status(404).json({msg:error.message})
        }
        return res.json(proyecto)
    }
    if(proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error("No tienes permisos")
        return res.status(401).json({msg:error.message})
    }
}
const eliminarProyecto = async (req,res) =>{
    const {id} = req.params

    const proyecto = await Proyecto.findById(id)
    if(!proyecto){
        const error = new Error("Proyecto no encontrado")
        return res.status(404).json({msg:error.message})
    }
    if(proyecto.creador.toString() === req.usuario._id.toString()){
   
        try {
            await proyecto.deleteOne()
            return res.json({msg:"proyecto eliminado"})
        } catch (error) {
            error = new Error("Hubo un error")
            return res.status(404).json({msg:error.message})
        }
    }
    if(proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error("No tienes permisos")
        return res.status(403).json({msg:error.message})
    }
}
const buscarColaborador = async (req,res) =>{
    const {email} = req.body
    const usuario = await Usuario.findOne({email}).select("-confirmado -createdAt -updatedAt -__v -password -token")
    if(!usuario){
        const error = new Error("Este Usuario No Existe")
        return res.status(404).json({msg:error.message})
    }
    return res.json(usuario)
}
const agregarColaborador = async (req,res) =>{
    const proyecto = await Proyecto.findById(req.params.id)
    const {email} = req.body
    const usuario = await Usuario.findOne({email}).select("-confirmado -createdAt -updatedAt -__v -password -token")

    if(!proyecto){
        const error = new Error("Proyecto no encontrado")
        return res.status(404).json({msg:error.message})
    }
    if(proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error("No tienes permisos")
        return res.status(403).json({msg:error.message})
    }
    if(!usuario){
        const error = new Error("Este Usuario No Existe")
        return res.status(404).json({msg:error.message})
    }
    if(proyecto.creador.toString() === usuario._id.toString()){
        const error = new Error("El creador del proyecto no puede ser colaborador")
        return res.status(400).json({msg:error.message})
    }
    if(proyecto.colaboradores.includes(usuario._id)){
        const error = new Error("Este usuario ya es colaborador del Proyecto")
        return res.status(400).json({msg:error.message})
    }
    proyecto.colaboradores.push(usuario._id)
    await proyecto.save()
    return res.json({msg:"Colaborador agregado correctamente"})
}
const eliminarColaborador = async (req,res) =>{
    const proyecto = await Proyecto.findById(req.params.id)
    if(!proyecto){
        const error = new Error("Proyecto no encontrado")
        return res.status(404).json({msg:error.message})
    }
    if(proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error("No tienes permisos")
        return res.status(403).json({msg:error.message})
    }

    proyecto.colaboradores.pull(req.body.id)
    await proyecto.save()
    res.json({msg:"Colaborador Eliminado Correctamente"})
    
}


export{
    obtenerProyectos,
    obtenerProyecto,
    nuevoProyecto,
    editarProyecto,
    eliminarProyecto,
    buscarColaborador,
    agregarColaborador,
    eliminarColaborador,
  
}