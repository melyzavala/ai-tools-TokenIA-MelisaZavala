# Reporte de validación — TokenIA

**Fecha:** 16 de octubre de 2026  
**Responsable funcional:** Melisa Zavala  
**Apoyo técnico y de control de calidad:** ChatGPT / Codex  
**Estado actual:** aprobado con reservas documentadas

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
- disponibilidad y comportamiento esencial desde la URL pública.

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

La suite confirma presencia, unicidad y conexión declarada de los manejadores. La validación pública confirmó cálculo, actualización de resultados, comparativo y descarga de informe.

## 5. APIs y recursos externos

Servicios configurados:

- `open.er-api.com`
- `cdn.jsdelivr.net/npm/@fawazahmed0/currency-api`
- `api.frankfurter.app`
- Google Fonts para Poppins

Se confirmó desde GitHub Pages una conversión de USD a MXN obtenida mediante ExchangeRate-API, con fuente, fecha y valor visibles. Los proveedores de respaldo permanecen validados estructuralmente, pero no fueron forzados en producción porque el proveedor principal respondió correctamente.

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

Verificaciones públicas adicionales:

- vista de 390 × 844 px sin desbordamiento horizontal: aprobada;
- descarga real de informe HTML: aprobada;
- informe con temática operativa y audiencia Dirección de Operaciones: aprobado;
- consola del navegador sin errores ni advertencias: aprobada;
- navegación exhaustiva sólo con teclado: no ejecutada;
- carga pública mediante selector del navegador: no concluida; los parsers y fixtures sí aprobaron la suite automática.

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

## 9. Evidencia de validación pública

| Comprobación | Evidencia | Resultado |
|---|---|---|
| URL de Pages | La aplicación abrió con título `Calculadora de Costos de IA` | Aprobada |
| Cálculo automático | 20 tokens estimados y USD 1.38 para 10,000 llamadas | Aprobada |
| Comparativo | Tabla pública con OpenAI, Anthropic/Claude, Google/Gemini, DeepSeek, Perplexity y Mistral | Aprobada |
| Tipo de cambio | 1 USD = 18.457205 MXN, ExchangeRate-API, 16/10/2026 | Aprobada |
| Informe | Archivo `prueba-publica-de-validacion-operational-2026-10-16.html` descargado | Aprobada |
| Personalización | Título operativo, destinatario Dirección de Operaciones y cifras MXN | Aprobada |
| Vista móvil | 390 px de ancho; contenido de 375 px, sin desbordamiento | Aprobada |
| Recursos | Sin errores ni advertencias en consola durante la prueba | Aprobada |

Pendientes no bloqueantes: recorrido exhaustivo sólo con teclado y repetición manual de todos los formatos desde el selector público. La lectura de cada formato sí fue validada automáticamente con fixtures sintéticos.

## 10. Criterio de aprobación

- **Pruebas automáticas:** 35 aprobadas, cero fallos.
- **Publicación:** repositorio público y GitHub Pages activos.
- **Estado final:** aprobado con reservas por las pruebas manuales exhaustivas pendientes indicadas arriba.
