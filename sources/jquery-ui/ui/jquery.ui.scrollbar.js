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
          x: 10,
          y: 10
        };

        // alias
        var _o = this.options
          , cp = _o.classPrefix
          ;
        // determine which bar will be added
        this.add = {
          x: _o.sides == 'both' || _o.sides == 'x' ? true : false,
          y: _o.sides == 'both' || _o.sides == 'y' ? true : false
        }

        console.debug('this.add -> ', this.add);


        // * scrollbar elements *

        // ** scrollbar-placeholder **
        if(!this.element.children(cp+'placeholder').length)
          this.element.wrapInner($('<div class="' + cp + 'placeholder" />'));

        this.placeholder = this.element.find('.'+cp+'placeholder')
          .css('position', 'relative')
          .height(this.element.height() || this.options.height);
       
        // ** scrollbar-wrapper
        if(!this.placeholder.find(cp+'wrapper').length)
          this.placeholder.wrapInner($('<div class="' + cp + 'wrapper" />'));

        this.wrapper = this.placeholder.find('.'+cp+'wrapper')
          //.css('overflow', 'hidden')
          .css('overflow', 'auto')
          .outerHeight(this.placeholder.outerHeight());

        // ** scrollbar-container **
        if(!this.wrapper.find(cp+'container').length)
          this.wrapper.wrapInner($('<div class="' + cp + 'container" />'));
        this.container = this.wrapper.find('.'+cp+'container');

        // offset
        this.offset = {
          y: this.container.outerHeight() - this.wrapper.outerHeight()
        }
        // add Scrollbar
        this._addScrollbar();
      }

    , _addScrollbar: function() {
        var self = this;

        // * Y scrollbar *
        if(this.offset.y > 0) {

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

          // recalculation of position
          var handle = this.slider.y.find('.ui-slider-handle')  // slide handle element
            , hH = handle.outerHeight()
            , mH = Math.round(hH/2)
            , hS = this.placeholder.outerHeight() - parseInt(this.slider.y.css('margin-top'))*2 - hH

          // esislider size/position
          this.slider.y.css({
            height: hS,
            top: hH
          });

          // 
          handle.css({
            left: -Math.round(handle.outerWidth()/2),
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
