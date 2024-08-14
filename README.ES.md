## Inicio del Proyecto

[English](./README.md)  

[configuración del proyecto](./project-bootstrap.md)

RAG Multitenant
Dos flujos:

### 1. Indexación (digestión):

<p align="center">
<img src="./assets/rag-multitenant-github.png" width="800">
</p>
Front End:
Crear producto nuevo

```bash
Copy code
httt://localhost:3000/products/add
```

`src/app/products/add/page.tsx`
Componente Cliente (Formulario crea producto)

`src/components/doc-upload-form.tsx`
Server Action:
`src/lib/actions/product.ts`

- Validación del esquema del formulario
- Creación de Slug para el nombre
- Cargar documento e imagen a s3 (URL prefirmada)
- Crear producto en el esquema de la base de datos (Prisma)
- Vectorizar e indexar el doc File

**Insertar Archivo de Documento**
[`src/lib/pinecone-utils.ts`](src/lib/pinecone-utils.ts)

### 2. Chat (retrieving)

<p align="center">
<img src="./assets/f150-chat-screenshot.png" width="800">
</p>
El flujo comienza en `src/app/products/[slug]/page.tsx` en la página de chat del producto
El trabajo pesado lo realiza el componente cliente <ChatSection>

Para integrar un LLM con una aplicación Next.js, particularmente cuando se trata de una pantalla de chat que envía y recibe respuestas de una cadena de LangChain, es necesario seguir un proceso específico. Así es como funciona:

1. **Componente Cliente**: La pantalla de chat debe ser un componente cliente porque utilizará varios hooks de React, incluido el hook `useChat`.

2. **Hook useChat**: El hook `useChat` es responsable de enviar los mensajes del usuario (prompts) a un manejador de rutas. Este manejador es donde reside el Runnable de LangChain para la _Generación Aumentada por Recuperación_ (RAG).

3. **Manejo de Mensajes**: Cuando un usuario envía un mensaje, el hook `useChat` empaqueta el historial de mensajes, incluyendo el último mensaje de chat, y lo envía al manejador de rutas.

4. **Proceso de Cadena RAG**:

- La cadena RAG recibe el mensaje prompt junto con el historial de mensajes.
- Realiza una búsqueda semántica para reunir el contexto relevante basado en el prompt.
- La RAG luego combina el mensaje prompt con el contexto recuperado y utiliza esta información para alimentar al Modelo de Lenguaje (LLM).

5. **Respuesta en Streaming**: El LLM procesa la entrada y genera una respuesta en streaming.

6. **Actualización de la Interfaz**: El hook `useChat` o un componente de UI de un SDK de IA sabe cómo convertir la respuesta en streaming en texto, que luego se muestra directamente en la pantalla de chat como la respuesta del LLM.
