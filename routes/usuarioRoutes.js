import express  from "express";
import { registrar,autenticar, olvidePassword,comprobarToken,nuevoPassword,perfil
 } from "../controllers/usuarioController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router()

// ! AUTENTICACION, REGISTRO Y CONFIRMACION DE USUARIOS

router.post("/",registrar); // ? CREA UN NUEVO USUARIO
router.post("/login",autenticar); // ? AUTENTICAR UN USUARIO
// router.post("/olvide-password",olvidePassword); // ? RECUPERAR CONTRASEÑA DE UN USUARIO
// router.route("/olvide-password/:token").post(nuevoPassword).get(comprobarToken) // ? RECUPERAR CONTRASEÑA DE UN USUARIO
// router.get("/confirmar/:token",confirmar); // ? CONFIRMAR UN USUARIO

router.get("/perfil",checkAuth,perfil)


export default router
