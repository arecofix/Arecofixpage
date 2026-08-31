cd /home/ubuntu/arecofix/supabase/docker
for f in ../migrations/202*.sql; do
    echo "Executing $f"
    docker compose exec -T db psql -U postgres -d postgres < "$f"
done
echo "Migrations completed."
