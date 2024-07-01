-----------------------------------------------------------------------------
-- USUARIO ADMINISTRADOR admin_user
-----------------------------------------------------------------------------

CREATE USER admin_user WITH PASSWORD 'z#W9#cLvi5@Lr^ej';

-- Otorgar permisos de conexión y uso de la base de datos
GRANT CONNECT ON DATABASE ips_bogota TO admin_user;
GRANT USAGE ON SCHEMA pediatria TO admin_user;

-- Otorgar todos los permisos en todas las tablas, secuencias y funciones del esquema público
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA pediatria TO admin_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA pediatria TO admin_user;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA pediatria TO admin_user;

-- Otorgar permisos de creación de objetos en el esquema público
GRANT CREATE ON SCHEMA pediatria TO admin_user;

-- Asegurarse de que los permisos se aplican a las futuras tablas, secuencias y funciones en el esquema público
ALTER DEFAULT PRIVILEGES IN SCHEMA pediatria GRANT ALL PRIVILEGES ON TABLES TO admin_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA pediatria GRANT ALL PRIVILEGES ON SEQUENCES TO admin_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA pediatria GRANT ALL PRIVILEGES ON FUNCTIONS TO admin_user;

-----------------------------------------------------------------------------
-- USUARIO ADMINISTRADOR editor_user
-----------------------------------------------------------------------------

CREATE USER editor_user WITH PASSWORD 'e#h6Ewk%do*cu5X@';

-- Otorgar permisos de conexión y uso de la base de datos
GRANT CONNECT ON DATABASE ips_bogota TO editor_user;
GRANT USAGE ON SCHEMA pediatria TO editor_user;

-- Otorgar permisos de SELECT, INSERT, UPDATE en todas las tablas actuales del esquema público
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA pediatria TO editor_user;

-- Otorgar permisos de SELECT, UPDATE en todas las secuencias actuales del esquema público
GRANT SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA pediatria TO editor_user;

-- Otorgar permisos de creación de tablas
GRANT CREATE ON SCHEMA pediatria TO editor_user;

-- Revocar permisos de TRUNCATE y DELETE en todas las tablas actuales del esquema público
REVOKE TRUNCATE, DELETE ON ALL TABLES IN SCHEMA pediatria FROM editor_user;

-- Asegurarse de que los permisos se aplican a las futuras tablas y secuencias en el esquema público
ALTER DEFAULT PRIVILEGES IN SCHEMA pediatria GRANT SELECT, INSERT, UPDATE ON TABLES TO editor_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA pediatria GRANT SELECT, UPDATE ON SEQUENCES TO editor_user;

-----------------------------------------------------------------------------
-- USUARIO ADMINISTRADOR web_editor_user
-----------------------------------------------------------------------------

CREATE USER web_editor_user WITH PASSWORD 'Fcf#Vo43vFk&iCfi';

-- Otorgar permisos de conexión y uso de la base de datos
GRANT CONNECT ON DATABASE ips_bogota TO web_editor_user;
GRANT USAGE ON SCHEMA pediatria TO web_editor_user;

-- Otorgar permisos de SELECT, INSERT, UPDATE en todas las tablas actuales del esquema público
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA pediatria TO web_editor_user;

-- Otorgar permisos de SELECT, UPDATE en todas las secuencias actuales del esquema público
GRANT SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA pediatria TO web_editor_user;

-- Revocar permisos de TRUNCATE y DELETE en todas las tablas actuales del esquema público
REVOKE TRUNCATE, DELETE ON ALL TABLES IN SCHEMA pediatria FROM web_editor_user;

-- Asegurarse de que los permisos se aplican a las futuras tablas y secuencias en el esquema público
ALTER DEFAULT PRIVILEGES IN SCHEMA pediatria GRANT SELECT, INSERT, UPDATE ON TABLES TO web_editor_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA pediatria GRANT SELECT, UPDATE ON SEQUENCES TO web_editor_user;
