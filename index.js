if (Modernizr.geolocation) {

    var listo = false;
    var colecciones = {};
    var copia_hoteles;
    var hoteles_mapa = {};
    var marc_hotel = false;
    var coleccion_usuarios = {};
    var hotel_actual = "";
    var ApiKey = "AIzaSyC5hQk4LZTwNNfMJoYXYiUIZL94sWipgXk";
    var col_hotel = false;

    function show_accomodation(){

        if (marc_hotel == false){
            var accomodation = accomodations[$(this).attr('no')];
            hoteles_mapa[accomodation.basicData.name] = $(this).attr('no');
        }else{
            var cont_pop = $('#map2').text();
            cont_pop = cont_pop.split("Ver descripcion");
            var nom = "";
            for (i = 1; i < cont_pop[0].length; i++) {
                nom += cont_pop[0][i];
            }

            var num_hotel = hoteles_mapa[nom];
            var accomodation = accomodations[num_hotel];
        }

      var lat = accomodation.geoData.latitude;
      var lon = accomodation.geoData.longitude;
      var url = accomodation.basicData.web;
      var name = accomodation.basicData.name;
      hotel_actual = accomodation.basicData.name;
      var desc = accomodation.basicData.body;
      var img = [];
      for (var i=0; i < accomodation.multimedia.media.length; i++ ){
        img.push(accomodation.multimedia.media[i].url);
      }
      var cat = accomodation.extradata.categorias.categoria.item[1]['#text'];
      var subcat = accomodation.extradata.categorias.categoria
       .subcategorias.subcategoria.item[1]['#text'];
      $("#hoteles").show();
      $("#hoteles_alojados").show();
      L.marker([lat, lon]).addTo(map)
    	 .bindPopup('<a href="' + url + '">' + name + '</a><br/>' + '<button id = "boton_mapa" value = "'+name+'">Ver descripcion</button>')
    	 .openPopup();
      map.setView([lat, lon], 15);
      $('#info_hotel').html('<h2>' + name + '</h2>'
       + '<p>Type: ' + cat + ', subtype: ' + subcat + '</p>'
       + desc);
       $('#info_hotel_2').html('<h2>' + name + '</h2>'
        + '<p>Type: ' + cat + ', subtype: ' + subcat + '</p>'
        + desc);

       $(".carousel-indicators").empty();
       $(".carousel-inner").empty();
       if(img.length != 0){
         $(".carousel-indicators").show();
         $(".carousel-inner").show();
         for (var i=0; i < img.length; i++ ){
           if(i==0){
             $(".carousel-indicators").append("<li data-target='#myCarousel' data-slide-to='" + i + "' class='active'></li>");
             $(".carousel-inner").append("<div class='item active'><img src='"+ img[i] +"'></div>");
           }else{
             $(".carousel-indicators").append("<li data-target='#myCarousel' data-slide-to='" + i + "'></li>");
             $(".carousel-inner").append("<div class='item'><img src='"+ img[i] +"'></div>");
           }
         }
       }else{
         $(".carousel-indicators").hide();
         $(".carousel-inner").hide();
       }
    };

    function get_accomodations(){
      $.getJSON("alojamientos.json", function(data) {
        $("#guardar").show();
        $("#cargar").show();
        $("#boton_formulario_guardar_user").show();
        $("#boton_formulario_cargar_user").show();

        listo = true;
        $("#tabs").show();
        accomodations = data.serviceList.service
        $('#list').after('<h1>' + accomodations.length + '</h1>');
        var list = '<p>Hoteles encontrados: ' + accomodations.length + '</p>'
        list = list + '<ul>'
        var list2 = '<div><ul>'
        for (var i = 0; i < accomodations.length; i++) {
          list = list + '<li no=' + i + '>' + accomodations[i].basicData.title + '</li>';
          list2 = list2 + '<li>' + accomodations[i].basicData.title + '</li>';
        }
        list = list + '<div></ul>';
        list2 = list2 + '</ul></div>';
        $('#list').html(list);
        $('#catalog').html(list2);
        $("#catalog *").draggable({stack: "#hotel", revert: true,scroll:false });
        $('#pagina_principal li').click(show_accomodation);
        $('#map2').on('click', '#boton_mapa', function() {
            marc_hotel = true;
            show_accomodation();
            marc_hotel = false;
        });
        $("#buttonmsg").hide();

        $( "#hotel ol" ).droppable({
          activeClass: "ui-state-default",
          hoverClass: "ui-state-hover",
          accept: ":not(.ui-sortable-helper)",
          drop: function( event, ui ) {
            $( this ).find( ".placeholder" ).remove();
            $( "<li></li>" ).text( ui.draggable.text() ).appendTo( this );
          }
        }).sortable({
          items: "li:not(.placeholder)",
          sort: function() {
            $( this ).removeClass( "ui-state-default" );
          }
        });
      });
    };

};

$(document).ready(function() {

    $("#tabs").hide();
    $("#hotel").hide();
    $("#hotel_col").hide();
    $("#coleccion").hide();
    $("#formulario_guardar").hide();
    $("#formulario_cargar").hide();
    $("#guardar").hide();
    $("#cargar").hide();
    $("#boton_formulario_guardar_user").hide();
    $("#boton_formulario_cargar_user").hide();
    $(function() {
        $( "#tabs" ).tabs();
    });

    map = L.map('map2').setView([40.4175, -3.708], 11);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    function makeApiCall(id_google){

        gapi.client.setApiKey(ApiKey);
        gapi.client.load('plus','v1', function(){
            var request = gapi.client.plus.people.get({
                'userId': id_google,
            });
            request.execute(function(resp){
                if(resp.displayName == undefined){
                    alert("El usuario no se encuentra en google +")
                }else if(coleccion_usuarios[hotel_actual].indexOf(id_google) == -1){
                    $("#user_google").html($("#user_google").html() + "<li>" + resp.displayName + "<img src ='" + resp.image.url + "'></img>");
                    coleccion_usuarios[hotel_actual] = $("#user_google").html();
                }else{
                    alert("Este usuario ya esta en la lista");
                }
            });
        });
        console.log(coleccion_usuarios);
    };


    $("#boton_google").click(function(){
        var id_google = $("#nombre_google").val();
        if (coleccion_usuarios[hotel_actual] == undefined && hotel_actual != ""){
                coleccion_usuarios[hotel_actual] = [];
        }
        makeApiCall(id_google);
    });

    $(".boton_guardar_user").click(function(){
        $("#formulario_guardar").show();
        $("#formulario_cargar").hide();
        $("#guardar").hide();
        $("#cargar").hide();
        col_hotel = false;
    });

    $(".boton_cargar_user").click(function(){
        $("#formulario_guardar").hide();
        $("#formulario_cargar").show();
        $("#guardar").hide();
        $("#cargar").hide();
        col_hotel = false;
    });

    $(".boton_guardar").click(function(){
        $("#formulario_guardar").show();
        $("#formulario_cargar").hide();
        $("#boton_formulario_guardar_user").hide();
        $("#boton_formulario_cargar_user").hide();
        col_hotel = true;
    });

    $("#boton_formulario_guardar").click(function(){
        if (col_hotel == true){
            var archivo = JSON.stringify(colecciones);
        }else{
            var archivo = unescape(encodeURIComponent(JSON.stringify(coleccion_usuarios)));
        }

        $("#boton_formulario_guardar_user").show();
        $("#boton_formulario_cargar_user").show();
        $("#guardar").show();
        $("#cargar").show();
        var id_token = $("#id_token").val();
        var repo_token = $("#repo_token").val();
        var fich_token = $("#fich_token").val();
        var user_token = $("#user_token").val();
        var git = new Github({token:id_token,auth:"oauth"});
        var repo_git_guardar = git.getRepo(user_token,repo_token);
        repo_git_guardar.write('master', fich_token,archivo,'subida prueba 1', function(err){});
        $("#formulario_guardar").hide();
    });

    $(".boton_cargar").click(function(){
        $("#formulario_cargar").show();
        $("#formulario_guardar").hide();
        $("#boton_formulario_guardar_user").hide();
        $("#boton_formulario_cargar_user").hide();
        col_hotel = true;
    });

    $("#boton_formulario_cargar").click(function(){

        $("#guardar").show();
        $("#cargar").show();
        $("#boton_formulario_guardar_user").show();
        $("#boton_formulario_cargar_user").show();

        var id_token_2 = $("#id_token_2").val();
        var url_token_2 = $("#url_token_2").val();
        var user_token_2 = $("#user_token_2").val();
        $("#formulario_cargar").hide();
        var git = new Github({token:id_token_2,auth:"oauth"});
        url = url_token_2.split("/");
        var repo_git_guardar = git.getRepo(user_token_2,url[3]);
        url = "http://api.github.com/repos/" + user_token_2 + "/" + url[3] + "/contents/" + url[4];
        $.getJSON(url)
            .done(function(data){
                var texto = JSON.parse(decodeURIComponent(escape(atob(data.content))));
                if (col_hotel == true){
                    $(".coleccion_act").html('<p id="list_col"></p>');
                    $("#caja_mis_col").html("<ul></ul>");
                    $("#hoteles_coleccion").html("<h1>Hoteles de la coleccion</h1><div id='caja_mis_col2'><li>Listado de hoteles de la coleccion actual</li><ul></ul></div>");

                    colecciones = {};
                    
                    $.each(texto,function(key,value){
                        colecciones[key] = value;

                        $("#caja_mis_col ul").html($("#caja_mis_col ul").html() + "<li>" + key + "</li>");

                    })

                    $("#caja_mis_col").click(function(event){
                        var coll = event.target.textContent;
                        $("#caja_mis_col2 ul").html(colecciones[coll]);
                        $('#list_col').html(colecciones[coll]);
                    });
                }else{
                    coleccion_usuarios = {};
                    console.log(texto);
                    $.each(texto,function(key,value){
                        coleccion_usuarios[key] = value;
                        console.log(coleccion_usuarios);
                    })
                }

            });
    });

    $("#buttonmsg").click(get_accomodations);

    copia_hoteles = $("#guardar_hoteles").html();

    $(".botones").click(function(){
        if ($(this).attr('id') == "inicio"){
          $("#pagina_principal").show();
      	  $("#pagina_colecciones").hide();
          $("#pagina_alojamientos").hide();

      } else if ($(this).attr('id') == "colecciones" && listo == true){
          $("#pagina_principal").hide();
      	  $("#pagina_colecciones").show();
          $("#hoteles_cargados").hide();
          $("#hotel").show();
          $("#coleccion").show();
          $("#hotel_col").show();
      }else if ($(this).attr('id') == "alojamientos" && listo == true){
          $("#pagina_principal").hide();
      	  $("#pagina_colecciones").hide();
          $("#hoteles_cargados").hide();
          $("#hotel").hide();
          $("#coleccion").hide();
          $("#hotel_col").hide();
          $("#pagina_alojamientos").show();
          $("#hoteles_alojados").show();

          if (coleccion_usuarios[hotel_actual]==undefined){
              $("#user_google").html("");
          }else{
              $("#user_google").html(coleccion_usuarios[hotel_actual]);
          }

      }else if ($(this).attr('id') == "colecciones" || $(this).attr('id') == "alojamientos" && listo == false){
          $("#pagina_principal").hide();
      	  $("#pagina_colecciones").show();
          $("#hoteles_cargados").show();
      };

    });

    $(function() {
        $( "#catalog" ).accordion();
        $( "#catalog li" ).draggable({
          appendTo: "body",
          helper: "clone"
    });

    $("#boton_col").click(function(){
        //nombre de la lista
        var nombre = $("#nombre_col").val();
        //printeo el nombre en la caja
        if (nombre != "" && colecciones[nombre] == null){
            $("#caja_mis_col ul").append("<li>" + nombre + "</li>");
            //guardo el codigo html de la caja
            var lista_html = $("#guardar_hoteles").html();
            //dejo la caja como estaba
            $("#guardar_hoteles").html(copia_hoteles);
            $( "#hotel ol" ).droppable({
              activeClass: "ui-state-default",
              hoverClass: "ui-state-hover",
              accept: ":not(.ui-sortable-helper)",
              drop: function( event, ui ) {
                $( this ).find( ".placeholder" ).remove();
                $( "<li></li>" ).text( ui.draggable.text() ).appendTo( this );
              }
            }).sortable({
              items: "li:not(.placeholder)",
              sort: function() {
                $( this ).removeClass( "ui-state-default" );
              }
            });
            //guardo el codigo html de la lista en su sitio
            colecciones[nombre] = lista_html;
            //si hago click en el nombre miro el contenido de esa coleccion y la copio a la caja de la derecha
            $("#caja_mis_col").click(function(event){
                var coll = event.target.textContent;
                $('#list_col').html(colecciones[coll]);
                $("#caja_mis_col2 ul").html(colecciones[coll]);
            });
        };
    });
  });
});
