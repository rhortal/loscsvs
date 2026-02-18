# Instrucciones para Generar Informes de Propiedades

## Dónde acceder

Accede a la aplicación en: **https://loscsvs.pages.dev**

---

## Archivos de prueba incluidos

Se incluyen dos archivos para probar el sistema:

1. **ListadoApartamentos.csv** - Lista de 148 propiedades con sus códigos NRU
2. **ListadoPruebasCompleto.csv** - Lista de 24 reservas/pruebas

---

## Cómo usar la aplicación

### 1. Subir archivos

Arrastra o haz clic para subir los dos archivos CSV:

- **Properties File (Archivo de propiedades)**: Sube el archivo `ListadoApartamentos.csv`
  - Este archivo contiene la lista de propiedades con sus códigos NRU turísticos y no turísticos
  
- **Bookings File (Archivo de reservas)**: Sube el archivo `ListadoPruebasCompleto.csv`
  - Este archivo contiene las reservas/pruebas que queremos asociar a las propiedades

### 2. Generar informe

Haz clic en el botón **"Generate Report"** o **"Generar Informe"**.

### 3. Verificar resultados

Se mostrará una lista desplegable con las propiedades que tienen reservas asociadas. Puedes seleccionar cada propiedad para ver su informe individual.

### 4. Descargar

Haz clic en **"Download ZIP"** o **"Descargar ZIP"** para obtener todos los informes en un archivo ZIP.

---

## Cómo funciona el procesamiento

El sistema procesa las reservas de la siguiente manera:

### Clasificación de reservas

- **Estancias turísticas (1-10 noches)**: Se marcan como "Vacacional/Turístico" y usan el código NRU turístico
- **Estancias largas (11+ noches)**: Se markan como "Otros" y usan el código NRU no turístico

### Orden de presentación

Para cada propiedad, las reservas se muestran en este orden:

1. Primero las reservas turísticas (1-10 noches), ordenadas por fecha de entrada
2. Luego 4 filas vacías (solo si la propiedad tiene ambos tipos de reservas)
3. Finalmente las reservas no turísticas (11+ noches), ordenadas por fecha de entrada

---

## Qué esperar del resultado

Al descargar el ZIP containing:

- **13 archivos CSV** (uno por cada propiedad con reservas)
- **48 filas totales** de datos (incluyendo las filas vacías de separación)

### Propiedades con ambos tipos de reservas

Las siguientes propiedades tienen tanto reservas turísticas como no turísticas (mostrarán las 4 filas vacías de separación):

- **108421** - MIRAMAR PLAYA 6-2 (1 turística + 1 no turística)
- **388437** - LOS GEMELOS 5B (1 turística + 1 no turística)
- **418165** - MAR Y VENT 5A (1 turística + 1 no turística)
- **465274** - PINTOR ROSALES 16B (1 turística + 1 no turística)
- **502775** - ACUARIUM 3 2F (ESTUDIO) (2 turísticas + 1 no turística)
- **519454** - CACHIRULO 4C (1 turística + 1 no turística)

### Propiedades con un solo tipo de reserva

Las siguientes propiedades tienen solo reservas turísticas (sin filas vacías):

- **108458** - PALMERAS 9E
- **108460** - DUCADO 8D
- **108908** - ISLANDIA 15C
- **108914** - KENNEDY 2 16A
- **117851** - OCE3 3A
- **157720** - MAR Y VENT 4D
- **252618** - PRINCIPADO CENTRO 7 A

---

## Ejemplo de resultado (propiedad 502775)

```
NRUA,Finalidad (1),Nº de huéspedes,Fecha de entrada,Fecha de salida,Sin actividad
ESFCTU...,Vacacional/Turístico,2,01.07.2025,06.07.2025,
ESFCTU...,Vacacional/Turístico,2,22.07.2025,28.07.2025,
,,,,,           <- 4 filas vacías de separación
,,,,,
,,,,,
,,,,,
ESFCNT...,Otros,2,08.07.2025,22.07.2025,
```

---

## Notas adicionales

- Todos los datos se procesan en tu navegador - tus archivos nunca salen de tu dispositivo
- El sistema funciona en español e inglés (puedes cambiar el idioma desde el desplegable superior)
- Si tienes dudas sobre el formato de los archivos, contacta para recibir plantillas específicas
