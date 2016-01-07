
function Partida(){
	this.saldobanco=40000
	this.maxPresupuesto = 20000
	this.tablero
	this.dado
	this.fichas
	this.coloresFichas
	this.numjugadores = 6;
	this.turnopartida = 0;
	this.pasosalida = 200;	
	this.maxcasas = 32;
	this.maxhoteles = 12;
	this.grupocalles = [];
	

	this.iniciar = function(){
		this.tablero = new Tablero(40)
		this.dado = new Dado()
		this.fichas = []
		this.coloresFichas = ["azul","rojo","verde","amarillo", "marron", "naranja"];
		this.iniciargrupocalle();
	}	

	this.grupocalle = function(color,tamano){
		this.color=color;
		this.tamano=tamano;
	
	}
	this.iniciargrupocalle = function(){
		this.grupocalles[0] = new this.grupocalle("Marron",2);
		this.grupocalles[1] = new this.grupocalle("AzulCielo",3);
		this.grupocalles[2] = new this.grupocalle("Rosa",3);
		this.grupocalles[3] = new this.grupocalle("Naranja",3);
		this.grupocalles[4] = new this.grupocalle("Rojo",3);
		this.grupocalles[5] = new this.grupocalle("Amarillo",3);
		this.grupocalles[6] = new this.grupocalle("Verde",3);
		this.grupocalles[7] = new this.grupocalle("AzulOscuro",2);
		return this.grupocalles 
	
	}
	this.crearFicha = function(Jugador){
		if (this.fichas.length != this.coloresFichas.length){
			var ficha = new Ficha(Jugador, this, this.coloresFichas[this.fichas.length])
			this.fichas.push(ficha)
			console.log("Bienvenido "+this.nombre)
			return ficha
		}			
		else{
			console.log("No hay fichas libres para jugar")
			return false
		}
	}
	
	this.quitarfondosBanco=function(dinero){
			Partida.saldobanco=Partida.saldobanco-dinero
		}
	
	this.agregarfondosBanco=function(dinero){
			Partida.saldobanco=Partida.saldobanco+dinero
		}

	this.buscarjugador=function(Jugador){
		for(i=0;i<this.fichas.length;i++){
			if (this.fichas[i].obtenerjugador().Jugador==Jugador) return this.fichas[i]
		}
		return false
	} 

	this.iniciarturno = function(){
		var turno=0
		var tirada = this.partida.lanzarDados()
		var resultado = tirada[0] + tirada[1]
		var masalto = resultado
		this.fichas[0].turno = true;
		
		for (i=1;i<this.fichas.length;i++) {
			tirada = this.partida.lanzarDados()
			resultado = tirada[0] + tirada[1]
			if (masalto<resultado) {
				this.fichas[i].turno = true
				this.fichas[turno].turno= false
				masalto=resultado
			} 
		}
	}	
	
	this.pasarturno= function(){
		this.fichas[this.turnopartida].turno=false;
		this.turnopartida++;
		if (this.turnopartida>=this.fichas.length)
			this.turnopartida=0
		this.fichas[this.turnopartida].turno=true;
		
			
	}
	
	this.lanzarDados = function(){
		var dado1 = this.dado.calcularNumero()
		var dado2 = this.dado.calcularNumero()
		return [dado1, dado2]
	}

	this.moverFicha = function(ficha,num){
		
		if ((ficha.getPosicion() + num)>39) {
			var nuevaPosicion = (ficha.getPosicion() + num) -40;
			ficha.pasarsalida();
		}
		else {
			var nuevaPosicion = ficha.getPosicion() + num
		}
		ficha.setPosicion(nuevaPosicion);
		
		switch(nuevaPosicion){
			case(30): //casilla ir a la carcel
				ficha.setPosicion(nuevaPosicion);
				break;
			case(4 || 38): //casilla pargar impuestos
				ficha.pagar(150);
				Partida.agregarfondosBanco(50);
				//ficha.setPosicion(nuevaPosicion);
				break;
			case (7 || 22 || 36): //caja de la suerte
				//ficha.setPosicion(nuevaPosicion);
				console.log ("coger tarjeta de la suerte")
				break;
			case (2 ||17 || 32): // caja de comunudad
				//ficha.setPosicion(nuevaPosicion);
				console.log ("Coger una tarjeta de la caja de comunidad")
				break;
			case (12 || 28)://has caido en una compañia , sin implementar
				//ficha.setPosicion(nuevaPosicion);
				console.log ("has caido en una compañia")
				break;
				
			default:
				//ficha.setPosicion(nuevaPosicion);
			   //	if (nuevaPosicion instanceof Partida.grupocalles){
				if ((tablero.casillas[nuevaPosicion].tipo== "calle") || (tablero.casillas[nuevaPosicion].tipo== "Estacion")) { 
					if (tablero.casillas[nuevaPosicion].estado=="libre"){
						console.log("comprar")
						tablero.casillas[nuevaPosicion].comprar(ficha);
						
					}
					else 
						if (tablero.casillas[nuevaPosicion].estado=="Nocomprable"){
							console.log("compro la calle")
							tablero.casillas[nuevaPosicion].alquiler(ficha);
						}
					
				}
				
				
				
						
		}
		return nuevaPosicion
		
	} 



	this.iralacarcel = function(ficha){
		ficha.setPosicion(10);
		ficha.carcel=true;
		console.log("vas a la carcel")
	}

}


function Tablero(numeroCasillas){
	this.casillas=[]
	this.numeroCasillas=numeroCasillas
	this.agregarCasilla=function(posicion, casilla) {
		this.casillas[posicion]=casilla
	}
	this.iniciarTablero=function(){
		for (i=0;i<numeroCasillas;i++){
			this.casillas[i]=new Casilla(new inicio())
		}
	}
	this.configurarTablero=function(){
		
		//esquinas
		
		this.agregarCasilla(0,new Casilla(new Salida()))
		this.agregarCasilla(10,new Casilla(new Carcel()))
		this.agregarCasilla(20,new Casilla(new Parking()))
		this.agregarCasilla(30,new Casilla(new Ircarcel()))
		
		//comunidad y suerte
		
		this.agregarCasilla(2,new Casilla(new Caja()))
		this.agregarCasilla(17,new Casilla(new Caja()))
		this.agregarCasilla(33,new Casilla(new Caja()))
		this.agregarCasilla(7,new Casilla(new Suerte()))
		this.agregarCasilla(22,new Casilla(new Suerte()))
		this.agregarCasilla(36,new Casilla(new Suerte()))
		
		//impuestos
		
		this.agregarCasilla(4,new Casilla(new Impuesto(200)))
		this.agregarCasilla(38,new Casilla(new Impuesto(100)))		
		
		//estaciones y compañias
		
		this.agregarCasilla(12,new Casilla(new Compania("Compañia de Electricidad",150)))
		this.agregarCasilla(28,new Casilla(new Compania("Compañia del Agua",150)))
		this.agregarCasilla(5,new Casilla(new Estacion("Estacion de Goya",200)))
		this.agregarCasilla(15,new Casilla(new Estacion("Estacion de las Delicias",200)))
		this.agregarCasilla(25,new Casilla(new Estacion("Estacion del medio dia",200)))
		this.agregarCasilla(35,new Casilla(new Estacion("Estacion del Norte",200)))
		
		//calles
			
		
		this.agregarCasilla(1,new Casilla(new Calle("Ronda de Valencia",60, "Marron")))
		this.agregarCasilla(3,new Casilla(new Calle("Plaza Lavapies",60, "Marron")))
		this.agregarCasilla(6,new Casilla(new Calle("Glorieta Cuatro Caminos",100, "AzulCielo")))
		this.agregarCasilla(8,new Casilla(new Calle("Avenida Reina Victoria",100, "AzulCielo")))
		this.agregarCasilla(9,new Casilla(new Calle("Calle Bravo Murillo",120, "AzulCielo")))
		this.agregarCasilla(11,new Casilla(new Calle("Glorieta de Bilbao",140, "Rosa")))
		this.agregarCasilla(13,new Casilla(new Calle("Calle Alberto Aguilera",140, "Rosa")))
		this.agregarCasilla(14,new Casilla(new Calle("Calle Fuencarral",160, "Rosa")))
		this.agregarCasilla(16,new Casilla(new Calle("Avenida Felipe II",180, "Naranja")))
		this.agregarCasilla(18,new Casilla(new Calle("Calle Velazquez",180, "Naranja")))
		this.agregarCasilla(19,new Casilla(new Calle("Calle Serrano",200, "Naranja")))
		this.agregarCasilla(21,new Casilla(new Calle("Avenida de America",220, "Rojo")))
		this.agregarCasilla(23,new Casilla(new Calle("Calle Maria de Molina",220, "Rojo")))
		this.agregarCasilla(24,new Casilla(new Calle("Calle Cea Bermudez",240, "Rojo")))
		this.agregarCasilla(26,new Casilla(new Calle("Avenida de los Reyes Catolicos",260, "Amarillo")))
		this.agregarCasilla(27,new Casilla(new Calle("Calle Bailen",260, "Amarillo")))
		this.agregarCasilla(29,new Casilla(new Calle("Plaza de Espana",280, "Amarillo")))
		this.agregarCasilla(31,new Casilla(new Calle("Puerta del sol",300, "Verde")))
		this.agregarCasilla(32,new Casilla(new Calle("Puerta Alcala",300, "Verde")))
		this.agregarCasilla(34,new Casilla(new Calle("Gran Via",320, "Verde")))
		this.agregarCasilla(37,new Casilla(new Calle("Paseo de la Castellana",350, "AzulOscuro")))
		this.agregarCasilla(39,new Casilla(new Calle("Paseo del Prado",400, "AzulOscuro")))
	
	this.iniciartarjetas = function(){
	
	}  
	
	
	}
	this.obtenerCasilla=function(posicion){
		return this.casillas[posicion]
	}
	this.obtenerPosicion=function(tema){
		for(i=0;i<this.numeroCasillas;i++){
			casilla=this.casillas[i]
			if (casilla.tema.nombre==tema) {
				return i
			}
		}
		return -1
	}
	this.iniciarTablero()
}
function Casilla(tema){
	this.tema=tema
	this.obtenerTema=function(){
		return this.tema
	}
}

function Dado(){
     this.calcularNumero=function(){
        return Math.round(Math.random()*5)+1;
     }
}



function Jugador(nombre){
		this.nombre = nombre
		this.fichas = []

		this.unirseAPartida = function(partida){
			var ficha = partida.crearFicha(this)
			if (ficha){
				this.fichas.push(ficha)
				return true
			}
			else
				return false
		}
}

function Ficha(Jugador, partida, color){
		this.Jugador = Jugador
		this.partida = partida
		this.turno = false
		this.carcel = false
		this.turnocarcel = 0
		this.tarjetasalircarcel = false
		this.color = color
		this.saldo = 1500
		this.posicion = 0
		this.volveratirar = 0
		this.propiedades = []
		this.numpropiedades = 0
		this.Posesiongrupo = []
		this.getSaldo = function(){return this.saldo}
		this.getPosicion = function(){return this.posicion}
		this.setPosicion = function(numCasilla){this.posicion = numCasilla}

		this.agregarpropiedad=function(tipo, nombre, color){
			var propiedad = [tipo,nombre,color]
			this.propiedades.push(propiedad);
			this.numpropiedades++
		}
		
		this.IniciarPosesionGrupo=function(){
			this.Posesiongrupo[0]= partida.grupocalle("Marron",0)
			this.Posesiongrupo[1]= partida.grupocalle("AzulCielo",0)
			this.Posesiongrupo[2]= partida.grupocalle("Rosa",0)
			this.Posesiongrupo[3]= partida.grupocalle("Naranja",0)
			this.Posesiongrupo[4]= partida.grupocalle("Rojo",0)
			this.Posesiongrupo[5]= partida.grupocalle("Amarillo",0)
			this.Posesiongrupo[6]= partida.grupocalle("Verde",0)
			this.Posesiongrupo[7]= partida.grupocalle("AzulOscuro",0)
		}
		
		this.agregaralgrupo=function(color){
			var i = this.Posesiongrupo.indexof(color)
			this.Posesiongrupo[i].posesion++;
		}
		
		this.obtenerjugador=function(){
			return this.Jugador
		}
		
		this.pasarsalida=function(){
			this.saldo=this.cobrar(200)
			this.partida.quitarfondosBanco(200)
			console.log("cobre 200 pelotis por pasar por salida")
		}
		
		this.lanzarDados = function(){
			var pagarcarcel = true //quiere pagar para salir de la carcel
			var tirada = this.partida.lanzarDados()
			var resultado = tirada[0] + tirada[1]
		//	this.partida.moverFicha(this, resultado)
			
			if (!this.carcel) { //no esta en la carcel
				
				if (tirada[0] == tirada[1]) {
					if (this.volveratirar < 2) {
						this.volveratirar++
						tirada = this.partida.lanzarDados()
						this.partida.moverFicha(this,resultado)
					}
					else { //vas a la carcel por tirar 3 dobles
						//vas a la carcel
						this.volveratirar = 0
						this.partida.iralacarcel(this);
						this.partida.pasarturno();
					}
				}	
				else {//no es doble
					this.volveratirar = 0;
					this.partida.moverFicha(this,resultado);
					this.partida.pasarturno();
				}
			}	
			else { //estas en la carcel
				if (tirada[0] == tirada[1]){ //estas en la carcel, sacas dobles , sales
					this.carcel=false;
					this.turnocarcel = 0;
					this.partida.moverFicha(this,resultado);
					this.partida.pasarturno();
					
				}
				else
					if (this.tarjetasalircarcel) { //estas en la carcel y sales por tener tarjeta de salir de la carcel
							this.tarjetasalircarcel = false;
							this.carcel = false;
							this.turnocarcel = 0;	
							this.partida.moverFicha(this,resultado);
							this.partida.pasarturno();
												
					}
					else
						if ((this.turnocarcel = 3) || pagarcarcel){ //llevas 3 turnos en la carcel o decides pagar
							this.pagar(50);
							this.partida.agregarfondosBanco(50);
							this.partida.moverFicha(this, resultado);
							this.partida.pasarturno();
						}
						else { //sigues esperando en la carcel
							this.turnocarcel++;
							this.partida.pasarturno();
						}
			}
		return tirada
		} 
			
		this.pagar = function(cantidad){
			this.saldo = this.saldo - cantidad
			return this.saldo
		}

		this.cobrar = function(cantidad){
			this.saldo = this.saldo + cantidad
			return this.saldo
		}
}

function titulocalle(precio){
	this.alquiler 
	this.hipoteca 
	this.casa 
	this.hotel 
	this.numcasas=0
	
	this.iniIitulo=function(precio,tipo){
		this.alquiler=(precio*0.05)+(precio*0.05*this.numcasas)
			this.hipoteca=precio*0.5
			this.casa=precio*0.5
			this.hipoteca=precio*2.5
	}	
	
	this.Edificarcasa=function(ficha){
		var indiceposesion = ficha.Posesiongrupo.indexof(this.color)
		var indicegrupo = Partida.grupocalles.indexof(this.color)
		var indicecasilla = 0
		var casitas = 0
		if (ficha.Posesiongrupo[indiceposesion].tamano == Partida.grupocalles[indicegrupo].tamano){
			
			console.log("tiene todas las propiedades del grupo");
			for (i=0;i<ficha.numpropiedades;i++){
				if (this.color == ficha.propiedades[i].color){
					console.log ("una propiedad del mismo grupo")
					indicecasilla = Tablero.obtenerPosicion(ficha.propiedades[i].nombre);
					if (casillas[indicecasilla].titulo.numcasas == this.numcasas){ //comparo el numero de casas que tiene ese titulo
						casitas++
						
					}
					
				}
			}
			if (casitas == Partida.grupocalles[indicegrupo].tamano){
				console.log("todas la calles del grupo tienen el mismo numero de casas")
				if (this.numcasas=4){
					console.log("no puedes edificar mas")
				}
				else{
					if (Partida.maxcasas>0){
						console.log("quedan casas por edificar")
						console.log("puedes edificar una casa mas")
						this.numcasas++
						ficha.pagar(this.casa);
						Partida.agregarfondosBanco(this.casa);
						Partida.maxcasas--
					}
					else
						console.log("no quedan casas paa construir")
				}
	
			}
		}
	} 
	
/	this.Edificarhotel=function(ficha){
		if (this.numcasas = 4) {
			console.log ("puedes edificar hotel")
			if (Partida.maxhoteles>0) {
				console.log("hay hoteles para construir")
				this.hoteles = 1
				this.casa = 0
				Partida.maxhoteles--;
			}
			else
				console.log("no quedan hoteles para construir")
		}
	}

} 

function tituloestacion(precio){
	this.alquiler 
	this.hipoteca 
	this.numestaciones	= 0
	this.iniIitulo=function(precio,tipo){
		this.buscarestaciones(ficha)
		this.alquiler=(precio*0.05)+(precio*0,05*this.numestaciones)
		this.hipoteca=precio*0.5
		}
}
	this.buscarestaciones=function(ficha){
		var estaciones = 0;
		for (i=0; i<ficha.numpropiedades;i++){
			if (ficha.propiedades[i].tipo="Estacion"){
				estaciones++
			}
		}
		this.numestaciones=estaciones
	} 

	
function inicio(){
	this.nombre="Normal"
}
function Salida(){
	this.nombre="Salida"
}
function Suerte(){
	this.nombre="Suerte"
}
function Estacion(nombre,precio){
	this.tipo="Estacion"
	this.nombre=nombre
	this.precio=precio
	this.estado="libre"
	this.propietario= new Jugador("nadie")
	this.titulo=new tituloestacion(this.precio)
	
	this.comprar=function(ficha){
		if (ficha.pagar(this.precio)<0) {
			console.log("No tienes saldo para comprar")
			return false
		}
		else { 
			ficha.pagar(this.precio);
			ficha.agregarpropiedad(this.nombre);
			this.propietario=ficha.Jugador;
			this.estado="Nocomprable"
			this.titulo.numestaciones++
			console.log("Acabas de comprar esta estación")
			return true
			
		}
	}
	
	this.alquiler=function(ficha){
		
		var pago=this.titulo(this.precio).alquiler
		
		ficha.saldo=ficha.pagar(pago)
		console.log("el jugador paga el alquiler")
		Partida.buscarjugador(this.propietario).cobrar(pago)
		console.log("el propietario cobra el alquiler")
	}
}

function Calle(nombre, precio, color){
	this.tipo="Calle"
	this.nombre=nombre
	this.precio=precio
	this.color=color
	this.titulo=new titulocalle(this.precio)
	this.estado="libre"
	this.propietario= new Jugador("nadie")
	
	this.comprar=function(ficha){
		if (ficha.pagar(this.precio)<0) {
			console.log("No tienes saldo para comprar")
			return false
		}
		else { 
			ficha.pagar(this.precio);
			ficha.agregarpropiedad(this.tipo,this.nombre,this.color);
			this.propietario=ficha.Jugador;
			this.estado="Nocomprable"
			console.log("Acabas de comprar esta calle")
			return true
			
		}
	}
	
	this.alquiler=function(ficha){
		var pago=this.titulo(this.precio).alquiler
		
		ficha.saldo=ficha.pagar(pago)
		console.log("el jugador paga el alquiler")
		Partida.buscarjugador(this.propietario).cobrar(pago)
		console.log("el propietario cobra el alquiler")
	}
	

function Carcel(){
	this.nombre="Carcel"
}
function Ircarcel(){
	this.nombre="Ir a la carcel"
}


function Compania(nombre,precio){
	this.nombre=nombre
	this.precio=precio
}

function Impuesto(precio){
	this.nombre="Impuesto"
	this.precio=precio
}
function Caja(){
	this.nombre="Caja de Comunidad"
}

function Parking(){
	this.nombre="Parking"
}




function iniJuego(){
	tablero = new Tablero(40)
	tablero.configurarTablero()
}