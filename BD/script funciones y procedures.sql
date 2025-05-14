use web;

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

create or replace view estado_cuentas as
select v_id_cxc,v_estado,v_calle_casa,v_numero_casa,v_tipo,v_monto,v_inquilino_rfc
from movimiento_cxc_recibo where v_estado != '0' order by v_id_cxc asc,v_tipo desc;
-- --------------------------------------------------------------------------------------
-- ------------------- pruebaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
-- ----------------------------------------------------------------------------------------
-- --------------------------------------------------------------------------------------
-- ------------------- pruebaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
-- ----------------------------------------------------------------------------------------
-- --------------------------------------------------------------------------------------
-- ------------------- pruebaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
-- ----------------------------------------------------------------------------------------

