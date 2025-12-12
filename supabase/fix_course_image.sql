-- Fix broken image URL for "Curso Reparación de Celulares"
UPDATE courses
SET image_url = 'assets/img/cursos/1.jpg'
WHERE image_url LIKE '%curso-reparacion-de-celulares.jpg%';
