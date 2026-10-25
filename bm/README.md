# bM — catálogo independiente

Página estática para `https://mariabonitaec.com/bm/`. Sus estilos, scripts y recursos están dentro de `bm/`; las fotografías están en `Imagenes/Imagenes_bM/`. No requiere cambios en el catálogo existente de María Bonita.

## Vista previa

Servir la raíz del repositorio con un servidor estático y abrir `/bm/`. Ejemplo, con Python instalado:

```sh
python -m http.server 8766 --bind 127.0.0.1
```

Abrir `http://127.0.0.1:8766/bm/` en la misma computadora. Para simular teléfonos en Chrome: F12, Ctrl+Shift+M, seleccionar un teléfono y alternar su orientación.

## Fotografías y redes

- Instagram y el chat de disponibilidad están configurados en `catalogo.js`.
- TikTok permanece oculto mientras `tiktok` esté vacío; al añadir la URL aparece automáticamente.
- Cada producto incluye frente, espalda y modelo, en ese orden. Se pueden añadir más fotografías al arreglo `images`; las miniaturas y controles se generan automáticamente.

La portada y las cuatro columnas de escritorio también se usan en horizontal. En teléfonos verticales de hasta 767 px se usa la portada vertical y dos columnas. Las fichas se abren en un diálogo dentro de la misma página y admiten Escape y el botón Atrás del navegador.

La publicación inicial fue autorizada por el propietario el 24 de octubre de 2026. Mantener todos los cambios de bM dentro de `bm/` e `Imagenes/Imagenes_bM/`, sin modificar el sitio existente de María Bonita.
