

# Crear cuenta admin

Vamos a crear tu cuenta de administrador con las credenciales que indicaste.

## Pasos

1. **Crear usuario en el sistema de autenticación** con email `eduardoibacache@yahoo.com` y contraseña `Eduardo2758`, con auto-confirmación habilitada para que puedas ingresar de inmediato.

2. **Asignar rol admin** insertando una entrada en la tabla `user_roles` con el rol `admin` para ese usuario.

3. **Desactivar auto-confirmación** después de crear el usuario, para mantener la seguridad del sistema.

## Detalle técnico

- Se habilitará temporalmente la auto-confirmación de emails para que el usuario quede activo sin necesidad de verificar el correo.
- Se usará una migración SQL para insertar el rol admin vinculado al user_id del usuario creado.
- El login en `/admin` funcionará con estas credenciales usando `supabase.auth.signInWithPassword()`.

