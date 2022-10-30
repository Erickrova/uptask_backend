import Proyecto from "../models/Proyecto.js"
import Tarea from "../models/Tarea.js"

const agregarTarea = async (req,res) => {
    const proyecto = req.body.proyecto

    const proyectoExiste = await Proyecto.findById(proyecto)
    if(!proyectoExiste){
        const error = new Error("El Proyecto no existe")
        return res.status(404).json({msg: error.message})

    }
    if(proyectoExiste.creador.toString() !== req.usuario._id.toString()){
        const error = new Error("No tienes Permisos")
        return res.status(403).json({msg: error.message})
    }

    try {
        const tareaAlmacenada = await Tarea.create(req.body)
        proyectoExiste.tareas.push(tareaAlmacenada._id)
        await proyectoExiste.save()
        return res.json(tareaAlmacenada)
    } catch (error) {
        console.log(error)
    }

}
const obtenerTarea = async (req,res) => {
    const {id} = req.params
    const tarea = await Tarea.findById(id).populate("proyecto")
    
    if(!tarea){
        const error = new Error("Tarea no encontrada")
        return res.status(404).json({msg:error.message})
    }
    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error("No tienes permisos")
        return res.status(401).json({msg:error.message})
    }
    return res.json(tarea)
}
const actualizarTarea = async (req,res) => {
    const {id} = req.params
    const tarea = await Tarea.findById(id).populate("proyecto")
    
    if(!tarea){
        const error = new Error("Tarea no encontrada")
        return res.status(404).json({msg:error.message})
    }
    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error("No tienes permisos")
        return res.status(403).json({msg:error.message})
    }
    try {
        tarea.nombre = req.body.nombre || tarea.nombre
        tarea.descripcion = req.body.descripcion || tarea.descripcion
        tarea.estado = req.body.estado || tarea.estado
        tarea.prioridad = req.body.prioridad || tarea.prioridad
        tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega
        const tareaActualizada = await tarea.save()
        return res.json(tareaActualizada)
    } catch (error) {
        console.log(error)
    }
}
const eliminarTarea = async (req,res) => {
    const {id} = req.params
    const tarea = await Tarea.findById(id).populate("proyecto")
    
    if(!tarea){
        const error = new Error("Tarea no encontrada")
        return res.status(404).json({msg:error.message})
    }
    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error("No tienes permisos")
        return res.status(403).json({msg:error.message})
    }
    try {
        const proyecto = await Proyecto.findById(tarea.proyecto._id)
        proyecto.tareas.pull(tarea._id)
        await Promise.allSettled([await proyecto.save(),await tarea.deleteOne()])
        return res.json({msg:"Tarea Eliminada"})
    } catch (error) {
        console.log(error)
    }
}
const cambiarEstado = async (req,res) => {
    const tarea = await Tarea.findById(req.params.id).populate("proyecto").populate("completado")
    if(!tarea){
        const error = new Error("Tarea no encontrada")
        return res.status(404).json({msg:error.message})
    }
    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString() && !tarea.proyecto.colaboradores.some(c => c._id.toString() === req.usuario._id.toString()) ){
        const error = new Error("No tienes permisos")
        return res.status(401).json({msg:error.message})
    }
    tarea.estado = !tarea.estado
    tarea.completado = req.usuario._id
    await tarea.save()
    const tareaAlmacenada = await Tarea.findById(req.params.id).populate("proyecto").populate("completado")

    res.json(tareaAlmacenada)

}

export{
    agregarTarea,
    obtenerTarea,
    actualizarTarea,
    eliminarTarea,
    cambiarEstado
}