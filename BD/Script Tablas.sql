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