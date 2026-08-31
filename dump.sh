cd /home/ubuntu/arecofix/supabase/docker
docker compose exec -T \
    -e PGPASSWORD='$G4br13l7315' \
    -e PGSSLMODE=require \
    db \
    pg_dump -U postgres.jftiyfnnaogmgvksgkbn -h aws-0-sa-east-1.pooler.supabase.com -p 5432 -d postgres --schema-only -f /tmp/test_dump4.sql
