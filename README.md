# Comiquea Backend

Backend de **Comiquea**, la web colaborativa para buscar información de cómics, organizar tu comicteca y tus lecturas,
añadir cómics a listas personales (favoritos, leídos, comprados, deseados) y dejar comentarios valorando cada cómic.
Los usuarios pueden contribuir añadiendo nuevos cómics, haciendo que la base de datos crezca de forma orgánica.

---

## Tecnologías

- **Node.js** + **Express**
- **MongoDB** + **Mongoose**
- **JWT** para autenticación
- **Bcrypt** para hashing de contraseñas
- **Cloudinary** para almacenamiento de imágenes
- **Multer** y **multer-storage-cloudinary** para subida de archivos
- **Nodemailer** para envío de emails
- **Papaparse** y **xml2js** para procesar CSV y RSS
- **CORS** para control de acceso

---

## Ruta base de la API

- **Local:**
  http://localhost:3000/api/v1

- **Producción:**  
  https://comiquea-back.vercel.app/api/v1

## Endpoints de la API

### **Comics**

| Método | Ruta | Autenticación | Descripción |
|--------|------|---------------|------------|
| GET | `/comics` | ❌ | Obtener todos los cómics |
| GET | `/comics/:id` | ❌ | Obtener un cómic por su ID |
| GET | `/comics/search?query=<texto>` | ❌ | Buscar cómics por texto (título, autor, ISBN, fecha) |
| GET | `/comics/year/:year` | ❌ | Filtrar cómics por año de publicación |
| POST | `/comics` | ✅ | Añadir un cómic (usuario autenticado) |
| PUT | `/comics/:id` | ✅ | Editar cómic existente |
| DELETE | `/comics/:id` | ✅ (admin) | Eliminar un cómic |

---

### **Usuarios**

| Método | Ruta | Autenticación | Descripción |
|--------|------|---------------|------------|
| POST | `/users/register` | ❌ | Registrar nuevo usuario |
| POST | `/users/login` | ❌ | Iniciar sesión |
| GET | `/users` | ✅ (admin) | Obtener todos los usuarios |
| GET | `/users/:id` | ✅ | Obtener usuario por ID |
| PUT | `/users/:id` | ✅ | Actualizar datos del usuario |
| DELETE | `/users/:id` | ✅ | Eliminar usuario |
| PUT | `/users/lists/:listName` | ✅ | Añadir o quitar un cómic en lista predefinida (`favorites`, `readed`, `wanted`, etc.) |
| POST | `/users/lists` | ✅ | Crear lista personalizada del usuario |
| PUT | `/users/lists/custom/:listId` | ✅ | Añadir o quitar cómic en lista personalizada |
| DELETE | `/users/lists/custom/:listId` | ✅ | Eliminar lista personalizada |

---

### **Comentarios**

| Método | Ruta | Autenticación | Descripción |
|--------|------|---------------|------------|
| POST | `/comments` | ✅ | Añadir comentario a un cómic |
| GET | `/comments/:comicId` | ❌ | Obtener todos los comentarios de un cómic |

---

### **Noticias**

| Método | Ruta | Autenticación | Descripción |
|--------|------|---------------|------------|
| GET | `/news` | ❌ | Obtener noticias del blog en formato RSS |

---

### **Contacto**

| Método | Ruta | Autenticación | Descripción |
|--------|------|---------------|------------|
| POST | `/contact` | ❌ | Enviar mensaje de contacto por email |
