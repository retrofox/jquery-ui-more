(function($) {
  $.widget( "ui.scrollbar", {
      options: {
          sides: 'y'
        , classPrefix: 'scrollbar-'
        , height: 300
      }
    
    , _create: function() {
        this.slider = {};
        this.step = {
          x: 40,
          y: 40
        };

        // alias
        var _o = this.options
          , cp = _o.classPrefix
          , _sd = _o.sides
          ;
        // determine which bar will be added
        this.add = {
          x: _sd == 'both' || _o.sides == 'x' ? true : false,
          y: _sd == 'both' || _o.sides == 'y' ? true : false
        }

        // dims to calculate
        var _d = this.dims = {x: {}, y: {}};

        // ** scrollbar-placeholder **
        if(!this.element.children(cp+'placeholder').length)
          this.element.wrapInner($('<div class="' + cp + 'placeholder" />'));

        _d.x.h = this.element.width();
        _d.y.h = this.element.height();

        this.placeholder = this.element.find('.'+cp+'placeholder')
          .css('position', 'relative')
          .height(_d.y.h);
       
        // ** scrollbar-wrapper
        if(!this.placeholder.find(cp+'wrapper').length)
          this.placeholder.wrapInner($('<div class="' + cp + 'wrapper" />'));
        
        this.wrapper = this.placeholder.find('.'+cp+'wrapper')
          .css('overflow', 'hidden')
          .outerHeight(_d.y.h);

        // ** scrollbar-container **
        if(!this.wrapper.find(cp+'container').length)
          this.wrapper.wrapInner($('<div class="' + cp + 'container" />'));
        this.container = this.wrapper.find('.'+cp+'container');

        _d.x.c = this.container.outerWidth();
        _d.y.c = this.container.outerHeight();

        // percentage
        _d.y.p = _d.y.h/_d.y.c;

        // offset
        this.offset = {
          y: _d.y.c - _d.y.h
        }

        // add Scrollbar
        this._addScrollbar();
      }

    , _addScrollbar: function() {
        var self = this;

        // * Y scrollbar *
        if(this.add.y && this.offset.y > 0) {

          // add slider
          if(!this.wrapper.find('.ui-slider-vertical').length)
            this.slider.y =  $('<div class="ui-slider-vertical" />')
              .css({
                position: 'absolute',
                top: 0,
                right: 0,
                width: 0
              })
              .appendTo(this.placeholder);
        
          (this.slider.y).slider({
            orientation: "vertical",
            min: 0,
            max: 100,
            value: 100,
            slide: function( event, ui ){
              self.setPosition(100-ui.value);
            }
          });

          // slide handle element
          var handle = this.slider.y.find('.ui-slider-handle');

          // set handle height
          handle.outerHeight(Math.round(this.dims.y.h*this.dims.y.p));
          
          // re-calculate positions/dims
          var hH = handle.outerHeight()
            , hmH = Math.round(hH/2)
            , hS = this.dims.y.h - parseInt(this.slider.y.css('margin-top'))*2 - hH

          // slider size/position
          this.slider.y.css({
            height: hS,
            top: hH
          });

          // handle slide/position 
          handle.css({
            left: -Math.round(handle.outerWidth()/2),
            marginTop: -Math.round(hmH)
          });

        // add mousewheel event
        this.placeholder.mousewheel(function(ev, d, x, y){
          ev.preventDefault();
          var vs = self.slider.y.slider('value');
          self.slider.y.slider('value', vs+d*self.step.y);

          self.setPosition(100 - self.slider.y.slider('value'));
        });

      }
    }
    , setPosition: function(v){ 
        this.wrapper.scrollTop(this.offset.y*v/100);
      }


    , _destroy: function(){ 
        this.placeholder.remove();
      }

  });
})(jQuery);
//TODO
//implement horizontal scrollbar
