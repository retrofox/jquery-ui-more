(function($) {
  $.widget( "ui.scrollbar", {
      options: {
          sides: 'both'
        , classPrefix: 'scrollbar-'
        , height: 300
      }
    
    , _create: function() {
        this.slider = {};
        this.step = {
          x: 10,
          y: 10
        };

        var cp = this.options.classPrefix;

        // scrollbar elements
        if(!this.element.children(cp+'placeholder').length)
          this.element.wrapInner($('<div class="' + cp + 'placeholder" />'));
        this.placeholder = this.element.find('.'+cp+'placeholder')
          .height(this.element.height() || this.options.height);
        
        if(!this.placeholder.find(cp+'wrapper').length)
          this.placeholder.wrapInner($('<div class="' + cp + 'wrapper" />'));
        this.wrapper = this.placeholder.find('.'+cp+'wrapper').outerHeight(this.placeholder.outerHeight());

        if(!this.wrapper.find(cp+'container').length)
          this.wrapper.wrapInner($('<div class="' + cp + 'container" />'));
        this.container = this.wrapper.find('.'+cp+'container')

        // dimms
        this.offset = {
          y: this.container.outerHeight() - this.wrapper.outerHeight()
        }
        // add Scrollbar
        this._addScrollbar();
      }

    , _addScrollbar: function() {
        var self = this;
        // Y scrollbar
        if(this.offset.y > 0) {
        // Slider
        if(!this.wrapper.find('.ui-slider-vertical').length)
          this.slider.y =  $('<div class="ui-slider-vertical" />').appendTo(this.placeholder);
        
        (this.slider.y).slider({
          orientation: "vertical",
          min: 0,
          max: 100,
          value: 100,
          slide: function( event, ui ){
            self.setPosition(100-ui.value);
          }
        });

        //  dims
        var handle = this.slider.y.find('.ui-slider-handle')
          , hH = handle.outerHeight()
          , mH = Math.round(hH/2)
          , hS = this.placeholder.outerHeight() - parseInt(this.slider.y.css('margin-top'))*2 - hH

        // size/position corrections
        this.slider.y.css({
          height: hS,
          top: hH
        });

        handle.css({
          marginTop: -Math.round(mH)
        });

      // mousewheel to placeholder
      this.placeholder.mousewheel(function(ev, d, x, y){
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
