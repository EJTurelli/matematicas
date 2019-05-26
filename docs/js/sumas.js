var sumas = {
    minimo: 0,
    maximo: 0,
    tiempoEntrePreguntas: 0,
    cantidadDePreguntas: 0,
    a: [],
    b: [],
    contadorDePreguntas: 0,
    contadorDeRespuestasOk: 0,
    respuesta: 0,
    tiempoDeInicio: 0,
    demora: 0,

    preguntaRepetida: function () {
        for (i=0; i<this.contadorDePreguntas; i++) {
            if (this.a[this.contadorDePreguntas]== this.a[i]) {
                if (this.b[this.contadorDePreguntas]== this.b[i]) {
                    return true;
                }
            }
        }

        return false;
    },

  	generoPregunta: function() {
        do {
            this.a[this.contadorDePreguntas] = Math.floor((Math.random() * (this.maximo-this.minimo+1)) + this.minimo);
            this.b[this.contadorDePreguntas] = Math.floor((Math.random() * (this.maximo-this.minimo+1)) + this.minimo);
        } while (this.preguntaRepetida())

        this.respuesta = this.a[this.contadorDePreguntas]+this.b[this.contadorDePreguntas];
        this.tiempoDeInicio = (new Date()).valueOf();
    },

    comparoRespuesta: function(respuesta) {
        var t = 0;
        var salida = false;

        if (respuesta == (this.respuesta)) {
            salida = true;
            this.contadorDeRespuestasOk++;
        }

        t = (new Date()).valueOf() - this.tiempoDeInicio;
        this.demora += t;

        this.contadorDePreguntas++;

        return salida;
    },

    iniciar: function (minimo, maximo) {
        $('#opciones').addClass('d-none');

        this.tiempoEntrePreguntas = 2;
        this.cantidadDePreguntas = 10;

        $('#boton').on('click', function(){sumas.comenzar(minimo, maximo)});          
        $('#ingreso').on('keypress', function(e){sumas.verificar(e)});   
    
        this.comenzar(minimo, maximo);
    },

    comenzar: function(minimo, maximo) {
        this.minimo = minimo;
        this.maximo = maximo;
        this.a = [];
        this.b = [];
        this.contadorDePreguntas = 0;
        this.contadorDeRespuestasOk = 0;
        this.respuesta = 0;
        this.tiempoDeInicio = 0;
        this.demora = 0;

        $('#card-final').addClass('d-none');
        $('#divProgreso').removeClass('d-none');        
        $('#ingreso').removeClass('d-none');

        this.preguntar();
    },

    preguntar: function() {
        this.generoPregunta();

        $('#resultado').addClass('d-none');    

        $('#ingreso').val('');
        $('#ingreso').attr('placeholder', this.a[this.contadorDePreguntas] + " + " + this.b[this.contadorDePreguntas] );
        $('#ingreso').focus();

        this.mostrarProgreso();
    },

    mostrarProgreso: function () {
        var porcentaje = (this.contadorDePreguntas/this.cantidadDePreguntas*100).toFixed(0);

        $('#progreso').attr('aria-valuenow', porcentaje);
        $('#progreso').attr('style', 'width: ' + porcentaje + '%;');
    },

    verificar: function (e) {
        var tmp = '';
            
        tecla = (document.all) ? e.keyCode : e.which;
        if (tecla != 13) return;

        if (this.comparoRespuesta($('#ingreso').val())) {
            $('#resultado').html('CORRECTO !!!!');
            $('#resultado').attr('class', 'alert alert-success');
        }
        else {
            $('#resultado').html('ERROR !!!! (era ' + (this.respuesta) + ')');
            $('#resultado').attr('class', 'alert alert-danger');
        }
        
        if (this.contadorDePreguntas<this.cantidadDePreguntas) {
            setTimeout(function(){ sumas.preguntar() }, this.tiempoEntrePreguntas*1000)
        }
        else {
            setTimeout(function(){ sumas.mostrarFinal() }, this.tiempoEntrePreguntas*1000)
        }
    },

    mostrarFinal: function() {    
            
        $('#resultado').addClass('d-none');          
        $('#ingreso').addClass('d-none');       
        $('#divProgreso').addClass('d-none');      
 
        tmp = '<ul>' 
            + '<li>Correctas= ' + this.contadorDeRespuestasOk + "</li>" 
            + '<li>Incorrectas= ' + (this.contadorDePreguntas - this.contadorDeRespuestasOk)  + "</li>" 
            + '<li>Eficacia= ' + (this.contadorDeRespuestasOk/this.contadorDePreguntas*100).toFixed(2) + "%</li>"
            + '<li>Tiempo Promedio [seg]= ' + (this.demora/this.contadorDePreguntas/1000).toFixed(2) + "</li></ul>";

        $('#final').html(tmp);
        $('#card-final').removeClass('d-none');

    }


};