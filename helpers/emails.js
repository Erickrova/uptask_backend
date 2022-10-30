import nodemailer from "nodemailer"

const emailRegistro = async (datos) =>{
    const {email, nombre, token} = datos
    const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

      // informacion email

      const info = await transport.sendMail({
        from: '"Uptask - Administrador de Proyectos" <cuentas@uptask.com>',
        to: email,
        subject: "Uptask - Comprueba tu cuenta",
        text:  "Uptask - Comprueba tu cuenta en Uptask",
        html: `<p>Hola ${nombre} Comprueba tu cuenta en Uptask</p>
        <p>Tu cuenta ya esta casi lista solo debes comprobarla en el siguiente enlace:</p>
        <a href="${process.env.FRONTEND_URL}/confirmar/${token}" >Comprobar Cuenta</a>

        <p>Si tu no creaste esta cuenta puesdes ignorar este mensaje</p>
        `
      })


}

const emailOlvidePassword = async (datos) =>{
  const {email, nombre, token} = datos

  // TODO : ocultar en variables de entorno
  const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // informacion email

    const info = await transport.sendMail({
      from: '"Uptask - Administrador de Proyectos" <cuentas@uptask.com>',
      to: email,
      subject: "Uptask - Reestablece tu password",
      text:  "Uptask - Reestablece tu passsword en Uptask",
      html: `<p>Hola ${nombre} Reestablece tu cuenta en Uptask</p>
      <p> Reestablece tu password en el siguiente enlace:</p>
      <a href="${process.env.FRONTEND_URL}/olvide-password/${token}" >Reestablecer Passwored</a>

      <p>Si tu no solicitaste este email puesdes ignorar este mensaje</p>
      `
    })


}

export{
    emailRegistro,
    emailOlvidePassword
}