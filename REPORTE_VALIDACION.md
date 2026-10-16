# Reporte de validación — TokenIA

**Fecha:** 16 de octubre de 2026  
**Responsable funcional:** Melisa Zavala  
**Apoyo técnico y de control de calidad:** ChatGPT / Codex  
**Estado actual:** aprobado localmente con validación pública pendiente

## 1. Objetivo y alcance

Validar una aplicación estática para estimar costos de consumo de APIs de inteligencia artificial, cargar proyectos, convertir moneda, comparar modelos y proyectos, evaluar presupuesto y producir informes personalizados.

La validación cubre:

- integridad de archivos publicables;
- sintaxis y estructura;
- cálculos principales y casos límite seleccionados;
- formatos de carga anunciados;
- controles e interacciones declaradas;
- accesibilidad y responsividad básicas;
- seguridad y privacidad;
- compatibilidad estructural con GitHub Pages;
- disponibilidad pública, pendiente hasta la publicación autorizada.

No se valida la calidad real de los modelos ni la vigencia futura de sus tarifas.

## 2. Arquitectura evaluada

| Componente | Decisión | Justificación |
|---|---|---|
| Aplicación | `index.html` autocontenido | Reduce dependencias y errores de rutas |
| Hosting | GitHub Pages desde `main` y raíz | Adecuado para sitio estático |
| Backend | No existe | No se necesita para los cálculos locales |
| Persistencia | `localStorage` | Conserva sesión sin enviar datos |
| Tipo de cambio | Tres APIs públicas con fallback | Reduce dependencia de un solo proveedor |
| Pruebas | Node.js sin bibliotecas | Reproducibles y sin instalación adicional |
| Jekyll | Desactivado mediante `.nojekyll` | Evita procesamiento innecesario |

## 3. Datos y privacidad

Los archivos incluidos en `tests/fixtures` son sintéticos o fueron preparados únicamente para pruebas técnicas. No contienen datos personales, credenciales ni información confidencial.

La aplicación procesa los archivos cargados localmente. No los sube a un servidor. El informe registra el nombre del archivo y los valores detectados, pero no incorpora el archivo original.

## 4. Matriz de pruebas automáticas

Comando ejecutado:

```powershell
node tests/test-calculadora.mjs
```

Resultado vigente:

```text
35 pruebas aprobadas, 0 fallos
```

### 4.1 Estructura, seguridad y publicación

| Prueba | Resultado |
|---|---|
| JavaScript compila | Aprobada |
| Idioma y viewport | Aprobada |
| Media queries 920, 700 y 580 px | Aprobada |
| Movimiento reducido | Aprobada |
| Rutas locales absolutas ausentes | Aprobada |
| Recursos externos por HTTPS | Aprobada |
| Patrones comunes de secretos ausentes | Aprobada |
| Rutas relativas compatibles con Pages | Aprobada |

### 4.2 Cálculos

| Escenario | Evidencia esperada | Resultado |
|---|---:|---|
| 120 tokens entrada a USD 45/M | USD 0.0054 por llamada | Aprobada |
| 350 tokens salida a USD 50/M | USD 0.0175 por llamada | Aprobada |
| Cargo fijo USD 0.001 | USD 0.0239 total por llamada | Aprobada |
| 10,000 llamadas | USD 239.00 | Aprobada |
| Conversión a 18.4572 | 4,411.2708 en moneda seleccionada | Aprobada |
| Presupuesto 50 con costo unitario 0.0022 | 44% y capacidad 22,727 | Aprobada |
| Crecimiento 15%, tres periodos | 10,000; 11,500; 13,225; 15,209 | Aprobada |
| Evaluación de valor del ejemplo | beneficio 63,000; valor neto 62,992.25; equilibrio 80 | Aprobada |
| Valor no recuperable | `null` para recuperación y equilibrio | Aprobada |

### 4.3 Formatos de archivo

| Formato | Prueba | Resultado |
|---|---|---|
| TXT | Lectura como contenido no estructurado | Aprobada |
| MD | Detección de secciones | Aprobada |
| JSON | Detección de campos | Aprobada |
| CSV | Detección de encabezados | Aprobada |
| HTML | Extracción de texto y secciones | Aprobada |
| XML | Lectura de etiquetas compatibles | Aprobada |
| YAML | Lectura de claves | Aprobada |
| YML | Lectura de claves | Aprobada |
| ZIP | Descompresión y lectura de archivos compatibles | Aprobada |
| Carpeta | Presencia de input y output compatibles | Aprobada |

Las imágenes, PDF, DOCX y archivos binarios no se anuncian como compatibles.

### 4.4 Controles e informes

| Control | Resultado estructural |
|---|---|
| Modo autónomo/manual | Aprobado |
| Proveedor y modelo | Aprobado |
| Audiencia y temática | Aprobado |
| Tipo de cambio y actualización | Aprobado |
| Volumen y presupuesto | Aprobado |
| Comparativo de modelos | Aprobado |
| Evaluación de valor opcional | Aprobado |
| Comparación de proyectos | Aprobado |
| Descarga de informe, CSV y JSON | Aprobado |
| Restablecimiento y guardado local | Aprobado |

La suite confirma presencia, unicidad y conexión declarada de los manejadores. La ejecución visual completa en navegador se realizará nuevamente sobre la URL pública.

## 5. APIs y recursos externos

Servicios configurados:

- `open.er-api.com`
- `cdn.jsdelivr.net/npm/@fawazahmed0/currency-api`
- `api.frankfurter.app`
- Google Fonts para Poppins

Se confirmó respuesta JSON válida de `open.er-api.com` durante la auditoría. El entorno de terminal local restringe DNS externo y la herramienta web no pudo consultar los otros dos servicios; esto no demuestra una falla de los servicios. Su carga y CORS quedan como pruebas obligatorias desde GitHub Pages.

## 6. Accesibilidad y responsividad

Verificaciones aprobadas:

- etiquetas asociadas a controles;
- regiones `aria-live` para archivo, costo y estado;
- `aria-label` en navegación, gráficas y controles relevantes;
- estados `aria-expanded` en módulos desplegables;
- barra de presupuesto con rol de progreso;
- soporte de teclado y Escape en ayuda modal;
- foco visible en controles;
- reglas para escritorio, pantalla media y móvil;
- respeto de `prefers-reduced-motion`.

Pendiente después de publicar:

- inspección a 390 × 844 px;
- comprobación de desbordamiento horizontal;
- navegación completa sólo con teclado;
- descarga real en navegador;
- carga de archivos mediante selector del navegador.

## 7. Correcciones durante la validación

La primera ejecución de pruebas detectó errores del arnés, no del producto:

1. Una expectativa de presupuesto tenía el decimal desplazado.
2. Las funciones extraídas no eran visibles por el aislamiento de módulos de Node.
3. El TXT no estructurado se evaluaba como si debiera contener secciones separadas.

Se corrigió únicamente la suite y se repitió completa hasta obtener 35 aprobaciones y cero fallos. El HTML no fue modificado durante esta fase, conforme a la instrucción de solicitar aprobación antes de cualquier cambio.

## 8. Riesgos y límites

- Las tarifas precargadas pueden cambiar después de su fecha de consulta.
- Los tokens estimados localmente no equivalen a un tokenizador oficial.
- Las APIs públicas de tipo de cambio pueden tener límites, caídas o cambios de esquema.
- La selección de carpetas depende de `webkitdirectory`, soportado principalmente por navegadores basados en Chromium.
- Los ZIP con contraseña o métodos de compresión no compatibles se rechazan.
- El comparativo económico mantiene los mismos tokens, pero no demuestra equivalencia de calidad entre modelos.
- La evaluación de valor depende de supuestos humanos y no constituye un beneficio garantizado.
- GitHub Pages es público; cualquier archivo incorporado al repositorio será visible para terceros.

## 9. Pruebas públicas obligatorias después de publicar

1. Abrir la URL de Pages y confirmar HTTP 200.
2. Comprobar carga de Poppins o fallback legible.
3. Cargar el ejemplo y verificar recálculo.
4. Cambiar proveedor, modelo, volumen, periodo, moneda, audiencia y temática.
5. Verificar actualización integral de KPIs, tabla y narrativas.
6. Ejecutar la actualización de tipo de cambio desde la URL pública.
7. Cargar TXT, JSON, XML, YAML, ZIP y carpeta.
8. Probar mensajes de error por formato incompatible y tamaño.
9. Descargar informes de las tres temáticas, CSV y configuración JSON.
10. Activar y desactivar evaluación de valor y revisar su inclusión condicional.
11. Guardar proyectos y descargar comparativo completo.
12. Revisar escritorio y móvil, teclado, foco y ausencia de desbordamientos.

## 10. Criterio de aprobación

- **Aprobado localmente:** 35 pruebas automáticas, cero fallos.
- **Publicación:** pendiente de aprobación explícita de la responsable.
- **Aprobación final:** requiere URL pública operativa y pruebas públicas completas o reservas documentadas.
