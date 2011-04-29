(function($) {
  $.widget( "ui.scrollbar", {
      options: {
          sides: 'both'
        , classPrefix: 'scrollbar-'
        , height: 300
        , handleMinHeight: 50
        , handleMinWidth: 50
      }
    
    , _create: function(options) {
        this.slider = {};
        this.step = {
          x: 20,
          y: 20
        };

        // alias
        var _o = this.options
          , _sd = _o.sides
          ;

        // dims to calculate
        var _d = this.dims = {
          x: {
            h: this.element.width(),
            c: this.element.children().outerWidth()
          },
          y: {
            h: this.element.height(),
            c: this.element.children().outerHeight()
          }
        };
        // percentage
        _d.y.p = _d.y.h/_d.y.c;
        _d.x.p = _d.x.h/_d.x.c;

        // offset
        this.offset = {
          x: _d.x.c - _d.x.h,
          y: _d.y.c - _d.y.h
        }

        // determine which bar will be added
        this.add = {
          x: (_sd == 'both' || _o.sides == 'x' ? true : false) && (this.offset.x > 0),
          y: (_sd == 'both' || _o.sides == 'y' ? true : false) && (this.offset.y > 0)
        }

        // add aditional DOM elements
        this._addElements();

        // add Scrollbar
        this._addScrollbar();
      }

    , _addElements: function() {
        if(this.add.x || this.add.y) {
          var cp = this.options.classPrefix

          // ** scrollbar-placeholder **
          if(!this.element.children(cp+'placeholder').length)
            this.element.wrapInner($('<div class="' + cp + 'placeholder" />'));

          this.placeholder = this.element.find('.'+cp+'placeholder')
            .css('position', 'relative')
            .width(this.dims.x.h)
            .height(this.dims.y.h);
       
          // ** scrollbar-wrapper
          if(!this.placeholder.find(cp+'wrapper').length)
            this.placeholder.wrapInner($('<div class="' + cp + 'wrapper" />'));
        
          this.wrapper = this.placeholder.find('.'+cp+'wrapper')
            .css('overflow', 'hidden')
            .outerWidth(this.dims.x.h)
            .outerHeight(this.dims.y.h);
        }
     }

    , _addScrollbar: function() {
        var self = this;

        // add slider
        var addSlider = function(type) {
          var isV = type == 'vertical'
            , dims = self.dims[(isV ? 'y' : 'x')]

          // scrollbar css properties
          var cssPrps = {
                position: 'absolute',
              };
            cssPrps = $.extend(cssPrps, isV ? {
              top: 0,
              right: 0,
              width: 0
            } : {
              bottom: 0,
              left: 0,
              height: 0
            });

          if(!self.wrapper.find('.ui-slider-' + type).length)
            var elSlider = self.slider[isV ? 'y' : 'x'] =  $('<div class="ui-slider-'+type+'" />')
              .css(cssPrps)
              .appendTo(self.placeholder);

          elSlider.slider({
            orientation: type,
            min: 0,
            max: 100,
            value: isV ? 100 : 0,
            slide: function( event, ui ){
              self.setPosition(isV ? (100-ui.value) : ui.value, isV);
            }
          });

          // slide handle element
          var handle = elSlider.find('.ui-slider-handle');

          // set handle height/width
          var handleSize = Math.max(Math.round(dims.h*dims.p), self.options['handleMin'+(isV ? 'Height' : 'Width')])
          handle['outer' + (isV ? 'Height' : 'Width')](handleSize);
          
          // re-calculate positions/dims
          var hH = handleSize
            , hmH = Math.round(hH/2)
            , hS = dims.h - parseInt(elSlider.css(isV ? 'margin-top' : 'margin-left'))*2 - hH

          // slider size/position
          elSlider.css(isV ? {
            height: hS,
            top: hH
          } : {
            width: hS,
            left: hmH
          });

          // handle slide/position 
          handle.css(isV ? {
            left: -Math.round(handle.outerWidth()/2),
            marginTop: -Math.round(hmH)
          }: {
            top: -Math.round(handle.outerHeight()/2),
            marginLeft: -Math.round(hmH)
          });

          // add mousewheel event
          self.placeholder.mousewheel(function(ev, d, x, y){
            ev.preventDefault();
            var vs = elSlider.slider('value');
            elSlider.slider('value', vs+d*self.step[isV ? 'y' : 'x']);

            self.setPosition(100 - elSlider.slider('value'), isV);
          });
        }

        if(this.add.y)
          addSlider('vertical');

        if(this.add.x)
          addSlider('horizontal');

      }

    , setPosition: function(v, isV){
        this.wrapper['scroll' + (isV ? 'Top' : 'Left')](this.offset[isV ? 'y' : 'x']*v/100);
      }


    , _destroy: function(){ 
//        this.placeholder.remove();
      }

  });
})(jQuery);
//TODO
// destroy method
