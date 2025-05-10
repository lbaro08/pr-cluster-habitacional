
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

