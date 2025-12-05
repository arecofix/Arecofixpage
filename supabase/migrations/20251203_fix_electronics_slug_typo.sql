-- Fix typo in electronics category slug
UPDATE categories 
SET slug = 'electronicos' 
WHERE slug = 'electrnicos';
