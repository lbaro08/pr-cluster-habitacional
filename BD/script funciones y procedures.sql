
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

DELIMITER ;


drop procedure REVOCAR_inquilino;