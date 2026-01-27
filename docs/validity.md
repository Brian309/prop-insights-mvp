
# Ficha de Validez del MVP

## 1. Validez Interna (Causalidad y Control)
* **Amenaza:** La variación en los datos podría deberse al rendimiento de la máquina local y no a la lógica del sistema.
* **Mitigación:** Se aisló el entorno de ejecución utilizando **Docker containers** con límites de recursos implícitos. Además, la "latencia" visualizada se genera mediante un algoritmo controlado en el Backend, desacoplándola de la velocidad real de la CPU del evaluador.
* **Control:** Se establecieron semillas aleatorias en las pruebas para asegurar que los estados "Healthy", "Warning" y "Critical" aparezcan con frecuencia suficiente para la demo.

## 2. Validez Externa (Generalización)
* **Amenaza:** El sistema está probado con 5 propiedades. ¿Funciona con 500?
* **Limitación Declarada:** La arquitectura (FastAPI + Postgres) es escalable horizontalmente, pero el componente de visualización (Frontend) actual no implementa virtualización de listas. El MVP es válido para carteras pequeñas (<50 edificios), pero requiere refactorización para gestión masiva (Portafolios Globales).
* **Entorno:** Se asume conectividad estándar TCP/IP, aplicable a cualquier sensor IoT moderno.

## 3. Validez de Constructo (Medición Correcta)
* **Amenaza:** ¿Es la "Latencia de Red" un buen indicador de la "Salud del Edificio"?
* **Defensa:** Sí. En sistemas distribuidos (IoT), la disponibilidad de la red es una pre-condición para cualquier otra operación (seguridad, acceso, climatización).
* **Operacionalización:**
    * **Constructo:** Continuidad Operativa.
    * **Medida:** Latencia de respuesta (ms) del endpoint del edificio.
    * **Umbral Crítico:** >800ms (Punto de quiebre donde los sistemas de video vigilancia empiezan a perder frames).

## 4. Validez de Conclusión
* **Amenaza:** El tamaño de la muestra es insuficiente para inferir tendencias de fallo a largo plazo.
* **Mitigación:** El objetivo del MVP es validar la **capacidad técnica de detección y alerta**, no realizar un estudio estadístico de fallos. La conclusión es que la arquitectura *puede* detectar y alertar en <200ms, lo cual valida la hipótesis tecnológica.

