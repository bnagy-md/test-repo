Interactivities = new Class({
    Implements: [Options, Events],
    Extends: MetrodigiWidget,
    options: {
        whole_page_toggle : false,
        whole_page_toggle_initial_index: 0,
        core_standard_popups : false,
        info : false,
        glossary : false,
        glossary_inside_info: false,
        glossary_inside_hotspot: false,
        gallery : false,
        widget_hotspot : false,
        accordion : false,
        csp_data : {
            type: 'text', //  [ text | image ]
            text: 'Lorem Ipsum',
            audio: 'path/to/mp3.mp3',
            image: 'path/to/image.jpg'
        },
        config_wiu_header : 'empty',
        scrollabe_page : false,
        vertical_tabs : false,
        zoom_loupe : false,
        science_in_a_snap: false,
        info_hotspots_overide:false

    },

    wpt_prevent_click : false,
    wpt_toggle_time : 800,
    current_wpt_page : null,

    audio_fallback : '<span class="err"><span>Sorry, it appears your system does not support audio playback.</span></span>',
    stopAudios : true,
    wps_prevent_click: false,
    sts_prevent_click: false,
    prevent_hotspot_close: false,
    prevent_hotspot_close_timer_flag : false,




// initialize - core functions initialization after getting config script
    initialize: function(options) {
        _this = this;
        this.parent(options);
        this.loadScript();

    },
    loadScript:function(){
        _this = this;

        var myScript = Asset.javascript('../Javascript/config.js', {
            id: 'myScript',
            events: {
                load: function(){

                    _this.config_wiu_header = config_wiu_header;
                    _this.config_wiu_header_audio_female = config_wiu_header_audio_female;
                    _this.config_wiu_header_audio_male = config_wiu_header_audio_male;
                    _this.config_wiu_header_share_compare = config_wiu_header_share_compare;

                    if(config_enable_dev_navigation){
                        _this.createDevelopmentNavigation();
                    }

                    _this.container = _this.options.container;

                    if(_this.options.widget_hotspot == true){
                        _this.initWidgetHotspot();
                    }
                    if(_this.options.section_toggle == true){
                        this.initSectionToggle();
                    }
                    if(_this.options.core_standard_popups == true){
                        _this.initCoreStandardPopUps();
                    }
                    if(_this.options.wiu == true){
                        _this.initWrapItUp();
                    }
                    if(_this.options.info == true){
                        _this.initInfo();
                    }
                    if(_this.options.tabs_on_page == true){
                        _this.initTabs();
                    }
                    if(_this.options.gallery == true){
                        _this.initGallery();
                    }
                    if(_this.options.page_hotspots == true){
                        _this.initPageHotspots();
                    }
                    if(_this.options.glossary == true){
                        _this.initGlossary();
                    }
                    if(_this.options.accordion == true){
                        _this.initAccordion();
                    }
                    if(_this.options.whole_page_scroll == true){
                        _this.initWholePageScroll();
                    }
                    if(_this.options.simple_text_scroll == true){
                        _this.initSimpleTextScroll();
                    }
                    if(_this.options.whole_page_toggle == true){
                        _this.initWholePageToggle();
                    }
                    if(_this.options.image_swap == true){
                        _this.initImageSwap();
                    }
                    if(_this.options.scrollabe_page == true){
                        _this.initScrollablePage();
                    }
                    if(_this.options.vertical_tabs == true){
                        _this.initVerticalTabs();
                    }
                    if(_this.options.zoom_loupe == true){
                        _this.initZoomLoupe();
                    }
                    if(_this.options.science_in_a_snap == true){
                        _this.initScienceInASnap();
                    }

                    _this.createImageOverlay();
                    _this.initMessaging();
                    _this.initAccessibility();
                    _this.initPageAudios();

                }
            }
        });
    },

    initScrollablePage : function(){
        _this = this;
        this.container.addClass('ScrollabePage');


        this.srollabePageUp = this.container.getElement('.scroll-up-btn');
        this.srollabePageDown = this.container.getElement('.scroll-down-btn');
        this.srollabePageUp.addClass('disabled');

        this.srollabePageUp.addClass('srollable-page-trigger');
        this.srollabePageDown.addClass('srollable-page-trigger');

        this.container.getElements('.srollable-page-trigger').addEvent(this.mouseDownEvent, function(e) {
            e.preventDefault();
            _this.scrollablePageScroll(e.target);
        }).addEvent(this.mouseUpEvent, function(e) {
            e.preventDefault();
            _this.stopPageScroll(e.target);
        });

        this.scrollable_page_image_height = this.container.getElement('.image-container img').getComputedSize().height;

        this.scrollable_page_current_scroll = 0;


        this.scrollable_page_interval_2 = setInterval(function(){
            _this.scrollable_page_image_height = _this.container.getElement('.image-container img').getComputedSize().height;
            scroll = _this.container.getElement('.image-container').getScroll().y;
            _this.srollabePageDown.removeClass('disabled');
            _this.srollabePageUp.removeClass('disabled');


            if(_this.scrollable_page_current_scroll != scroll){
                if(_this.prevent_hotspot_close == true){
                    if(_this.prevent_hotspot_close_timer_flag == true){
                        setTimeout(function(){
                            console.log('NOW' , _this.prevent_hotspot_close_timer_flag);
                            _this.prevent_hotspot_close = false;
                            _this.prevent_hotspot_close_timer_flag = false;
                            console.log('==================================');
                        },1);
                    }
                }else{
                    if(_this.options.page_hotspots == true){
                        _this.hideHotspots();
                    }
                }

                _this.scrollable_page_current_scroll = scroll;
            }
            if((_this.scrollable_page_image_height  - scroll) <= 640){
                _this.srollabePageDown.addClass('disabled');
                _this.srollabePageUp.removeClass('disabled');
            }else if(scroll == 0){
                _this.srollabePageDown.removeClass('disabled');
                _this.srollabePageUp.addClass('disabled');
            }
        },50)
    },
    stopPageScroll:function(button){
        clearInterval(this.scrollable_page_interval);
        if(this.options.page_hotspots){
            this.hideHotspots();
        }
    },
    scrollablePageScroll: function(button){

        if(button.hasClass('disabled')){
            return false;
        }
        if(this.options.page_hotspots){
            this.hideHotspots();
        }
        if(this.options.glossary){
            this.closeGlossaryTerms();
        }
        this.stopPageScroll();
        this.scrollabe_page_container = this.container.getElement('.image-container');

        if(button.hasClass('scroll-down-btn')){


            this.scrollable_page_interval = setInterval(function(){

                if((_this.scrollable_page_image_height  - _this.scrollabe_page_container.getScroll().y) <= 640){
                    _this.stopPageScroll();
                    _this.srollabePageDown.addClass('disabled');
                }
                _this.scrollabe_page_container.scrollTo(0, _this.scrollabe_page_container.getScroll().y + 3);

                if(_this.scrollabe_page_container.getScroll().y > 0){
                    _this.srollabePageUp.removeClass('disabled');
                }

            },1);

        }else if(button.hasClass('scroll-up-btn')){

            this.scrollable_page_interval = setInterval(function(){
                _this.scrollabe_page_container.scrollTo(0, _this.scrollabe_page_container.getScroll().y - 2);
                if(_this.scrollabe_page_container.getScroll().y == 0){
                    _this.srollabePageUp.addClass('disabled');
                }else{
                    _this.srollabePageDown.removeClass('disabled');
                }
            },1);

        }

    },
    createDevelopmentNavigation: function(){
        _this = this;
        pathArray = window.location.pathname.split( '/' );
        current_spread = pathArray[pathArray.length - 1];
        current_spread = current_spread.split('.')[0];


        if(current_spread.split('-')[0] == 'spread'){
            prefix = 'spread';
        }else if(current_spread.split('-')[0] == 'frontmatter'){
            prefix = 'frontmatter';
        }else if(current_spread.split('-')[0] == 'backmatter'){
            prefix = 'backmatter';
        }else{
            return false
        }

        prev_1 = parseInt(current_spread.split('-')[1]) - 2;
        prev_1 = (( prev_1 - 100) < 0 ) ? '0' + prev_1 : prev_1;
        if(parseInt(prev_1) < 10){prev_1 = '0' + prev_1;        }

        prev_2 = parseInt(current_spread.split('-')[1]) - 1;
        prev_2 = (( prev_2 - 100) < 0 ) ? '0' + prev_2 : prev_2;
        if(parseInt(prev_2) < 10){prev_2 = '0' + prev_2;}

        next_1 = parseInt(current_spread.split('-')[1]) + 2;
        next_1 = (( next_1 - 100) < 0 ) ? '0' + next_1 : next_1;
        if(parseInt(next_1) < 10){next_1 = '0' + next_1;}

        next_2 = parseInt(current_spread.split('-')[1]) + 3;
        next_2 = (( next_2 - 100) < 0 ) ? '0' + next_2 : next_2;
        if(parseInt(next_2) < 10){next_2 = '0' + next_2;}

        prev_link = prefix + '-' + prev_1 +'-'+ prev_2 + '.xhtml';
        next_link = prefix + '-' + next_1 +'-'+ next_2 + '.xhtml';

        new Element ('a.dev-nav-next',{
            html : 'NEXT',
            href : next_link
        }).inject(this.container);
        new Element ('a.dev-nav-prev',{
            html : 'PREV',
            href : prev_link
        }).inject(this.container);

        toc_iframe = new Element ('iframe.dev-iframe',{
            src : '../toc.xhtml'
        }).inject(this.container);

        this.dev_toc_container = new Element ('div.dev-toc-container').inject(this.container);

        toc_trigger = new Element ('a.dev-toc',{
            html : 'TOC'
        }).inject(this.container);

        toc_trigger.addEvent(this.clickEvent, function(){
            console.log('aca');
            _this.dev_toc_container.toggleClass('active');

        })



        setTimeout(function(){
            links = [].slice.call($$('iframe.dev-iframe')[0].contentDocument.querySelectorAll('a')) || [].slice.call($$('iframe.dev-iframe')[0].contentWindow.querySelectorAll('a'));
            _this.createDevTOC(links);

        },1000)

    },

    createDevTOC : function(links){
        _this = this;
        links.each(function(link, i){

            href = link.toString();
            href = href.split('/').getLast();
            new Element('a', {
                href: href,
                html: href

            }).inject(_this.dev_toc_container);
        })

    },


    respondCanvas: function(){
        // TODO: remove this
    },

    initMessaging: function() {
        var _this = this;

        window.addEventListener("message", function(message) {

            switch (message.data.method) {
                case 'stopAllAudios':
                    _this.stopAllAudios(true);
                    break;
                case 'hideInfo':
                    if(_this.options.info == true){
                        _this.hideInfo();
                    }
                    break;
                case 'closeGlossaryTerms':
                if(_this.options.glossary == true){
                        _this.closeGlossaryTerms();
                    }
                    break;
                default:
                    console.warn('interactivities.js', 'Unknown message received', message.data);
            }

        });
    },
    /*WHOLE PAGE TOGGLE */
    initWholePageToggle : function(){
        _this = this;
        this.container.addClass('WholePageToggle');

        this.imagesContainer = this.container.getElement('.toggle-image-container');

        this.toggleButtons = this.container.getElements('.toggle-button');

        this.wpt_images = this.container.getElements('.toggle-image-container img');
        this.wpt_images.each(function(image, i){
            image.set('data-wpt', i);
            _this.toggleButtons[i].set('data-wpt', i);
        });


        this.toggleButtons.addEvent(this.clickEvent, function(e) {
            e.preventDefault();
            _this.togglePage(e.target);
        });

        this.current_wpt_page = 0;
    },
    togglePage: function(button){

        _this = this;
        if(button.hasClass('active'))
            return false;
        if(this.wpt_prevent_click)
            return false;

        if(this.options.page_hotspots){
            this.hideHotspots();
        }

        this.hideInfo();

        this.wpt_prevent_click = true;
        setTimeout(function(){
            _this.wpt_prevent_click = false;
        },_this.wpt_toggle_time);

        this.toggleButtons.removeClass('active');
        button.addClass('active');

        this.current_wpt_page =  button.get('data-wpt');

        this.imagesContainer.getElement('img:not(.active)').fade('in');
        this.imagesContainer.getElement('img.active').fade('out');

        this.imagesContainer.getElements('img').toggleClass('active');


        this.container.getElements('.info-trigger').hide();
        this.container.getElements('.info-trigger[data-info="'+this.current_wpt_page+'"]').show();
        if(this.options.glossary == true){
            this.closeGlossaryTerms();
        }
        if(_this.options.info_hotspots_overide){
            if(this.current_wpt_page == 1){
                hotspot_trigger.show();
            }else{
                hotspot_trigger.hide();
            }
        }
    },
    /*IMAGE SWAP*/
    initImageSwap : function(){
        _this = this;
        this.thumbnailContainer = this.container.getElements('.image-swap-trigger');
        this.current_wpt_page = 1;

        this.container.getElement('.toggle-image-container img:not(.active)').hide();
        // this.container.getElements('.i-icon-shadow:not(.active)').hide();
        this.container.getElements('.image-swap-buttons img:not(.active)').hide();

        this.thumbnailContainer.addEvent(_this.clickEvent, function(e) {
            if(!e.target.hasClass('audio')) {
                _this.stopAllAudios();
                _this.container.getElement('.image-swap-buttons img.active').toggle();
                _this.container.getElement('.image-swap-buttons img:not(.active)').toggle();
                _this.hideInfo();
                $$('button.i-icon-shadow').show();

                _this.container.getElement('.image-swap-trigger').set('toggle-position', _this.current_wpt_page);

                if (_this.current_wpt_page === 1) {
                    _this.current_wpt_page = 0;
                    $$('button.i-icon-shadow[data-info="1"]')[0].hide();
                    $$('button.i-icon-shadow[data-info="0"]')[0].show();
                    _this.container.getElement('.toggle-image-container img[data-info="1"]').hide();
                    _this.container.getElement('.toggle-image-container img[data-info="1"]').removeClass('active');
                    _this.container.getElement('.toggle-image-container img[data-info="0"]').show();
                    _this.container.getElement('.toggle-image-container img[data-info="0"]').addClass('active');
                } else if (_this.current_wpt_page === 0) {
                    _this.current_wpt_page = 1;
                    $$('button.i-icon-shadow[data-info="1"]')[0].show();
                    $$('button.i-icon-shadow[data-info="0"]')[0].hide();
                    _this.container.getElement('.toggle-image-container img[data-info="1"]').show();
                    _this.container.getElement('.toggle-image-container img[data-info="1"]').addClass('active');
                    _this.container.getElement('.toggle-image-container img[data-info="0"]').hide();
                    _this.container.getElement('.toggle-image-container img[data-info="0"]').removeClass('active');
                }  
            }              
        });
    },
    showImageSwap: function() {
        image_swap_container = this.container.getElement('.image-swap-trigger');
        image_swap_container.show();
    },
    initSectionToggle: function() {
        console.log('start section toggle');
    },
    /* CORE STANDARD POPUPS */
    initCoreStandardPopUps:function(){
        _this = this;
        this.trigger = this.container.getElement('.csp-trigger');
        this.trigger.addEvent(this.clickEvent, function(e) {
            e.preventDefault();
            _this.showCSP(e.target);
        });

        switch(this.options.csp_data.type){
            case 'text':
                this.csp_container = new Element('div.csp-text-container',{
                    html :	'<p class="csp-title">' + _this.returnBreakTag(this.options.csp_data.title) + '</p><p class="csp-subtitle">' + this.options.csp_data.subtitle + '</p><p class="csp-text">' + _this.returnBreakTag(this.options.csp_data.text) + '</p>'
                }).inject(this.container);

                if (this.options.csp_data.additional) {
                    this.options.csp_data.additional.each(function(el, i) {
                        new Element('p.additional.csp-subtitle', {
                            html: '<p class="csp-subtitle">' + el.subtitle + '</p><p class="csp-text">' + el.text + '</p>'
                        }).inject(_this.csp_container);
                    })
                }
                break;
            case 'image':
                this.csp_container = new Element('div.csp-image-container').inject(this.container);
                this.csp_image = new Element('img', {
                    src : this.options.csp_data.image
                }).inject(this.csp_container);
                this.csp_audio_container = new Element('span.csp-audio').inject(this.csp_container);
                this.csp_audio = new Element('audio', {
                    src : this.options.csp_data.audio,
                    title : this.options.csp_data.text,
                    controls : 'controls'
                }).inject(this.csp_audio_container);

                this.csp_audio_container.addEvent(this.clickEvent, function(e) {
                    e.preventDefault();
                    _this.toggleAudio(e.target);
                });

                this.csp_caption = new Element('div.csp-caption', {
                    html : this.options.csp_data.text,
                }).inject(this.csp_container);


                break;
            default:
                return false;
                break;

        }
        this.csp_container_close = new Element('button.csp-text-container-close').inject(this.csp_container);
        this.csp_container_close.addEvent(this.clickEvent, function(e) {
            e.preventDefault();
            _this.hideCSP();
        });

    },
    showCSP: function(button){
        button.addClass('active');

        this.csp_container.show();
        this.csp_container.getElement('.csp-text-container-close').focus();



        if(this.options.info == true){
            this.hideInfo();
        }
        if(this.options.page_hotspots == true){
            this.hideHotspots();
        }
        if(this.options.glossary == true){
            this.closeGlossaryTerms();
        }
        if(this.options.info_hotspots_overide){
            if(this.current_wpt_page == 1){
               hotspot_trigger.show();
               this.info_triggers.hide();
            }else{
                hotspot_trigger.hide();
                this.info_triggers.show();
            }
        }
        if (typeof this.container.getElements('iframe') !== 'undefined') {
            try {
                iframeGlossary = [].slice.call($$('iframe')[0].contentDocument.querySelectorAll('.glossary-container')) || [].slice.call($$('iframe')[0].contentWindow.querySelectorAll('.glossary-container'));
                if(iframeGlossary[0])
                {
                   iframeGlossary[0].destroy(); 
                }  
            } catch(e){}
        };

    },
    hideCSP: function(){
        this.container.getElement('.csp-trigger').removeClass('active');
        //this.csp_overlay.hide();
        this.csp_container.hide();
        this.stopAllAudios();


    },

    /* GLOSSARY */
    initGlossary : function(){

        if(this.options.info){
            this.container.getElements('.info-container').addClass('text-container');
        }
        this.options.glossary_data.each(function(item , i){

            parent_container = _this.container.getElement('#' +_this.options.glossary_data[i].term_id).getParent('.text-container');

            glossary_container = new Element('div.glossary-container.' + item.type, {
                'data-term-id': item.term_id
            }).inject(parent_container);

            new Element('hr.glossary-divider').inject(glossary_container, 'top');

            custom_class = ''
            if(typeof item.audio_class != 'undefined'){
                custom_class = '.'+item.audio_class;
            }

            glosary_text = new Element('p', {
                html: '<strong>'+  _this.returnBreakTag(item.term) + '</strong>' + item.pronunciation + '<p>' + _this.returnBreakTag(item.definition) + '</p>',
            }).inject(glossary_container);

            glossary_audio_container = new Element('span.audio-large.audio' + custom_class ).inject(glosary_text, 'top');

            glossary_audio = new Element('audio', {
                src: item.audio,
                title: item.term,
                controls: 'controls',
                html : _this.audio_fallback
            }).inject(glossary_audio_container);

            glosary_close = new Element('button.glossary-close').inject(glossary_container);

        });

        this.container.getElements('a.glossary-audio').addEvent(this.clickEvent, function(e) {
            e.preventDefault();
            _this.toggleAudio(e.target);
        });
        this.container.getElements('button.glossary-close').addEvent(this.clickEvent, function(e) {
            e.preventDefault();
            _this.closeGlossaryTerms(e.target);
            e.target.getParent().getParent().getElement('.audio').focus();
        });
        this.container.getElements('.glossaryterm').addEvent(this.clickEvent, function(e) {
            e.preventDefault();
            _this.showGlossaryTerms(e.target);
        });



    },
    closeGlossaryTerms : function(){
        this.stopAllAudios();
        this.container.getElements('.glossary-container').hide();
    },
    showGlossaryTerms : function(term){
        this.closeGlossaryTerms();
        this.container.getElement('.glossary-container[data-term-id="'+term.id+'"]' ).show();


        if(this.options.info == true){
            if(this.options.glossary_inside_info == false) {
                this.hideInfo();
            }
        }


        if(this.options.page_hotspots == true){
            if(this.options.glossary_inside_hotspot == false) {
                this.hideHotspots();
            }
        }
        if (typeof this.container.getElements('iframe') !== 'undefined') {
            try {
                iframeGlossary = [].slice.call($$('iframe')[0].contentDocument.querySelectorAll('.glossary-container')) || [].slice.call($$('iframe')[0].contentWindow.querySelectorAll('.glossary-container'));
                if(iframeGlossary[0])
                {
                   iframeGlossary[0].destroy(); 
                }  
            } catch(e){}
        };
    },
    /* GENERAL IMAGE OVERLAY */

    createImageOverlay: function(){
        this.wiu_image_overlay  = new Element('div.wiu-image-overlay').inject(this.container);

        if(typeof this.container.getElements('.image-container img')[0] != 'undefined'){
            cloned_image  = this.container.getElements('.image-container img')[0].clone(true, true);
            cloned_image.inject(this.wiu_image_overlay);
        }


    },
    hideImageOverlay: function(){
        this.wiu_image_overlay.hide();
    },
    showImageOverlay: function(){
        if(this.container.getElement('.image-container img.active') != null){
            cloned_image  = this.container.getElements('.image-container img.active')[0].clone(true, true);
            this.wiu_image_overlay.set('html', '');
            cloned_image.inject(this.wiu_image_overlay);
        }
        this.wiu_image_overlay.show();
    },

    /* WRAP IT UP */
    initWrapItUp: function(){
        _this = this;

        this.wiu_overlay = new Element('div.wiu-overlay').inject(this.container);

        //change the heading style depending if it is WIU or share and compare
        if (this.options.wiu_data.share_and_compare) {
            wiu_header = this.config_wiu_header_share_compare;
        } else {
            wiu_header = this.config_wiu_header;
        }

        this.wiu_container = new Element('div.wiu-container.' + this.options.wiu_data.type,{
            html : wiu_header
        }).inject(this.container);

        wiu_close = new Element('button.wiu-container-close.icon-close').inject(this.wiu_container);

        wiu_close.addEvent(this.clickEvent, function(e) {
            e.preventDefault();
            _this.stopAllAudios();
            _this.hideWrapItUp();
        });

        items = 0;


        switch(this.options.wiu_data.type){
            case 'steps':

                Array.each(this.options.wiu_data.steps, function(item, index) {

                    stepsContainer = new Element('div.wiu-steps-container').set('data-step', index).addClass(item.wiu_class).inject(_this.wiu_container);

                    $$('div.wiu-steps-container').each(function(item, index) {
                        if (index !== 0) {
                            item.hide();
                        }
                    })

                    stepsWrapper = new Element('div.wiu-steps-wrapper').inject(stepsContainer);
                    stepsInnerWrapper = new Element('div.wiu-steps-inner-wrapper').inject(stepsWrapper);

                    if (_this.options.wiu_data.steps.length > 1) {
                        buttonsWrapper = new Element('div.buttons-wrapper').inject(stepsContainer);
                        buttonsInnerWrapper = new Element('div.innerWrapper').inject(buttonsWrapper);
                        if (index === 0) {
                            nextBtn('next-btn', index, index+1);
                        } else if (index === _this.options.wiu_data.steps.length-1) {
                            if (_this.options.wiu_data.steps.length > 2) {
                                backBtn('back-btn', index, index-1);
                                resetBtn('reset-btn', index);
                            } else {
                                backBtn('back-btn', index, index-1);
                            }
                        } else {
                            nextBtn('next-btn', index, index+1);
                            backBtn('back-btn', index, index-1);
                        }
                    }

                    function nextBtn(btnName, index, nextIndex) {
                        new Element('button.'+btnName, {
                            events: {
                                click: function() {
                                    _this.stopAllAudios();
                                    $$('div.wiu-steps-container[data-step="'+nextIndex+'"]')[0].show();
                                    $$('div.wiu-steps-container[data-step="'+index+'"]')[0].hide();
                                    $$('.wiu-container')[0].setStyle('top', ($$('.wiu-overlay')[0].getCoordinates().height - $$('.wiu-container')[0].getCoordinates().height)/2+'px');
                                    $$('.wiu-header .audio')[0].focus();

                                }
                            }
                        }).inject(buttonsInnerWrapper);
                    }

                    function resetBtn(btnName, index) {
                        new Element('button.'+btnName, {
                            events: {
                                click: function() {
                                    _this.stopAllAudios();
                                    $$('div.wiu-steps-container').each(function(step, i) {
                                        i !== 0 ? step.hide() : step.show();
                                    })
                                    $$('.wiu-container')[0].setStyle('top', ($$('.wiu-overlay')[0].getCoordinates().height - $$('.wiu-container')[0].getCoordinates().height)/2+'px');
                                    $$('.wiu-header .audio')[0].focus();
                                }
                            }
                        }).inject(buttonsInnerWrapper);
                    }

                    function backBtn(btnName, index, prevIndex) {
                        new Element('button.'+btnName, {
                            events: {
                                click: function() {
                                    _this.stopAllAudios();
                                    $$('div.wiu-steps-container[data-step="'+prevIndex+'"]')[0].show();
                                    $$('div.wiu-steps-container[data-step="'+index+'"]')[0].hide();
                                    $$('.wiu-container')[0].setStyle('top', ($$('.wiu-overlay')[0].getCoordinates().height - $$('.wiu-container')[0].getCoordinates().height)/2+'px');
                                    $$('.wiu-header .audio')[0].focus();
                                }
                            }
                        }).inject(buttonsInnerWrapper);
                    }

                    item.step.each(function(step, i) {
                        items++;


                        if (typeof step.image != 'undefined') {
                            imageWrapper = new Element('div.wiu-step-imageWrapper').inject(stepsContainer, 'top');
                            stepsWrapper.setStyle('margin', '0');
                            new Element('img.wiu-step-image', {
                                src: step.image,
                                alt: step.image_alt
                            }).inject(imageWrapper);
                        }

                        if (typeof step.type != 'undefined' && step.type === 'iframe') {
                            var wiu_iframe = new Element('iframe', {
                                src: step.url,
                                width: '770px',
                                height: '501px'
                            }).inject(stepsInnerWrapper);

                        }

                        if (typeof step.type != 'undefined' && step.type === 'digigraph') {
                            wiu_data = step;
                            stepsWrapper.setStyle('margin', '0');
                            buttonsWrapper.setStyle('margin-top', '-49px')
                            wiu_dg_iframe = new Element('iframe.digigraph-holder',{
                                width: '770',
                                height: wiu_data.digigraphSize.height,
                                src: '../widgets/digigraph/index.html?data-width='+wiu_data.digigraphSize.width+'&data-height='+wiu_data.digigraphSize.height+'&data-save-text='+wiu_data.digigraphSaveWord+'&data-background='+wiu_data.digigraphImage+'&data-wid='+wiu_data.digigraphID,
                                lang : 'en-us'
                            }).inject(stepsContainer, 'top');

                            wiu_dg_instructions = new Element('div.digigraph-instructions').inject(stepsInnerWrapper);
                            stepElementWrapper = new Element('div.wiu-step-wrapper').inject(wiu_dg_instructions);

                            custom_class = ''
                            if(typeof wiu_data.instructions.audio_class != 'undefined'){
                                custom_class = '.'+wiu_data.instructions.audio_class;
                            }

                            wiu_dg_audio_container = new Element('span.audio-large.audio' + custom_class).inject(stepElementWrapper);

                            wiu_dg_audio = new Element('audio', {
                                src: wiu_data.instructions.audio,
                                controls: 'controls',
                                html: _this.audio_fallback
                            }).inject(wiu_dg_audio_container);

                            wiu_step_text = new Element('p.wiu-dg-text',{
                                html: wiu_data.instructions.text
                            }).inject(stepElementWrapper);

                        } else {

                            if (typeof step.text !== 'undefined') {
                                stepRow = new Element('div.wiu-step-row').inject(stepsInnerWrapper);
                                stepElement = new Element('div.wiu-step.step-number-' + parseInt(i+1)).inject(stepRow);
                                stepElementWrapper = new Element('div.wiu-step-wrapper').inject(stepElement);

                                custom_class = ''

                                if(typeof step.audio_class != 'undefined'){
                                    custom_class = '.'+step.audio_class;
                                }

                                if (isNaN(step.stepNum) === true) {
                                    bullet = '<span class="stepNum">' + step.stepNum +  '</span>';
                                } else {
                                    bullet = '<span class="stepNum">' + step.stepNum +  '.</span>';
                                };

                                wiu_step_text = new Element('p.wiu-step-text',{
                                    html: bullet + '<span class="wiu-text">' + _this.returnBreakTag(step.text) + '</span>'
                                }).inject(stepElementWrapper);

                                wiu_step_audio_container = new Element('span.audio-large.audio' + custom_class).inject(stepElementWrapper, 'top');

                                wiu_step_audio = new Element('audio', {
                                    src: step.audio,
                                    controls: 'controls',
                                    html: _this.audio_fallback
                                }).inject(wiu_step_audio_container);

                                if (step.audio === '') {
                                    wiu_step_audio_container.setStyles({
                                        'opacity': '0',
                                        'cursor': 'auto'
                                    })
                                }
                            }

                        }
                    })


                });

                break;
            case 'digigraph':

                wiu_data = this.options.wiu_data;

                wiu_dg_iframe = new Element('iframe.digigraph-holder',{
                    width: '100%',
                    height: wiu_data.digigraphSize.height,
                    src: '../widgets/digigraph/index.html?data-width='+wiu_data.digigraphSize.width+'&data-height='+wiu_data.digigraphSize.height+'&data-save-text='+wiu_data.digigraphSaveWord+'&data-background='+wiu_data.digigraphImage+'&data-wid='+wiu_data.digigraphID,
                    lang : 'en-us'
                }).inject(_this.wiu_container);

                wiu_dg_instructions = new Element('div.digigraph-instructions').inject(_this.wiu_container);

                audio_wrapper = new Element ('div.audio-wrapper').inject(wiu_dg_instructions);

                custom_class = ''
                if(typeof wiu_data.instructions.audio_class != 'undefined'){
                    custom_class = '.'+wiu_data.instructions.audio_class;
                }

                wiu_dg_audio_container = new Element('span.sound-icon-yellow-large.audio' + custom_class).inject(audio_wrapper);

                wiu_dg_audio = new Element('audio', {
                    src: wiu_data.instructions.audio,
                    controls: 'controls',
                    html: _this.audio_fallback
                }).inject(wiu_dg_audio_container);

                wiu_step_text = new Element('p.wiu-dg-text',{
                    html: wiu_data.instructions.text
                }).inject(audio_wrapper);
                break;
        }

        /* hide reset button when there is only to pages in wiu section */
        if(items == 2){
            if(this.container.getElement('.wiu-steps-container .reset-btn')){
                this.container.getElement('.wiu-steps-container .reset-btn').hide();
            }

        }




        this.container.getElement('.wiu-trigger').addEvent(this.clickEvent, function(e) {
            e.preventDefault();
            _this.showWrapItUp();
        });


    },
    hideWrapItUp: function(){
        this.stopAllAudios();
        this.wiu_overlay.hide();
        this.wiu_container.hide();
        this.hideImageOverlay();
        iframes = this.wiu_container.getElements('iframe');
        iframes.each(function(iframe, i){

            parent = iframe.getParent();

            src = iframe.get('src');
            width = iframe.get('width');
            height = iframe.get('height');
            iframe.src = iframe.src;
            /*
            iframe.destroy();

            new_iframe = new Element('iframe', {
                width: width,
                height: height,
                src: src
            }).inject(parent, 'top');
            */
        })
    },
    showWrapItUp: function(){
        if(this.options.core_standard_popups){
            this.hideCSP();
        }
        if(this.options.page_hotspots){
            this.hideHotspots();
        }
        if(this.options.info){
            this.hideInfo();
        }
        if(this.options.widget_hotspot){
            this.hideWidgetHotspots();
        }
        if(this.options.zoom_loupe){
            this.hideZoomLoupe();
        }
        if(this.options.glossary == true){
            this.closeGlossaryTerms();
        }
        if(this.options.science_in_a_snap == true){
            this.container.getElements('.science-in-a-snap-tab-trigger')[0].fireEvent("click");
        }
        if(this.options.tabs_on_page == true){
            this.container.getElements('.tab-link')[0].fireEvent("click");
        }
        if(this.options.whole_page_toggle == true){
            if(!$$('.toggle-button')[this.options.whole_page_toggle_initial_index].hasClass('active'))
            {
                this.togglePage($$('.toggle-button')[this.options.whole_page_toggle_initial_index]);
            }
        }
        if (typeof this.container.getElements('iframe') !== 'undefined') {
            try {
                    iframe = this.container.getElements('iframe') ;
                    iframe[0].src = iframe[0].src;
                } catch(e){}
        };
        if (typeof this.container.getElements('iframe') !== 'undefined') {
            try {
                iframeGlossary = [].slice.call($$('iframe')[0].contentDocument.querySelectorAll('.glossary-container')) || [].slice.call($$('iframe')[0].contentWindow.querySelectorAll('.glossary-container'));
                if(iframeGlossary[0])
                {
                   iframeGlossary[0].destroy(); 
                }    
            } catch(e){}
        };
        // only need this if there are different female and male voices for WIU header
        if (this.container.hasClass('physical') || this.container.hasClass('earth')) {
            if (this.container.getElement('.wiu-header audio')) {
                this.container.getElement('.wiu-header audio').set('src', _this.config_wiu_header_audio_female);
            }
        } else if (this.container.hasClass('life')) {
            if (this.container.getElement('.wiu-header audio')) {
                this.container.getElement('.wiu-header audio').set('src', _this.config_wiu_header_audio_male);
            }
        }

        // if (this.options.wiu_data.share_and_compare) {
        //     this.container.getElement('.wiu-header audio').set('src', _this.options.wiu_data.audio);
        // }

        this.stopAllAudios();

        this.wiu_overlay.show();
        this.wiu_container.show();
        this.wiu_container.getElements('.wiu-steps-container').hide();
        this.wiu_container.getElement('.wiu-steps-container[data-step="0"]').show();
        this.wiu_container.setStyle('top', (this.wiu_overlay.getCoordinates().height-this.wiu_container.getCoordinates().height)/2+'px');
        if (this.wiu_container.getElement('.wiu-header').hasClass('audio')) {
            this.wiu_container.getElement('.wiu-header .audio').focus();
        }



        this.showImageOverlay()

    },
    /* INFO 'i' icons */
    initInfo: function(){

        _this = this;

        //setTimeout(function(){// unfortunately we need to wrap this in a timeout because sometimes the coordinates don't init properly
            _this.info_triggers = _this.container.getElements('.info-trigger');

            _this.options.info_data.each(function(item , i){

                info_container = new Element('div.info-container',{
                    'data-info' : i
                }).inject(_this.container);
                
                _this.info_triggers[i].set('data-info', i);

                if(typeof _this.container.getElements('.image-container img')[i] != 'undefined'){
                    _this.container.getElements('.image-container img')[i].set('data-info', i);
                }

                info_close = new Element('button.info-container-close.icon-close').inject(info_container);

                info_close.addEvent(_this.clickEvent, function(e) {
                    e.preventDefault();
                    _this.stopAllAudios();
                    _this.hideInfo();
                });

                custom_class = ''
                if(typeof item.audio_class != 'undefined'){
                    custom_class = '.'+item.audio_class;
                }

                info_audio_container = new Element('span.audio-large.audio' + custom_class).inject(info_container);

                info_audio = new Element('audio', {
                    src: item.audio,
                    controls: 'controls',
                    html : _this.audio_fallback
                }).inject(info_audio_container);

                info_text = new Element('p.info-text',{
                    html: _this.returnBreakTag(item.text)
                }).inject(info_container);

                info_container.setStyle('top', _this.info_triggers[i].getPosition().y + 12);

                position = '';
                if(item.x_position){
                    position = item.x_position;
                }
                if(position == 'left'){
                    info_container.setStyle('left', '36px');
                }

                if(_this.options.info_hotspots_overide){
                    return false;
                }

            });

            _this.info_triggers.addEvent(_this.clickEvent, function(e) {
                e.preventDefault();
                _this.showInfo(e.target);
            });
            _this.setTabIndex();

        //}, 250);



    },
    hideInfo: function(stopaudios){
        this.stopAllAudios();

        if(this.options.info == false){
            return false;
        }
        this.container.getElements('.info-container').hide();

        if(this.current_wpt_page != null && this.options.info_hotspots_overide == false){
            this.container.getElement('.info-trigger[data-info="'+this.current_wpt_page+'"]').show();
        }else{
            this.info_triggers.show();
            if(this.options.info_hotspots_overide){
                this.hotspot_triggers.hide();

                if(this.current_wpt_page == 1){
                    this.info_triggers.hide();
                }
            }
        }

    },
    showInfo: function(trigger){

        currentID = trigger.get('data-info');

        this.info_triggers.hide();
        this.stopAllAudios();
        /* TODO: suppport whole page toggles */

        /*currentID = this.container.getElement('.image-container img').get('data-info');

         if(this.container.getElement('.image-container img.active')){
         currentID = this.container.getElement('.image-container img.active').get('data-info');
         }*/


        this.container.getElement('.info-container[data-info="'+currentID+'"]').show();
        this.container.getElement('.info-container[data-info="'+currentID+'"]').getElement('.icon-close').focus();

        if(this.options.page_hotspots == true){
            this.hideHotspots();
        }
        if(this.options.glossary == true){
            this.closeGlossaryTerms();
        }
        if(this.options.widget_hotspot == true){
            this.hideWidgetHotspots();
        }

        if (typeof this.container.getElements('iframe') !== 'undefined') {
            try {
                iframeGlossary = [].slice.call($$('iframe')[0].contentDocument.querySelectorAll('.glossary-container')) || [].slice.call($$('iframe')[0].contentWindow.querySelectorAll('.glossary-container'));
                if(iframeGlossary[0])
                {
                   iframeGlossary[0].destroy(); 
                }  
            } catch(e){}
        };

        if(this.options.zoom_loupe == true){
            this.hideZoomLoupe();
        }

    },
    /* GALLERY */
    initGallery: function(){

        this.gallery_overlay = new Element('div.regular-overlay').inject(this.container);
        this.gallery_container = new Element('div.gallery-container').inject(this.container);
        /*this.gallery_overlay.addEvent(this.clickEvent, function(e) {
         e.preventDefault();
         _this.hideGallery();
         });*/

        this.gallery_trigger_elements = this.container.getElements('.trigger-gallery');
        this.gallery_trigger_elements.addEvent(this.clickEvent, function(e) {
            e.preventDefault();
            _this.stopAllAudios();
            _this.showGallery(e.target);
        });

    },
    hideGallery: function(){
        this.stopAllAudios();
        this.gallery_overlay.hide();
        this.gallery_container.hide();
        this.hideImageOverlay();
    },
    showGallery: function(trigger){
        current_gallery_item = this.gallery_trigger_elements.indexOf(trigger);

        this.gallery_container.set('html', '');

        gallery_close = new Element('div.gallery-container-close.icon-close').inject(this.gallery_container);

        gallery_close.addEvent(_this.clickEvent, function(e) {
            e.preventDefault();
            _this.stopAllAudios();
            _this.hideGallery();
        });

        this.gallery_iframe = new Element('iframe.gallery-iframe',{
            width: '100%',
            height: '560px',
            src: '../widgets/'+this.options.gallery_data.path+'/index.html?index=' + current_gallery_item,
            'data-responsivedesigned' : 'no',
            'data-lmsrequired': 'no',
            'data-offlinesupport': 'yes',
            'data-displaytarget': 'embed'
        }).inject(this.gallery_container);

        this.stopAllAudios();
        this.gallery_overlay.show()
        this.gallery_container.show();
        this.showImageOverlay();

        if(this.options.page_hotspots == true){
            this.hideHotspots();
        }
        if(this.options.glossary == true){
            this.closeGlossaryTerms();
        }
        if(this.options.info){
            this.hideInfo();
        }

    },
    /* PAGE HOTSPOTS */
    initPageHotspots: function(){
        _this = this;

        hotspot_offsets = {
            top:{
                x : -125,
                y : 50,
            },
            right:{
                x : 50,
                y : 50,
            },
            bottom:{
                x : -60, /* -108 */ // popup.x / 2 - trigger.x / 2     // centers it vertically
                y : 120,
            },
            left:{
                x : -215, /* -310 */
                y : -10,
            }
        }


        this.options.page_hotspots_data.each(function(hotspot, i){

            hotspot_trigger = _this.container.getElement('#' + hotspot.trigger_id);
            hotspot_trigger.addClass('page-hotspot-trigger');
            hotspot_trigger.set('data-hotspot-id', i);


            hotspot_container = new Element('div.hotspot-container.'+hotspot.position).inject(hotspot_trigger.getParent());
            hotspot_container.set('data-hotspot-id', i);
            hotspot_container.addClass('text-container');
            hotspot_close = new Element('div.hotspot-container-close.icon-close').inject(hotspot_container);

            hotspot_line = new Element('div.hotspot-line.hs'+hotspot.position).inject(hotspot_container);
            hotspot_circle = new Element('div.hotspot-circle.hs'+hotspot.position).inject(hotspot_container);

            custom_class = ''
            if(typeof hotspot.audio_class != 'undefined'){
                custom_class =  hotspot.audio_class;
            }


            audio = '<span class="audio-large yellow audio '+custom_class+'"><audio src="'+hotspot.audio+'" controls=""></audio></span>'


            info_text = new Element('p.info-text',{
                html: audio + _this.returnBreakTag(hotspot.text)
            }).inject(hotspot_container);



            if(_this.options.info_hotspots_overide){
                hotspot_trigger.hide();
            }






            hotspot_trigger.addEvent(_this.clickEvent, function(e) {
                e.preventDefault();
                _this.showHotspot(e.target);
                _this.stopAllAudios();
            });

            x = 0;
            y = 0;
            switch(hotspot.position){
                case 'bottom':
                    x = hotspot_offsets.bottom.x;
                    y = hotspot_offsets.bottom.y;
                    break;
                case 'left':
                    x = hotspot_offsets.left.x;
                    y = hotspot_offsets.left.y;
                    break;


            }

            offset_x = 0;
            offset_y = 0;

            if(hotspot.offset){
                offset_x = hotspot.offset.x;
                offset_y = hotspot.offset.y;
            }

            hotspot_container.setStyle('left', hotspot_trigger.getPosition().x + x + offset_x +  'px');
            hotspot_container.setStyle('top', hotspot_trigger.getPosition().y + y + offset_y + 'px');


            hotspot_close.addEvent(_this.clickEvent, function(e) {
                e.preventDefault();
                _this.stopAllAudios();
                _this.hideHotspots();
            });

        });

        this.hotspot_containers = this.container.getElements('.hotspot-container');
        this.hotspot_triggers = this.container.getElements('.page-hotspot-trigger');

    },
    showHotspot: function(element){
        _this = this
        if(this.options.scrollabe_page) {
            _this.prevent_hotspot_close = true;
            scrollpoint = element.offsetTop-350;
            currentScroll = this.container.getElement('.image-container').getScroll().y;

            interval = setInterval(function() {
                _this.prevent_hotspot_close_timer_flag = false;
                if(currentScroll > scrollpoint && currentScroll - scrollpoint != 1) {
                    currentScroll-=2;
                    _this.container.getElement('.image-container').scrollTo(0, currentScroll);
                } else if(currentScroll < scrollpoint && currentScroll - scrollpoint != -1) {
                    currentScroll+=2;
                    _this.container.getElement('.image-container').scrollTo(0, currentScroll);
                } else {
                    window.clearInterval(interval);
                    console.log('showHotspot', _this.prevent_hotspot_close_timer_flag)
                    _this.prevent_hotspot_close_timer_flag = true;
                }
                console.log(scrollpoint);
            }, 1);
        }
        this.hideHotspots();
        element.hide();
        pop_up_id = element.get('data-hotspot-id');
        _this.container.getElement('.hotspot-container[data-hotspot-id="'+pop_up_id+'"]').show();
        _this.hotspot_containers.get('data-hotspot-id');
        if(_this.options.info == true){
            _this.hideInfo();
        }
        if(_this.options.glossary == true){
            _this.closeGlossaryTerms();
        }

    },
    hideHotspots: function(){
        this.hotspot_containers.hide();
        this.hotspot_triggers.show();
    },
    /* TABS */
    initTabs: function() {
        var nextBtn = $$('.next-btn')[0],
            backBtn = $$('.back-btn')[0],
            menuLis = $$('.menu ul li'),
            digigraph_image_button = $$('.digigraph-image-button');


        menuLis.addClass('tab-link');


        $$('#tabs > div').each(function(tab, i) {
            if (i !== 0) {
                tab.hide();
            }
        });

        backBtn.hide();
        digigraph_image_button.hide();


        nextBtn.addEvent(_this.clickEvent, function(e) {
            var tabIndex = parseInt($$('.menu ul li.active')[0].get('data-tab-index'));
            if (tabIndex < menuLis.length-1) {
                tabIndex = tabIndex + 1;
                showCurrentTab(tabIndex, e.target);
            }
        })

        backBtn.addEvent(_this.clickEvent, function(e) {
            var tabIndex = parseInt($$('.menu ul li.active')[0].get('data-tab-index'));
            if (tabIndex >= 0) {
                tabIndex = tabIndex - 1;
                showCurrentTab(tabIndex, e.target);
            }
        })

        menuLis.each(function(menuLi, i) {
            menuLi.addEvent('click', function(e) {
                if(typeof e != 'undefined'){
                    showCurrentTab(i, e.target);
                }else{
                    if(_this.options.tabs_on_page == true){
                        showCurrentTab(i, _this.container.getElements('.tab-link')[0]);
                    }
                }

            })
        });

        function showCurrentTab(tabIndex, target) {
            _this.stopAllAudios();
            if(target.hasClass('audio')){
                _this.toggleAudio(target);
            }
            var tabNumber = '#tabs .tab-'+tabIndex;
            $$('.image-holder').show();
            digigraph_image_button.hide();


            if ($$(tabNumber).hasClass('toggle-digigraph')[0] === true) {
                $$(tabNumber + ' .digigraph-holder').hide();
                $$('.digigraph-button').addEvent('click', function() {
                    $$(tabNumber + ' .image-holder').hide();
                    $$(tabNumber + ' .digigraph-holder').show();
                    $$(tabNumber + ' .digigraph-image-button').show()
                        .addEvent('click', function(e) {
                            e.target.getParent('div').hide();
                            $$(tabNumber + ' .image-holder').show();
                            $$(tabNumber + ' .digigraph-holder').hide();

                        });
                })
            }
            //remove all active class to the menu tabs.
            $$('.menu ul li').each(function(el) {
                if (el.hasClass('active') === true) el.removeClass('active');
            });

            //hide all the tab contents.
            $$('#tabs > div').each(function(tab, i) {
                i !== tabIndex ? tab.hide() : tab.show()
            })
            $$('.menu ul li')[tabIndex].addClass('active');


            //show and hide tab's content based on Next and Back Buttons
            if (tabIndex === 0) {
                nextBtn.show();
                backBtn.hide();
            } else if (tabIndex === menuLis.length-1) {
                nextBtn.hide();
                backBtn.show();
            } else if (tabIndex !== 0 && tabIndex !== menuLis.length-1) {
                nextBtn.show();
                backBtn.show();
            }

        }



    },
    returnBreakTag: function(thisText) {
        thisText = thisText.replace(/(?:\r\n|\r|\n)/g, '<br />');
        thisText = thisText.replace(/\[(.*?)\]/g,"<$1>");

        return thisText;
    },
    /* AUDIO */
    stopAllAudios: function(only_this_window){

        if(this.stopAudios == false){
            this.stopAudios = true;
            return false;
        }

        var audioPlayers = this.container.getElements('audio');

        if (!only_this_window && typeof this.container.getElements('iframe') !== 'undefined') {
            try {
                iframesAudioPlayers = [].slice.call($$('iframe')[0].contentDocument.querySelectorAll('audio'));
                audioPlayers.combine(iframesAudioPlayers);
            } catch(e){}
        };

        audioPlayers.each(function(audio){
            try {
                audio.pause();

                if(!document.activeElement.hasClass('audio')){// reset audio on certain items
                    if( audio.getParent().getParent().hasClass('info-container') ||
                        audio.getParent().getParent().hasClass('wh-popup-container') ||
                        audio.getParent().getParent().hasClass('wiu-step-wrapper') ||
                        audio.getParent().getParent().hasClass('wiu-header') ||
                        audio.getParent().getParent().getParent().hasClass('glossary-container')){

                        audio.currentTime = 0;
                    }
                }


                if (audio.getParent('span').hasClass('audio-pause')) {
                    audio.getParent('span').removeClass('audio-pause');
                }

            } catch(e){}
        })

    },
    toggleAudio: function(e){
        eAudio = e.getChildren('audio')[0];
        if (eAudio.hasAttribute('controls')) {
            if (eAudio.paused) {
                _this.stopAllAudios();
                if (!e.hasClass('single')) {
                    e.addClass('audio-pause');
                }
                e.addClass('active');
                eAudio.addEventListener('ended', function() {
                    e.removeClass('audio-pause');
                    e.removeClass('active');
                })
                eAudio.play();
            } else {
                eAudio.pause();
                e.removeClass('audio-pause');
                e.removeClass('active');

            }
        }
    },
    initPageAudios: function(){
        _this = this;
        this.container.getElements('.audio').set('tabindex', 0);
        this.container.getElements('.audio').set('aria-label', 'Select to listen.');
        setTimeout(function(){
            _this.container.getElements('.audio').addEvent(_this.clickEvent, function(e) {
                e.preventDefault();
                _this.toggleAudio(e.target);
            });
        },600)
    },

    /* WIDGET HOTSPOTS */
    initWidgetHotspot : function(){
        this.options.wh_data.each(function(item, i){
            hw_container = new Element('div.wh-popup-container.box-shadow.text-container',{
                'data-hotspot' : i
            }).inject(_this.container);


            hw_close = new Element('button.wh-container-close.icon-close').inject(hw_container);

            hw_close.addEvent(_this.clickEvent, function(e) {
                e.preventDefault();
                _this.hideWidgetHotspots();
            });

            custom_class = ''
            if(typeof item.audio_class != 'undefined'){
                custom_class = '.'+item.audio_class;
            }

            hw_audio_container = new Element('span.audio-large.audio' + custom_class).inject(hw_container);

            info_audio = new Element('audio', {
                src: item.audio,
                controls: 'controls',
                html : _this.audio_fallback
            }).inject(hw_audio_container);

            checked_title = '';

            if(typeof item.title != 'undefined'){
                checked_title = '<span class="title">'+item.title+'</span>';
            }

            hw_text = new Element('p.hw-text',{
                html: checked_title + _this.returnBreakTag(item.text)
            }).inject(hw_container);

            if(typeof item.image != 'undefined'){

                image_position = 'top'
                if(typeof item.image_position != 'undefined'){
                    image_position = 'image-'+item.image_position;
                }
                hw_container.addClass('has-image').addClass(image_position);

                image = new Element('img',{
                    'src' : item.image,
                    'alt' : item.image_alt
                }).inject(hw_container);

            }
            if(typeof item.text_items != 'undefined'){

                ol = new Element('ol').inject(hw_container);

                item.text_items.each(function(text, i){
                    list = new Element('li',{
                        'html' : _this.returnBreakTag(text) //'<strong>' + parseInt(i + 1) + '</strong>'
                    }).inject(ol);
                })
            }

        })

        this.wh_containers = this.container.getElements('.wh-popup-container');

        this.wh_containers.setStyles({
            bottom: this.options.wh_positions.popup_bottom,
            left: this.options.wh_positions.popup_left
        })



        this.drawWidgetHotspotsLines();

    },
    drawWidgetHotspotsLines:function(){
        this.wh_triggers = this.container.getElements('.wh-trigger');

        console.log('initial position' , this.wh_triggers[0].getPosition().x);
        if(this.wh_triggers[0].getPosition().x == 0){
            console.log('==================================');
            console.log('ZERO');
            console.log('element', this.wh_triggers[0]);
            console.log('$$ position', $$(this.wh_triggers[0]).getPosition());
            console.log('offset', this.wh_triggers[0].getOffsets());
            console.log('position', this.wh_triggers[0].getPosition());
            console.log('left', this.wh_triggers[0].getStyle('left'));
            //this.drawWidgetHotspotsLines();
            console.log('==================================');

            setTimeout(function(){
                console.log(_this.container.getElements('.wh-trigger')[0].getPosition());
                console.log('TRYING AGAIN...');
                _this.drawWidgetHotspotsLines();
            },500)

            return false;
        }else{
            console.log('got the right coordinates');
        }

        //console.log(this.wh_triggers[0].getPosition());

        //setTimeout(function(){ // unfortunately we need to wrap this in a timeout because sometimes the coordinates don't init properly
        trigger_position = _this.wh_triggers[0].getPosition();
        console.log(trigger_position);

        //_this.container.getElements('.canvas.wh-canvas').destroy();

        _this.wh_triggers.each(function(trigger, i){

            trigger_position = trigger.getPosition();
            //console.log(trigger_position);


            canvas = new Element('canvas.wh-canvas',{
                'data-hotspot' : i,
                width : 924,
                height :630,
            }).inject(_this.container);

            if (typeof _this.options.wh_data[i].custom_line_coordinates === 'undefined') {
                line_coord = _this.options.wh_positions.line_coordinates;
            } else {
                line_coord = _this.options.wh_data[i].custom_line_coordinates;
            }

            var ctx = canvas.getContext("2d");

            if(typeof _this.options.wh_data[i] == 'undefined'){
                console.warn('no data for hotspot ' + i)
                return false
            };

            if(typeof _this.options.wh_data[i].line_direction != 'undefined'){
                bottom = _this.options.wh_positions.popup_bottom + 40;
                center = _this.options.wh_positions.popup_left;

                ctx.moveTo(trigger_position.x + 15, trigger_position.y +35);

                switch (_this.options.wh_data[i].line_direction){
                    case 'bottom' :
                        ctx.lineTo(trigger_position.x + 15, 630 - bottom);
                        ctx.lineTo(center, 630 - bottom);

                        break;
                    case 'right' :
                        ctx.lineTo(center + 40, trigger_position.y +35);
                        ctx.lineTo(center + 40, 630 - bottom);
                        break;
                    case 'left' :
                        ctx.lineTo(trigger_position.x - 15, trigger_position.y +35);
                        ctx.lineTo(trigger_position.x - 15, 630 - bottom);
                        break;
                    case 'brackets' :
                        ctx.moveTo(trigger_position.x + 14 , trigger_position.y -25);
                        ctx.lineTo(trigger_position.x + 14 , trigger_position.y -25);
                        ctx.lineTo(trigger_position.x + 4 , trigger_position.y -25);
                        ctx.lineTo(trigger_position.x + 4 , trigger_position.y +75);
                        ctx.lineTo(trigger_position.x + 14 , trigger_position.y +75)
                        ctx.moveTo(trigger_position.x + 4 , trigger_position.y+25);
                        ctx.lineTo(trigger_position.x - 9, trigger_position.y+25);
                        ctx.lineTo(trigger_position.x - 9, trigger_position.y +25);
                        ctx.lineTo(trigger_position.x - 9, 500);
                        ctx.lineTo(trigger_position.x - 100, 500);
                        break;
                    default :
                        console.log(_this.options.wh_data[i].title + ' position is not defined')
                        break;
                }

                ctx.lineWidth = 2;
                ctx.strokeStyle = '#FECC02';
                ctx.stroke();

            }else{
                ctx.moveTo(trigger_position.x + 15, trigger_position.y +35);
                ctx.lineTo(line_coord[0],trigger_position.y +35);
                ctx.lineTo(line_coord[0],line_coord[1]);
                ctx.lineTo(line_coord[2],line_coord[1]);
                ctx.lineWidth = 2;
                ctx.strokeStyle = '#FECC02';
                ctx.stroke();

            }
            if(_this.options.wh_data[i].line_direction != 'brackets')
            {
                ctx.beginPath();
                ctx.arc(trigger_position.x + 15, trigger_position.y +35, 4, 0, 2 * Math.PI, false);
                ctx.fillStyle = '#FECC02';
                ctx.fill();
                ctx.lineWidth = 0;
                ctx.stroke();
            }else{
                ctx.beginPath();
                ctx.arc(trigger_position.x + 14, trigger_position.y -25, 4, 0, 2 * Math.PI, false);
                ctx.fillStyle = '#FECC02';
                ctx.fill();
                ctx.lineWidth = 0;
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(trigger_position.x + 14, trigger_position.y +75, 4, 0, 2 * Math.PI, false);
                ctx.fillStyle = '#FECC02';
                ctx.fill();
                ctx.lineWidth = 0;
                ctx.stroke();
            }


        });

        _this.wh_canvas = _this.container.getElements('canvas.wh-canvas');

        _this.wh_triggers.addEvent(_this.clickEvent, function(e) {
            e.preventDefault();
            _this.showWidgetHotspot(e.target);
        });
        _this.canvas_instances = _this.container.getElements('canvas');
        _this.respondCanvas();

        //},500);
    },
    hideWidgetHotspots : function(){
        this.stopAllAudios();
        this.wh_containers.hide();
        this.wh_canvas.hide();
        this.wh_triggers.show();
        this.closeGlossaryTerms();
    },
    showWidgetHotspot : function(trigger){

        currentID = trigger.get('data-hotspot');
        this.stopAllAudios();
        this.hideWidgetHotspots();
        trigger.hide();

        this.container.getElements('.wh-popup-container[data-hotspot="'+currentID+'"]').show();
        this.container.getElements('.wh-canvas[data-hotspot="'+currentID+'"]').show();
        this.container.getElement('.wh-popup-container[data-hotspot="'+currentID+'"]').getElement('.icon-close').focus();

        if(this.options.info){
            this.hideInfo();
        }

    },
    /* ACCORDION */
    initAccordion : function(){
        _this = this;
        var accordion_tabs = this.container.getElements('.accordion-trigger > li');

        accordion_tabs.each(function(tab, i) {
            tab.set('data-tab', i);
            if (!tab.hasClass('selected')) {
                slideToggle(tab.getElement('ul.accordion-tab-info'));
            }
            tab.getElement('div.header').addEvent('click', function(e) {
                _this.stopAllAudios();
                if (tab.hasClass('selected')) {
                    tab.removeClass('selected');
                    slideToggle(tab.getElement('ul.accordion-tab-info'));
                } else {
                    slideInAllTabs()
                    tab.addClass('selected');
                    slideToggle(tab.getElement('ul.accordion-tab-info'));
                    current_tab = tab.get('data-tab');
                    if(current_tab > 1){ // from second tab forward
                        _this.scrollText(0, 1000, _this.container.getElement('.panel'))
                    }
                }
            })

            function slideInAllTabs() {
                accordion_tabs.each(function(tab, i) {

                    if (tab.hasClass('selected')) {
                        slideToggle(tab.getElement('ul.accordion-tab-info'));
                        tab.removeClass('selected');
                    }
                })
            }

            function slideToggle(tab) {
                new Fx.Slide(tab).toggle();
            }
        });
    },
    initVerticalTabs : function(){

        _this = this;

        this.vtabs_triggers_container = this.container.getElement('.vertical-tabs');

        this.vtabs_overlay = new Element ('div.vertical-tabs-overlay').inject(this.container);

        this.vtabs_container = new Element ('div.vertical-tabs-container').inject(this.container);
        this.vtabs_container_links = new Element ('div.vertical-tabs-links').inject(this.vtabs_container);
        this.vtabs_container_content = new Element ('div.vertical-tabs-content-wrapper').inject(this.vtabs_container);

        this.vtabs_prev = new Element ('button.vertical-tabs-prev.back-btn').inject(this.vtabs_container_content);
        this.vtabs_next = new Element ('button.vertical-tabs-next.next-btn').inject(this.vtabs_container_content);

        vtabs_close = new Element('button.vtabs-container.icon-close').inject(this.vtabs_container);

        this.options.vertical_tabs_data.each(function(item, i){

            li = new Element('li.vtab-trigger', {
                'data-tab': i
            }).inject(_this.vtabs_triggers_container);
            header = new Element('div.accordion-header',{
                html: '<span class="number">'+(i+1)+'</span><p class="option">'+item.title+'</p><button type="button"></button>'
            }).inject(li);

            link = new Element('a.vtabs-link',{
                html : '<span class="stepNum">' + (i+1)+ '</span> ' + item.title.split(' ')[0],
                style: 'height:' + 100 / _this.options.vertical_tabs_data.length + '%',
                'data-tab': i
            }).inject(_this.vtabs_container_links);


            content_container = new Element('div.vertical-tabs-content-container',{
                'data-tab': i
            }).inject(_this.vtabs_container_content);


            if(item.digigraph == true){

                content_container.addClass('has-digigraph');

                digigraph = new Element('iframe.vtab-digigraph-holder',{
                    width: '593',
                    height: '406',
                    src: '../widgets/digigraph/index.html?data-width=593&data-height=406&data-save-text=Save&data-wid='+item.digigraph_id,
                }).inject(content_container);
            }

            audio_class = '';
            if(typeof item.audio_class != 'undefined'){
                audio_class = item.audio_class;
            }
            audio = '<span class="audio-large yellow audio '+audio_class+'"><audio src="'+item.audio+'" controls="controls"></audio></span>';


            science_icon = '';
            if(typeof item.science_icon != 'undefined' && item.science_icon == true){
                science_icon = '<span class="mysciencenotebook-icon"></span>';
            }

            text = item.text;
            if(typeof item.text == 'undefined' && typeof item.text_items != 'undefined'){
                text = '<ul>';
                item.text_items.each(function(inner_item, j){
                    text += '<li>'+ _this.returnBreakTag(inner_item.text)+'</li>';
                });
                text += '</ul>';
            }

            content = new Element('div.vtab-text-content',{
                html : '<h3><p>'+item.title+ '</p>'+science_icon+'</h3>' + '<div class="vtab-text-container"><p>' + audio +  _this.returnBreakTag(text)+'</p></div>',
            }).inject(content_container);

            if (typeof item.image !== 'undefined') {
                new Element('img', {
                    src: item.image
                }).inject($$('.vtab-text-container')[0]);
            }



        });

        this.vtabs_container_content.getElements('div.vertical-tabs-content-container').hide();

        vtabs_close.addEvent(this.clickEvent, function(e) {
            _this.stopAllAudios();
            _this.vtabs_container.hide();
            _this.vtabs_overlay.hide();
            _this.wiu_image_overlay.hide();
        });

        this.vtabs_triggers_container.addEvent(this.clickEvent, function(e) {
            _this.stopAllAudios();
            link = e.target;

            if(link.hasClass('vtab-trigger')){
                currentID = link.get('data-tab');
            }else{
                currentID = link.getParent('.vtab-trigger').get('data-tab')
            }
            _this.vtabs_container.show();
            _this.vtabs_overlay.show();
            _this.wiu_image_overlay.show();
            _this.showVerticalTab(currentID);
        });


        this.vtabs_container_links.getElements('a').addEvent(this.clickEvent, function(e) {
            _this.stopAllAudios();
            e.preventDefault();
            button = e.target;
            if(button.hasClass('audio')){
                currentID = button.getParent().get('data-tab');
            }else{
                currentID = button.get('data-tab');
            }
            _this.showVerticalTab(currentID);
        });


        this.vtabs_next.addEvent(this.clickEvent, function(e) {
            e.preventDefault();
            _this.showVerticalTab(parseInt(_this.vtabs_current_tab) + 1);
        });
        this.vtabs_prev.addEvent(this.clickEvent, function(e) {
            e.preventDefault();
            _this.showVerticalTab(parseInt(_this.vtabs_current_tab) - 1);
        });


    },
    showVerticalTab: function(ID){


        this.vtabs_container_links.getElements('a')
            .setStyle('line-height' , this.vtabs_container_links.getElements('a').getHeight());

        this.vtabs_current_tab = ID;
        this.vtabs_container_links.getElements('a')
            .removeClass('active')
            //.setStyle('background-color', '#fff');
        this.vtabs_container_links.getElement('a[data-tab="'+ID+'"]')
            .addClass('active')
            //.setStyle('background-color', this.vtabs_triggers_container.get('data-color'))
            .focus();

        this.vtabs_container_content.getElements('div.vertical-tabs-content-container').hide();



        this.vtabs_container_content.getElement('div.vertical-tabs-content-container[data-tab="'+ID+'"]').show();


        text = this.vtabs_container_content
            .getElement('div.vertical-tabs-content-container[data-tab="'+ID+'"]')
            .getElement('div.vtab-text-content');


        text.setStyle('margin-top', '-' + text.getHeight()/2  - 30  + 'px');


        if(_this.vtabs_current_tab > 0){
            this.vtabs_prev.show();
        }else{
            this.vtabs_prev.hide();
        }

        if(parseInt(this.vtabs_current_tab) + 1  == this.options.vertical_tabs_data.length){
            this.vtabs_next.hide();
        }else{
            this.vtabs_next.show();
        }

        if(this.options.info == true){
            this.hideInfo();
        }



    },




    initWholePageScroll : function(){
        this.wps_pages = this.container.getElements('.whole-page-scroll-container');

        if(typeof this.wps_pages == 'undefined'){
            console.warn('you need to add containers with the class .whole-page-scroll-container for this to work');
            return false
        }
        if(typeof this.container.getElement('.page-scroll-controls') == 'undefined'){
            console.warn('you need to add the controls .page-scroll-controls for this to work');
            return false
        }
        if(this.wps_pages.length < 2){
            console.warn('you need to have at least 2 pages for this to work');
            return false;
        }

        this.wps_text_container = this.container.getElement('#scroll-page-text');
        if(!this.wps_text_container) {
            console.warn('the text container should have the ID "scroll-page-text" for this to work');
            return false;
        }

        this.wps_up = this.container.getElement('.page-scroll-controls .up');
        this.wps_down = this.container.getElement('.page-scroll-controls .down');
        this.wps_controls = this.container.getElements('.page-scroll-controls');

        this.wps_up.addClass('disabled');

        this.wps_pages[0].addClass('active');

        this.current_active_page = 0;

        this.wps_pages.each(function(page, i){
            page.set('data-page-scroll', i);
        })

        this.wps_controls.addEvent(this.clickEvent, function(e) {
            e.preventDefault();
            _this.scrollPage(e.target);
        });


        setInterval(function(){
            scroll = _this.container.getElement('#scroll-page-text').getScroll();
            //var maxScroll = Browser.name = 'firefox'?470:570;
            if(scroll.y >= maxScroll){
                _this.wps_controls.fireEvent("click", {
                    target: _this.wps_down,
                    preventDefault: function (){}

                });
            }else if(scroll.y == 0){
                _this.wps_controls.fireEvent("click", {
                    target: _this.wps_up,
                    preventDefault: function (){}

                });
            }
        },50)
    },
    scrollPageChangePage:function(direction){

        old_page = this.current_active_page;
        if(direction == 'down'){
            this.current_active_page++;
        }else if(direction =='up'){
            this.current_active_page--;
        }

        this.wps_pages[old_page].fade('out');
        this.wps_pages[this.current_active_page].fade('in');
    },
    scrollPage : function (button){
        if(button.hasClass('disabled')){
            return false;
        }


        if(this.wps_prevent_click){
            return false;
        }else{
            this.wps_prevent_click = true;
            setTimeout(function(){
                _this.wps_prevent_click = false;
            },500);
        }


        if(this.options.info){
            this.stopAudios = false;
            this.hideInfo();
        }



        if(button.hasClass('down')){
            direction = 'down';
            this.scrollPageChangePage(direction);
        }else if(button.hasClass('up')){
            direction = 'up';
            this.scrollPageChangePage(direction);
        }
        if( this.current_active_page + 1  == this.wps_pages.length){
            this.wps_up.removeClass('disabled');
            this.wps_down.addClass('disabled');

            this.scrollText(0,570, 'scroll-page-text')

        }else if( this.current_active_page  == 0){
            this.wps_up.addClass('disabled');
            this.wps_down.removeClass('disabled');

            this.scrollText(0,0, 'scroll-page-text');

        }
    },
    scrollText: function(x, y, container){
        var myFx = new Fx.Scroll(container, {
            offset: {
                x: x,
                y: y
            }
        }).toTop();
    },
    initSimpleTextScroll : function(){

        this.sts_container = this.container.getElement('#simple-scroll-container');

        if(typeof this.sts_container == 'undefined'){
            console.warn('you need to add a containers with the ID .simple-scroll-container for this to work');
            return false
        }
        if(typeof this.container.getElement('.page-scroll-controls') == 'undefined'){
            console.warn('you need to add the controls .page-scroll-controls for this to work');
            return false
        }

        this.sts_up = this.container.getElement('.page-scroll-controls .up');
        this.sts_down = this.container.getElement('.page-scroll-controls .down');
        this.sts_controls = this.container.getElements('.page-scroll-controls');

        this.sts_up.addClass('disabled');

        this.sts_controls.addEvent(this.clickEvent, function(e) {
            e.preventDefault();
            _this.scrollEvents(e.target);
        });


        setInterval(function(){
             scroll = _this.container.getElement('#simple-scroll-container').getScroll();
             if(scroll.y >= 70){
                 _this.sts_controls.fireEvent("click", {
                     target: _this.sts_down,
                     preventDefault: function (){}
                 });
             }else if(scroll.y == 0){
                 _this.sts_controls.fireEvent("click", {
                     target: _this.sts_up,
                     preventDefault: function (){}
                });
             }
         },1000)

    },
    scrollEvents: function(button){

        if(this.sts_prevent_click){
            return false;
        }else{
            this.sts_prevent_click = true;
            setTimeout(function(){
                _this.sts_prevent_click = false;
            },500);
        }

        if(button.hasClass('down')){
            this.sts_up.removeClass('disabled');
            this.sts_down.addClass('disabled');
            this.scrollText(0, 560, 'simple-scroll-container');

        }else if( button.hasClass('up')){
            this.sts_up.addClass('disabled');
            this.sts_down.removeClass('disabled');
            this.scrollText(0, 0, 'simple-scroll-container');
        }
    },
    /* ZOOM LOUPE */
    initZoomLoupe :function () {
        // mooloupe.js and mouloupe.css libraries must be added to the html
        var _this = this;
        this.loupeDom();
        this.mooloupe = new md.widgets.MooLoupe(this.options.zloupe_data.container, {
            width: 300,
            height: 300,
            magnification: 0.97,
            controls: false,
            hidden: true,
            circular: true,
            padding: 8,
            xPosition:this.options.zloupe_data.xPosition,
            yPosition:this.options.zloupe_data.yPosition,
            'main-image': $(this.options.zloupe_data.imageId)
        });
        this.loupeBuildAction();

    },
    loupeDom: function() {
        var _this = this;
        this.main_container = new Element ('div.main-container').inject(this.options.zloupe_data.container);
        this.main_image = new Element ('img.main-image',{src: this.options.zloupe_data.imageSrc, id:this.options.zloupe_data.imageId}).inject(this.main_container);
    },
    loupeBuildAction: function() {
        var _this = this; 
        var loupe_button = $$('.zoomin-loupe-btn')[0];
        loupe_button.addEvent('click', function(e){
            e.preventDefault();

            this.toggleClass('out');

            if(_this.options.info){
                _this.hideInfo();
            }
            _this.mooloupe.toggle();
        }); 
    },
    hideZoomLoupe: function(){
        var _this = this; 
        _this.mooloupe.close_loupe();
    },
    /* SCIENCE IN A SNAP */
    initScienceInASnap: function() {
        _this = this;

        this.sia_container = this.container.getElement('.science-in-a-snap');
        this.content_container = this.sia_container.getElement('.blue-box');
        this.sia_tabs_container = this.sia_container.getElement('ul');
        _this.isaDom(this.content_container);
        var tab_item=[];
        this.options.sia_data.each(function(item, i){
            tab_item[i] = new Element ('li',{html: _this.returnBreakTag(item.title)}).inject(_this.sia_tabs_container);
            tab_item[i].addEvent('click', function(e){
                _this.isaBuildAction(i, _this.options.sia_data[i],1);
                _this.stopAllAudios();
            });
        });  
        _this.isaBuildAction(0,_this.options.sia_data[0],0);
    },
    isaDom: function(container) {
        var _this = this;
        this.image_container = new Element ('div.pic-holder').inject(container);
        this.image_element = new Element ('img.round').inject(this.image_container);
        this.box_container = new Element ('div.textbox.white').inject(container);

        this.text_number = new Element('span.number').inject(this.box_container);

        this.audio_container = new Element ('span.audio-large').inject(this.box_container);
        this.audio_container.addClass('white');
        this.audio_container.addClass('audio');
        this.audio_player = new Element ('audio.sia_audio').inject(this.audio_container);
        this.audio_player.set('controls','controls');
        this.audio_error_container = new Element ('span.err').inject(this.audio_player);
        this.audio_error_message = new Element ('span').inject(this.audio_error_container);
        this.audio_error_message.set('html','Sorry, it appears your system does not support audio playback.');
        
        this.text_container = new Element ('p.sia_text').inject(this.box_container);
        this.image_text = new Element ('span.text').inject(this.image_element, 'after');
    },
    isaBuildAction: function(index, data, init) {
        _this = this;
        $$('.science-in-a-snap li').removeClass('selected');
        $$('.science-in-a-snap li').addClass('science-in-a-snap-tab-trigger');
        $$('.science-in-a-snap li')[index].addClass('selected');
        $$('.science-in-a-snap .sia_audio')[0].set('src', data.audio);
        if(data.audio_class){
           $$('.science-in-a-snap .white .audio-large')[0].addClass(data.audio_class);
        }else {
            $$('.science-in-a-snap .white .audio-large')[0].set('class', 'audio-large white audio')
        }
        if(data.image){
           $$('.science-in-a-snap .pic-holder .round')[0].set('src', data.image);
           $$('.science-in-a-snap .pic-holder .round')[0].set('alt', data.image_alt);
           $$('.science-in-a-snap .pic-holder')[0].show();
        }else{
            $$('.science-in-a-snap .pic-holder .round')[0].set('src', '');
            $$('.science-in-a-snap .pic-holder')[0].hide();
        }
        if (data.image_text) {
            $$('.science-in-a-snap .pic-holder .text')[0].set('html', _this.returnBreakTag(data.image_text));
            if(init == 1)
            {
                $$('.science-in-a-snap .pic-holder .text')[0].getElements('.audio').removeEvent('click').addEvent('click', function(e) {
                    e.preventDefault();
                    _this.toggleAudio(e.target);
                });
            }
        }
        if (data.number !== '') {
            $$('.science-in-a-snap .number')[0].show();
            $$('.science-in-a-snap .sia_text')[0].removeClass('last');
            $$('.science-in-a-snap .number')[0].set('html', data.number);
        } else {
            $$('.science-in-a-snap .number')[0].hide();
            $$('.science-in-a-snap .sia_text')[0].addClass('last');
        }
        $$('.science-in-a-snap p.sia_text')[0].set('html', _this.returnBreakTag(data.text));

        if(this.options.glossary == true){
            this.closeGlossaryTerms();
        }
        if(this.options.info == true){
            this.hideInfo();
        }
        if(this.options.page_hotspots == true){
            this.hideHotspots();
        }

    },
    
    /* ACESSIBILITY */
    initAccessibility :function(){

        this.injectAccessCSS();
        this.setTabIndex();

        /* DYNAMIC OUTLINE */

        window.lastKey = new Date();
        window.lastClick = new Date();
        document.addEvent('focusin', function(e) {
            $$(".non-keyboard-outline").removeClass("non-keyboard-outline");
            var wasByKeyboard = lastClick < lastKey;
            if (wasByKeyboard) {
                e.target.addClass( "non-keyboard-outline");
            }
        });
        document.addEvent('click', function(){
            window.lastClick = new Date();
        });
        document.addEvent('keydown', function() {
            window.lastKey = new Date();
        });

        document.onkeydown = function(e) {
            if (e.keyCode == 32 || e.keyCode == 13) {
                _this.triggerActions(e);
            }
        };

    },
    setTabIndex : function(){
        this.container.getElements('.audio').set('tabindex', 0);
        this.container.getElements('.icon-close').set('tabindex', 0);
        this.container.getElements('.glossaryterm').set('tabindex', 0);
        this.container.getElements('.investigate .menu li').set('tabindex', 0);
        this.container.getElements('.toggle-button').set('tabindex', 0);
        this.container.getElements('.tab-link').set('tabindex', 0);
        this.container.getElements('.main-title').set('tabindex', 0);
        this.container.getElements('.main-title2').set('tabindex', 0);
        this.container.getElements('.main-title3').set('tabindex', 0);
        this.container.getElements('.vertical-tabs-links a').set('tabindex', 0);
        this.container.getElements('.science-in-a-snap li').set('tabindex', 0);
        this.container.getElements('.srollable-page-trigger').set('tabindex', 0);
    },
    injectAccessCSS:function(){
        var headTag = document.getElementsByTagName("head")[0];
        style = document.createElement('style');
        style.type = 'text/css';
        css = '*:active,*:focus{outline:none;}*:active.non-keyboard-outline,*:focus.non-keyboard-outline{outline:rgba(125,173,217,0.4) solid 2px;box-shadow:0 0 6px rgb(125,173,217);}';
        if (style.styleSheet){
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
        document.head.appendChild(style);
    },
    triggerActions : function(e){
        element = document.activeElement;
        if(element.hasClass('glossaryterm')){
            element.fireEvent("click", e);
        }
        if(element.hasClass('audio')){
            element.fireEvent("click", e);
        }
        if(element.hasClass('tab-link')){
            element.fireEvent("click", e);
        }
        if(element.hasClass('toggle-button')){
            this.togglePage(e.target);
        }
        if(element.hasClass('vtabs-link')){
            element.fireEvent("click", e);
        }
        if(element.hasClass('science-in-a-snap-tab-trigger')){
            element.fireEvent("click", e);
        }
        if(element.hasClass('srollable-page-trigger')){
            element.fireEvent("click", e);
        }
    }
});