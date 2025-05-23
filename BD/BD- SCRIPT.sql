drop database web;
Create database web;

use web;
create table usuario(
	u_rfc char(13) primary key,
    u_nombre varchar(100),
    u_telefono char(10) unique,
    u_tipo char(1),
    u_password varchar(255) default '123' not null,
    
    CONSTRAINT chk_u_rfc CHECK (u_rfc REGEXP '^[A-ZÑ&]{4}[0-9]{6}[A-Z0-9]{3}$'), -- ER con el diseño de rfc
    CONSTRAINT chk_u_nombre CHECK (u_nombre REGEXP '^[A-Za-zÑñ& ]{1,100}$'), -- ER que obliga que solo se inserten letras
    CONSTRAINT chk_u_telefono CHECK (u_telefono REGEXP '^[0-9]{10}$'), -- ER que obliga a que numero de telefono sean 10 valores numericos
    CONSTRAINT chk_u_tipo CHECK (u_tipo REGEXP '^[01]$') -- ER para permitir solo 0 / 1
    
);

create table casa(

	c_calle char(1),
	c_numero char(2),
    c_rfc_propietario char(13),
    c_rfc_inquilino char(13),
    
    primary key(c_calle,c_numero),
    constraint r_usuario_casa_propietario 
    FOREIGN KEY (c_rfc_propietario) references usuario(u_rfc),
    
    constraint r_usario_casa_inquilino 
    FOREIGN KEY (c_rfc_inquilino) references usuario(u_rfc),
    
	CONSTRAINT chk_c_calle CHECK (c_calle REGEXP '^[A-Z]$'), -- ER con el diseño de rfc
    CONSTRAINT chk_c_numero CHECK (c_numero REGEXP '^[0-9]{2}$'), -- ER con el diseño de rfc
	CONSTRAINT chk_c_rfc_propietario CHECK (c_rfc_propietario REGEXP '^[A-ZÑ&]{4}[0-9]{6}[A-Z0-9]{3}$'), -- ER con el diseño de rfc    
    CONSTRAINT chk_c_rfc_inquilino CHECK (c_rfc_inquilino REGEXP '^[A-ZÑ&]{4}[0-9]{6}[A-Z0-9]{3}$') -- ER con el diseño de rfc    
    

);

create table cargo(

	cg_id char(4),
    cg_nombre char(25),
    cg_descripcion char(100),
    cg_costo float not null,
    
    primary key (cg_id)
);

create table cxc(

	cxc_id char(7), -- Formato de año + numero de factura 2025001 2025002
    cxc_id_cg char(4), -- Id del cargo que se cobra
    cxc_calle_casa char(1) not null, -- Calle de la casa
    cxc_numero_casa char(2) not null, -- numero de la casa
    cxc_costo float not null, -- Costo en lo que se cobro
    cxc_fecha_cobro date not null,
    cxc_fecha_limite date not null,
    
    primary key(cxc_id,cxc_id_cg),
   
	constraint r_cxc_casa
	FOREIGN KEY (cxc_calle_casa, cxc_numero_casa) REFERENCES casa(c_calle, c_numero)

    
    
);

create table recibo(

r_id_cxc char(7),
r_folio char(10), -- esto podria ser una imagen o no se como hacerlo
r_monto float, -- esto lo pone el usuario
r_fecha_peticion date,
r_status char(1), -- si se verifico o nelpas
r_rfc_usuario_cliente char(13), -- quien verifico
r_rfc_usuario_verificador char(13), -- quien verifico
r_fecha_verificacion date,

	primary key (r_id_cxc,r_folio),
    constraint r_recibo_cxc_id
    FOREIGN KEY (r_id_cxc) references cxc(cxc_id),
	constraint r_recibo_usuario_verificador_rfc
    FOREIGN KEY (r_rfc_usuario_verificador) references usuario(u_rfc),
	constraint r_recibo_usuario_cliente_rfc
    FOREIGN KEY (r_rfc_usuario_cliente) references usuario(u_rfc),
    
    CONSTRAINT chk_r_status CHECK (r_status REGEXP '^[01]$') -- ER para permitir solo 0 / 1
);

create table reserva_espacio(
re_fecha date,
re_espacio int, -- 1 para alberca, 2 para palapa, 3 para ambas
re_rfc_usuario char(13),
re_detalle varchar(30),

constraint r_reserva_usuario_rfc_usuario
FOREIGN KEY (re_rfc_usuario) references usuario(u_rfc),

constraint chk_re_espacio CHECK ( re_espacio>= 1 AND re_espacio <= 3)


);


-- ----------------------
create table publicacion(
f_id integer auto_increment,
f_rfc_usuario char(13),
f_titulo varchar(255) not null,
f_contenido text not null,
f_fecha datetime default current_timestamp,

primary key (f_id)
);

create table comentario(
c_id integer auto_increment,
c_id_f integer,
c_rfc_usuario char(13),
c_contenido text not null,
c_fecha datetime default current_timestamp,

primary key (c_id,c_id_f),
constraint r_publicacion_comentario_id foreign key (c_id_f) references publicacion(f_id) on delete cascade
);

create table pago(
    p_id integer auto_increment,
    c_calle CHAR(1),
    c_numero CHAR(2),
    u_rfc char(13),
    p_fecha datetime default current_timestamp,
    p_folio CHAR(10),
    p_monto float,

    primary key (p_id),

    constraint fk_cliente foreign key (u_rfc) references usuario(u_rfc),
    CONSTRAINT fk_habitacion_casa
        FOREIGN KEY (c_calle, c_numero)
        REFERENCES casa(c_calle, c_numero)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


DELIMITER //
-- -----------------------------------------------------------------------------
-- ------------------PROCEDURE PARA PODER REGISTRAR USUARIOS--------------------
-- -----------------------------------------------------------------------------
create procedure registrar_usuario(
	in v_u_rfc char(13),
    in v_u_nombre varchar(100),
    in v_u_telefono char(10),
    in v_u_password varchar(255)
)
begin
	insert	into usuario(u_rfc,u_nombre,u_telefono,u_tipo,u_password) values
    (v_u_rfc,v_u_nombre,v_u_telefono,'0',v_u_password);
	

end//


-- -----------------------------------------------------------------------------
-- ------------------PROCEDURE PARA PODER REGISTRAR SUPERUSUARIOS---------------
-- -----------------------------------------------------------------------------

create procedure registrar_superusuario(
	in v_u_rfc char(13),
    in v_u_nombre varchar(100),
    in v_u_telefono char(10),
    in v_u_password varchar(255)
)
begin
	insert	into usuario(u_rfc,u_nombre,u_telefono,u_tipo,u_password) values
    (v_u_rfc,v_u_nombre,v_u_telefono,'1',v_u_password);
	

end//
-- -----------------------------------------------------------------------------
-- -----------PROCEDURE PARA PODER REGITRAR UNA SOLICITUD DE ESPACIO------------
-- -----------------------------------------------------------------------------
create procedure registrar_solicitud_espacio(
	in v_re_fecha date,
    in v_re_espacio int,
    in v_re_rfc_usuario char(13),
    in v_re_detalle varchar(30)
)
begin

	declare t_disponibilidad int;
    
    select re_verificar_disponibilidad(v_re_fecha,v_re_espacio) into t_disponibilidad;
    
    IF t_disponibilidad = 1 then 
	insert	into reserva_espacio(re_fecha,re_espacio,re_rfc_usuario,re_detalle) values
    (v_re_fecha,v_re_espacio,v_re_rfc_usuario,v_re_detalle);
    
	ELSE
    
    SELECT 'DIA NO DISPONIBLE';
    
    END IF;
	

end//

delimiter ;

-- -----------------------------------------------------------------------------
-- ---Function para verificar si una espacio esta disponible--------------------
-- -----------------------------------------------------------------------------

DELIMITER //

CREATE FUNCTION re_verificar_disponibilidad(v_fecha_solicitada date,v_espacio_deseado INT)
RETURNS BOOLEAN
DETERMINISTIC
BEGIN
	declare va_espacio int; 
    
    SELECT SUM(re_espacio) into va_espacio
    from reserva_espacio where re_fecha=v_fecha_solicitada;
    
     IF va_espacio = 3 THEN
        return 0;
    ELSEIF va_espacio+v_espacio_deseado >3 then
		return 0;		
    ELSE
        return 1;
    END IF;

END;
//

-- ---------------------------------------------------------------------------
-- -----------este metodo lo que hace es decirte si una casa esta ocupado o no
-- ---------------------------------------------------------------------------

CREATE function casa_inquilino_disponible(
	v_c_calle char(1),
    v_c_numero char(2)

)
RETURNS INT
DETERMINISTIC
BEGIN

    DECLARE is_free INT;
    
    SELECT COUNT(*) INTO is_free
    FROM casa
    WHERE c_calle = v_c_calle
      AND c_numero = v_c_numero
      AND c_rfc_inquilino IS NULL;
      
      return is_free;
END //
-- ---------------------------------------------------------------------------
-- -----------PROCEDURE PARA ASIGNAR UN INQUILINO A UNA CASA
-- ---------------------------------------------------------------------------
create procedure asignar_inquilino(
	
    in v_c_calle char(1),
    in v_c_numero char(2),
	in v_u_rfc char(13)
)
begin
	 DECLARE is_free INT;
	
    select casa_inquilino_disponible(v_c_calle,v_c_numero) into is_free;
    
    IF is_free != 0 THEN
        UPDATE casa
        SET c_rfc_inquilino = v_u_rfc
        WHERE c_calle = v_c_calle
          AND c_numero = v_c_numero;
    else
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Casa no Disponible';
    END IF;

end//

-- ---------------------------------------------------------------------------
-- -----------PROCEDURE PARA QUITAR A UN INQUILINO A UNA CASA
-- ---------------------------------------------------------------------------
create procedure revocar_inquilino(	
    in v_c_calle char(1),
    in v_c_numero char(2),
    in v_u_rfc char(13)
)
begin
        UPDATE casa
        SET c_rfc_inquilino = null
        WHERE c_calle = v_c_calle
          AND c_numero = v_c_numero
          AND c_rfc_inquilino = v_u_rfc;

end//

-- ---------------------------------------------------------------------------
-- -----------PROCEDURE PARA CAMBIAR PROPIETARIO A UNA CASA
-- ---------------------------------------------------------------------------
create procedure modificar_propietario(	
    in v_c_calle char(1),
    in v_c_numero char(2),
    in v_u_rfc char(13)
)
begin
        UPDATE casa
        SET c_rfc_propietario = v_u_rfc
        WHERE c_calle = v_c_calle
          AND c_numero = v_c_numero;

end//
-- ---------------------------------------------------------------------------
-- -----------Function AUXILIAR que te genera el ultimo id para cxc posible
-- -----------ES NECESARIO DARLE UNA FECHA PARA VER EN QUE AÑO GENERARA LA FACTURA
-- ---------------------------------------------------------------------------

CREATE function aux_generar_cxc_id(
	v_cxc_fecha_cobro date
)
RETURNS char(7)
DETERMINISTIC
BEGIN
      -- Variables temporales para el ciclo
	declare v_anio char(4);
    declare v_conteo int;
    declare v_cxc_id char(7);
    
    SET v_anio = YEAR(v_cxc_fecha_cobro);
    
    SELECT COUNT(distinct CXC_ID) + 1 INTO v_conteo FROM cxc WHERE year(cxc_fecha_cobro) = v_anio;
	SET v_cxc_id = CONCAT(v_anio, LPAD(v_conteo, 3, '0'));
      
      return v_cxc_id;
END //

DELIMITER ;
-- ---------------------------------------------------------------------------
-- -----------PROCEDURE AUXILIAR QUE GENERA EL COBRO DE TODOS LOS SERVICIOS A UNA CASA
-- -----------ES NECESARIO DARLE LA CASA, Y LA FECHA DE COBRO Y LIMITE
-- ---------------------------------------------------------------------------



DELIMITER //

CREATE PROCEDURE aux_generar_cargos(
    in v_c_calle char(1),
    in v_c_numero char(2),
    in v_cg_fecha_cobro date,
    in v_cg_fecha_limite date
    
)
BEGIN
	-- variable fija del id factura
    DECLARE v_cxc_id CHAR(7);
    -- temporales que ciclan de los cargos
    DECLARE t_cg_id CHAR(4);
    DECLARE t_cg_costo float;
	-- variavble de fin de ciclo
    DECLARE f_ciclo INT DEFAULT FALSE;

    -- Cursor para recorrer la tabla casa
    DECLARE cur_cargos CURSOR FOR SELECT cg_id, cg_costo FROM cargo;
    -- Manejador de fin de datos del cursor
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET f_ciclo = TRUE;
       
	-- SE GENERA LA NUEVA ID
    SET v_cxc_id = aux_generar_cxc_id(v_cg_fecha_cobro);
       
    -- Abrir cursor
    OPEN cur_cargos;

    loop_cargos: LOOP
        -- Leer una fila del cursor
        FETCH cur_cargos INTO t_cg_id,t_cg_costo;
		-- Si no hay más filas, salir del bucle
        IF f_ciclo THEN
            LEAVE loop_cargos;
        END IF;
        
        insert into cxc(cxc_id,cxc_id_cg,cxc_calle_casa,cxc_numero_casa,cxc_costo,cxc_fecha_cobro,cxc_fecha_limite)
        values (v_cxc_id,t_cg_id,v_c_calle,v_c_numero,t_cg_costo,v_cg_fecha_cobro,v_cg_fecha_limite);
		
        

    END LOOP;

    -- Cerrar cursor
    CLOSE cur_cargos;
END //

DELIMITER ;

-- --------------------------------------------------------------------------------------
-- ------------------- Procedure para generar el cobro de todos lso servicios-----------
-- a todas las casa
-- ----------------------------------------------------------------------------------------
DELIMITER //

create PROCEDURE cobrar_servicios(
    in v_cg_fecha_cobro date,
    in v_cg_fecha_limite date
    
)
BEGIN
    -- temporales que ciclan de los casa
    DECLARE t_c_calle CHAR(1);
    DECLARE t_c_numero char(2);
	-- variavble de fin de ciclo
    DECLARE f_ciclo INT DEFAULT FALSE;

    -- Cursor para recorrer la tabla casa
    DECLARE cur_casa CURSOR FOR SELECT c_calle, c_numero FROM casa;
    -- Manejador de fin de datos del cursor
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET f_ciclo = TRUE;
       
    -- Abrir cursor
    if v_cg_fecha_cobro<= v_cg_fecha_limite then
    OPEN cur_casa;
    
    loop_casas: LOOP
        -- Leer una fila del cursor
        FETCH cur_casa INTO t_c_calle,t_c_numero;
		-- Si no hay más filas, salir del bucle
        IF f_ciclo THEN
            LEAVE loop_casas;
        END IF;
        call aux_generar_cargos(t_c_calle,t_c_numero,v_cg_fecha_cobro,v_cg_fecha_limite);
        

    END LOOP;

    -- Cerrar cursor
    CLOSE cur_casa;
    END IF;
END //

DELIMITER ;

-- --------------------------------------------------------------------------------------
-- ------------------- PROCEDURE PARA GENERAR LOS RECIBOS (USUARIOOOOOOOO)
-- ----------------------------------------------------------------------------------------

-- --------------------------------------------------------------------------------------
-- ------------------- PROCEDURE PARA GENERAR LOS RECIBOS (USUARIOOOOOOOO)
-- ----------------------------------------------------------------------------------------


DELIMITER //

create PROCEDURE realizar_pago(
    in v_r_id_cxc char(7),
    in v_r_folio char(10),
    in v_r_monto float,
    in v_r_rfc_usuario_cliente char(13)
)
BEGIN
    declare id_cxc_existe int default 0;
    declare recibo_existe int default 0;

    select count(distinct cxc_id) INTO id_cxc_existe from cxc where cxc_id = v_r_id_cxc;
    select count(*) INTO recibo_existe from recibo where r_id_cxc = v_r_id_cxc and (r_status is null or r_status = '1');

    IF id_cxc_existe = 0 THEN
         SIGNAL SQLSTATE '45000'
         SET MESSAGE_TEXT = 'Error: no existe el cxc_id especificado';
    END IF;

    IF recibo_existe != 0 THEN
         SIGNAL SQLSTATE '45000'
         SET MESSAGE_TEXT = 'Error: La factura ya tiene un pago registrado';
    END IF;

    insert into recibo(r_id_cxc, r_folio, r_monto, r_fecha_peticion, r_rfc_usuario_cliente)
        values (v_r_id_cxc,v_r_folio,v_r_monto,curdate(),v_r_rfc_usuario_cliente);

END //

DELIMITER ;

-- --------------------------------------------------------------------------------------
-- ------------------- PROCEDURE PARA GENERAR LOS RECIBOS (USUARIOOOOOOOO)
-- ----------------------------------------------------------------------------------------

describe recibo;
DELIMITER //

create PROCEDURE validar_recibo(
    in v_r_id_cxc char(7),
    in v_r_folio char(10),
    in v_r_status char(1),
    in v_r_rfc_usuario_verificador char(13)
)
BEGIN
    declare v_recibo_existe int default 0;

    select count(*) INTO v_recibo_existe from recibo where r_id_cxc = v_r_id_cxc and r_folio=v_r_folio;

    IF v_recibo_existe = 0 THEN
         SIGNAL SQLSTATE '45000'
         SET MESSAGE_TEXT = 'Error: no existe el recibo especificado';
    END IF;

    IF v_r_status not in (0,1) THEN
         SIGNAL SQLSTATE '45000'
         SET MESSAGE_TEXT = 'Error: no existe el STATUS especificado';

    end if;

    update recibo
    set     r_status = v_r_status,
            r_fecha_verificacion = curdate(),
            r_rfc_usuario_verificador = v_r_rfc_usuario_verificador
    where r_id_cxc = v_r_id_cxc and r_folio=v_r_folio;


END //

DELIMITER ;

-- -
-- --------------------------------------------------------------
-- procedure para modficar datos de usario
-- ---------------------------------------------------------------
delimiter //

    create procedure modificar_usuario_nombre(
    in v_rfc_u char(13),
    in v_nombre_u char(100)
    )
    begin

    UPDATE usuario SET u_nombre = v_nombre_u
    where u_rfc = v_rfc_u;

    end//

delimiter ;

delimiter //

    create procedure modificar_usuario_telefono(
    in v_rfc_u char(13),
    in v_telefono_u char(10)
    )
    begin

    UPDATE usuario SET u_telefono = v_telefono_u
    where u_rfc = v_rfc_u ;

    end//

delimiter ;

delimiter //

    create procedure modificar_usuario_password(
    in v_rfc_u char(13),
    in v_old_password varchar(255),
    in v_new_password varchar(255)
    )
    begin

    declare t_existe integer;

    select count(*) into t_existe
    from usuario where u_rfc = v_rfc_u and u_password = v_old_password;

    if t_existe = 0 then
         SIGNAL SQLSTATE '45000'
         SET MESSAGE_TEXT = 'Error: Contraseña Erronea';
    end if ;

    UPDATE usuario SET u_password = v_new_password
    where u_rfc = v_rfc_u and u_password=v_old_password;

    end//

delimiter ;




-- --------------------------------------------------------------------------------------
-- ------------------- vista para ver todos los movimientos cxc + recibos (validados/no validados/rechazados)
-- ----------------------------------------------------------------------------------------
    CREATE or replace view movimiento_cxc_recibo AS
SELECT
    c.cxc_fecha_cobro AS v_fecha_pc,
    c.cxc_id AS v_id_cxc,
    c.cxc_calle_casa as v_calle_casa,
    c.cxc_numero_casa as v_numero_casa,
    'Cargo' AS v_tipo,
    'N/A' AS v_estado,
    SUM(c.cxc_costo) AS v_monto,
    casa.c_rfc_inquilino AS v_inquilino_rfc,
    casa.c_rfc_propietario  AS v_inquilino_propietario
FROM cxc c
inner join casa on c.cxc_calle_casa = casa.c_calle and c.cxc_numero_casa = casa.c_numero
group by c.cxc_fecha_cobro, c.cxc_id, c.cxc_calle_casa, c.cxc_numero_casa, casa.c_rfc_inquilino

UNION ALL

SELECT
    r.r_fecha_peticion AS v_fecha_pc,
    r.r_id_cxc AS v_id_cxc,
    cxc.cxc_calle_casa as v_calle_casa,
    cxc.cxc_numero_casa as v_numero_casa,
    'Abono' AS v_tipo,
    r.r_status as v_estado,
    -r.r_monto AS v_monto,
    casa.c_rfc_inquilino  AS v_inquilino_rfc,
    casa.c_rfc_propietario  AS v_inquilino_propietario
FROM recibo r
inner join cxc on r.r_id_cxc = cxc.cxc_id
inner join casa on cxc.cxc_calle_casa = casa.c_calle and cxc.cxc_numero_casa = casa.c_numero
group by r.r_fecha_peticion, r.r_id_cxc, cxc.cxc_calle_casa, cxc.cxc_numero_casa,r.r_status, r.r_monto, casa.c_rfc_inquilino;
-- --------------------------------------------------------------------------------------
-- ------------------- vista para ver los movimientos que ya estan confirmados o pendientes este servira
-- -------------------- para ver generar el total jeje
-- ----------------------------------------------------------------------------------------

create or replace view estado_cuentas as
select v_id_cxc,v_estado,v_calle_casa,v_numero_casa,v_tipo,v_monto,v_inquilino_rfc
from movimiento_cxc_recibo where v_estado != '0' order by v_id_cxc ,v_tipo desc;
-- ---------------------------------------------------------------------
-- --------------------------------------------------------------------
-- ---------------------------------------------------------------------
CALL registrar_usuario('PERE850101ABC', 'Juan Perez', '2291234567', 'Password1');
CALL registrar_usuario('LOPM900202XYZ', 'Maria Lopez', '2292345678', 'Password1');
CALL registrar_usuario('REYL950404QWE', 'Lucia Reyes', '2294567890', 'Password1');
CALL registrar_usuario('ORTA920606FGH', 'Ana Ortiz', '2296789012', 'Password1');
CALL registrar_usuario('RUIF880707BNM', 'Fernando Ruiz', '2297890123', 'Password1');
CALL registrar_usuario('GARS890909ZXV', 'Sofia Garcia', '2299012345', 'Password1');
CALL registrar_usuario('MARP970202UYT', 'Patricia Martinez', '2291236789', 'Password1');
CALL registrar_usuario('RAMA940404MNB', 'Andrea Ramos', '2293458901', 'Password1');
CALL registrar_usuario('MEZL980606QAZ', 'Laura Meza', '2295670123', 'Password1');

CALL registrar_superusuario('GOMC810303JKL', 'Carlos Gomez', '2293456789', 'Password1');
CALL registrar_superusuario('RAMJ870505RTY', 'Jorge Ramos', '2295678901', 'Password1');
CALL registrar_superusuario('DIAM930808VCX', 'Miguel Diaz', '2298901234', 'Password1');
CALL registrar_superusuario('MENR960101POI', 'Raul Mendoza', '2290123456', 'Password1');
CALL registrar_superusuario('HERG850303LKJ', 'Gabriel Hernandez', '2292347890', 'Password1');
CALL registrar_superusuario('VILD910505ASD', 'Diego Villar', '2294569012', 'Password1');

INSERT INTO casa (c_calle, c_numero,c_rfc_propietario) VALUES
('A', '01','DIAM930808VCX'),
('A', '02','DIAM930808VCX'),
('A', '03','DIAM930808VCX'),
('A', '04','DIAM930808VCX'),
('A', '05','DIAM930808VCX'),
('A', '06','DIAM930808VCX'),
('A', '07','DIAM930808VCX'),
('A', '08','DIAM930808VCX'),
('A', '09','DIAM930808VCX'),
('A', '10','DIAM930808VCX'),
('B', '01','DIAM930808VCX'),
('B', '02','DIAM930808VCX'),
('B', '03','DIAM930808VCX'),
('B', '04','DIAM930808VCX'),
('B', '05','DIAM930808VCX'),
('B', '06','DIAM930808VCX'),
('B', '07','DIAM930808VCX'),
('B', '08','DIAM930808VCX'),
('B', '09','DIAM930808VCX'),
('B', '10','DIAM930808VCX'),
('C', '01','DIAM930808VCX'),
('C', '02','DIAM930808VCX'),
('C', '03','DIAM930808VCX'),
('C', '04','DIAM930808VCX'),
('C', '05','DIAM930808VCX'),
('C', '06','DIAM930808VCX'),
('C', '07','DIAM930808VCX'),
('C', '08','DIAM930808VCX'),
('C', '09','DIAM930808VCX'),
('C', '10','DIAM930808VCX'),
('D', '01','DIAM930808VCX'),
('D', '02','DIAM930808VCX'),
('D', '03','DIAM930808VCX'),
('D', '04','DIAM930808VCX'),
('D', '05','REYL950404QWE'),
('D', '06','REYL950404QWE'),
('D', '07','REYL950404QWE'),
('D', '08','REYL950404QWE'),
('D', '09','REYL950404QWE'),
('D', '10','REYL950404QWE'),
('E', '01','REYL950404QWE'),
('E', '02','PERE850101ABC'),
('E', '03','PERE850101ABC'),
('E', '04','PERE850101ABC'),
('E', '05','PERE850101ABC'),
('E', '06','PERE850101ABC'),
('E', '07','PERE850101ABC'),
('E', '08','PERE850101ABC'),
('E', '09','PERE850101ABC'),
('E', '10','PERE850101ABC');


insert into reserva_espacio (re_fecha,re_espacio,re_rfc_usuario,re_Detalle) values
('2025-04-21',1,'MEZL980606QAZ','Cumpleaños de benito'),
('2025-04-21',2,'MEZL980606QAZ','Cumpleaños de benito'),
('2025-04-22',3,'MEZL980606QAZ','Cumpleaños de benito'),
('2025-04-23',2,'MEZL980606QAZ','Cumpleaños de benito'),
('2025-04-23',1,'MEZL980606QAZ','Cumpleaños de benito'),
('2025-04-24',1,'MEZL980606QAZ','Cumpleaños de benito'),
('2025-04-24',2,'MEZL980606QAZ','Cumpleaños de benito'),
('2025-04-25',2,'MEZL980606QAZ','Cumpleaños de benito');


CALL registrar_solicitud_espacio('2025-04-25',1,'RAMA940404MNB' , 'Dia de gracias');
call modificar_propietario('A','01','MEZL980606QAZ');


INSERT INTO cargo (cg_id, cg_nombre, cg_descripcion, cg_costo) VALUES
('LU01', 'Luz', 'Pago mensual de luz', 150.00),
('AG02', 'Agua', 'Servicio de agua potable', 80.00),
('GA03', 'Gas', 'Serviciodegasdoméstico', 50.00),
('MA04', 'Manteni', 'Cuota de mantenimiento', 100.00),
('IN05', 'Internet', 'Internet de velocidad', 100.00),
('LI06', 'Limpieza', 'Limpieza de áreas comunes', 100.00),
('SE07', 'Seguridad', 'Vigilancia privada 24/7', 100.00),
('PA08', 'Parqueo', 'Renta de espacio para auto', 100.00),
('RE09', 'Reparación', 'Fondo para reparaciones', 50.00),
('AL10', 'Alumbrado', 'Alumbrado de áreas comunes', 20.00);

call cobrar_servicios(curdate(),curdate()+1);
CALL asignar_inquilino('A','01','PERE850101ABC');
CALL asignar_inquilino('A','02','LOPM900202XYZ');
CALL asignar_inquilino('A','03','REYL950404QWE');
CALL asignar_inquilino('A','04','ORTA920606FGH');
CALL asignar_inquilino('A','05','GARS890909ZXV');
CALL asignar_inquilino('A','06','MARP970202UYT');
CALL asignar_inquilino('A','07','RAMA940404MNB');
CALL asignar_inquilino('A','08','MEZL980606QAZ');
CALL asignar_inquilino('A','09','PERE850101ABC');
CALL asignar_inquilino('A','10','MEZL980606QAZ');
CALL asignar_inquilino('B','01','LOPM900202XYZ');
CALL asignar_inquilino('B','02','REYL950404QWE');
CALL asignar_inquilino('B','03','ORTA920606FGH');
CALL asignar_inquilino('B','04','RUIF880707BNM');
CALL asignar_inquilino('B','05','GARS890909ZXV');
CALL asignar_inquilino('B','06','MARP970202UYT');
CALL asignar_inquilino('B','07','RAMA940404MNB');
CALL asignar_inquilino('B','08','MEZL980606QAZ');
CALL asignar_inquilino('B','09','PERE850101ABC');
CALL asignar_inquilino('B','10','LOPM900202XYZ');
CALL asignar_inquilino('C','01','REYL950404QWE');
CALL asignar_inquilino('C','02','ORTA920606FGH');
CALL asignar_inquilino('C','03','RUIF880707BNM');
CALL asignar_inquilino('C','04','GARS890909ZXV');
CALL asignar_inquilino('C','05','MARP970202UYT');
CALL asignar_inquilino('C','06','RAMA940404MNB');
CALL asignar_inquilino('C','07','MEZL980606QAZ');
CALL asignar_inquilino('C','08','PERE850101ABC');
CALL asignar_inquilino('C','09','LOPM900202XYZ');
CALL asignar_inquilino('C','10','REYL950404QWE');
CALL asignar_inquilino('D','01','REYL950404QWE');
CALL asignar_inquilino('D','02','ORTA920606FGH');
CALL asignar_inquilino('D','03','RUIF880707BNM');
CALL asignar_inquilino('D','04','GARS890909ZXV');
CALL asignar_inquilino('D','05','MARP970202UYT');
CALL asignar_inquilino('D','06','RAMA940404MNB');
CALL asignar_inquilino('D','07','MEZL980606QAZ');
CALL asignar_inquilino('D','08','PERE850101ABC');
CALL asignar_inquilino('D','09','LOPM900202XYZ');
CALL asignar_inquilino('D','10','REYL950404QWE');
CALL asignar_inquilino('E','01','PERE850101ABC');
CALL asignar_inquilino('E','02','LOPM900202XYZ');
CALL asignar_inquilino('E','03','REYL950404QWE');
CALL asignar_inquilino('E','04','ORTA920606FGH');
CALL asignar_inquilino('E','05','GARS890909ZXV');
CALL asignar_inquilino('E','06','MARP970202UYT');
CALL asignar_inquilino('E','07','RAMA940404MNB');
CALL asignar_inquilino('E','08','MEZL980606QAZ');
CALL asignar_inquilino('E','09','PERE850101ABC');
CALL asignar_inquilino('E','10','MEZL980606QAZ');

CALL realizar_pago('2025001','1234567890',812,'PERE850101ABC');
CALL realizar_pago('2025002','1982736450',735,'LOPM900202XYZ');
CALL realizar_pago('2025003','5678901234',983,'REYL950404QWE');
CALL realizar_pago('2025004','1029384756',618,'ORTA920606FGH');
CALL realizar_pago('2025005','5647382910',924,'RUIF880707BNM');
CALL realizar_pago('2025006','9876543210',556,'GARS890909ZXV');
CALL realizar_pago('2025007','1122334455',642,'MARP970202UYT');
CALL realizar_pago('2025008','5566778899',999,'RAMA940404MNB');
CALL realizar_pago('2025009','6677889900',501,'MEZL980606QAZ');
CALL realizar_pago('2025010','9988776655',752,'PERE850101ABC');
CALL realizar_pago('2025011','3456789012',804,'LOPM900202XYZ');
CALL realizar_pago('2025012','2345678901',993,'REYL950404QWE');
CALL realizar_pago('2025013','7890123456',700,'ORTA920606FGH');
CALL realizar_pago('2025014','6789012345',821,'RUIF880707BNM');
CALL realizar_pago('2025015','8901234567',511,'GARS890909ZXV');
CALL realizar_pago('2025016','3210987654',695,'MARP970202UYT');
CALL realizar_pago('2025017','4321098765',999,'RAMA940404MNB');
CALL realizar_pago('2025018','8765432109',888,'MEZL980606QAZ');
CALL realizar_pago('2025019','1092837465',566,'PERE850101ABC');
CALL realizar_pago('2025020','5647382912',712,'LOPM900202XYZ');
CALL realizar_pago('2025021','1123581321',750,'REYL950404QWE');
CALL realizar_pago('2025022','9873214560',843,'ORTA920606FGH');
CALL realizar_pago('2025023','1234098765',697,'RUIF880707BNM');
CALL realizar_pago('2025024','2109876543',599,'GARS890909ZXV');
CALL realizar_pago('2025025','4567890123',955,'MARP970202UYT');
CALL realizar_pago('2025026','3216549870',528,'RAMA940404MNB');
CALL realizar_pago('2025027','6549873210',863,'MEZL980606QAZ');
CALL realizar_pago('2025028','7896541230',900,'PERE850101ABC');
CALL realizar_pago('2025029','8907612345',678,'LOPM900202XYZ');
CALL realizar_pago('2025030','9012345678',999,'REYL950404QWE');
CALL realizar_pago('2025031','1123456789',856,'ORTA920606FGH');
CALL realizar_pago('2025032','2234567890',791,'RUIF880707BNM');
CALL realizar_pago('2025033','3345678901',975,'GARS890909ZXV');
CALL realizar_pago('2025034','4456789012',522,'MARP970202UYT');
CALL realizar_pago('2025035','5567890123',842,'RAMA940404MNB');
CALL realizar_pago('2025036','6678901234',509,'MEZL980606QAZ');
CALL realizar_pago('2025037','7789012345',731,'PERE850101ABC');
CALL realizar_pago('2025038','8890123456',900,'LOPM900202XYZ');
CALL realizar_pago('2025039','9901234567',583,'REYL950404QWE');
CALL realizar_pago('2025040','1012345678',799,'ORTA920606FGH');
CALL realizar_pago('2025041','2123456789',870,'RUIF880707BNM');
CALL realizar_pago('2025042','3234567890',934,'GARS890909ZXV');
CALL realizar_pago('2025043','4345678901',688,'MARP970202UYT');
CALL realizar_pago('2025044','5456789012',561,'RAMA940404MNB');
CALL realizar_pago('2025045','6567890123',726,'MEZL980606QAZ');
CALL realizar_pago('2025046','7678901234',982,'PERE850101ABC');
CALL realizar_pago('2025047','8789012345',594,'LOPM900202XYZ');
CALL realizar_pago('2025048','9890123456',819,'REYL950404QWE');
CALL realizar_pago('2025049','0901234567',758,'ORTA920606FGH');
CALL realizar_pago('2025050','1234567899',666,'RUIF880707BNM');





CALL validar_recibo('2025001','1234567890','1','DIAM930808VCX');
CALL validar_recibo('2025002','1982736450','0','GOMC810303JKL');
CALL validar_recibo('2025003','5678901234','1','RAMJ870505RTY');
CALL validar_recibo('2025004','1029384756','0','HERG850303LKJ');
CALL validar_recibo('2025005','5647382910','1','MENR960101POI');
CALL validar_recibo('2025006','9876543210','0','DIAM930808VCX');
CALL validar_recibo('2025007','1122334455','1','VILD910505ASD');
CALL validar_recibo('2025008','5566778899','1','HERG850303LKJ');
CALL validar_recibo('2025009','6677889900','0','GOMC810303JKL');
CALL validar_recibo('2025010','9988776655','1','RAMJ870505RTY');
CALL validar_recibo('2025011','3456789012','1','MENR960101POI');
CALL validar_recibo('2025012','2345678901','0','HERG850303LKJ');
CALL validar_recibo('2025013','7890123456','1','DIAM930808VCX');
CALL validar_recibo('2025014','6789012345','1','VILD910505ASD');
CALL validar_recibo('2025015','8901234567','0','GOMC810303JKL');
CALL validar_recibo('2025016','3210987654','1','MENR960101POI');
CALL validar_recibo('2025017','4321098765','0','DIAM930808VCX');
CALL validar_recibo('2025018','8765432109','1','HERG850303LKJ');
CALL validar_recibo('2025019','1092837465','0','RAMJ870505RTY');
CALL validar_recibo('2025020','5647382912','1','GOMC810303JKL');
CALL validar_recibo('2025021','1123581321','1','DIAM930808VCX');
CALL validar_recibo('2025022','9873214560','0','MENR960101POI');
CALL validar_recibo('2025023','1234098765','1','RAMJ870505RTY');
CALL validar_recibo('2025024','2109876543','1','HERG850303LKJ');
CALL validar_recibo('2025025','4567890123','0','VILD910505ASD');
CALL validar_recibo('2025026','3216549870','1','GOMC810303JKL');
CALL validar_recibo('2025027','6549873210','1','DIAM930808VCX');
CALL validar_recibo('2025028','7896541230','0','MENR960101POI');
CALL validar_recibo('2025029','8907612345','1','HERG850303LKJ');
CALL validar_recibo('2025030','9012345678','1','VILD910505ASD');
CALL validar_recibo('2025031','1123456789','1','ORTA920606FGH');
CALL validar_recibo('2025032','2234567890','1','RUIF880707BNM');
CALL validar_recibo('2025033','3345678901','1','GARS890909ZXV');
CALL validar_recibo('2025034','4456789012','1','MARP970202UYT');
CALL validar_recibo('2025035','5567890123','1','RAMA940404MNB');
CALL validar_recibo('2025036','6678901234','1','MEZL980606QAZ');
CALL validar_recibo('2025037','7789012345','1','PERE850101ABC');
CALL validar_recibo('2025038','8890123456','1','LOPM900202XYZ');
CALL validar_recibo('2025039','9901234567','1','REYL950404QWE');
CALL validar_recibo('2025040','1012345678','1','ORTA920606FGH');
CALL validar_recibo('2025041','2123456789','1','RUIF880707BNM');
CALL validar_recibo('2025042','3234567890','1','GARS890909ZXV');
CALL validar_recibo('2025043','4345678901','1','MARP970202UYT');
CALL validar_recibo('2025044','5456789012','1','RAMA940404MNB');
CALL validar_recibo('2025045','6567890123','1','MEZL980606QAZ');
CALL validar_recibo('2025046','7678901234','1','PERE850101ABC');
CALL validar_recibo('2025047','8789012345','1','LOPM900202XYZ');
CALL validar_recibo('2025048','9890123456','1','REYL950404QWE');
CALL validar_recibo('2025049','0901234567','1','ORTA920606FGH');
CALL validar_recibo('2025050','1234567899','1','RUIF880707BNM');


insert into publicacion(f_rfc_usuario, f_titulo, f_contenido) values ('DIAM930808VCX','Fallas de luz','Ultimamente he tenido problemas en los sistemas de luz, alguien mas?');
insert into comentario(c_id_f, c_rfc_usuario, c_contenido) values (1,'DIAM930808VCX','Estoy de acuerdo');
insert into comentario(c_id_f, c_rfc_usuario, c_contenido) values (1,'DIAM930808VCX','Yo no estoy de acuerdo');
