# APLICACIÓN DE AGENDAMIENTO DE CITAS COSBELL SPA

## Pasos de instalación del sistema de manera local
Clonar el proyecto
* git clone url
* npm install
* ng serve
* http://localhost:4200/
* Backend-descargar del link compartido llamado backendcosbell1
* Ocupar las credenciales compartidas en el documento.

## Manual de usuario
Se puede observar este manual de usuario en el siguiente enlace:
Video de youtube: 

## Adaptabilidad
<img src="responsivee" alt="Adaptabilidad" width="800">
Desde una pc en google Chrome.

<img src="login" alt="Adaptabilidad" width="800">
Desde una pc en google Chrome.

<img src="respons" alt="Adaptabilidad" width="800">
Visualización para un celular.

## Diseño de prototipo


## Tabla de Spring Backlog


## Sprint Backlog

| Código | Título                                     | Rol                                 | Prioridad | Puntos de Historia | Historia de Usuario                                                                                                                                                              | Criterios de Aceptación                                                                                                                                                                | Definición de Terminado                                                                                              |
| ------ | ------------------------------------------ | ----------------------------------- | --------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| RF01   | Registro de usuarios                       | Cliente                             | Alta      | 3                  | Como nuevo usuario del sistema, quiero poder registrarme ingresando mi nombre completo, correo electrónico y contraseña segura, para crear una cuenta y acceder a los servicios. | - Solicita nombre, correo y contraseña. <br> - Validar que el correo no esté registrado. <br> - Contraseña con criterios mínimos de seguridad. <br> - Mensaje de confirmación o error. | - Código en GitHub. <br> - Validaciones completas. <br> - Pruebas unitarias documentadas. <br> - Aprobado por tutor. |
| RF02   | Inicio de sesión por rol                   | Cliente / Administrador / Empleador | Alta      | 3                  | Como usuario registrado, quiero iniciar sesión según mi rol para acceder a las funcionalidades correspondientes.                                                                 | - Reconocimiento de rol. <br> - Cliente: módulo agendamiento. <br> - Admin: módulo gestión. <br> - Empleador: módulo agendamiento. <br> - Error si credenciales incorrectas.           | - Código en GitHub. <br> - Pruebas unitarias e integración documentadas. <br> - Aprobado por tutor.                  |
| RF03   | Inicio de sesión por correo y contraseña   | Cliente / Administrador / Empleador | Alta      | 2                  | Como usuario registrado, quiero iniciar sesión ingresando correo y contraseña para acceder a mi cuenta.                                                                          | - Formulario con correo y contraseña. <br> - Validación de credenciales. <br> - Mensaje de error si no coinciden. <br> - Redirección según rol.                                        | - Código en GitHub. <br> - Pruebas de validación realizadas.                                                         |
| RF04   | Visualizar servicios disponibles           | Cliente                             | Alta      | 2                  | Como cliente, quiero ver todos los servicios disponibles con precio y duración.                                                                                                  | - Mostrar todos los servicios con nombre, precio y duración. <br> - Información clara y organizada.                                                                                    | - Datos desde base de datos. <br> - Pruebas funcionales.                                                             |
| RF05   | Agendamiento de citas                      | Cliente                             | Alta      | 5                  | Como usuario, quiero seleccionar fecha, hora y servicio para agendar una cita.                                                                                                   | - Mostrar disponibilidad. <br> - Selección de uno o varios servicios. <br> - Validar disponibilidad antes de confirmar. <br> - Notificación de confirmación.                           | - Código en GitHub. <br> - Pruebas unitarias documentadas. <br> - Aprobado por tutor.                                |
| RF06   | Cancelar o modificar citas                 | Cliente                             | Alta      | 4                  | Como cliente, quiero cancelar o modificar mis citas agendadas.                                                                                                                   | - Visualizar citas programadas. <br> - Permitir modificar fecha, hora o servicio. <br> - Confirmación por correo o WhatsApp.                                                           | - Pruebas funcionales en entorno de pruebas. <br> - Código en GitHub.                                                |
| RF08   | Gestionar horarios del personal            | Administrador                       | Alta      | 3                  | Como administrador, quiero gestionar disponibilidad de horarios del personal.                                                                                                    | - Solo agendar en horarios disponibles. <br> - Guardar datos en BD. <br> - Error si fuera de horario.                                                                                  | - Interfaz funcional. <br> - Pruebas con distintos escenarios.                                                       |
| RF09   | Confirmación de cita por correo o WhatsApp | Cliente                             | Alta      | 4                  | Como cliente, quiero recibir confirmación de cita por correo o WhatsApp.                                                                                                         | - Confirmación inmediata tras agendar. <br> - Configurar canal preferido. <br> - Incluir fecha, hora, servicio, profesional.                                                           | - Servicio de notificación integrado. <br> - Pruebas realizadas.                                                     |
| RF10   | Visualización de citas programadas         | Cliente / Administrador / Empleador | Alta      | 3                  | Como usuario, quiero ver citas programadas en lista o calendario.                                                                                                                | - Cliente ve sus citas. <br> - Admin/Empleador ven todas. <br> - Filtro por fecha, servicio, profesional o cliente.                                                                    | - Visualización funcional. <br> - Pruebas de filtros y vistas.                                                       |
| RF14   | Gestión de catálogo de servicios           | Administrador                       | Media     | 3                  | Como administrador, quiero agregar, editar o eliminar servicios.                                                                                                                 | - CRUD de servicios. <br> - Nombre, descripción, duración y precio. <br> - Cambios inmediatos.                                                                                         | - CRUD probado. <br> - Código en GitHub.                                                                             |
| RF16   | Registro de profesionales                  | Administrador                       | Media     | 3                  | Como administrador, quiero registrar nuevos profesionales y sus actividades.                                                                                                     | - Datos personales. <br> - Servicios asignados. <br> - Disponibilidad inicial.                                                                                                         | - Formulario funcional. <br> - Servicios y disponibilidad guardados.                                                 |
| RF07   | Chat cliente-profesional                   | Cliente / Profesional               | Media     | 5                  | Como cliente, quiero comunicarme con el profesional asignado.                                                                                                                    | - Enviar y recibir mensajes. <br> - Guardar historial de chat.                                                                                                                         | - Interfaz funcional. <br> - Mensajes en BD.                                                                         |
| RF11   | Recordatorio de citas                      | Cliente                             | Media     | 3                  | Como cliente, quiero recibir recordatorio por correo y WhatsApp 1 día antes.                                                                                                     | - Envío 24h antes. <br> - Datos de cita incluidos.                                                                                                                                     | - Función automática probada.                                                                                        |
| RF12   | Valoración del servicio                    | Cliente                             | Media     | 3                  | Como cliente, quiero calificar el servicio recibido.                                                                                                                             | - Calificación de 1 a 5 estrellas. <br> - Comentario opcional. <br> - Publicación si es aprobada.                                                                                      | - Sistema funcional.                                                                                                 |
| RF13   | Historial de servicios                     | Cliente                             | Media     | 2                  | Como cliente, quiero ver historial de servicios recibidos.                                                                                                                       | - Lista con fecha y profesional.                                                                                                                                                       | - Interfaz funcional.                                                                                                |
| RF15   | Ver promociones activas                    | Cliente                             | Baja      | 2                  | Como cliente, quiero ver promociones vigentes.                                                                                                                                   | - Lista de promociones con fecha de vencimiento.                                                                                                                                       | - Sección funcional.                                                                                                 |
| RF17   | Notificaciones por WhatsApp                | Cliente                             | Baja      | 4                  | Como cliente, quiero recibir notificaciones por WhatsApp.                                                                                                                        | - Permiso para usar WhatsApp. <br> - Notificaciones automáticas.                                                                                                                       | - Integración con API probada.                                                                                       |
| RF18   | Recuperación de contraseña                 | Usuario registrado                  | Media     | 2                  | Como usuario, quiero recuperar contraseña olvidada.                                                                                                                              | - Solicitar correo. <br> - Enviar link de recuperación.                                                                                                                                | - Función segura probada.                                                                                            |
| RF19   | Resumen diario de citas                    | Administrador                       | Media     | 2                  | Como administrador, quiero recibir un resumen diario de citas.                                                                                                                   | - Generar resumen automático.                                                                                                                                                          | - Automatización probada.                                                                                            |
| RF20   | Consultar estado de la cita                | Cliente                             | Baja      | 2                  | Como cliente, quiero consultar el estado de mi cita.                                                                                                                             | - Mostrar estado actual. <br> - Notificación de cambios.                                                                                                                               | - Estados actualizados en tiempo real.                                                                               |
### Tabla de backlog realizado en clickup
<img src="12" alt="Tabla de backlog realizado en clickup" width="800">

### Recopilacion de requerimientos

Se puede visualizar requerimientos obtenidos al comienzo del proyecto donde, que concuerda con lo requerido por el propietario.

<img src="tabla" alt="Recopilacion de requerimientos" width="800">

### Organizacón de requimientos funcionales
Durante la revisión del anteproyecto, se realizó un análisis detallado de los requerimientos funcionales levantados inicialmente. Se detectó que algunos
requerimientos necesitaban ser corregidos y otros debían ser añadidos para garantizar que la aplicación sea realmente funcional y cumpla con los objetivos propuestos.

<img src="tabla1" alt="Organizacón de requimientos funcionales" width="800">

### Historia de usuario

<img src="usuario1" alt="Historia de usuario" width="800">

<img src="usuario02" alt="Historia de usuario" width="800">

<img src="usuario03" alt="Historia de usuario" width="800">

<img src="usuario04" alt="Historia de usuario" width="800">

<img src="usuario05" alt="Historia de usuario" width="800">

<img src="usuario06" alt="Historia de usuario" width="800">

<img src="usuario07" alt="Historia de usuario" width="800">

<img src="usuario08" alt="Historia de usuario" width="800">

## Resultados

- <img src="tabla0" alt="Resultados" width="800">

- <img src="tabla00" alt="Resultados" width="800">








