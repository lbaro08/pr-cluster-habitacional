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

r_id_cxc char(6),
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
    
    SELECT "DIA NO DISPONIBLE";
    
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

INSERT INTO casa (c_calle, c_numero) VALUES
('A', '01'),
('A', '02'),
('A', '03'),
('A', '04'),
('A', '05'),
('A', '06'),
('A', '07'),
('A', '08'),
('A', '09'),
('A', '10'),
('B', '01'),
('B', '02'),
('B', '03'),
('B', '04'),
('B', '05'),
('B', '06'),
('B', '07'),
('B', '08'),
('B', '09'),
('B', '10'),
('C', '01'),
('C', '02'),
('C', '03'),
('C', '04'),
('C', '05'),
('C', '06'),
('C', '07'),
('C', '08'),
('C', '09'),
('C', '10'),
('D', '01'),
('D', '02'),
('D', '03'),
('D', '04'),
('D', '05'),
('D', '06'),
('D', '07'),
('D', '08'),
('D', '09'),
('D', '10'),
('E', '01'),
('E', '02'),
('E', '03'),
('E', '04'),
('E', '05'),
('E', '06'),
('E', '07'),
('E', '08'),
('E', '09'),
('E', '10');

CALL registrar_usuario('PERE850101ABC', 'Juan Perez', '2291234567', 'passwords');
CALL registrar_usuario('LOPM900202XYZ', 'Maria Lopez', '2292345678', 'passwords');
CALL registrar_usuario('REYL950404QWE', 'Lucia Reyes', '2294567890', 'passwords');
CALL registrar_usuario('ORTA920606FGH', 'Ana Ortiz', '2296789012', 'passwords');
CALL registrar_usuario('RUIF880707BNM', 'Fernando Ruiz', '2297890123', 'passwords');
CALL registrar_usuario('GARS890909ZXV', 'Sofia Garcia', '2299012345', 'passwords');
CALL registrar_usuario('MARP970202UYT', 'Patricia Martinez', '2291236789', 'passwords');
CALL registrar_usuario('RAMA940404MNB', 'Andrea Ramos', '2293458901', 'passwords');
CALL registrar_usuario('MEZL980606QAZ', 'Laura Meza', '2295670123', 'passwords');

CALL registrar_superusuario('GOMC810303JKL', 'Carlos Gomez', '2293456789', 'passwords');
CALL registrar_superusuario('RAMJ870505RTY', 'Jorge Ramos', '2295678901', 'passwords');
CALL registrar_superusuario('DIAM930808VCX', 'Miguel Diaz', '2298901234', 'passwords');
CALL registrar_superusuario('MENR960101POI', 'Raul Mendoza', '2290123456', 'passwords');
CALL registrar_superusuario('HERG850303LKJ', 'Gabriel Hernandez', '2292347890', 'passwords');
CALL registrar_superusuario('VILD910505ASD', 'Diego Villar', '2294569012', 'passwords');


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
CALL asignar_inquilino('A','01','MEZL980606QAZ');
call revocar_inquilino('A','01','MEZL980606QAZ');
call modificar_propietario('A','01','MEZL980606QAZ');


INSERT INTO cargo (cg_id, cg_nombre, cg_descripcion, cg_costo) VALUES
('LU01', 'Luz', 'Pago mensual de luz', 350.00),
('AG02', 'Agua', 'Servicio de agua potable', 180.00),
('GA03', 'Gas', 'Serviciodegasdoméstico', 250.00),
('MA04', 'Manteni', 'Cuota de mantenimiento', 500.00),
('IN05', 'Internet', 'Internet de velocidad', 400.00),
('LI06', 'Limpieza', 'Limpieza de áreas comunes', 200.00),
('SE07', 'Seguridad', 'Vigilancia privada 24/7', 600.00),
('PA08', 'Parqueo', 'Renta de espacio para auto', 300.00),
('RE09', 'Reparación', 'Fondo para reparaciones', 150.00),
('AL10', 'Alumbrado', 'Alumbrado de áreas comunes', 120.00);