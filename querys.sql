DROP DATABASE IF EXISTS raices_db;
CREATE DATABASE raices_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE raices_db;
-- ============================================================
--  RAÍCES — Script MySQL Workbench v1.0 (corregido)
--  Motor: MySQL 8.0+
--  Charset: utf8mb4
-- ============================================================

-- Borrar base de datos si existía
DROP DATABASE IF EXISTS raices_db;

-- Crear base limpia
CREATE DATABASE raices_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE raices_db;

-- ============================================================
-- 1. CITIES — catálogo de ciudades de España
-- ============================================================
CREATE TABLE cities (
 id            SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 name          VARCHAR(100) NOT NULL,
 region        VARCHAR(100),
 is_active     BOOLEAN NOT NULL DEFAULT TRUE,
 created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 INDEX idx_name (name)
) COMMENT='Catálogo de ciudades de España donde opera Raíces';

-- ============================================================
-- 2. COUNTRIES — catálogo de países de origen
-- ============================================================
CREATE TABLE countries (
 id            SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 name          VARCHAR(100) NOT NULL,
 iso_code      CHAR(2) NOT NULL,
 flag_emoji    VARCHAR(10),
 UNIQUE KEY uq_iso (iso_code)
) COMMENT='Países de origen de los usuarios';

-- ============================================================
-- 3. USERS — tabla central
-- ============================================================
CREATE TABLE users (
 id                  CHAR(36) PRIMARY KEY DEFAULT (UUID()),
 email               VARCHAR(255) NOT NULL,
 password_hash       VARCHAR(255) NOT NULL,
 full_name           VARCHAR(150) NOT NULL,
 phone_whatsapp      VARCHAR(20),
 avatar_url          VARCHAR(500),
 country_id          SMALLINT UNSIGNED,
 city_id             SMALLINT UNSIGNED,
 role                ENUM('worker','employer','both') NOT NULL DEFAULT 'worker',
 section             ENUM('raices','semillas') NOT NULL DEFAULT 'raices',
 is_active           BOOLEAN NOT NULL DEFAULT TRUE,
 is_verified         BOOLEAN NOT NULL DEFAULT FALSE,
 is_available        BOOLEAN NOT NULL DEFAULT TRUE,
 bio                 TEXT,
 last_login_at       TIMESTAMP NULL,
 created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 UNIQUE KEY uq_email (email),
 CONSTRAINT fk_user_country FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE SET NULL,
 CONSTRAINT fk_user_city    FOREIGN KEY (city_id)    REFERENCES cities(id)    ON DELETE SET NULL,
 INDEX idx_city    (city_id),
 INDEX idx_role    (role),
 INDEX idx_section (section),
 INDEX idx_active  (is_active)
) COMMENT='Usuarios de la plataforma — Raíces y Semillas';

-- ============================================================
-- 4. USER_DOCUMENTS — verificación de identidad
-- ============================================================
CREATE TABLE user_documents (
 id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 user_id         CHAR(36) NOT NULL,
 doc_type        ENUM('NIE','TIE','passport','work_permit') NOT NULL,
 doc_number      VARCHAR(50) NOT NULL,
 expiry_year     YEAR,
 status          ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
 reviewed_by     CHAR(36) NULL,
 reviewed_at     TIMESTAMP NULL,
 rejection_note  VARCHAR(500),
 created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 CONSTRAINT fk_doc_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
 INDEX idx_doc_user   (user_id),
 INDEX idx_doc_status (status)
) COMMENT='Documentos de identidad para verificación — número y estado, sin escáner';

-- ============================================================
-- 5. USER_SKILLS — habilidades del trabajador
-- ============================================================
CREATE TABLE skills (
 id      SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 name    VARCHAR(100) NOT NULL,
 UNIQUE KEY uq_skill_name (name)
) COMMENT='Catálogo de habilidades';

CREATE TABLE user_skills (
 user_id   CHAR(36) NOT NULL,
 skill_id  SMALLINT UNSIGNED NOT NULL,
 PRIMARY KEY (user_id, skill_id),
 CONSTRAINT fk_us_user  FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE,
 CONSTRAINT fk_us_skill FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
) COMMENT='Habilidades asignadas a cada usuario';

-- ============================================================
-- 6. SECTORS — sectores laborales
-- ============================================================
CREATE TABLE sectors (
 id      SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 name    VARCHAR(100) NOT NULL,
 UNIQUE KEY uq_sector_name (name)
) COMMENT='Sectores laborales: hostelería, limpieza, construcción...';

-- ============================================================
-- 7. JOBS — oportunidades publicadas (sección Raíces)
-- ============================================================
CREATE TABLE jobs (
 id              CHAR(36) PRIMARY KEY DEFAULT (UUID()),
 employer_id     CHAR(36) NOT NULL,
 city_id         SMALLINT UNSIGNED NOT NULL,
 sector_id       SMALLINT UNSIGNED,
 title           VARCHAR(200) NOT NULL,
 description     TEXT NOT NULL,
 contract_type   ENUM('full_time','part_time','temporary','freelance','internship') NOT NULL DEFAULT 'full_time',
 requires_nie    BOOLEAN NOT NULL DEFAULT TRUE,
 vacancies       TINYINT UNSIGNED NOT NULL DEFAULT 1,
 status          ENUM('active','paused','closed') NOT NULL DEFAULT 'active',
 views_count     INT UNSIGNED NOT NULL DEFAULT 0,
 applications_count INT UNSIGNED NOT NULL DEFAULT 0,
 expires_at      DATE,
 created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 CONSTRAINT fk_job_employer FOREIGN KEY (employer_id) REFERENCES users(id)    ON DELETE CASCADE,
 CONSTRAINT fk_job_city     FOREIGN KEY (city_id)     REFERENCES cities(id)   ON DELETE RESTRICT,
 CONSTRAINT fk_job_sector   FOREIGN KEY (sector_id)   REFERENCES sectors(id)  ON DELETE SET NULL,
 INDEX idx_job_city     (city_id),
 INDEX idx_job_sector   (sector_id),
 INDEX idx_job_employer (employer_id),
 INDEX idx_job_status   (status),
 INDEX idx_job_created  (created_at DESC)
) COMMENT='Oportunidades laborales publicadas en Raíces';

-- ============================================================
-- 8. SERVICES — servicios entre personas (sección Semillas)
-- ============================================================
CREATE TABLE services (
 id              CHAR(36) PRIMARY KEY DEFAULT (UUID()),
 provider_id     CHAR(36) NOT NULL,
 city_id         SMALLINT UNSIGNED NOT NULL,
 title           VARCHAR(200) NOT NULL,
 description     TEXT NOT NULL,
 service_type    ENUM('personal','digital','tutoring','other') NOT NULL DEFAULT 'personal',
 modality        ENUM('in_person','remote','both') NOT NULL DEFAULT 'in_person',
 price_info      VARCHAR(200),
 status          ENUM('active','paused','closed') NOT NULL DEFAULT 'active',
 views_count     INT UNSIGNED NOT NULL DEFAULT 0,
 created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 CONSTRAINT fk_svc_provider FOREIGN KEY (provider_id) REFERENCES users(id)  ON DELETE CASCADE,
 CONSTRAINT fk_svc_city     FOREIGN KEY (city_id)     REFERENCES cities(id) ON DELETE RESTRICT,
 INDEX idx_svc_city     (city_id),
 INDEX idx_svc_provider (provider_id),
 INDEX idx_svc_status   (status),
 INDEX idx_svc_type     (service_type)
) COMMENT='Servicios entre personas — sección Semillas';

-- ============================================================
-- 9. APPLICATIONS — candidatura a un job
-- ============================================================
CREATE TABLE applications (
 id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 job_id          CHAR(36) NOT NULL,
 worker_id       CHAR(36) NOT NULL,
 status          ENUM('pending','viewed','contacted','rejected','hired') NOT NULL DEFAULT 'pending',
 cover_note      TEXT,
 created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 UNIQUE KEY uq_application (job_id, worker_id),
 CONSTRAINT fk_app_job    FOREIGN KEY (job_id)    REFERENCES jobs(id)  ON DELETE CASCADE,
 CONSTRAINT fk_app_worker FOREIGN KEY (worker_id) REFERENCES users(id) ON DELETE CASCADE,
 INDEX idx_app_job    (job_id),
 INDEX idx_app_worker (worker_id),
 INDEX idx_app_status (status)
) COMMENT='Candidaturas de trabajadores a ofertas de empleo';

-- ============================================================
-- 10. CONNECTIONS — red de contactos (like LinkedIn)
-- ============================================================
CREATE TABLE connections (
 id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 requester_id    CHAR(36) NOT NULL,
 addressee_id    CHAR(36) NOT NULL,
 status          ENUM('pending','accepted','blocked') NOT NULL DEFAULT 'pending',
 created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 UNIQUE KEY uq_connection (requester_id, addressee_id),
 CONSTRAINT fk_conn_requester FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE,
 CONSTRAINT fk_conn_addressee FOREIGN KEY (addressee_id) REFERENCES users(id) ON DELETE CASCADE,
 INDEX idx_conn_addressee (addressee_id),
 INDEX idx_conn_status    (status)
) COMMENT='Red de conexiones entre usuarios';

-- ============================================================
-- 11. CONVERSATIONS — mensajería interna
-- ============================================================
CREATE TABLE conversations (
 id              CHAR(36) PRIMARY KEY DEFAULT (UUID()),
 user_a_id       CHAR(36) NOT NULL,
 user_b_id       CHAR(36) NOT NULL,
 job_id          CHAR(36) NULL,
 service_id      CHAR(36) NULL,
 last_message_at TIMESTAMP NULL,
 created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 UNIQUE KEY uq_conversation (user_a_id, user_b_id),
 CONSTRAINT fk_conv_user_a  FOREIGN KEY (user_a_id)    REFERENCES users(id)    ON DELETE CASCADE,
 CONSTRAINT fk_conv_user_b  FOREIGN KEY (user_b_id)    REFERENCES users(id)    ON DELETE CASCADE,
 CONSTRAINT fk_conv_job     FOREIGN KEY (job_id)       REFERENCES jobs(id)     ON DELETE SET NULL,
 CONSTRAINT fk_conv_service FOREIGN KEY (service_id)   REFERENCES services(id) ON DELETE SET NULL,
 INDEX idx_conv_user_a (user_a_id),
 INDEX idx_conv_user_b (user_b_id),
 INDEX idx_conv_last   (last_message_at DESC)
) COMMENT='Conversaciones privadas entre dos usuarios';

-- ============================================================
-- 12. MESSAGES — mensajes dentro de una conversación
-- ============================================================
CREATE TABLE messages (
 id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 conversation_id CHAR(36) NOT NULL,
 sender_id       CHAR(36) NOT NULL,
 body            TEXT NOT NULL,
 is_read         BOOLEAN NOT NULL DEFAULT FALSE,
 read_at         TIMESTAMP NULL,
 created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT fk_msg_conv   FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
 CONSTRAINT fk_msg_sender FOREIGN KEY (sender_id)       REFERENCES users(id)         ON DELETE CASCADE,
 INDEX idx_msg_conv    (conversation_id, created_at DESC),
 INDEX idx_msg_sender  (sender_id),
 INDEX idx_msg_unread  (conversation_id, is_read)
) COMMENT='Mensajes individuales dentro de una conversación';

-- ============================================================
-- 13. POSTS — publicaciones de comunidad (feed)
-- ============================================================
CREATE TABLE posts (
 id              CHAR(36) PRIMARY KEY DEFAULT (UUID()),
 author_id       CHAR(36) NOT NULL,
 city_id         SMALLINT UNSIGNED,
 post_type       ENUM('opportunity','experience','question','announcement') NOT NULL DEFAULT 'experience',
 content         TEXT NOT NULL,
 section         ENUM('raices','semillas','both') NOT NULL DEFAULT 'raices',
 likes_count     INT UNSIGNED NOT NULL DEFAULT 0,
 comments_count  INT UNSIGNED NOT NULL DEFAULT 0,
 is_active       BOOLEAN NOT NULL DEFAULT TRUE,
 created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 CONSTRAINT fk_post_author FOREIGN KEY (author_id) REFERENCES users(id)  ON DELETE CASCADE,
 CONSTRAINT fk_post_city   FOREIGN KEY (city_id)   REFERENCES cities(id) ON DELETE SET NULL,
 INDEX idx_post_author  (author_id),
 INDEX idx_post_city    (city_id),
 INDEX idx_post_section (section),
 INDEX idx_post_created (created_at DESC)
) COMMENT='Publicaciones de comunidad en el feed';

-- ============================================================
-- 14. POST_LIKES — likes en publicaciones
-- ============================================================
CREATE TABLE post_likes (
 post_id     CHAR(36) NOT NULL,
 user_id     CHAR(36) NOT NULL,
 created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY (post_id, user_id),
 CONSTRAINT fk_like_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
 CONSTRAINT fk_like_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) COMMENT='Likes en publicaciones del feed';

-- ============================================================
-- 15. POST_COMMENTS — comentarios en publicaciones
-- ============================================================
CREATE TABLE post_comments (
 id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 post_id     CHAR(36) NOT NULL,
 author_id   CHAR(36) NOT NULL,
 body        TEXT NOT NULL,
 created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT fk_comment_post   FOREIGN KEY (post_id)   REFERENCES posts(id) ON DELETE CASCADE,
 CONSTRAINT fk_comment_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
 INDEX idx_comment_post (post_id, created_at DESC)
) COMMENT='Comentarios en publicaciones del feed';

-- ============================================================
-- 16. NOTIFICATIONS — centro de notificaciones
-- ============================================================
CREATE TABLE notifications (
 id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 user_id         CHAR(36) NOT NULL,
 type            ENUM('new_message','new_application','application_update','connection_request','connection_accepted','new_job_in_city','doc_approved','doc_rejected','post_like','post_comment') NOT NULL,
 ref_type        ENUM('job','service','message','application','connection','post') NULL,
 ref_id          CHAR(36) NULL,
 title           VARCHAR(200) NOT NULL,
 body            VARCHAR(500),
user_documents is_read         BOOLEAN NOT NULL DEFAULT FALSE,
 created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
 INDEX idx_notif_user   (user_id, is_read),
 INDEX idx_notif_created (created_at DESC)
) COMMENT='Notificaciones del sistema para cada usuario';

-- ============================================================
-- 17. ADMIN_USERS — panel de administración
-- ============================================================
CREATE TABLE admin_users (
 id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 email         VARCHAR(255) NOT NULL,
 password_hash VARCHAR(255) NOT NULL,
 full_name     VARCHAR(150) NOT NULL,
 role          ENUM('superadmin','moderator','support') NOT NULL DEFAULT 'moderator',
 is_active     BOOLEAN NOT NULL DEFAULT TRUE,
 created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 UNIQUE KEY uq_admin_email (email)
) COMMENT='Usuarios del panel de administración';

-- ============================================================
-- DATOS INICIALES — seed data
-- ============================================================

-- Ciudades principales de España
INSERT INTO cities (name, region) VALUES
 ('Madrid',          'Comunidad de Madrid'),
 ('Barcelona',       'Cataluña'),
 ('Valencia',        'Comunitat Valenciana'),
 ('Sevilla',         'Andalucía'),
 ('Zaragoza',        'Aragón'),
 ('Málaga',          'Andalucía'),
 ('Murcia',          'Región de Murcia'),
 ('Palma',           'Islas Baleares'),
 ('Las Palmas',      'Canarias'),
 ('Bilbao',          'País Vasco'),
 ('Vitoria-Gasteiz', 'País Vasco'),
 ('Alicante',        'Comunitat Valenciana'),
 ('Córdoba',         'Andalucía'),
 ('Valladolid',      'Castilla y León'),
 ('Vigo',            'Galicia'),
 ('Gijón',           'Asturias'),
 ('Granada',         'Andalucía'),
 ('A Coruña',        'Galicia'),
 ('San Sebastián',   'País Vasco'),
 ('Santander',       'Cantabria');

-- Países latinoamericanos principales
INSERT INTO countries (name, iso_code, flag_emoji) VALUES
 ('Colombia',             'CO', '🇨🇴'),
 ('México',               'MX', '🇲🇽'),
 ('Venezuela',            'VE', '🇻🇪'),
 ('Perú',                 'PE', '🇵🇪'),
 ('Ecuador',              'EC', '🇪🇨'),
 ('Argentina',            'AR', '🇦🇷'),
 ('Bolivia',              'BO', '🇧🇴'),
 ('Chile',                'CL', '🇨🇱'),
 ('Paraguay',             'PY', '🇵🇾'),
 ('Uruguay',              'UY', '🇺🇾'),
 ('Cuba',                 'CU', '🇨🇺'),
 ('República Dominicana', 'DO', '🇩🇴'),
 ('Honduras',             'HN', '🇭🇳'),
 ('Guatemala',            'GT', '🇬🇹'),
 ('El Salvador',          'SV', '🇸🇻'),
 ('Nicaragua',            'NI', '🇳🇮'),
 ('Costa Rica',           'CR', '🇨🇷'),
 ('Panamá',               'PA', '🇵🇦');

-- Sectores laborales
INSERT INTO sectors (name) VALUES
 ('Hostelería y restauración'),
 ('Limpieza y mantenimiento'),
 ('Construcción y obras'),
 ('Logística y almacén'),
 ('Cuidado de personas'),
 ('Comercio y ventas'),
 ('Agricultura'),
 ('Seguridad'),
 ('Administración'),
 ('Tecnología e IT'),
 ('Educación y formación'),
 ('Salud'),
 ('Marketing y comunicación'),
 ('Transporte'),
 ('Otros');

-- Habilidades frecuentes
INSERT INTO skills (name) VALUES
 ('Atención al cliente'),
 ('Cocina'),
 ('Limpieza industrial'),
 ('Conducción'),
 ('Idioma inglés'),
 ('Idioma francés'),
 ('Redes sociales'),
 ('Diseño gráfico'),
 ('Contabilidad básica'),
 ('Cuidado de mayores'),
 ('Cuidado de niños'),
 ('Programación'),
 ('Electricidad'),
 ('Fontanería'),
 ('Soldadura'),
 ('Traducción e interpretación'),
 ('Carnet de manipulador de alimentos'),
 ('Trabajo en equipo'),
 ('Gestión de almacén'),
 ('Microsoft Office');

-- Admin por defecto (cambiar password en producción)
INSERT INTO admin_users (email, password_hash, full_name, role)
VALUES ('admin@raices.app', '$2b$12$CHANGE_THIS_HASH_IN_PRODUCTION', 'Admin Raíces', 'superadmin');

DELETE FROM users WHERE email = 'camila@test.com';
DELETE FROM users WHERE email = 'camila@test.com';

SELECT id, email, role FROM users WHERE email = 'parceros.info@gmail.com';

UPDATE users 
SET role = 'employer' 
WHERE email = 'parceros.info@gmail.com';


SELECT id, email, role FROM users 
WHERE email = 'parceros.info@gmail.com';
DELETE FROM users WHERE email = 'parceros.info@gmail.com';

SELECT * FROM users WHERE email = 'parceros.info@gmail.com';