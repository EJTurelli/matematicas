var tablas = {
    tiempoEntrePreguntas: 0,
    cantidadDePreguntas: 0,
    a: [],
    b: [],
    contadorDePreguntas: 0,
    contadorDeRespuestasOk: 0,
    respuesta: 0,
    tiempoDeInicio: 0,
    demora: 0,
    demorasPorTabla:[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    contadorDePreguntasPorTabla:[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    contadorDeRespuestasOkPorTabla:[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],

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
            this.a[this.contadorDePreguntas] = Math.floor((Math.random() * 8) + 2);
            this.b[this.contadorDePreguntas] = Math.floor((Math.random() * 8) + 2);
        } while (this.preguntaRepetida())

        this.respuesta = this.a[this.contadorDePreguntas]*this.b[this.contadorDePreguntas];
        this.tiempoDeInicio = (new Date()).valueOf();
    },

    comparoRespuesta: function(respuesta) {
        var t = 0;
        var salida = false;

        if (respuesta == (this.respuesta)) {
            salida = true;
            this.contadorDeRespuestasOk++;
            this.contadorDeRespuestasOkPorTabla[this.a[this.contadorDePreguntas]]++;
            this.contadorDeRespuestasOkPorTabla[this.b[this.contadorDePreguntas]]++;
        }

        t = (new Date()).valueOf() - this.tiempoDeInicio;
        this.demora += t;

        this.contadorDePreguntasPorTabla[this.a[this.contadorDePreguntas]]++;
        this.contadorDePreguntasPorTabla[this.b[this.contadorDePreguntas]]++;
        this.demorasPorTabla[this.a[this.contadorDePreguntas]] += t;
        this.demorasPorTabla[this.b[this.contadorDePreguntas]] += t;

        this.contadorDePreguntas++;

        return salida;
    },

    iniciar: function () {
        $('#opciones').addClass('d-none');
        $('#zona').removeClass('d-none');

        this.tiempoEntrePreguntas = 2;
        this.cantidadDePreguntas = 20;

        $('#boton').on('click', function(){tablas.comenzar()});          
        $('#ingreso').on('keypress', function(e){tablas.verificar(e)});   
    
        this.comenzar();
    },

    comenzar: function() {
        this.a = [];
        this.b = [];
        this.contadorDePreguntas = 0;
        this.contadorDeRespuestasOk = 0;
        this.respuesta = 0;
        this.tiempoDeInicio = 0;
        this.demora = 0;
        this.demorasPorTabla = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.contadorDePreguntasPorTabla = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.contadorDeRespuestasOkPorTabla = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        $('#card-final').addClass('d-none');
        $('#divProgreso').removeClass('d-none');
        $('#ingreso').removeClass('d-none');
       
        this.preguntar();
    },

    preguntar: function() {
        this.generoPregunta();

        $('#resultado').addClass('d-none');        

        $('#ingreso').val('');
        $('#ingreso').attr('placeholder', this.a[this.contadorDePreguntas] + " x " + this.b[this.contadorDePreguntas] );
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
            setTimeout(function(){ tablas.preguntar() }, this.tiempoEntrePreguntas*1000)
        }
        else {
            setTimeout(function(){ tablas.mostrarFinal() }, this.tiempoEntrePreguntas*1000)
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

        tmp += '<div class="table-responsive"><table class="table table-hover"><thead>'
            + '<tr class="text-center"><th scope="col">Tabla</th><th scope="col">Eficacia</th><th scope="col">Tiempo Promedio</th></tr>'
            + '</thead><tbody>';

        for (i = 2; i < 10; i++) {

            if (this.contadorDePreguntasPorTabla[i]>0) {
                tmp += ((this.contadorDePreguntasPorTabla[i] == this.contadorDeRespuestasOkPorTabla[i])?'<tr class="table-success text-center">':'<tr class="table-danger text-center">')
                    + '<th scope="row">' + i + '</td>' 
                    + '<td>' + (this.contadorDeRespuestasOkPorTabla[i]/this.contadorDePreguntasPorTabla[i]*100).toFixed(2) + '% ('
                    + this.contadorDeRespuestasOkPorTabla[i] + '/' + (this.contadorDePreguntasPorTabla[i] - this.contadorDeRespuestasOkPorTabla[i]) + ')</td>'
                    + '<td>' + (this.demorasPorTabla[i]/this.contadorDePreguntasPorTabla[i]/1000).toFixed(2) + ' seg.</td>' 
                    + '</tr>';
            }

        }            

        tmp += '</tbody></table></div>';

        $('#final').html(tmp);
        $('#card-final').removeClass('d-none');

    }


};