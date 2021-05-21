(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["app"],{

/***/ "./assets/bundles/omines-datatables/js/datatables.js":
/*!***********************************************************!*\
  !*** ./assets/bundles/omines-datatables/js/datatables.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! core-js/modules/es.array.concat */ "./node_modules/core-js/modules/es.array.concat.js");

__webpack_require__(/*! core-js/modules/es.array.filter */ "./node_modules/core-js/modules/es.array.filter.js");

__webpack_require__(/*! core-js/modules/es.array.index-of */ "./node_modules/core-js/modules/es.array.index-of.js");

__webpack_require__(/*! core-js/modules/es.array.join */ "./node_modules/core-js/modules/es.array.join.js");

__webpack_require__(/*! core-js/modules/es.function.name */ "./node_modules/core-js/modules/es.function.name.js");

__webpack_require__(/*! core-js/modules/es.object.to-string */ "./node_modules/core-js/modules/es.object.to-string.js");

__webpack_require__(/*! core-js/modules/es.promise */ "./node_modules/core-js/modules/es.promise.js");

__webpack_require__(/*! core-js/modules/es.regexp.exec */ "./node_modules/core-js/modules/es.regexp.exec.js");

__webpack_require__(/*! core-js/modules/es.string.replace */ "./node_modules/core-js/modules/es.string.replace.js");

__webpack_require__(/*! core-js/modules/es.string.search */ "./node_modules/core-js/modules/es.string.search.js");

__webpack_require__(/*! core-js/modules/es.string.split */ "./node_modules/core-js/modules/es.string.split.js");

/**
 * Symfony DataTables Bundle
 * (c) Omines Internetbureau B.V. - https://omines.nl/
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @author Niels Keurentjes <niels.keurentjes@omines.com>
 */
(function ($) {
  /**
   * Initializes the datatable dynamically.
   */
  $.fn.initDataTables = function (config, options) {
    var root = this,
        config = $.extend({}, $.fn.initDataTables.defaults, config),
        state = ''; // Load page state if needed

    switch (config.state) {
      case 'fragment':
        state = window.location.hash;
        break;

      case 'query':
        state = window.location.search;
        break;
    }

    state = state.length > 1 ? deparam(state.substr(1)) : {};
    var persistOptions = config.state === 'none' ? {} : {
      stateSave: true,
      stateLoadCallback: function stateLoadCallback(s, cb) {
        // Only need stateSave to expose state() function as loading lazily is not possible otherwise
        return null;
      }
    };
    return new Promise(function (fulfill, reject) {
      // Perform initial load
      $.ajax(config.url, {
        method: config.method,
        data: {
          _dt: config.name,
          _init: true
        }
      }).done(function (data) {
        var baseState; // Merge all options from different sources together and add the Ajax loader

        var dtOpts = $.extend({}, data.options, config.options, options, persistOptions, {
          ajax: function ajax(request, drawCallback, settings) {
            if (data) {
              data.draw = request.draw;
              drawCallback(data);
              data = null; // if (Object.keys(state).length) {
              //     var merged = $.extend(true, {}, dt.state(), state);
              //     dt
              //         .order(merged.order)
              //         .search(merged.search.search)
              //         .page.len(merged.length)
              //         .page(merged.start / merged.length)
              //         .draw(false);
              // }
            } else {
              request._dt = config.name;
              $.ajax(config.url, {
                method: config.method,
                data: request
              }).done(function (data) {
                drawCallback(data);
              });
            }
          }
        });
        root.html(data.template);
        dt = $('table', root).DataTable(dtOpts);

        if (config.state !== 'none') {
          dt.on('draw.dt', function (e) {
            var data = $.param(dt.state()).split('&'); // First draw establishes state, subsequent draws run diff on the first

            if (!baseState) {
              baseState = data;
            } else {
              var diff = data.filter(function (el) {
                return baseState.indexOf(el) === -1 && el.indexOf('time=') !== 0;
              });

              switch (config.state) {
                case 'fragment':
                  history.replaceState(null, null, window.location.origin + window.location.pathname + window.location.search + '#' + decodeURIComponent(diff.join('&')));
                  break;

                case 'query':
                  history.replaceState(null, null, window.location.origin + window.location.pathname + '?' + decodeURIComponent(diff.join('&') + window.location.hash));
                  break;
              }
            }
          });
        }

        fulfill(dt);
      }).fail(function (xhr, cause, msg) {
        console.error('DataTables request failed: ' + msg);
        reject(cause);
      });
    });
  };
  /**
   * Provide global component defaults.
   */


  $.fn.initDataTables.defaults = {
    method: 'POST',
    state: 'fragment',
    url: window.location.origin + window.location.pathname
  };
  /**
   * Convert a querystring to a proper array - reverses $.param
   */

  function deparam(params, coerce) {
    var obj = {},
        coerce_types = {
      'true': !0,
      'false': !1,
      'null': null
    };
    $.each(params.replace(/\+/g, ' ').split('&'), function (j, v) {
      var param = v.split('='),
          key = decodeURIComponent(param[0]),
          val,
          cur = obj,
          i = 0,
          keys = key.split(']['),
          keys_last = keys.length - 1;

      if (/\[/.test(keys[0]) && /\]$/.test(keys[keys_last])) {
        keys[keys_last] = keys[keys_last].replace(/\]$/, '');
        keys = keys.shift().split('[').concat(keys);
        keys_last = keys.length - 1;
      } else {
        keys_last = 0;
      }

      if (param.length === 2) {
        val = decodeURIComponent(param[1]);

        if (coerce) {
          val = val && !isNaN(val) ? +val // number
          : val === 'undefined' ? undefined // undefined
          : coerce_types[val] !== undefined ? coerce_types[val] // true, false, null
          : val; // string
        }

        if (keys_last) {
          for (; i <= keys_last; i++) {
            key = keys[i] === '' ? cur.length : keys[i];
            cur = cur[key] = i < keys_last ? cur[key] || (keys[i + 1] && isNaN(keys[i + 1]) ? {} : []) : val;
          }
        } else {
          if ($.isArray(obj[key])) {
            obj[key].push(val);
          } else if (obj[key] !== undefined) {
            obj[key] = [obj[key], val];
          } else {
            obj[key] = val;
          }
        }
      } else if (key) {
        obj[key] = coerce ? undefined : '';
      }
    });
    return obj;
  }
})(jQuery);

/***/ }),

/***/ "./assets/bundles/toast/css/jquery.toast.css":
/*!***************************************************!*\
  !*** ./assets/bundles/toast/css/jquery.toast.css ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./assets/bundles/toast/js/jquery.toast.js":
/*!*************************************************!*\
  !*** ./assets/bundles/toast/js/jquery.toast.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! core-js/modules/es.symbol */ "./node_modules/core-js/modules/es.symbol.js");

__webpack_require__(/*! core-js/modules/es.symbol.description */ "./node_modules/core-js/modules/es.symbol.description.js");

__webpack_require__(/*! core-js/modules/es.symbol.iterator */ "./node_modules/core-js/modules/es.symbol.iterator.js");

__webpack_require__(/*! core-js/modules/es.array.find */ "./node_modules/core-js/modules/es.array.find.js");

__webpack_require__(/*! core-js/modules/es.array.index-of */ "./node_modules/core-js/modules/es.array.index-of.js");

__webpack_require__(/*! core-js/modules/es.array.iterator */ "./node_modules/core-js/modules/es.array.iterator.js");

__webpack_require__(/*! core-js/modules/es.array.slice */ "./node_modules/core-js/modules/es.array.slice.js");

__webpack_require__(/*! core-js/modules/es.object.create */ "./node_modules/core-js/modules/es.object.create.js");

__webpack_require__(/*! core-js/modules/es.object.to-string */ "./node_modules/core-js/modules/es.object.to-string.js");

__webpack_require__(/*! core-js/modules/es.parse-int */ "./node_modules/core-js/modules/es.parse-int.js");

__webpack_require__(/*! core-js/modules/es.string.iterator */ "./node_modules/core-js/modules/es.string.iterator.js");

__webpack_require__(/*! core-js/modules/web.dom-collections.iterator */ "./node_modules/core-js/modules/web.dom-collections.iterator.js");

__webpack_require__(/*! core-js/modules/web.timers */ "./node_modules/core-js/modules/web.timers.js");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

// jQuery toast plugin created by Kamran Ahmed copyright MIT license 2015
if (typeof Object.create !== 'function') {
  Object.create = function (obj) {
    function F() {}

    F.prototype = obj;
    return new F();
  };
}

(function ($, window, document, undefined) {
  "use strict";

  var Toast = {
    _positionClasses: ['bottom-left', 'bottom-right', 'top-right', 'top-left', 'bottom-center', 'top-center', 'mid-center'],
    _defaultIcons: ['success', 'error', 'info', 'warning'],
    init: function init(options, elem) {
      this.prepareOptions(options, $.toast.options);
      this.process();
    },
    prepareOptions: function prepareOptions(options, options_to_extend) {
      var _options = {};

      if (typeof options === 'string' || options instanceof Array) {
        _options.text = options;
      } else {
        _options = options;
      }

      this.options = $.extend({}, options_to_extend, _options);
    },
    process: function process() {
      this.setup();
      this.addToDom();
      this.position();
      this.bindToast();
      this.animate();
    },
    setup: function setup() {
      var _toastContent = '';
      this._toastEl = this._toastEl || $('<div></div>', {
        "class": 'jq-toast-single'
      }); // For the loader on top

      _toastContent += '<span class="jq-toast-loader"></span>';

      if (this.options.allowToastClose) {
        _toastContent += '<span class="close-jq-toast-single">&times;</span>';
      }

      ;

      if (this.options.text instanceof Array) {
        if (this.options.heading) {
          _toastContent += '<h2 class="jq-toast-heading">' + this.options.heading + '</h2>';
        }

        ;
        _toastContent += '<ul class="jq-toast-ul">';

        for (var i = 0; i < this.options.text.length; i++) {
          _toastContent += '<li class="jq-toast-li" id="jq-toast-item-' + i + '">' + this.options.text[i] + '</li>';
        }

        _toastContent += '</ul>';
      } else {
        if (this.options.heading) {
          _toastContent += '<h2 class="jq-toast-heading">' + this.options.heading + '</h2>';
        }

        ;
        _toastContent += this.options.text;
      }

      this._toastEl.html(_toastContent);

      if (this.options.bgColor !== false) {
        this._toastEl.css("background-color", this.options.bgColor);
      }

      ;

      if (this.options.textColor !== false) {
        this._toastEl.css("color", this.options.textColor);
      }

      ;

      if (this.options.textAlign) {
        this._toastEl.css('text-align', this.options.textAlign);
      }

      if (this.options.icon !== false) {
        this._toastEl.addClass('jq-has-icon');

        if ($.inArray(this.options.icon, this._defaultIcons) !== -1) {
          this._toastEl.addClass('jq-icon-' + this.options.icon);
        }

        ;
      }

      ;

      if (this.options["class"] !== false) {
        this._toastEl.addClass(this.options["class"]);
      }
    },
    position: function position() {
      if (typeof this.options.position === 'string' && $.inArray(this.options.position, this._positionClasses) !== -1) {
        if (this.options.position === 'bottom-center') {
          this._container.css({
            left: $(window).outerWidth() / 2 - this._container.outerWidth() / 2,
            bottom: 20
          });
        } else if (this.options.position === 'top-center') {
          this._container.css({
            left: $(window).outerWidth() / 2 - this._container.outerWidth() / 2,
            top: 20
          });
        } else if (this.options.position === 'mid-center') {
          this._container.css({
            left: $(window).outerWidth() / 2 - this._container.outerWidth() / 2,
            top: $(window).outerHeight() / 2 - this._container.outerHeight() / 2
          });
        } else {
          this._container.addClass(this.options.position);
        }
      } else if (_typeof(this.options.position) === 'object') {
        this._container.css({
          top: this.options.position.top ? this.options.position.top : 'auto',
          bottom: this.options.position.bottom ? this.options.position.bottom : 'auto',
          left: this.options.position.left ? this.options.position.left : 'auto',
          right: this.options.position.right ? this.options.position.right : 'auto'
        });
      } else {
        this._container.addClass('bottom-left');
      }
    },
    bindToast: function bindToast() {
      var that = this;

      this._toastEl.on('afterShown', function () {
        that.processLoader();
      });

      this._toastEl.find('.close-jq-toast-single').on('click', function (e) {
        e.preventDefault();

        if (that.options.showHideTransition === 'fade') {
          that._toastEl.trigger('beforeHide');

          that._toastEl.fadeOut(function () {
            that._toastEl.trigger('afterHidden');
          });
        } else if (that.options.showHideTransition === 'slide') {
          that._toastEl.trigger('beforeHide');

          that._toastEl.slideUp(function () {
            that._toastEl.trigger('afterHidden');
          });
        } else {
          that._toastEl.trigger('beforeHide');

          that._toastEl.hide(function () {
            that._toastEl.trigger('afterHidden');
          });
        }
      });

      if (typeof this.options.beforeShow == 'function') {
        this._toastEl.on('beforeShow', function () {
          that.options.beforeShow();
        });
      }

      ;

      if (typeof this.options.afterShown == 'function') {
        this._toastEl.on('afterShown', function () {
          that.options.afterShown();
        });
      }

      ;

      if (typeof this.options.beforeHide == 'function') {
        this._toastEl.on('beforeHide', function () {
          that.options.beforeHide();
        });
      }

      ;

      if (typeof this.options.afterHidden == 'function') {
        this._toastEl.on('afterHidden', function () {
          that.options.afterHidden();
        });
      }

      ;
    },
    addToDom: function addToDom() {
      var _container = $('.jq-toast-wrap');

      if (_container.length === 0) {
        _container = $('<div></div>', {
          "class": "jq-toast-wrap",
          role: "alert",
          "aria-live": "polite"
        });
        $('body').append(_container);
      } else if (!this.options.stack || isNaN(parseInt(this.options.stack, 10))) {
        _container.empty();
      }

      _container.find('.jq-toast-single:hidden').remove();

      _container.append(this._toastEl);

      if (this.options.stack && !isNaN(parseInt(this.options.stack), 10)) {
        var _prevToastCount = _container.find('.jq-toast-single').length,
            _extToastCount = _prevToastCount - this.options.stack;

        if (_extToastCount > 0) {
          $('.jq-toast-wrap').find('.jq-toast-single').slice(0, _extToastCount).remove();
        }

        ;
      }

      this._container = _container;
    },
    canAutoHide: function canAutoHide() {
      return this.options.hideAfter !== false && !isNaN(parseInt(this.options.hideAfter, 10));
    },
    processLoader: function processLoader() {
      // Show the loader only, if auto-hide is on and loader is demanded
      if (!this.canAutoHide() || this.options.loader === false) {
        return false;
      }

      var loader = this._toastEl.find('.jq-toast-loader'); // 400 is the default time that jquery uses for fade/slide
      // Divide by 1000 for milliseconds to seconds conversion


      var transitionTime = (this.options.hideAfter - 400) / 1000 + 's';
      var loaderBg = this.options.loaderBg;
      var style = loader.attr('style') || '';
      style = style.substring(0, style.indexOf('-webkit-transition')); // Remove the last transition definition

      style += '-webkit-transition: width ' + transitionTime + ' ease-in; \
                      -o-transition: width ' + transitionTime + ' ease-in; \
                      transition: width ' + transitionTime + ' ease-in; \
                      background-color: ' + loaderBg + ';';
      loader.attr('style', style).addClass('jq-toast-loaded');
    },
    animate: function animate() {
      var that = this;

      this._toastEl.hide();

      this._toastEl.trigger('beforeShow');

      if (this.options.showHideTransition.toLowerCase() === 'fade') {
        this._toastEl.fadeIn(function () {
          that._toastEl.trigger('afterShown');
        });
      } else if (this.options.showHideTransition.toLowerCase() === 'slide') {
        this._toastEl.slideDown(function () {
          that._toastEl.trigger('afterShown');
        });
      } else {
        this._toastEl.show(function () {
          that._toastEl.trigger('afterShown');
        });
      }

      if (this.canAutoHide()) {
        var that = this;
        window.setTimeout(function () {
          if (that.options.showHideTransition.toLowerCase() === 'fade') {
            that._toastEl.trigger('beforeHide');

            that._toastEl.fadeOut(function () {
              that._toastEl.trigger('afterHidden');
            });
          } else if (that.options.showHideTransition.toLowerCase() === 'slide') {
            that._toastEl.trigger('beforeHide');

            that._toastEl.slideUp(function () {
              that._toastEl.trigger('afterHidden');
            });
          } else {
            that._toastEl.trigger('beforeHide');

            that._toastEl.hide(function () {
              that._toastEl.trigger('afterHidden');
            });
          }
        }, this.options.hideAfter);
      }

      ;
    },
    reset: function reset(resetWhat) {
      if (resetWhat === 'all') {
        $('.jq-toast-wrap').remove();
      } else {
        this._toastEl.remove();
      }
    },
    update: function update(options) {
      this.prepareOptions(options, this.options);
      this.setup();
      this.bindToast();
    }
  };

  $.toast = function (options) {
    var toast = Object.create(Toast);
    toast.init(options, this);
    return {
      reset: function reset(what) {
        toast.reset(what);
      },
      update: function update(options) {
        toast.update(options);
      }
    };
  };

  $.toast.options = {
    text: '',
    heading: '',
    showHideTransition: 'fade',
    allowToastClose: true,
    hideAfter: 3000,
    loader: true,
    loaderBg: '#9EC600',
    stack: 5,
    position: 'bottom-left',
    bgColor: false,
    textColor: false,
    textAlign: 'left',
    icon: false,
    beforeShow: function beforeShow() {},
    afterShown: function afterShown() {},
    beforeHide: function beforeHide() {},
    afterHidden: function afterHidden() {}
  };
})(jQuery, window, document);

/***/ }),

/***/ "./assets/css/app.css":
/*!****************************!*\
  !*** ./assets/css/app.css ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./assets/js/app.js":
/*!**************************!*\
  !*** ./assets/js/app.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (master.html.twig).
 */
// CSS you require will output into a single css file (public/build/app.css in this case)
__webpack_require__(/*! ../css/app.css */ "./assets/css/app.css"); // JS you require will output into a single js file (public/build/app.js)


__webpack_require__(/*! ../js/moovity */ "./assets/js/moovity.js"); //Bundles
//Omines Datatables


__webpack_require__(/*! ../bundles/omines-datatables/js/datatables.js */ "./assets/bundles/omines-datatables/js/datatables.js"); //Toast notifications


__webpack_require__(/*! ../bundles/toast/js/jquery.toast.js */ "./assets/bundles/toast/js/jquery.toast.js");

__webpack_require__(/*! ../bundles/toast/css/jquery.toast.css */ "./assets/bundles/toast/css/jquery.toast.css");

/***/ }),

/***/ "./assets/js/moovity.js":
/*!******************************!*\
  !*** ./assets/js/moovity.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

var Tables = function ($) {
  var loadTableData = function loadTableData() {
    var settings = $('#table-data').data('settings');

    if (settings) {
      $('#table-data').initDataTables(settings, {
        searching: true,
        dom: 'f<"html5buttons">Brtip',
        language: {
          "sProcessing": "Procesando...",
          "sLengthMenu": "Mostrar _MENU_ registros",
          "sZeroRecords": "No se encontraron resultados",
          "sEmptyTable": "Ningún dato disponible en esta tabla",
          "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
          "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
          "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
          "sInfoPostFix": "",
          "sSearch": "",
          "searchPlaceholder": "Buscar",
          "sUrl": "",
          "sInfoThousands": ",",
          "sLoadingRecords": "Cargando...",
          "oPaginate": {
            "sFirst": "Primero",
            "sLast": "Último",
            "sNext": "Siguiente",
            "sPrevious": "Anterior"
          },
          "oAria": {
            "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
            "sSortDescending": ": Activar para ordenar la columna de manera descendente"
          }
        },
        responsive: true,
        orderCellsTop: true,
        fixedHeader: true,
        buttons: [{
          extend: 'colvis',
          text: 'Columnas',
          titleAttr: 'Col visibility',
          className: 'btn-outline-default btn-primary'
        }, {
          extend: 'csvHtml5',
          text: 'Exportar',
          titleAttr: 'Generate CSV',
          className: 'btn-outline-default btn-primary'
        }, {
          extend: 'copyHtml5',
          text: 'Copiar',
          titleAttr: 'Copy to clipboard',
          className: 'btn-outline-default btn-primary'
        }, {
          extend: 'print',
          text: 'Imprimir',
          titleAttr: 'Print Table',
          className: 'btn-outline-default btn-primary'
        }],
        initComplete: function initComplete() {
          $('.table-btn').appendTo('.html5buttons');
          activeRedirection = false;
        },
        drawCallback: function drawCallback() {
          $('[href*="/delete/"] i').on('click', function (e) {
            var _this = this;

            if (activeRedirection == false) {
              e.preventDefault(); // e.stopPropagation();

              Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
              }).then(function (result) {
                if (result.value) {
                  activeRedirection = true;
                  $(_this).click();
                } else {}
              });
            }
          });
        }
      });
    }
  };

  var smartPanel = function smartPanel() {
    $('#smart-panels').smartPanel({
      localStorage: true,
      onChange: function onChange() {},
      onSave: function onSave() {},
      opacity: 1,
      deleteSettingsKey: '#deletesettingskey-options',
      settingsKeyLabel: 'Reset settings?',
      deletePositionKey: '#deletepositionkey-options',
      positionKeyLabel: 'Reset position?',
      sortable: true,
      buttonOrder: '%collapse% %fullscreen% %close%',
      buttonOrderDropdown: '%refresh% %locked% %color% %custom% %reset%',
      customButton: false,
      customButtonLabel: "Custom Button",
      onCustom: function onCustom() {},
      closeButton: true,
      onClosepanel: function onClosepanel() {
        if (myapp_config.debugState) console.log($(this).closest(".panel").attr('id') + " onClosepanel");
      },
      fullscreenButton: true,
      onFullscreen: function onFullscreen() {
        if (myapp_config.debugState) console.log($(this).closest(".panel").attr('id') + " onFullscreen");
      },
      collapseButton: true,
      onCollapse: function onCollapse() {
        if (myapp_config.debugState) console.log($(this).closest(".panel").attr('id') + " onCollapse");
      },
      lockedButton: true,
      lockedButtonLabel: "Fijar Posición",
      onLocked: function onLocked() {
        if (myapp_config.debugState) console.log($(this).closest(".panel").attr('id') + " onLocked");
      },
      refreshButton: false,
      refreshButtonLabel: "Refresh Content",
      onRefresh: function onRefresh() {
        if (myapp_config.debugState) console.log($(this).closest(".panel").attr('id') + " onRefresh");
      },
      colorButton: false,
      colorButtonLabel: "Panel Style",
      onColor: function onColor() {
        if (myapp_config.debugState) console.log($(this).closest(".panel").attr('id') + " onColor");
      },
      panelColors: ['bg-primary-700 bg-success-gradient', 'bg-primary-500 bg-info-gradient', 'bg-primary-600 bg-primary-gradient', 'bg-info-600 bg-primray-gradient', 'bg-info-600 bg-info-gradient', 'bg-info-700 bg-success-gradient', 'bg-success-900 bg-info-gradient', 'bg-success-700 bg-primary-gradient', 'bg-success-600 bg-success-gradient', 'bg-danger-900 bg-info-gradient', 'bg-fusion-400 bg-fusion-gradient', 'bg-faded'],
      resetButton: false,
      resetButtonLabel: "Reset Panel",
      onReset: function onReset() {
        if (myapp_config.debugState) console.log($(this).closest(".panel").attr('id') + " onReset callback");
      }
    });
  };

  return {
    init: function init() {
      loadTableData();
      smartPanel();
    }
  };
}(jQuery);

$(document).ready(function () {
  Tables.init();
});

/***/ })

},[["./assets/js/app.js","runtime","vendors~app"]]]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hc3NldHMvYnVuZGxlcy9vbWluZXMtZGF0YXRhYmxlcy9qcy9kYXRhdGFibGVzLmpzIiwid2VicGFjazovLy8uL2Fzc2V0cy9idW5kbGVzL3RvYXN0L2Nzcy9qcXVlcnkudG9hc3QuY3NzIiwid2VicGFjazovLy8uL2Fzc2V0cy9idW5kbGVzL3RvYXN0L2pzL2pxdWVyeS50b2FzdC5qcyIsIndlYnBhY2s6Ly8vLi9hc3NldHMvY3NzL2FwcC5jc3MiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2pzL2FwcC5qcyIsIndlYnBhY2s6Ly8vLi9hc3NldHMvanMvbW9vdml0eS5qcyJdLCJuYW1lcyI6WyIkIiwiZm4iLCJpbml0RGF0YVRhYmxlcyIsImNvbmZpZyIsIm9wdGlvbnMiLCJyb290IiwiZXh0ZW5kIiwiZGVmYXVsdHMiLCJzdGF0ZSIsIndpbmRvdyIsImxvY2F0aW9uIiwiaGFzaCIsInNlYXJjaCIsImxlbmd0aCIsImRlcGFyYW0iLCJzdWJzdHIiLCJwZXJzaXN0T3B0aW9ucyIsInN0YXRlU2F2ZSIsInN0YXRlTG9hZENhbGxiYWNrIiwicyIsImNiIiwiUHJvbWlzZSIsImZ1bGZpbGwiLCJyZWplY3QiLCJhamF4IiwidXJsIiwibWV0aG9kIiwiZGF0YSIsIl9kdCIsIm5hbWUiLCJfaW5pdCIsImRvbmUiLCJiYXNlU3RhdGUiLCJkdE9wdHMiLCJyZXF1ZXN0IiwiZHJhd0NhbGxiYWNrIiwic2V0dGluZ3MiLCJkcmF3IiwiaHRtbCIsInRlbXBsYXRlIiwiZHQiLCJEYXRhVGFibGUiLCJvbiIsImUiLCJwYXJhbSIsInNwbGl0IiwiZGlmZiIsImZpbHRlciIsImVsIiwiaW5kZXhPZiIsImhpc3RvcnkiLCJyZXBsYWNlU3RhdGUiLCJvcmlnaW4iLCJwYXRobmFtZSIsImRlY29kZVVSSUNvbXBvbmVudCIsImpvaW4iLCJmYWlsIiwieGhyIiwiY2F1c2UiLCJtc2ciLCJjb25zb2xlIiwiZXJyb3IiLCJwYXJhbXMiLCJjb2VyY2UiLCJvYmoiLCJjb2VyY2VfdHlwZXMiLCJlYWNoIiwicmVwbGFjZSIsImoiLCJ2Iiwia2V5IiwidmFsIiwiY3VyIiwiaSIsImtleXMiLCJrZXlzX2xhc3QiLCJ0ZXN0Iiwic2hpZnQiLCJjb25jYXQiLCJpc05hTiIsInVuZGVmaW5lZCIsImlzQXJyYXkiLCJwdXNoIiwialF1ZXJ5IiwiT2JqZWN0IiwiY3JlYXRlIiwiRiIsInByb3RvdHlwZSIsImRvY3VtZW50IiwiVG9hc3QiLCJfcG9zaXRpb25DbGFzc2VzIiwiX2RlZmF1bHRJY29ucyIsImluaXQiLCJlbGVtIiwicHJlcGFyZU9wdGlvbnMiLCJ0b2FzdCIsInByb2Nlc3MiLCJvcHRpb25zX3RvX2V4dGVuZCIsIl9vcHRpb25zIiwiQXJyYXkiLCJ0ZXh0Iiwic2V0dXAiLCJhZGRUb0RvbSIsInBvc2l0aW9uIiwiYmluZFRvYXN0IiwiYW5pbWF0ZSIsIl90b2FzdENvbnRlbnQiLCJfdG9hc3RFbCIsImFsbG93VG9hc3RDbG9zZSIsImhlYWRpbmciLCJiZ0NvbG9yIiwiY3NzIiwidGV4dENvbG9yIiwidGV4dEFsaWduIiwiaWNvbiIsImFkZENsYXNzIiwiaW5BcnJheSIsIl9jb250YWluZXIiLCJsZWZ0Iiwib3V0ZXJXaWR0aCIsImJvdHRvbSIsInRvcCIsIm91dGVySGVpZ2h0IiwicmlnaHQiLCJ0aGF0IiwicHJvY2Vzc0xvYWRlciIsImZpbmQiLCJwcmV2ZW50RGVmYXVsdCIsInNob3dIaWRlVHJhbnNpdGlvbiIsInRyaWdnZXIiLCJmYWRlT3V0Iiwic2xpZGVVcCIsImhpZGUiLCJiZWZvcmVTaG93IiwiYWZ0ZXJTaG93biIsImJlZm9yZUhpZGUiLCJhZnRlckhpZGRlbiIsInJvbGUiLCJhcHBlbmQiLCJzdGFjayIsInBhcnNlSW50IiwiZW1wdHkiLCJyZW1vdmUiLCJfcHJldlRvYXN0Q291bnQiLCJfZXh0VG9hc3RDb3VudCIsInNsaWNlIiwiY2FuQXV0b0hpZGUiLCJoaWRlQWZ0ZXIiLCJsb2FkZXIiLCJ0cmFuc2l0aW9uVGltZSIsImxvYWRlckJnIiwic3R5bGUiLCJhdHRyIiwic3Vic3RyaW5nIiwidG9Mb3dlckNhc2UiLCJmYWRlSW4iLCJzbGlkZURvd24iLCJzaG93Iiwic2V0VGltZW91dCIsInJlc2V0IiwicmVzZXRXaGF0IiwidXBkYXRlIiwid2hhdCIsInJlcXVpcmUiLCJUYWJsZXMiLCJsb2FkVGFibGVEYXRhIiwic2VhcmNoaW5nIiwiZG9tIiwibGFuZ3VhZ2UiLCJyZXNwb25zaXZlIiwib3JkZXJDZWxsc1RvcCIsImZpeGVkSGVhZGVyIiwiYnV0dG9ucyIsInRpdGxlQXR0ciIsImNsYXNzTmFtZSIsImluaXRDb21wbGV0ZSIsImFwcGVuZFRvIiwiYWN0aXZlUmVkaXJlY3Rpb24iLCJTd2FsIiwiZmlyZSIsInRpdGxlIiwic2hvd0NhbmNlbEJ1dHRvbiIsImNvbmZpcm1CdXR0b25Db2xvciIsImNhbmNlbEJ1dHRvbkNvbG9yIiwiY29uZmlybUJ1dHRvblRleHQiLCJ0aGVuIiwicmVzdWx0IiwidmFsdWUiLCJjbGljayIsInNtYXJ0UGFuZWwiLCJsb2NhbFN0b3JhZ2UiLCJvbkNoYW5nZSIsIm9uU2F2ZSIsIm9wYWNpdHkiLCJkZWxldGVTZXR0aW5nc0tleSIsInNldHRpbmdzS2V5TGFiZWwiLCJkZWxldGVQb3NpdGlvbktleSIsInBvc2l0aW9uS2V5TGFiZWwiLCJzb3J0YWJsZSIsImJ1dHRvbk9yZGVyIiwiYnV0dG9uT3JkZXJEcm9wZG93biIsImN1c3RvbUJ1dHRvbiIsImN1c3RvbUJ1dHRvbkxhYmVsIiwib25DdXN0b20iLCJjbG9zZUJ1dHRvbiIsIm9uQ2xvc2VwYW5lbCIsIm15YXBwX2NvbmZpZyIsImRlYnVnU3RhdGUiLCJsb2ciLCJjbG9zZXN0IiwiZnVsbHNjcmVlbkJ1dHRvbiIsIm9uRnVsbHNjcmVlbiIsImNvbGxhcHNlQnV0dG9uIiwib25Db2xsYXBzZSIsImxvY2tlZEJ1dHRvbiIsImxvY2tlZEJ1dHRvbkxhYmVsIiwib25Mb2NrZWQiLCJyZWZyZXNoQnV0dG9uIiwicmVmcmVzaEJ1dHRvbkxhYmVsIiwib25SZWZyZXNoIiwiY29sb3JCdXR0b24iLCJjb2xvckJ1dHRvbkxhYmVsIiwib25Db2xvciIsInBhbmVsQ29sb3JzIiwicmVzZXRCdXR0b24iLCJyZXNldEJ1dHRvbkxhYmVsIiwib25SZXNldCIsInJlYWR5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7OztBQVVDLFdBQVNBLENBQVQsRUFBWTtBQUNUOzs7QUFHQUEsR0FBQyxDQUFDQyxFQUFGLENBQUtDLGNBQUwsR0FBc0IsVUFBU0MsTUFBVCxFQUFpQkMsT0FBakIsRUFBMEI7QUFDNUMsUUFBSUMsSUFBSSxHQUFHLElBQVg7QUFBQSxRQUNJRixNQUFNLEdBQUdILENBQUMsQ0FBQ00sTUFBRixDQUFTLEVBQVQsRUFBYU4sQ0FBQyxDQUFDQyxFQUFGLENBQUtDLGNBQUwsQ0FBb0JLLFFBQWpDLEVBQTJDSixNQUEzQyxDQURiO0FBQUEsUUFFSUssS0FBSyxHQUFHLEVBRlosQ0FENEMsQ0FNNUM7O0FBQ0EsWUFBUUwsTUFBTSxDQUFDSyxLQUFmO0FBQ0ksV0FBSyxVQUFMO0FBQ0lBLGFBQUssR0FBR0MsTUFBTSxDQUFDQyxRQUFQLENBQWdCQyxJQUF4QjtBQUNBOztBQUNKLFdBQUssT0FBTDtBQUNJSCxhQUFLLEdBQUdDLE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQkUsTUFBeEI7QUFDQTtBQU5SOztBQVFBSixTQUFLLEdBQUlBLEtBQUssQ0FBQ0ssTUFBTixHQUFlLENBQWYsR0FBbUJDLE9BQU8sQ0FBQ04sS0FBSyxDQUFDTyxNQUFOLENBQWEsQ0FBYixDQUFELENBQTFCLEdBQThDLEVBQXZEO0FBQ0EsUUFBSUMsY0FBYyxHQUFHYixNQUFNLENBQUNLLEtBQVAsS0FBaUIsTUFBakIsR0FBMEIsRUFBMUIsR0FBK0I7QUFDaERTLGVBQVMsRUFBRSxJQURxQztBQUVoREMsdUJBQWlCLEVBQUUsMkJBQVNDLENBQVQsRUFBWUMsRUFBWixFQUFnQjtBQUMvQjtBQUNBLGVBQU8sSUFBUDtBQUNIO0FBTCtDLEtBQXBEO0FBUUEsV0FBTyxJQUFJ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QUFPLEVBQUUsbUJBQVk7QUFDakIsWUFBSWhCLFlBQVksQ0FBQ0MsVUFBakIsRUFDSW5KLE9BQU8sQ0FBQ29KLEdBQVIsQ0FBWWhOLENBQUMsQ0FBQyxJQUFELENBQUQsQ0FBUWlOLE9BQVIsQ0FBZ0IsUUFBaEIsRUFBMEJ6RCxJQUExQixDQUErQixJQUEvQixJQUF1QyxVQUFuRDtBQUNQLE9BL0N5QjtBQWdEMUJ1RSxpQkFBVyxFQUFFLENBQUMsb0NBQUQsRUFDVCxpQ0FEUyxFQUVULG9DQUZTLEVBR1QsaUNBSFMsRUFJVCw4QkFKUyxFQUtULGlDQUxTLEVBTVQsaUNBTlMsRUFPVCxvQ0FQUyxFQVFULG9DQVJTLEVBU1QsZ0NBVFMsRUFVVCxrQ0FWUyxFQVdULFVBWFMsQ0FoRGE7QUE0RDFCQyxpQkFBVyxFQUFFLEtBNURhO0FBNkQxQkMsc0JBQWdCLEVBQUUsYUE3RFE7QUE4RDFCQyxhQUFPLEVBQUUsbUJBQVk7QUFDakIsWUFBSXBCLFlBQVksQ0FBQ0MsVUFBakIsRUFDSW5KLE9BQU8sQ0FBQ29KLEdBQVIsQ0FBWWhOLENBQUMsQ0FBQyxJQUFELENBQUQsQ0FBUWlOLE9BQVIsQ0FBZ0IsUUFBaEIsRUFBMEJ6RCxJQUExQixDQUErQixJQUEvQixJQUF1QyxtQkFBbkQ7QUFDUDtBQWpFeUIsS0FBOUI7QUFtRUgsR0FyRUQ7O0FBdUVBLFNBQU87QUFDSDVELFFBQUksRUFBRSxnQkFBWTtBQUNkeUUsbUJBQWE7QUFDYndCLGdCQUFVO0FBQ2I7QUFKRSxHQUFQO0FBT0gsQ0EvS1ksQ0ErS1YxRyxNQS9LVSxDQUFiOztBQWlMQW5GLENBQUMsQ0FBQ3dGLFFBQUQsQ0FBRCxDQUFZMkksS0FBWixDQUFrQixZQUFZO0FBQzFCL0QsUUFBTSxDQUFDeEUsSUFBUDtBQUNILENBRkQsRSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFN5bWZvbnkgRGF0YVRhYmxlcyBCdW5kbGVcbiAqIChjKSBPbWluZXMgSW50ZXJuZXRidXJlYXUgQi5WLiAtIGh0dHBzOi8vb21pbmVzLm5sL1xuICpcbiAqIEZvciB0aGUgZnVsbCBjb3B5cmlnaHQgYW5kIGxpY2Vuc2UgaW5mb3JtYXRpb24sIHBsZWFzZSB2aWV3IHRoZSBMSUNFTlNFXG4gKiBmaWxlIHRoYXQgd2FzIGRpc3RyaWJ1dGVkIHdpdGggdGhpcyBzb3VyY2UgY29kZS5cbiAqXG4gKiBAYXV0aG9yIE5pZWxzIEtldXJlbnRqZXMgPG5pZWxzLmtldXJlbnRqZXNAb21pbmVzLmNvbT5cbiAqL1xuXG4oZnVuY3Rpb24oJCkge1xuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemVzIHRoZSBkYXRhdGFibGUgZHluYW1pY2FsbHkuXG4gICAgICovXG4gICAgJC5mbi5pbml0RGF0YVRhYmxlcyA9IGZ1bmN0aW9uKGNvbmZpZywgb3B0aW9ucykge1xuICAgICAgICB2YXIgcm9vdCA9IHRoaXMsXG4gICAgICAgICAgICBjb25maWcgPSAkLmV4dGVuZCh7fSwgJC5mbi5pbml0RGF0YVRhYmxlcy5kZWZhdWx0cywgY29uZmlnKSxcbiAgICAgICAgICAgIHN0YXRlID0gJydcbiAgICAgICAgO1xuXG4gICAgICAgIC8vIExvYWQgcGFnZSBzdGF0ZSBpZiBuZWVkZWRcbiAgICAgICAgc3dpdGNoIChjb25maWcuc3RhdGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ2ZyYWdtZW50JzpcbiAgICAgICAgICAgICAgICBzdGF0ZSA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAncXVlcnknOlxuICAgICAgICAgICAgICAgIHN0YXRlID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBzdGF0ZSA9IChzdGF0ZS5sZW5ndGggPiAxID8gZGVwYXJhbShzdGF0ZS5zdWJzdHIoMSkpIDoge30pO1xuICAgICAgICB2YXIgcGVyc2lzdE9wdGlvbnMgPSBjb25maWcuc3RhdGUgPT09ICdub25lJyA/IHt9IDoge1xuICAgICAgICAgICAgc3RhdGVTYXZlOiB0cnVlLFxuICAgICAgICAgICAgc3RhdGVMb2FkQ2FsbGJhY2s6IGZ1bmN0aW9uKHMsIGNiKSB7XG4gICAgICAgICAgICAgICAgLy8gT25seSBuZWVkIHN0YXRlU2F2ZSB0byBleHBvc2Ugc3RhdGUoKSBmdW5jdGlvbiBhcyBsb2FkaW5nIGxhemlseSBpcyBub3QgcG9zc2libGUgb3RoZXJ3aXNlXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChmdWxmaWxsLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIC8vIFBlcmZvcm0gaW5pdGlhbCBsb2FkXG4gICAgICAgICAgICAkLmFqYXgoY29uZmlnLnVybCwge1xuICAgICAgICAgICAgICAgIG1ldGhvZDogY29uZmlnLm1ldGhvZCxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIF9kdDogY29uZmlnLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgIF9pbml0OiB0cnVlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkuZG9uZShmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgdmFyIGJhc2VTdGF0ZTtcblxuICAgICAgICAgICAgICAgIC8vIE1lcmdlIGFsbCBvcHRpb25zIGZyb20gZGlmZmVyZW50IHNvdXJjZXMgdG9nZXRoZXIgYW5kIGFkZCB0aGUgQWpheCBsb2FkZXJcbiAgICAgICAgICAgICAgICB2YXIgZHRPcHRzID0gJC5leHRlbmQoe30sIGRhdGEub3B0aW9ucywgY29uZmlnLm9wdGlvbnMsIG9wdGlvbnMsIHBlcnNpc3RPcHRpb25zLCB7XG4gICAgICAgICAgICAgICAgICAgIGFqYXg6IGZ1bmN0aW9uIChyZXF1ZXN0LCBkcmF3Q2FsbGJhY2ssIHNldHRpbmdzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuZHJhdyA9IHJlcXVlc3QuZHJhdztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkcmF3Q2FsbGJhY2soZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgKE9iamVjdC5rZXlzKHN0YXRlKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgdmFyIG1lcmdlZCA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkdC5zdGF0ZSgpLCBzdGF0ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIGR0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAub3JkZXIobWVyZ2VkLm9yZGVyKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgLnNlYXJjaChtZXJnZWQuc2VhcmNoLnNlYXJjaClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIC5wYWdlLmxlbihtZXJnZWQubGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgLnBhZ2UobWVyZ2VkLnN0YXJ0IC8gbWVyZ2VkLmxlbmd0aClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIC5kcmF3KGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3QuX2R0ID0gY29uZmlnLm5hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJC5hamF4KGNvbmZpZy51cmwsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiBjb25maWcubWV0aG9kLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiByZXF1ZXN0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuZG9uZShmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRyYXdDYWxsYmFjayhkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICByb290Lmh0bWwoZGF0YS50ZW1wbGF0ZSk7XG4gICAgICAgICAgICAgICAgZHQgPSAkKCd0YWJsZScsIHJvb3QpLkRhdGFUYWJsZShkdE9wdHMpO1xuICAgICAgICAgICAgICAgIGlmIChjb25maWcuc3RhdGUgIT09ICdub25lJykge1xuICAgICAgICAgICAgICAgICAgICBkdC5vbignZHJhdy5kdCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkYXRhID0gJC5wYXJhbShkdC5zdGF0ZSgpKS5zcGxpdCgnJicpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBGaXJzdCBkcmF3IGVzdGFibGlzaGVzIHN0YXRlLCBzdWJzZXF1ZW50IGRyYXdzIHJ1biBkaWZmIG9uIHRoZSBmaXJzdFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFiYXNlU3RhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYXNlU3RhdGUgPSBkYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGlmZiA9IGRhdGEuZmlsdGVyKGVsID0+IHsgcmV0dXJuIGJhc2VTdGF0ZS5pbmRleE9mKGVsKSA9PT0gLTEgJiYgZWwuaW5kZXhPZigndGltZT0nKSAhPT0gMDsgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChjb25maWcuc3RhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZnJhZ21lbnQnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGlzdG9yeS5yZXBsYWNlU3RhdGUobnVsbCwgbnVsbCwgd2luZG93LmxvY2F0aW9uLm9yaWdpbiArIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSArIHdpbmRvdy5sb2NhdGlvbi5zZWFyY2hcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArICcjJyArIGRlY29kZVVSSUNvbXBvbmVudChkaWZmLmpvaW4oJyYnKSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3F1ZXJ5JzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhpc3RvcnkucmVwbGFjZVN0YXRlKG51bGwsIG51bGwsIHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArICc/JyArIGRlY29kZVVSSUNvbXBvbmVudChkaWZmLmpvaW4oJyYnKSArIHdpbmRvdy5sb2NhdGlvbi5oYXNoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZnVsZmlsbChkdCk7XG4gICAgICAgICAgICB9KS5mYWlsKGZ1bmN0aW9uKHhociwgY2F1c2UsIG1zZykge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0RhdGFUYWJsZXMgcmVxdWVzdCBmYWlsZWQ6ICcgKyBtc2cpO1xuICAgICAgICAgICAgICAgIHJlamVjdChjYXVzZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFByb3ZpZGUgZ2xvYmFsIGNvbXBvbmVudCBkZWZhdWx0cy5cbiAgICAgKi9cbiAgICAkLmZuLmluaXREYXRhVGFibGVzLmRlZmF1bHRzID0ge1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgc3RhdGU6ICdmcmFnbWVudCcsXG4gICAgICAgIHVybDogd2luZG93LmxvY2F0aW9uLm9yaWdpbiArIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDb252ZXJ0IGEgcXVlcnlzdHJpbmcgdG8gYSBwcm9wZXIgYXJyYXkgLSByZXZlcnNlcyAkLnBhcmFtXG4gICAgICovXG4gICAgZnVuY3Rpb24gZGVwYXJhbShwYXJhbXMsIGNvZXJjZSkge1xuICAgICAgICB2YXIgb2JqID0ge30sXG4gICAgICAgICAgICBjb2VyY2VfdHlwZXMgPSB7J3RydWUnOiAhMCwgJ2ZhbHNlJzogITEsICdudWxsJzogbnVsbH07XG4gICAgICAgICQuZWFjaChwYXJhbXMucmVwbGFjZSgvXFwrL2csICcgJykuc3BsaXQoJyYnKSwgZnVuY3Rpb24gKGosIHYpIHtcbiAgICAgICAgICAgIHZhciBwYXJhbSA9IHYuc3BsaXQoJz0nKSxcbiAgICAgICAgICAgICAgICBrZXkgPSBkZWNvZGVVUklDb21wb25lbnQocGFyYW1bMF0pLFxuICAgICAgICAgICAgICAgIHZhbCxcbiAgICAgICAgICAgICAgICBjdXIgPSBvYmosXG4gICAgICAgICAgICAgICAgaSA9IDAsXG4gICAgICAgICAgICAgICAga2V5cyA9IGtleS5zcGxpdCgnXVsnKSxcbiAgICAgICAgICAgICAgICBrZXlzX2xhc3QgPSBrZXlzLmxlbmd0aCAtIDE7XG5cbiAgICAgICAgICAgIGlmICgvXFxbLy50ZXN0KGtleXNbMF0pICYmIC9cXF0kLy50ZXN0KGtleXNba2V5c19sYXN0XSkpIHtcbiAgICAgICAgICAgICAgICBrZXlzW2tleXNfbGFzdF0gPSBrZXlzW2tleXNfbGFzdF0ucmVwbGFjZSgvXFxdJC8sICcnKTtcbiAgICAgICAgICAgICAgICBrZXlzID0ga2V5cy5zaGlmdCgpLnNwbGl0KCdbJykuY29uY2F0KGtleXMpO1xuICAgICAgICAgICAgICAgIGtleXNfbGFzdCA9IGtleXMubGVuZ3RoIC0gMTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAga2V5c19sYXN0ID0gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHBhcmFtLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgICAgIHZhbCA9IGRlY29kZVVSSUNvbXBvbmVudChwYXJhbVsxXSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoY29lcmNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbCA9IHZhbCAmJiAhaXNOYU4odmFsKSA/ICt2YWwgICAgICAgICAgICAgIC8vIG51bWJlclxuICAgICAgICAgICAgICAgICAgICAgICAgOiB2YWwgPT09ICd1bmRlZmluZWQnID8gdW5kZWZpbmVkICAgICAgICAgLy8gdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBjb2VyY2VfdHlwZXNbdmFsXSAhPT0gdW5kZWZpbmVkID8gY29lcmNlX3R5cGVzW3ZhbF0gLy8gdHJ1ZSwgZmFsc2UsIG51bGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiB2YWw7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc3RyaW5nXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGtleXNfbGFzdCkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKDsgaSA8PSBrZXlzX2xhc3Q7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAga2V5ID0ga2V5c1tpXSA9PT0gJycgPyBjdXIubGVuZ3RoIDoga2V5c1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1ciA9IGN1cltrZXldID0gaSA8IGtleXNfbGFzdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gY3VyW2tleV0gfHwgKGtleXNbaSArIDFdICYmIGlzTmFOKGtleXNbaSArIDFdKSA/IHt9IDogW10pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiB2YWw7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgkLmlzQXJyYXkob2JqW2tleV0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvYmpba2V5XS5wdXNoKHZhbCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAob2JqW2tleV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb2JqW2tleV0gPSBbb2JqW2tleV0sIHZhbF07XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvYmpba2V5XSA9IHZhbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSBlbHNlIGlmIChrZXkpIHtcbiAgICAgICAgICAgICAgICBvYmpba2V5XSA9IGNvZXJjZVxuICAgICAgICAgICAgICAgICAgICA/IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICAgICA6ICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH1cbn0oalF1ZXJ5KSk7XG4iLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW4iLCIvLyBqUXVlcnkgdG9hc3QgcGx1Z2luIGNyZWF0ZWQgYnkgS2FtcmFuIEFobWVkIGNvcHlyaWdodCBNSVQgbGljZW5zZSAyMDE1XG5pZiAoIHR5cGVvZiBPYmplY3QuY3JlYXRlICE9PSAnZnVuY3Rpb24nICkge1xuICAgIE9iamVjdC5jcmVhdGUgPSBmdW5jdGlvbiggb2JqICkge1xuICAgICAgICBmdW5jdGlvbiBGKCkge31cbiAgICAgICAgRi5wcm90b3R5cGUgPSBvYmo7XG4gICAgICAgIHJldHVybiBuZXcgRigpO1xuICAgIH07XG59XG5cbihmdW5jdGlvbiggJCwgd2luZG93LCBkb2N1bWVudCwgdW5kZWZpbmVkICkge1xuXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgXG4gICAgdmFyIFRvYXN0ID0ge1xuXG4gICAgICAgIF9wb3NpdGlvbkNsYXNzZXMgOiBbJ2JvdHRvbS1sZWZ0JywgJ2JvdHRvbS1yaWdodCcsICd0b3AtcmlnaHQnLCAndG9wLWxlZnQnLCAnYm90dG9tLWNlbnRlcicsICd0b3AtY2VudGVyJywgJ21pZC1jZW50ZXInXSxcbiAgICAgICAgX2RlZmF1bHRJY29ucyA6IFsnc3VjY2VzcycsICdlcnJvcicsICdpbmZvJywgJ3dhcm5pbmcnXSxcblxuICAgICAgICBpbml0OiBmdW5jdGlvbiAob3B0aW9ucywgZWxlbSkge1xuICAgICAgICAgICAgdGhpcy5wcmVwYXJlT3B0aW9ucyhvcHRpb25zLCAkLnRvYXN0Lm9wdGlvbnMpO1xuICAgICAgICAgICAgdGhpcy5wcm9jZXNzKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcHJlcGFyZU9wdGlvbnM6IGZ1bmN0aW9uKG9wdGlvbnMsIG9wdGlvbnNfdG9fZXh0ZW5kKSB7XG4gICAgICAgICAgICB2YXIgX29wdGlvbnMgPSB7fTtcbiAgICAgICAgICAgIGlmICggKCB0eXBlb2Ygb3B0aW9ucyA9PT0gJ3N0cmluZycgKSB8fCAoIG9wdGlvbnMgaW5zdGFuY2VvZiBBcnJheSApICkge1xuICAgICAgICAgICAgICAgIF9vcHRpb25zLnRleHQgPSBvcHRpb25zO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBfb3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZCgge30sIG9wdGlvbnNfdG9fZXh0ZW5kLCBfb3B0aW9ucyApO1xuICAgICAgICB9LFxuXG4gICAgICAgIHByb2Nlc3M6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0dXAoKTtcbiAgICAgICAgICAgIHRoaXMuYWRkVG9Eb20oKTtcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb24oKTtcbiAgICAgICAgICAgIHRoaXMuYmluZFRvYXN0KCk7XG4gICAgICAgICAgICB0aGlzLmFuaW1hdGUoKTtcbiAgICAgICAgfSxcblxuICAgICAgICBzZXR1cDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgX3RvYXN0Q29udGVudCA9ICcnO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLl90b2FzdEVsID0gdGhpcy5fdG9hc3RFbCB8fCAkKCc8ZGl2PjwvZGl2PicsIHtcbiAgICAgICAgICAgICAgICBjbGFzcyA6ICdqcS10b2FzdC1zaW5nbGUnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gRm9yIHRoZSBsb2FkZXIgb24gdG9wXG4gICAgICAgICAgICBfdG9hc3RDb250ZW50ICs9ICc8c3BhbiBjbGFzcz1cImpxLXRvYXN0LWxvYWRlclwiPjwvc3Bhbj4nOyAgICAgICAgICAgIFxuXG4gICAgICAgICAgICBpZiAoIHRoaXMub3B0aW9ucy5hbGxvd1RvYXN0Q2xvc2UgKSB7XG4gICAgICAgICAgICAgICAgX3RvYXN0Q29udGVudCArPSAnPHNwYW4gY2xhc3M9XCJjbG9zZS1qcS10b2FzdC1zaW5nbGVcIj4mdGltZXM7PC9zcGFuPic7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAoIHRoaXMub3B0aW9ucy50ZXh0IGluc3RhbmNlb2YgQXJyYXkgKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoIHRoaXMub3B0aW9ucy5oZWFkaW5nICkge1xuICAgICAgICAgICAgICAgICAgICBfdG9hc3RDb250ZW50ICs9JzxoMiBjbGFzcz1cImpxLXRvYXN0LWhlYWRpbmdcIj4nICsgdGhpcy5vcHRpb25zLmhlYWRpbmcgKyAnPC9oMj4nO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBfdG9hc3RDb250ZW50ICs9ICc8dWwgY2xhc3M9XCJqcS10b2FzdC11bFwiPic7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm9wdGlvbnMudGV4dC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBfdG9hc3RDb250ZW50ICs9ICc8bGkgY2xhc3M9XCJqcS10b2FzdC1saVwiIGlkPVwianEtdG9hc3QtaXRlbS0nICsgaSArICdcIj4nICsgdGhpcy5vcHRpb25zLnRleHRbaV0gKyAnPC9saT4nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBfdG9hc3RDb250ZW50ICs9ICc8L3VsPic7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKCB0aGlzLm9wdGlvbnMuaGVhZGluZyApIHtcbiAgICAgICAgICAgICAgICAgICAgX3RvYXN0Q29udGVudCArPSc8aDIgY2xhc3M9XCJqcS10b2FzdC1oZWFkaW5nXCI+JyArIHRoaXMub3B0aW9ucy5oZWFkaW5nICsgJzwvaDI+JztcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIF90b2FzdENvbnRlbnQgKz0gdGhpcy5vcHRpb25zLnRleHQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX3RvYXN0RWwuaHRtbCggX3RvYXN0Q29udGVudCApO1xuXG4gICAgICAgICAgICBpZiAoIHRoaXMub3B0aW9ucy5iZ0NvbG9yICE9PSBmYWxzZSApIHtcbiAgICAgICAgICAgICAgICB0aGlzLl90b2FzdEVsLmNzcyhcImJhY2tncm91bmQtY29sb3JcIiwgdGhpcy5vcHRpb25zLmJnQ29sb3IpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKCB0aGlzLm9wdGlvbnMudGV4dENvbG9yICE9PSBmYWxzZSApIHtcbiAgICAgICAgICAgICAgICB0aGlzLl90b2FzdEVsLmNzcyhcImNvbG9yXCIsIHRoaXMub3B0aW9ucy50ZXh0Q29sb3IpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKCB0aGlzLm9wdGlvbnMudGV4dEFsaWduICkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3RvYXN0RWwuY3NzKCd0ZXh0LWFsaWduJywgdGhpcy5vcHRpb25zLnRleHRBbGlnbik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICggdGhpcy5vcHRpb25zLmljb24gIT09IGZhbHNlICkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3RvYXN0RWwuYWRkQ2xhc3MoJ2pxLWhhcy1pY29uJyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoICQuaW5BcnJheSh0aGlzLm9wdGlvbnMuaWNvbiwgdGhpcy5fZGVmYXVsdEljb25zKSAhPT0gLTEgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3RvYXN0RWwuYWRkQ2xhc3MoJ2pxLWljb24tJyArIHRoaXMub3B0aW9ucy5pY29uKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKCB0aGlzLm9wdGlvbnMuY2xhc3MgIT09IGZhbHNlICl7XG4gICAgICAgICAgICAgICAgdGhpcy5fdG9hc3RFbC5hZGRDbGFzcyh0aGlzLm9wdGlvbnMuY2xhc3MpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgcG9zaXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICggKCB0eXBlb2YgdGhpcy5vcHRpb25zLnBvc2l0aW9uID09PSAnc3RyaW5nJyApICYmICggJC5pbkFycmF5KCB0aGlzLm9wdGlvbnMucG9zaXRpb24sIHRoaXMuX3Bvc2l0aW9uQ2xhc3NlcykgIT09IC0xICkgKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoIHRoaXMub3B0aW9ucy5wb3NpdGlvbiA9PT0gJ2JvdHRvbS1jZW50ZXInICkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jb250YWluZXIuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6ICggJCh3aW5kb3cpLm91dGVyV2lkdGgoKSAvIDIgKSAtIHRoaXMuX2NvbnRhaW5lci5vdXRlcldpZHRoKCkvMixcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvdHRvbTogMjBcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggdGhpcy5vcHRpb25zLnBvc2l0aW9uID09PSAndG9wLWNlbnRlcicgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NvbnRhaW5lci5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogKCAkKHdpbmRvdykub3V0ZXJXaWR0aCgpIC8gMiApIC0gdGhpcy5fY29udGFpbmVyLm91dGVyV2lkdGgoKS8yLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiAyMFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCB0aGlzLm9wdGlvbnMucG9zaXRpb24gPT09ICdtaWQtY2VudGVyJyApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY29udGFpbmVyLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAoICQod2luZG93KS5vdXRlcldpZHRoKCkgLyAyICkgLSB0aGlzLl9jb250YWluZXIub3V0ZXJXaWR0aCgpLzIsXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3A6ICggJCh3aW5kb3cpLm91dGVySGVpZ2h0KCkgLyAyICkgLSB0aGlzLl9jb250YWluZXIub3V0ZXJIZWlnaHQoKS8yXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NvbnRhaW5lci5hZGRDbGFzcyggdGhpcy5vcHRpb25zLnBvc2l0aW9uICk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCB0eXBlb2YgdGhpcy5vcHRpb25zLnBvc2l0aW9uID09PSAnb2JqZWN0JyApIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jb250YWluZXIuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgdG9wIDogdGhpcy5vcHRpb25zLnBvc2l0aW9uLnRvcCA/IHRoaXMub3B0aW9ucy5wb3NpdGlvbi50b3AgOiAnYXV0bycsXG4gICAgICAgICAgICAgICAgICAgIGJvdHRvbSA6IHRoaXMub3B0aW9ucy5wb3NpdGlvbi5ib3R0b20gPyB0aGlzLm9wdGlvbnMucG9zaXRpb24uYm90dG9tIDogJ2F1dG8nLFxuICAgICAgICAgICAgICAgICAgICBsZWZ0IDogdGhpcy5vcHRpb25zLnBvc2l0aW9uLmxlZnQgPyB0aGlzLm9wdGlvbnMucG9zaXRpb24ubGVmdCA6ICdhdXRvJyxcbiAgICAgICAgICAgICAgICAgICAgcmlnaHQgOiB0aGlzLm9wdGlvbnMucG9zaXRpb24ucmlnaHQgPyB0aGlzLm9wdGlvbnMucG9zaXRpb24ucmlnaHQgOiAnYXV0bydcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY29udGFpbmVyLmFkZENsYXNzKCAnYm90dG9tLWxlZnQnICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgYmluZFRvYXN0OiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgICAgICAgdGhpcy5fdG9hc3RFbC5vbignYWZ0ZXJTaG93bicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB0aGF0LnByb2Nlc3NMb2FkZXIoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLl90b2FzdEVsLmZpbmQoJy5jbG9zZS1qcS10b2FzdC1zaW5nbGUnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoIGUgKSB7XG5cbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICBpZiggdGhhdC5vcHRpb25zLnNob3dIaWRlVHJhbnNpdGlvbiA9PT0gJ2ZhZGUnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQuX3RvYXN0RWwudHJpZ2dlcignYmVmb3JlSGlkZScpO1xuICAgICAgICAgICAgICAgICAgICB0aGF0Ll90b2FzdEVsLmZhZGVPdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5fdG9hc3RFbC50cmlnZ2VyKCdhZnRlckhpZGRlbicpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCB0aGF0Lm9wdGlvbnMuc2hvd0hpZGVUcmFuc2l0aW9uID09PSAnc2xpZGUnICkge1xuICAgICAgICAgICAgICAgICAgICB0aGF0Ll90b2FzdEVsLnRyaWdnZXIoJ2JlZm9yZUhpZGUnKTtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5fdG9hc3RFbC5zbGlkZVVwKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuX3RvYXN0RWwudHJpZ2dlcignYWZ0ZXJIaWRkZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5fdG9hc3RFbC50cmlnZ2VyKCdiZWZvcmVIaWRlJyk7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQuX3RvYXN0RWwuaGlkZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0Ll90b2FzdEVsLnRyaWdnZXIoJ2FmdGVySGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoIHR5cGVvZiB0aGlzLm9wdGlvbnMuYmVmb3JlU2hvdyA9PSAnZnVuY3Rpb24nICkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3RvYXN0RWwub24oJ2JlZm9yZVNob3cnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQub3B0aW9ucy5iZWZvcmVTaG93KCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAoIHR5cGVvZiB0aGlzLm9wdGlvbnMuYWZ0ZXJTaG93biA9PSAnZnVuY3Rpb24nICkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3RvYXN0RWwub24oJ2FmdGVyU2hvd24nLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQub3B0aW9ucy5hZnRlclNob3duKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAoIHR5cGVvZiB0aGlzLm9wdGlvbnMuYmVmb3JlSGlkZSA9PSAnZnVuY3Rpb24nICkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3RvYXN0RWwub24oJ2JlZm9yZUhpZGUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQub3B0aW9ucy5iZWZvcmVIaWRlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAoIHR5cGVvZiB0aGlzLm9wdGlvbnMuYWZ0ZXJIaWRkZW4gPT0gJ2Z1bmN0aW9uJyApIHtcbiAgICAgICAgICAgICAgICB0aGlzLl90b2FzdEVsLm9uKCdhZnRlckhpZGRlbicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5vcHRpb25zLmFmdGVySGlkZGVuKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9OyAgICAgICAgICBcbiAgICAgICAgfSxcblxuICAgICAgICBhZGRUb0RvbTogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgdmFyIF9jb250YWluZXIgPSAkKCcuanEtdG9hc3Qtd3JhcCcpO1xuICAgICAgICAgICAgIFxuICAgICAgICAgICAgIGlmICggX2NvbnRhaW5lci5sZW5ndGggPT09IDAgKSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgX2NvbnRhaW5lciA9ICQoJzxkaXY+PC9kaXY+Jyx7XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzOiBcImpxLXRvYXN0LXdyYXBcIixcbiAgICAgICAgICAgICAgICAgICAgcm9sZTogXCJhbGVydFwiLFxuICAgICAgICAgICAgICAgICAgICBcImFyaWEtbGl2ZVwiOiBcInBvbGl0ZVwiXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAkKCdib2R5JykuYXBwZW5kKCBfY29udGFpbmVyICk7XG5cbiAgICAgICAgICAgICB9IGVsc2UgaWYgKCAhdGhpcy5vcHRpb25zLnN0YWNrIHx8IGlzTmFOKCBwYXJzZUludCh0aGlzLm9wdGlvbnMuc3RhY2ssIDEwKSApICkge1xuICAgICAgICAgICAgICAgIF9jb250YWluZXIuZW1wdHkoKTtcbiAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICBfY29udGFpbmVyLmZpbmQoJy5qcS10b2FzdC1zaW5nbGU6aGlkZGVuJykucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgICBfY29udGFpbmVyLmFwcGVuZCggdGhpcy5fdG9hc3RFbCApO1xuXG4gICAgICAgICAgICBpZiAoIHRoaXMub3B0aW9ucy5zdGFjayAmJiAhaXNOYU4oIHBhcnNlSW50KCB0aGlzLm9wdGlvbnMuc3RhY2sgKSwgMTAgKSApIHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB2YXIgX3ByZXZUb2FzdENvdW50ID0gX2NvbnRhaW5lci5maW5kKCcuanEtdG9hc3Qtc2luZ2xlJykubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICBfZXh0VG9hc3RDb3VudCA9IF9wcmV2VG9hc3RDb3VudCAtIHRoaXMub3B0aW9ucy5zdGFjaztcblxuICAgICAgICAgICAgICAgIGlmICggX2V4dFRvYXN0Q291bnQgPiAwICkge1xuICAgICAgICAgICAgICAgICAgICAkKCcuanEtdG9hc3Qtd3JhcCcpLmZpbmQoJy5qcS10b2FzdC1zaW5nbGUnKS5zbGljZSgwLCBfZXh0VG9hc3RDb3VudCkucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9jb250YWluZXIgPSBfY29udGFpbmVyO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNhbkF1dG9IaWRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gKCB0aGlzLm9wdGlvbnMuaGlkZUFmdGVyICE9PSBmYWxzZSApICYmICFpc05hTiggcGFyc2VJbnQoIHRoaXMub3B0aW9ucy5oaWRlQWZ0ZXIsIDEwICkgKTtcbiAgICAgICAgfSxcblxuICAgICAgICBwcm9jZXNzTG9hZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyBTaG93IHRoZSBsb2FkZXIgb25seSwgaWYgYXV0by1oaWRlIGlzIG9uIGFuZCBsb2FkZXIgaXMgZGVtYW5kZWRcbiAgICAgICAgICAgIGlmICghdGhpcy5jYW5BdXRvSGlkZSgpIHx8IHRoaXMub3B0aW9ucy5sb2FkZXIgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgbG9hZGVyID0gdGhpcy5fdG9hc3RFbC5maW5kKCcuanEtdG9hc3QtbG9hZGVyJyk7XG5cbiAgICAgICAgICAgIC8vIDQwMCBpcyB0aGUgZGVmYXVsdCB0aW1lIHRoYXQganF1ZXJ5IHVzZXMgZm9yIGZhZGUvc2xpZGVcbiAgICAgICAgICAgIC8vIERpdmlkZSBieSAxMDAwIGZvciBtaWxsaXNlY29uZHMgdG8gc2Vjb25kcyBjb252ZXJzaW9uXG4gICAgICAgICAgICB2YXIgdHJhbnNpdGlvblRpbWUgPSAodGhpcy5vcHRpb25zLmhpZGVBZnRlciAtIDQwMCkgLyAxMDAwICsgJ3MnO1xuICAgICAgICAgICAgdmFyIGxvYWRlckJnID0gdGhpcy5vcHRpb25zLmxvYWRlckJnO1xuXG4gICAgICAgICAgICB2YXIgc3R5bGUgPSBsb2FkZXIuYXR0cignc3R5bGUnKSB8fCAnJztcbiAgICAgICAgICAgIHN0eWxlID0gc3R5bGUuc3Vic3RyaW5nKDAsIHN0eWxlLmluZGV4T2YoJy13ZWJraXQtdHJhbnNpdGlvbicpKTsgLy8gUmVtb3ZlIHRoZSBsYXN0IHRyYW5zaXRpb24gZGVmaW5pdGlvblxuXG4gICAgICAgICAgICBzdHlsZSArPSAnLXdlYmtpdC10cmFuc2l0aW9uOiB3aWR0aCAnICsgdHJhbnNpdGlvblRpbWUgKyAnIGVhc2UtaW47IFxcXG4gICAgICAgICAgICAgICAgICAgICAgLW8tdHJhbnNpdGlvbjogd2lkdGggJyArIHRyYW5zaXRpb25UaW1lICsgJyBlYXNlLWluOyBcXFxuICAgICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb246IHdpZHRoICcgKyB0cmFuc2l0aW9uVGltZSArICcgZWFzZS1pbjsgXFxcbiAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAnICsgbG9hZGVyQmcgKyAnOyc7XG5cblxuICAgICAgICAgICAgbG9hZGVyLmF0dHIoJ3N0eWxlJywgc3R5bGUpLmFkZENsYXNzKCdqcS10b2FzdC1sb2FkZWQnKTtcbiAgICAgICAgfSxcblxuICAgICAgICBhbmltYXRlOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgICAgICAgdGhpcy5fdG9hc3RFbC5oaWRlKCk7XG5cbiAgICAgICAgICAgIHRoaXMuX3RvYXN0RWwudHJpZ2dlcignYmVmb3JlU2hvdycpO1xuXG4gICAgICAgICAgICBpZiAoIHRoaXMub3B0aW9ucy5zaG93SGlkZVRyYW5zaXRpb24udG9Mb3dlckNhc2UoKSA9PT0gJ2ZhZGUnICkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3RvYXN0RWwuZmFkZUluKGZ1bmN0aW9uICggKXtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5fdG9hc3RFbC50cmlnZ2VyKCdhZnRlclNob3duJyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCB0aGlzLm9wdGlvbnMuc2hvd0hpZGVUcmFuc2l0aW9uLnRvTG93ZXJDYXNlKCkgPT09ICdzbGlkZScgKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdG9hc3RFbC5zbGlkZURvd24oZnVuY3Rpb24gKCApe1xuICAgICAgICAgICAgICAgICAgICB0aGF0Ll90b2FzdEVsLnRyaWdnZXIoJ2FmdGVyU2hvd24nKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdG9hc3RFbC5zaG93KGZ1bmN0aW9uICggKXtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5fdG9hc3RFbC50cmlnZ2VyKCdhZnRlclNob3duJyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmNhbkF1dG9IaWRlKCkpIHtcblxuICAgICAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBpZiAoIHRoYXQub3B0aW9ucy5zaG93SGlkZVRyYW5zaXRpb24udG9Mb3dlckNhc2UoKSA9PT0gJ2ZhZGUnICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5fdG9hc3RFbC50cmlnZ2VyKCdiZWZvcmVIaWRlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0Ll90b2FzdEVsLmZhZGVPdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuX3RvYXN0RWwudHJpZ2dlcignYWZ0ZXJIaWRkZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCB0aGF0Lm9wdGlvbnMuc2hvd0hpZGVUcmFuc2l0aW9uLnRvTG93ZXJDYXNlKCkgPT09ICdzbGlkZScgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0Ll90b2FzdEVsLnRyaWdnZXIoJ2JlZm9yZUhpZGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuX3RvYXN0RWwuc2xpZGVVcChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5fdG9hc3RFbC50cmlnZ2VyKCdhZnRlckhpZGRlbicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0Ll90b2FzdEVsLnRyaWdnZXIoJ2JlZm9yZUhpZGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuX3RvYXN0RWwuaGlkZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5fdG9hc3RFbC50cmlnZ2VyKCdhZnRlckhpZGRlbicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH0sIHRoaXMub3B0aW9ucy5oaWRlQWZ0ZXIpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcblxuICAgICAgICByZXNldDogZnVuY3Rpb24gKCByZXNldFdoYXQgKSB7XG5cbiAgICAgICAgICAgIGlmICggcmVzZXRXaGF0ID09PSAnYWxsJyApIHtcbiAgICAgICAgICAgICAgICAkKCcuanEtdG9hc3Qtd3JhcCcpLnJlbW92ZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl90b2FzdEVsLnJlbW92ZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0sXG5cbiAgICAgICAgdXBkYXRlOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgICAgICB0aGlzLnByZXBhcmVPcHRpb25zKG9wdGlvbnMsIHRoaXMub3B0aW9ucyk7XG4gICAgICAgICAgICB0aGlzLnNldHVwKCk7XG4gICAgICAgICAgICB0aGlzLmJpbmRUb2FzdCgpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBcbiAgICAkLnRvYXN0ID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICB2YXIgdG9hc3QgPSBPYmplY3QuY3JlYXRlKFRvYXN0KTtcbiAgICAgICAgdG9hc3QuaW5pdChvcHRpb25zLCB0aGlzKTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXNldDogZnVuY3Rpb24gKCB3aGF0ICkge1xuICAgICAgICAgICAgICAgIHRvYXN0LnJlc2V0KCB3aGF0ICk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uKCBvcHRpb25zICkge1xuICAgICAgICAgICAgICAgIHRvYXN0LnVwZGF0ZSggb3B0aW9ucyApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgICQudG9hc3Qub3B0aW9ucyA9IHtcbiAgICAgICAgdGV4dDogJycsXG4gICAgICAgIGhlYWRpbmc6ICcnLFxuICAgICAgICBzaG93SGlkZVRyYW5zaXRpb246ICdmYWRlJyxcbiAgICAgICAgYWxsb3dUb2FzdENsb3NlOiB0cnVlLFxuICAgICAgICBoaWRlQWZ0ZXI6IDMwMDAsXG4gICAgICAgIGxvYWRlcjogdHJ1ZSxcbiAgICAgICAgbG9hZGVyQmc6ICcjOUVDNjAwJyxcbiAgICAgICAgc3RhY2s6IDUsXG4gICAgICAgIHBvc2l0aW9uOiAnYm90dG9tLWxlZnQnLFxuICAgICAgICBiZ0NvbG9yOiBmYWxzZSxcbiAgICAgICAgdGV4dENvbG9yOiBmYWxzZSxcbiAgICAgICAgdGV4dEFsaWduOiAnbGVmdCcsXG4gICAgICAgIGljb246IGZhbHNlLFxuICAgICAgICBiZWZvcmVTaG93OiBmdW5jdGlvbiAoKSB7fSxcbiAgICAgICAgYWZ0ZXJTaG93bjogZnVuY3Rpb24gKCkge30sXG4gICAgICAgIGJlZm9yZUhpZGU6IGZ1bmN0aW9uICgpIHt9LFxuICAgICAgICBhZnRlckhpZGRlbjogZnVuY3Rpb24gKCkge31cbiAgICB9O1xuXG59KSggalF1ZXJ5LCB3aW5kb3csIGRvY3VtZW50ICk7XG4iLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW4iLCIvKlxuICogV2VsY29tZSB0byB5b3VyIGFwcCdzIG1haW4gSmF2YVNjcmlwdCBmaWxlIVxuICpcbiAqIFdlIHJlY29tbWVuZCBpbmNsdWRpbmcgdGhlIGJ1aWx0IHZlcnNpb24gb2YgdGhpcyBKYXZhU2NyaXB0IGZpbGVcbiAqIChhbmQgaXRzIENTUyBmaWxlKSBpbiB5b3VyIGJhc2UgbGF5b3V0IChtYXN0ZXIuaHRtbC50d2lnKS5cbiAqL1xuXG4vLyBDU1MgeW91IHJlcXVpcmUgd2lsbCBvdXRwdXQgaW50byBhIHNpbmdsZSBjc3MgZmlsZSAocHVibGljL2J1aWxkL2FwcC5jc3MgaW4gdGhpcyBjYXNlKVxucmVxdWlyZSgnLi4vY3NzL2FwcC5jc3MnKTtcblxuXG4vLyBKUyB5b3UgcmVxdWlyZSB3aWxsIG91dHB1dCBpbnRvIGEgc2luZ2xlIGpzIGZpbGUgKHB1YmxpYy9idWlsZC9hcHAuanMpXG5yZXF1aXJlKCcuLi9qcy9tb292aXR5Jyk7XG5cblxuLy9CdW5kbGVzXG4gICAgLy9PbWluZXMgRGF0YXRhYmxlc1xuICAgIHJlcXVpcmUoJy4uL2J1bmRsZXMvb21pbmVzLWRhdGF0YWJsZXMvanMvZGF0YXRhYmxlcy5qcycpO1xuICAgIC8vVG9hc3Qgbm90aWZpY2F0aW9uc1xuICAgIHJlcXVpcmUoJy4uL2J1bmRsZXMvdG9hc3QvanMvanF1ZXJ5LnRvYXN0LmpzJyk7XG4gICAgcmVxdWlyZSgnLi4vYnVuZGxlcy90b2FzdC9jc3MvanF1ZXJ5LnRvYXN0LmNzcycpO1xuIiwiXG52YXIgVGFibGVzID0gKGZ1bmN0aW9uICgkKSB7XG5cbiAgICB2YXIgbG9hZFRhYmxlRGF0YSA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICB2YXIgc2V0dGluZ3MgPSAkKCcjdGFibGUtZGF0YScpLmRhdGEoJ3NldHRpbmdzJyk7XG5cbiAgICAgICAgaWYgKHNldHRpbmdzKSB7XG5cbiAgICAgICAgICAgICQoJyN0YWJsZS1kYXRhJykuaW5pdERhdGFUYWJsZXMoc2V0dGluZ3MsIHtcbiAgICAgICAgICAgICAgICBzZWFyY2hpbmc6IHRydWUsXG4gICAgICAgICAgICAgICAgZG9tOidmPFwiaHRtbDVidXR0b25zXCI+QnJ0aXAnLFxuICAgICAgICAgICAgICAgIGxhbmd1YWdlOiB7XG4gICAgICAgICAgICAgICAgICAgIFwic1Byb2Nlc3NpbmdcIjogICAgIFwiUHJvY2VzYW5kby4uLlwiLFxuICAgICAgICAgICAgICAgICAgICBcInNMZW5ndGhNZW51XCI6ICAgICBcIk1vc3RyYXIgX01FTlVfIHJlZ2lzdHJvc1wiLFxuICAgICAgICAgICAgICAgICAgICBcInNaZXJvUmVjb3Jkc1wiOiAgICBcIk5vIHNlIGVuY29udHJhcm9uIHJlc3VsdGFkb3NcIixcbiAgICAgICAgICAgICAgICAgICAgXCJzRW1wdHlUYWJsZVwiOiAgICAgXCJOaW5nw7puIGRhdG8gZGlzcG9uaWJsZSBlbiBlc3RhIHRhYmxhXCIsXG4gICAgICAgICAgICAgICAgICAgIFwic0luZm9cIjogICAgICAgICAgIFwiTW9zdHJhbmRvIHJlZ2lzdHJvcyBkZWwgX1NUQVJUXyBhbCBfRU5EXyBkZSB1biB0b3RhbCBkZSBfVE9UQUxfIHJlZ2lzdHJvc1wiLFxuICAgICAgICAgICAgICAgICAgICBcInNJbmZvRW1wdHlcIjogICAgICBcIk1vc3RyYW5kbyByZWdpc3Ryb3MgZGVsIDAgYWwgMCBkZSB1biB0b3RhbCBkZSAwIHJlZ2lzdHJvc1wiLFxuICAgICAgICAgICAgICAgICAgICBcInNJbmZvRmlsdGVyZWRcIjogICBcIihmaWx0cmFkbyBkZSB1biB0b3RhbCBkZSBfTUFYXyByZWdpc3Ryb3MpXCIsXG4gICAgICAgICAgICAgICAgICAgIFwic0luZm9Qb3N0Rml4XCI6ICAgIFwiXCIsXG4gICAgICAgICAgICAgICAgICAgIFwic1NlYXJjaFwiOiAgICAgICAgIFwiXCIsXG4gICAgICAgICAgICAgICAgICAgIFwic2VhcmNoUGxhY2Vob2xkZXJcIjogXCJCdXNjYXJcIixcbiAgICAgICAgICAgICAgICAgICAgXCJzVXJsXCI6ICAgICAgICAgICAgXCJcIixcbiAgICAgICAgICAgICAgICAgICAgXCJzSW5mb1Rob3VzYW5kc1wiOiAgXCIsXCIsXG4gICAgICAgICAgICAgICAgICAgIFwic0xvYWRpbmdSZWNvcmRzXCI6IFwiQ2FyZ2FuZG8uLi5cIixcbiAgICAgICAgICAgICAgICAgICAgXCJvUGFnaW5hdGVcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJzRmlyc3RcIjogICAgXCJQcmltZXJvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInNMYXN0XCI6ICAgICBcIsOabHRpbW9cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic05leHRcIjogICAgIFwiU2lndWllbnRlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInNQcmV2aW91c1wiOiBcIkFudGVyaW9yXCJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgXCJvQXJpYVwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcInNTb3J0QXNjZW5kaW5nXCI6ICBcIjogQWN0aXZhciBwYXJhIG9yZGVuYXIgbGEgY29sdW1uYSBkZSBtYW5lcmEgYXNjZW5kZW50ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzU29ydERlc2NlbmRpbmdcIjogXCI6IEFjdGl2YXIgcGFyYSBvcmRlbmFyIGxhIGNvbHVtbmEgZGUgbWFuZXJhIGRlc2NlbmRlbnRlXCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcmVzcG9uc2l2ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBvcmRlckNlbGxzVG9wOiB0cnVlLFxuICAgICAgICAgICAgICAgIGZpeGVkSGVhZGVyOiB0cnVlLFxuICAgICAgICAgICAgICAgIGJ1dHRvbnM6IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXh0ZW5kOiAgICAnY29sdmlzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICAgICAgJ0NvbHVtbmFzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlQXR0cjogJ0NvbCB2aXNpYmlsaXR5JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2J0bi1vdXRsaW5lLWRlZmF1bHQgYnRuLXByaW1hcnknXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4dGVuZDogICAgJ2Nzdkh0bWw1JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICAgICAgJ0V4cG9ydGFyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlQXR0cjogJ0dlbmVyYXRlIENTVicsXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdidG4tb3V0bGluZS1kZWZhdWx0IGJ0bi1wcmltYXJ5J1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBleHRlbmQ6ICAgICdjb3B5SHRtbDUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogICAgICAnQ29waWFyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlQXR0cjogJ0NvcHkgdG8gY2xpcGJvYXJkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2J0bi1vdXRsaW5lLWRlZmF1bHQgYnRuLXByaW1hcnknXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4dGVuZDogICAgJ3ByaW50JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICAgICAgJ0ltcHJpbWlyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlQXR0cjogJ1ByaW50IFRhYmxlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2J0bi1vdXRsaW5lLWRlZmF1bHQgYnRuLXByaW1hcnknXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIGluaXRDb21wbGV0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAkKCcudGFibGUtYnRuJykuYXBwZW5kVG8oJy5odG1sNWJ1dHRvbnMnKTtcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZlUmVkaXJlY3Rpb24gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRyYXdDYWxsYmFjazogZnVuY3Rpb24oKSB7ICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICQoJ1tocmVmKj1cIi9kZWxldGUvXCJdIGknKS5vbignY2xpY2snLCBmdW5jdGlvbihlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGFjdGl2ZVJlZGlyZWN0aW9uID09IGZhbHNlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBTd2FsLmZpcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0FyZSB5b3Ugc3VyZT8nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBcIllvdSB3b24ndCBiZSBhYmxlIHRvIHJldmVydCB0aGlzIVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnd2FybmluZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3dDYW5jZWxCdXR0b246IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpcm1CdXR0b25Db2xvcjogJyMzMDg1ZDYnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5jZWxCdXR0b25Db2xvcjogJyNkMzMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogJ1llcywgZGVsZXRlIGl0ISdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC52YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlUmVkaXJlY3Rpb24gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5jbGljaygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgc21hcnRQYW5lbCA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAkKCcjc21hcnQtcGFuZWxzJykuc21hcnRQYW5lbCh7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2U6IHRydWUsXG4gICAgICAgICAgICBvbkNoYW5nZTogZnVuY3Rpb24gKCkgeyB9LFxuICAgICAgICAgICAgb25TYXZlOiBmdW5jdGlvbiAoKSB7IH0sXG4gICAgICAgICAgICBvcGFjaXR5OiAxLFxuICAgICAgICAgICAgZGVsZXRlU2V0dGluZ3NLZXk6ICcjZGVsZXRlc2V0dGluZ3NrZXktb3B0aW9ucycsXG4gICAgICAgICAgICBzZXR0aW5nc0tleUxhYmVsOiAnUmVzZXQgc2V0dGluZ3M/JyxcbiAgICAgICAgICAgIGRlbGV0ZVBvc2l0aW9uS2V5OiAnI2RlbGV0ZXBvc2l0aW9ua2V5LW9wdGlvbnMnLFxuICAgICAgICAgICAgcG9zaXRpb25LZXlMYWJlbDogJ1Jlc2V0IHBvc2l0aW9uPycsXG4gICAgICAgICAgICBzb3J0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGJ1dHRvbk9yZGVyOiAnJWNvbGxhcHNlJSAlZnVsbHNjcmVlbiUgJWNsb3NlJScsXG4gICAgICAgICAgICBidXR0b25PcmRlckRyb3Bkb3duOiAnJXJlZnJlc2glICVsb2NrZWQlICVjb2xvciUgJWN1c3RvbSUgJXJlc2V0JScsXG4gICAgICAgICAgICBjdXN0b21CdXR0b246IGZhbHNlLFxuICAgICAgICAgICAgY3VzdG9tQnV0dG9uTGFiZWw6IFwiQ3VzdG9tIEJ1dHRvblwiLFxuICAgICAgICAgICAgb25DdXN0b206IGZ1bmN0aW9uICgpIHsgfSxcbiAgICAgICAgICAgIGNsb3NlQnV0dG9uOiB0cnVlLFxuICAgICAgICAgICAgb25DbG9zZXBhbmVsOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKG15YXBwX2NvbmZpZy5kZWJ1Z1N0YXRlKVxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygkKHRoaXMpLmNsb3Nlc3QoXCIucGFuZWxcIikuYXR0cignaWQnKSArIFwiIG9uQ2xvc2VwYW5lbFwiKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZ1bGxzY3JlZW5CdXR0b246IHRydWUsXG4gICAgICAgICAgICBvbkZ1bGxzY3JlZW46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAobXlhcHBfY29uZmlnLmRlYnVnU3RhdGUpXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCQodGhpcykuY2xvc2VzdChcIi5wYW5lbFwiKS5hdHRyKCdpZCcpICsgXCIgb25GdWxsc2NyZWVuXCIpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY29sbGFwc2VCdXR0b246IHRydWUsXG4gICAgICAgICAgICBvbkNvbGxhcHNlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKG15YXBwX2NvbmZpZy5kZWJ1Z1N0YXRlKVxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygkKHRoaXMpLmNsb3Nlc3QoXCIucGFuZWxcIikuYXR0cignaWQnKSArIFwiIG9uQ29sbGFwc2VcIilcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBsb2NrZWRCdXR0b246IHRydWUsXG4gICAgICAgICAgICBsb2NrZWRCdXR0b25MYWJlbDogXCJGaWphciBQb3NpY2nDs25cIixcbiAgICAgICAgICAgIG9uTG9ja2VkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKG15YXBwX2NvbmZpZy5kZWJ1Z1N0YXRlKVxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygkKHRoaXMpLmNsb3Nlc3QoXCIucGFuZWxcIikuYXR0cignaWQnKSArIFwiIG9uTG9ja2VkXCIpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVmcmVzaEJ1dHRvbjogZmFsc2UsXG4gICAgICAgICAgICByZWZyZXNoQnV0dG9uTGFiZWw6IFwiUmVmcmVzaCBDb250ZW50XCIsXG4gICAgICAgICAgICBvblJlZnJlc2g6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAobXlhcHBfY29uZmlnLmRlYnVnU3RhdGUpXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCQodGhpcykuY2xvc2VzdChcIi5wYW5lbFwiKS5hdHRyKCdpZCcpICsgXCIgb25SZWZyZXNoXCIpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY29sb3JCdXR0b246IGZhbHNlLFxuICAgICAgICAgICAgY29sb3JCdXR0b25MYWJlbDogXCJQYW5lbCBTdHlsZVwiLFxuICAgICAgICAgICAgb25Db2xvcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmIChteWFwcF9jb25maWcuZGVidWdTdGF0ZSlcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJCh0aGlzKS5jbG9zZXN0KFwiLnBhbmVsXCIpLmF0dHIoJ2lkJykgKyBcIiBvbkNvbG9yXCIpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGFuZWxDb2xvcnM6IFsnYmctcHJpbWFyeS03MDAgYmctc3VjY2Vzcy1ncmFkaWVudCcsXG4gICAgICAgICAgICAgICAgJ2JnLXByaW1hcnktNTAwIGJnLWluZm8tZ3JhZGllbnQnLFxuICAgICAgICAgICAgICAgICdiZy1wcmltYXJ5LTYwMCBiZy1wcmltYXJ5LWdyYWRpZW50JyxcbiAgICAgICAgICAgICAgICAnYmctaW5mby02MDAgYmctcHJpbXJheS1ncmFkaWVudCcsXG4gICAgICAgICAgICAgICAgJ2JnLWluZm8tNjAwIGJnLWluZm8tZ3JhZGllbnQnLFxuICAgICAgICAgICAgICAgICdiZy1pbmZvLTcwMCBiZy1zdWNjZXNzLWdyYWRpZW50JyxcbiAgICAgICAgICAgICAgICAnYmctc3VjY2Vzcy05MDAgYmctaW5mby1ncmFkaWVudCcsXG4gICAgICAgICAgICAgICAgJ2JnLXN1Y2Nlc3MtNzAwIGJnLXByaW1hcnktZ3JhZGllbnQnLFxuICAgICAgICAgICAgICAgICdiZy1zdWNjZXNzLTYwMCBiZy1zdWNjZXNzLWdyYWRpZW50JyxcbiAgICAgICAgICAgICAgICAnYmctZGFuZ2VyLTkwMCBiZy1pbmZvLWdyYWRpZW50JyxcbiAgICAgICAgICAgICAgICAnYmctZnVzaW9uLTQwMCBiZy1mdXNpb24tZ3JhZGllbnQnLFxuICAgICAgICAgICAgICAgICdiZy1mYWRlZCddLFxuICAgICAgICAgICAgcmVzZXRCdXR0b246IGZhbHNlLFxuICAgICAgICAgICAgcmVzZXRCdXR0b25MYWJlbDogXCJSZXNldCBQYW5lbFwiLFxuICAgICAgICAgICAgb25SZXNldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmIChteWFwcF9jb25maWcuZGVidWdTdGF0ZSlcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJCh0aGlzKS5jbG9zZXN0KFwiLnBhbmVsXCIpLmF0dHIoJ2lkJykgKyBcIiBvblJlc2V0IGNhbGxiYWNrXCIpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGxvYWRUYWJsZURhdGEoKTtcbiAgICAgICAgICAgIHNtYXJ0UGFuZWwoKTtcbiAgICAgICAgfSxcbiAgICB9O1xuXG59KShqUXVlcnkpO1xuXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgVGFibGVzLmluaXQoKTtcbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==