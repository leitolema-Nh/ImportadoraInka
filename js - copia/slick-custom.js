(function ($) {
    "use strict";

    // ✅ ESPERAR A QUE EL DOM Y TODOS LOS RECURSOS ESTÉN COMPLETAMENTE LISTOS
    $(window).on('load', function() {
        
        console.log('🎠 Inicializando Slick Carousels...');
        
        /*==================================================================
        [ Slick1 ]*/
        $('.wrap-slick1').each(function(){
            var wrapSlick1 = $(this);
            var slick1 = $(this).find('.slick1');
            var itemSlick1 = $(slick1).find('.item-slick1');
            var layerSlick1 = $(slick1).find('.layer-slick1');
            var actionSlick1 = [];
            
            // ✅ VALIDAR QUE EXISTAN SLIDES ANTES DE INICIALIZAR
            if (itemSlick1.length === 0) {
                console.warn('⚠️ No hay slides para inicializar Slick1');
                return;
            }

            $(slick1).on('init', function(){
                var layerCurrentItem = $(itemSlick1[0]).find('.layer-slick1');
                
                for(var i=0; i<actionSlick1.length; i++) {
                    clearTimeout(actionSlick1[i]);
                }

                $(layerSlick1).each(function(){
                    $(this).removeClass($(this).data('appear') + ' visible-true');
                });

                for(var i=0; i<layerCurrentItem.length; i++) {
                    actionSlick1[i] = setTimeout(function(index) {
                        $(layerCurrentItem[index]).addClass($(layerCurrentItem[index]).data('appear') + ' visible-true');
                    },$(layerCurrentItem[i]).data('delay'),i); 
                }        
            });

            var showDot = false;
            if($(wrapSlick1).find('.wrap-slick1-dots').length > 0) {
                showDot = true;
            }

            $(slick1).slick({
                pauseOnFocus: false,
                pauseOnHover: false,
                slidesToShow: 1,
                slidesToScroll: 1,
                fade: true,
                speed: 1000,
                infinite: true,
                autoplay: true,
                autoplaySpeed: 6000,
                arrows: true,
                appendArrows: $(wrapSlick1),
                prevArrow:'<button class="arrow-slick1 prev-slick1"><i class="zmdi zmdi-caret-left"></i></button>',
                nextArrow:'<button class="arrow-slick1 next-slick1"><i class="zmdi zmdi-caret-right"></i></button>',
                dots: showDot,
                appendDots: $(wrapSlick1).find('.wrap-slick1-dots'),
                dotsClass:'slick1-dots',
                customPaging: function(slick, index) {
                    var linkThumb = $(slick.$slides[index]).data('thumb');
                    var caption = $(slick.$slides[index]).data('caption');
                    
                    // ✅ VALIDAR QUE linkThumb NO SEA UNDEFINED O VACÍO
                    if (!linkThumb || linkThumb === 'undefined' || linkThumb === '') {
                        linkThumb = (window.CONFIG && window.CONFIG.imagesPath) 
                            ? window.CONFIG.imagesPath + 'default.jpg' 
                            : '/images/default.jpg';
                    }
                    
                    // ✅ AGREGAR FALLBACK EN CASO DE ERROR DE CARGA
                    var fallbackImg = (window.CONFIG && window.CONFIG.imagesPath) 
                        ? window.CONFIG.imagesPath + 'default.jpg' 
                        : '/images/default.jpg';
                    
                    return  '<img src="' + linkThumb + '" onerror="this.src=\'' + fallbackImg + '\'">' +
                            '<span class="caption-dots-slick1">' + (caption || '') + '</span>';
                },
            });

            $(slick1).on('afterChange', function(event, slick, currentSlide){ 
                var layerCurrentItem = $(itemSlick1[currentSlide]).find('.layer-slick1');

                for(var i=0; i<actionSlick1.length; i++) {
                    clearTimeout(actionSlick1[i]);
                }

                $(layerSlick1).each(function(){
                    $(this).removeClass($(this).data('appear') + ' visible-true');
                });

                for(var i=0; i<layerCurrentItem.length; i++) {
                    actionSlick1[i] = setTimeout(function(index) {
                        $(layerCurrentItem[index]).addClass($(layerCurrentItem[index]).data('appear') + ' visible-true');
                    },$(layerCurrentItem[i]).data('delay'),i); 
                }         
            });

        });

        /*==================================================================
        [ Slick2 ]*/
        $('.wrap-slick2').each(function(){
            var items = $(this).find('.slick2 > *');
            
            // ✅ VALIDAR QUE EXISTAN ITEMS
            if (items.length === 0) {
                console.warn('⚠️ No hay items para inicializar Slick2');
                return;
            }
            
            $(this).find('.slick2').slick({
              slidesToShow: 4,
              slidesToScroll: 4,
              infinite: false,
              autoplay: false,
              autoplaySpeed: 6000,
              arrows: true,
              appendArrows: $(this),
              prevArrow:'<button class="arrow-slick2 prev-slick2"><i class="fa fa-angle-left" aria-hidden="true"></i></button>',
              nextArrow:'<button class="arrow-slick2 next-slick2"><i class="fa fa-angle-right" aria-hidden="true"></i></button>',  
              responsive: [
                {
                  breakpoint: 1200,
                  settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4
                  }
                },
                {
                  breakpoint: 992,
                  settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3
                  }
                },
                {
                  breakpoint: 768,
                  settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                  }
                },
                {
                  breakpoint: 576,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                  }
                }
              ]    
            });
        });

        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
          var nameTab = $(e.target).attr('href'); 
          $(nameTab).find('.slick2').slick('reinit');          
        });      
        
        /*==================================================================
        [ Slick3 ]*/
        $('.wrap-slick3').each(function(){
            var slick3Items = $(this).find('.slick3 > *');
            
            // ✅ VALIDAR QUE EXISTAN ITEMS
            if (slick3Items.length === 0) {
                console.warn('⚠️ No hay items para inicializar Slick3');
                return;
            }
            
            $(this).find('.slick3').slick({
                slidesToShow: 1,
                slidesToScroll: 1,
                fade: true,
                infinite: true,
                autoplay: false,
                autoplaySpeed: 6000,
                arrows: true,
                appendArrows: $(this).find('.wrap-slick3-arrows'),
                prevArrow:'<button class="arrow-slick3 prev-slick3"><i class="fa fa-angle-left" aria-hidden="true"></i></button>',
                nextArrow:'<button class="arrow-slick3 next-slick3"><i class="fa fa-angle-right" aria-hidden="true"></i></button>',
                dots: true,
                appendDots: $(this).find('.wrap-slick3-dots'),
                dotsClass:'slick3-dots',
                customPaging: function(slick, index) {
                    var portrait = $(slick.$slides[index]).data('thumb');
                    
                    // ✅ VALIDAR QUE portrait NO SEA UNDEFINED O VACÍO
                    if (!portrait || portrait === 'undefined' || portrait === '') {
                        portrait = (window.CONFIG && window.CONFIG.imagesPath) 
                            ? window.CONFIG.imagesPath + 'default.jpg' 
                            : '/images/default.jpg';
                    }
                    
                    // ✅ AGREGAR FALLBACK EN CASO DE ERROR DE CARGA
                    var fallbackImg = (window.CONFIG && window.CONFIG.imagesPath) 
                        ? window.CONFIG.imagesPath + 'default.jpg' 
                        : '/images/default.jpg';
                    
                    return '<img src="' + portrait + '" onerror="this.src=\'' + fallbackImg + '\'"/><div class="slick3-dot-overlay"></div>';
                },  
            });
        });
        
        console.log('✅ Slick carousels inicializados correctamente');
    });

})(jQuery);