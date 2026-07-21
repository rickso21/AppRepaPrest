Uso de base de datos TiDB Cloud

https://auth.tidbcloud.com/login?state=hKFo2SByc0tPb0d4TkFtVUhoZTh2T1ZDVEc0d2pHbDhfYWp4YaFupWxvZ2luo3RpZNkgRU9GY2NxeUFfaUUwUDZTdkVlRVRGNFRnYVBKdGwwbHqjY2lk2SA2SVp0aENmbVJLSVBFblFTVDhhRGJ0TTdTR2RNbmlSbA&client=6IZthCfmRKIPEnQST8aDbtM7SGdMniRl&protocol=oauth2&response_type=token%20id_token&redirect_uri=https%3A%2F%2Ftidbcloud.com%2Fauth_redirect%3Fprev%3D%252F%253ForgId%253D1372813089209342752&scope=openid%20email&nonce=df-bzue5LRU5vjlAc~jymfrAzwY6kpad&auth0Client=eyJuYW1lIjoiYXV0aDAuanMiLCJ2ZXJzaW9uIjoiOS4xOS4xIn0%3D





CREATE TABLE tbl_rol (
  id int (50) AUTO_INCREMENT,
  nombre varchar (200),
  primary key (id)
);

SELECT * from tbl_rol;

create table tbl_status(
  id int (50) AUTO_INCREMENT,
  nombre varchar (200),
  PRIMARY key (id)
);

insert into tbl_status  (nombre) values ('activo'),('inactivo'),('en revision'), ('suspendido'),('cancelado');


select * from tbl_status;

  
select * from tbl_rol;
insert into tbl_rol values (3,'usuario');


CREATE TABLE tbl_user (
  id INT AUTO_INCREMENT,
  nombre VARCHAR(200) NOT NULL,
  apellido_p VARCHAR(200),
  apellido_m VARCHAR(200),
  email VARCHAR(200) UNIQUE NOT NULL,
  telefono VARCHAR(200),
  otp varchar(200) NULL,
  password VARCHAR(200) NOT NULL,
  rol_id INT,
  status_id INT,
  PRIMARY KEY (id),
  CONSTRAINT fk_user_rol FOREIGN KEY (rol_id) REFERENCES tbl_rol(id) ON DELETE SET NULL,
  CONSTRAINT fk_user_status FOREIGN KEY (status_id) REFERENCES tbl_status(id) ON DELETE SET NULL);

insert into tbl_user values (1,'Luis','ruiz','ignacio','rickso21111@gmail.com','5587227800','0','123',1,1);

select * from tbl_user;
