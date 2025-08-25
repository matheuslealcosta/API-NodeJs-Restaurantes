-- Inicialização do banco de dados PostgreSQL para API Restaurantes
-- Este script é executado automaticamente quando o container é criado

-- Cria extensions úteis
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Cria usuário de aplicação (se não existir)
DO
$do$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'app_user') THEN
      CREATE ROLE app_user LOGIN PASSWORD 'app_password';
   END IF;
END
$do$;

-- Concede permissões
GRANT CONNECT ON DATABASE restaurants_api TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;
GRANT CREATE ON SCHEMA public TO app_user;

-- Configurações de performance
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
ALTER SYSTEM SET track_activity_query_size = 2048;
ALTER SYSTEM SET pg_stat_statements.track = 'all';

-- Log de inicialização
\echo 'PostgreSQL inicializado com sucesso para API Restaurantes!'
\echo 'Database: restaurants_api'
\echo 'User: postgres'
\echo 'Extensions instaladas: uuid-ossp, pg_trgm'
