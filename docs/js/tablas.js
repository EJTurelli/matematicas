var tablas = {
    tiempoEntrePreguntas: 0,
    cantidadDePreguntas: 0,
    a: 0,
    b: 0,
    contadorDePreguntas: 0,
    contadorDeRespuestasOk: 0,
    respuesta: 0,
    tiempoDeInicio: 0,
    demora: 0,
    demorasPorTabla:[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    contadorDePreguntasPorTabla:[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    contadorDeRespuestasOkPorTabla:[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],

  	generoPregunta: function() {
        this.a = Math.floor((Math.random() * 8) + 2);
        this.b = Math.floor((Math.random() * 8) + 2);
        this.respuesta = this.a*this.b;
        this.tiempoDeInicio = (new Date()).valueOf();
    },

    comparoRespuesta: function(respuesta) {
        var t = 0;
        var salida = false;

        if (respuesta == (this.respuesta)) {
            salida = true;
            this.contadorDeRespuestasOk++;
            this.contadorDeRespuestasOkPorTabla[this.a]++;
            this.contadorDeRespuestasOkPorTabla[this.b]++;
        }

        this.contadorDePreguntas++;
        t = (new Date()).valueOf() - this.tiempoDeInicio;
        this.demora += t;

        this.contadorDePreguntasPorTabla[this.a]++;
        this.contadorDePreguntasPorTabla[this.b]++;
        this.demorasPorTabla[this.a] += t;
        this.demorasPorTabla[this.b] += t;

        this.a = 0;
        this.b = 0;

        return salida;
    },

    init: function() {
        $('#tablas').html('<h1>Tablas</h1>'
        + '<div class="form-group">'
        + '<input type="text" id="ingreso"/>'
        + '</div>'
        + '<div class="progress" id="divProgreso">'
        + '  <div class="progress-bar" id="progreso" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0</div>'
        + '</div>'
        + '<button type="button" id="botonComenzar" onsubmit="#" onclick="tablas.comenzar()">Comenzar</button>'
        + '<h3 id="resultado" role="alert"></h3>'
        + '<div id="estado"></div>');

        $('#ingreso').attr('class', 'form-control invisible');
        $('#divProgreso').attr('class', 'progress invisible');
        $('#botonComenzar').attr('class', 'btn btn-primary visible');   

        $('#ingreso').on('keypress', function(e){tablas.verificar(e)});             
    },

    comenzar: function() {
        this.tiempoEntrePreguntas = 2;
        this.cantidadDePreguntas = 20;
        this.a = 0;
        this.b = 0;
        this.contadorDePreguntas = 0;
        this.contadorDeRespuestasOk = 0;
        this.respuesta = 0;
        this.tiempoDeInicio = 0;
        this.demora = 0;
        this.demorasPorTabla = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.contadorDePreguntasPorTabla = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.contadorDeRespuestasOkPorTabla = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        $('#ingreso').attr('class', 'form-control visible');
        $('#divProgreso').attr('class', 'progress visible');
        $('#botonComenzar').attr('class', 'btn btn-primary invisible');   

        this.preguntar();
    },

    preguntar: function() {
        this.generoPregunta();

        $('#ingreso').val('');
        $('#resultado').attr('class', 'invisible');
        $('#estado').html('');
        $('#ingreso').attr('placeholder', this.a + " x " + this.b );
        $('#ingreso').focus();

        this.mostrarProgreso();
    },

    mostrarProgreso: function () {
        var porcentaje = (this.contadorDePreguntas/this.cantidadDePreguntas*100).toFixed(0);

        $('#progreso').attr('aria-valuenow', porcentaje);
        $('#progreso').attr('style', 'width: ' + porcentaje + '%;');
        $('#progreso').html(porcentaje + '%');
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
            setTimeout(function(){ $('#resultado').attr('class', 'invisible') }, this.tiempoEntrePreguntas*1000)
            
            $('#ingreso').attr('class', 'form-control invisible');
            $('#divProgreso').attr('class', 'progress invisible');
            $('#botonComenzar').attr('class', 'btn btn-primary visible');   

    
            tmp = '<h3>Resultado</h3><ul>' 
                + '<li>Correctas= ' + this.contadorDeRespuestasOk + "</li>" 
                + '<li>Incorrectas= ' + (this.contadorDePreguntas - this.contadorDeRespuestasOk)  + "</li>" 
                + '<li>Porcentaje= ' + (this.contadorDeRespuestasOk/this.contadorDePreguntas*100).toFixed(2) + "</li>"
                + '<li>Tiempo Promedio [seg]= ' + (this.demora/this.contadorDePreguntas/1000).toFixed(2) + "</li></ul>";

            tmp += '<p><table class="table table-hover"><thead>'
                + '<tr class="text-center"><th scope="col">Tabla</th><th scope="col">Correctas</th><th scope="col">Incorrectas</th><th scope="col">%</th><th scope="col">Tiempo Promedio</th></tr>'
                + '</thead><tbody>';

            for (i = 2; i < 10; i++) {

                if (this.contadorDePreguntasPorTabla[i]>0) {
                    tmp += ((this.contadorDePreguntasPorTabla[i] == this.contadorDeRespuestasOkPorTabla[i])?'<tr class="text-center">':'<tr class="table-danger text-center">')
                        + '<th scope="row">' + i + '</td> ' 
                        + '<td>' + this.contadorDeRespuestasOkPorTabla[i] + "</td>" 
                        + '<td>' + (this.contadorDePreguntasPorTabla[i] - this.contadorDeRespuestasOkPorTabla[i])  + "</td>" 
                        + '<td>' + (this.contadorDeRespuestasOkPorTabla[i]/this.contadorDePreguntasPorTabla[i]*100).toFixed(2) + "</td>"
                        + '<td>' + (this.demorasPorTabla[i]/this.contadorDePreguntasPorTabla[i]/1000).toFixed(2) + ' seg.</td>'
                        + '</tr>';
                }

            }            

            tmp += '</tbody></table>';

            $('#estado').html(tmp);

        }

    }


};