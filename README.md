# TokenIA — calculadora de costos de API de inteligencia artificial

Aplicación web estática para estimar, documentar y comparar costos de consumo de APIs de modelos de inteligencia artificial. Permite trabajar con tarifas documentadas o personalizadas, cargar proyectos en distintos formatos, convertir resultados a otras monedas, evaluar presupuesto y descargar informes adaptados a una audiencia y temática.

- **Calculadora publicada:** https://melyzavala.github.io/ai-tools-TokenIA-MelisaZavala/
- **Repositorio público:** https://github.com/melyzavala/ai-tools-TokenIA-MelisaZavala
- **Estado de validación:** aprobado con reservas documentadas y publicado

## Propósito

TokenIA ayuda a responder cuatro preguntas:

1. ¿Cuánto costaría ejecutar un proyecto con un modelo y un volumen determinados?
2. ¿Cómo cambia el costo entre modelos y proveedores bajo el mismo escenario?
3. ¿Qué capacidad permite un presupuesto por periodo?
4. ¿Qué supuestos, fuentes y límites deben conservarse para revisar la estimación?

La herramienta estima costos de **API**, no precios de suscripciones comerciales. El menor costo no demuestra mayor calidad, adecuación funcional ni equivalencia entre modelos.

## Funcionalidades

- Catálogo de modelos de OpenAI, Anthropic, Google, DeepSeek, Perplexity y Mistral.
- Tarifa personalizada en modo manual, con fuente y fecha declaradas.
- Estimación local de tokens a partir de texto o registro manual de tokens verificados.
- Carga de proyectos en TXT, MD, JSON, CSV, HTML, XML, YAML y YML.
- Lectura de carpetas y ZIP con archivos compatibles, hasta 25 MB.
- Carga separada de muestras de input y output en TXT, MD, JSON o CSV.
- Conversión desde USD mediante servicios públicos de tipo de cambio con estrategia de respaldo.
- Volumen rápido o personalizado, presupuesto por periodo y proyección compuesta opcional.
- Comparativo de proveedores y selección personalizada de modelos.
- Evaluación opcional de valor basada en supuestos declarados por el usuario.
- Informes ejecutivos, académicos u operativos adaptados a la audiencia.
- Comparación de proyectos conservando moneda original y base normalizada en USD.
- Exportación de informe HTML, CSV comparativo y configuración JSON.
- Guardado automático local en el navegador.

## Requisitos académicos cubiertos

| Requisito | Implementación |
|---|---|
| API de tipo de cambio | Tres proveedores públicos con timeout, caché local y respaldo manual |
| Carga en diferentes formatos | TXT, MD, JSON, CSV, HTML, XML, YAML, YML, ZIP y carpetas |
| Reporte con temática y usuario definido | Tres temáticas y audiencia obligatoria para descargar |
| Comparativo de Anthropic/Claude y Gemini | Claude bajo Anthropic y Gemini bajo Google, además de otros proveedores |

## Arquitectura

El sitio es deliberadamente autocontenido. La estructura, estilos y lógica están integrados en `index.html`, lo que evita rutas frágiles y facilita GitHub Pages. No requiere compilación, framework, backend ni claves privadas.

```text
index.html                       Aplicación completa y raíz publicable
.nojekyll                        Desactiva el procesamiento Jekyll
README.md                        Documentación funcional y técnica
REPORTE_VALIDACION.md            Evidencia, decisiones, límites y resultados
tests/test-calculadora.mjs       Suite automática sin dependencias
tests/servidor-local.mjs         Servidor estático local para validación
tests/fixtures/                  Archivos sintéticos de prueba
```

No se separó el HTML en `app.js`, `styles.css` y `data.js` porque el producto actual ya es una pieza autocontenida estable. Dividirlo antes de publicar aumentaría el riesgo de introducir errores de rutas o sincronización sin mejorar la experiencia de uso.

## Fórmula principal

Para una llamada:

```text
costo_input_USD  = tokens_input  × tarifa_input_USD_por_millón  / 1,000,000
costo_output_USD = tokens_output × tarifa_output_USD_por_millón / 1,000,000
costo_llamada_USD = costo_input_USD + costo_output_USD + cargo_fijo_USD
costo_llamada_moneda = costo_llamada_USD × tipo_cambio
costo_proyecto = costo_llamada_moneda × volumen
```

El tipo de cambio se expresa como unidades de moneda seleccionada por 1 USD.

## Fuentes de tipo de cambio

La aplicación intenta, en este orden:

1. `open.er-api.com`
2. `cdn.jsdelivr.net` con `@fawazahmed0/currency-api`
3. `api.frankfurter.app`

Si ninguna responde, conserva el último valor válido en el navegador o permite introducir un tipo de cambio manual. Las conversiones son referenciales y deben verificarse antes de presupuestar.

## Formato recomendado para proyectos

Para una mejor lectura automática, utilizar campos o encabezados como:

- Proyecto o título
- Audiencia
- Volumen
- Presupuesto
- Input, prompt o entrada
- Output, respuesta o salida

En carpetas y ZIP, los nombres `input`, `prompt`, `output`, `respuesta` o `salida` ayudan a identificar el contenido. No se procesan ZIP con contraseña ni archivos binarios. Las imágenes no se anuncian como compatibles porque esta versión no incorpora OCR.

## Informes

- **Ejecutivo:** prioriza costo, decisión y reservas.
- **Académico:** prioriza método, datos, supuestos y trazabilidad.
- **Operativo:** prioriza volumen, costo por operación y escalamiento.

La audiencia cambia la interpretación, mientras que la temática modifica el título, la estructura narrativa y la presentación. La evaluación de valor sólo aparece cuando fue activada y configurada.

Los informes se descargan como HTML optimizado para impresión. Desde el navegador pueden guardarse como PDF. El comparativo final utiliza una identidad violeta azulada distinta de las páginas individuales.

## Ejecución local

Requisito: Node.js 18 o posterior.

```powershell
node tests/servidor-local.mjs
```

Abrir `http://127.0.0.1:4173/`.

## Pruebas automáticas

```powershell
node tests/test-calculadora.mjs
```

La suite comprueba:

- sintaxis JavaScript y estructura HTML;
- cálculos de tokens, moneda, volumen, presupuesto, crecimiento y valor;
- controles, botones y manejadores principales;
- accesibilidad básica, estados dinámicos y reglas responsive;
- rutas compatibles con GitHub Pages;
- ausencia de patrones comunes de secretos;
- configuración de APIs externas;
- lectura de TXT, MD, JSON, CSV, HTML, XML, YAML, YML, ZIP y carpeta;
- personalización por audiencia y temática;
- inclusión condicional de la evaluación de valor.

Los resultados completos y las limitaciones se documentan en [REPORTE_VALIDACION.md](REPORTE_VALIDACION.md).

## Privacidad y seguridad

- El proyecto no contiene tokens, claves, contraseñas ni datos personales.
- Los archivos del usuario se procesan localmente en el navegador.
- Sólo se registra en los informes el nombre del archivo, no se incrusta el archivo original.
- El guardado automático utiliza `localStorage` del navegador.
- Las llamadas externas se limitan a Google Fonts, fuentes de tarifas enlazadas y APIs públicas de tipo de cambio.

## Limitaciones

- La estimación local usa una aproximación de tokens; no sustituye el tokenizador oficial.
- No incorpora impuestos, descuentos, caché, herramientas, imágenes, audio ni otros cargos salvo que se registren manualmente.
- Las tarifas precargadas tienen fecha y deben revisarse antes de tomar una decisión.
- La evaluación de valor depende de supuestos proporcionados por el usuario y no garantiza beneficios.
- Comparar proyectos con volúmenes o periodos distintos describe escenarios completos, no una comparación pura entre modelos.
- La descarga directa produce HTML; la conversión a PDF depende del navegador.

## Publicación

- Repositorio: `https://github.com/melyzavala/ai-tools-TokenIA-MelisaZavala`
- GitHub Pages: `https://melyzavala.github.io/ai-tools-TokenIA-MelisaZavala/`
- Rama: `main`
- Carpeta de publicación: raíz `/`

La URL de GitHub Pages fue abierta y verificada después de la publicación. La validación pública confirmó cálculo automático, comparativo de proveedores, actualización del tipo de cambio, descarga de informe personalizado y diseño móvil sin desbordamiento horizontal.

## Contributors

- **Melisa Zavala** — responsable del proyecto, definición funcional, pruebas de aceptación y decisión final.
- **ChatGPT / Codex** — apoyo en desarrollo web, automatización de pruebas, documentación, auditoría y preparación de publicación.

## Licencia y uso

Proyecto académico y demostrativo. Antes de reutilizarlo para decisiones financieras u operativas, validar tarifas, tokenización, tipos de cambio, condiciones comerciales y supuestos del escenario.
