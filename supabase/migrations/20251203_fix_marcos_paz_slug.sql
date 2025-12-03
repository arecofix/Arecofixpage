-- Fix typo in slug: 'tcnico' -> 'tecnico'
UPDATE posts
SET slug = 'servicio-tecnico-de-celulares-en-marcos-paz'
WHERE slug = 'servicio-tcnico-de-celulares-en-marcos-paz';
