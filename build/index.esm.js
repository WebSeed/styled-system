import _extends from "@babel/runtime/helpers/esm/extends";
import PropTypes from 'prop-types'; // utils

var noop = function noop(n) {
  return n;
};

export var propTypes = {
  numberOrString: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  responsive: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.array])
};
export var defaultBreakpoints = [40, 52, 64].map(function (n) {
  return n + 'em';
});
export var is = function is(n) {
  return n !== undefined && n !== null;
};
export var num = function num(n) {
  return typeof n === 'number' && !isNaN(n);
};
export var px = function px(n) {
  return num(n) ? n + 'px' : n;
};
var isArray = Array.isArray;
export { isArray };
export var isObject = function isObject(n) {
  return typeof n === 'object' && n !== null;
};
export var get = function get(obj) {
  for (var _len = arguments.length, paths = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    paths[_key - 1] = arguments[_key];
  }

  return paths.join('.').split('.').reduce(function (a, b) {
    return a && a[b] ? a[b] : null;
  }, obj);
};
export var themeGet = function themeGet(paths, fallback) {
  return function (props) {
    return get(props.theme, paths) || fallback;
  };
};
export var cloneFunc = function cloneFunc(fn) {
  return function () {
    return fn.apply(void 0, arguments);
  };
};
export var merge = function merge(a, b) {
  return Object.assign({}, a, b, Object.keys(b || {}).reduce(function (obj, key) {
    var _Object$assign;

    return Object.assign(obj, (_Object$assign = {}, _Object$assign[key] = a[key] !== null && typeof a[key] === 'object' ? merge(a[key], b[key]) : b[key], _Object$assign));
  }, {}));
};
export var compose = function compose() {
  for (var _len2 = arguments.length, funcs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    funcs[_key2] = arguments[_key2];
  }

  var fn = function fn(props) {
    return funcs.map(function (fn) {
      return fn(props);
    }).filter(Boolean).reduce(merge, {});
  };

  fn.propTypes = funcs.map(function (fn) {
    return fn.propTypes;
  }).reduce(merge, {});
  return fn;
};
export var createMediaQuery = function createMediaQuery(n) {
  return "@media screen and (min-width: " + px(n) + ")";
};

var getStyles = function getStyles(_ref) {
  var props = _ref.props,
      style = _ref.style,
      value = _ref.value;

  if (!isObject(value)) {
    return style(value);
  } // how to hoist this up??


  var breakpoints = get(props.theme, 'breakpoints') || defaultBreakpoints;

  if (isArray(value)) {
    var _styles = style(value[0]) || {};

    for (var i = 1; i < value.length; i++) {
      var rule = style(value[i]);

      if (rule) {
        var media = createMediaQuery(breakpoints[i - 1]);
        _styles[media] = rule;
      }
    }

    return _styles;
  }

  var styles = {};

  for (var breakpoint in value) {
    var _minWidth = breakpoints[breakpoint];

    if (!_minWidth) {
      Object.assign(styles, style(value[breakpoint]));
    } else {
      var _rule = style(value[breakpoint]);

      var _media = createMediaQuery(_minWidth);

      styles[_media] = _rule;
    }
  }

  return styles;
};

export var style = function style(_ref2) {
  var _fn$propTypes;

  var prop = _ref2.prop,
      cssProperty = _ref2.cssProperty,
      key = _ref2.key,
      getter = _ref2.getter,
      transformValue = _ref2.transformValue,
      _ref2$scale = _ref2.scale,
      defaultScale = _ref2$scale === void 0 ? {} : _ref2$scale;
  var css = cssProperty || prop;
  var transform = transformValue || getter || noop;

  var fn = function fn(props) {
    var value = props[prop];
    if (!is(value)) return null;
    var scale = get(props.theme, key) || defaultScale;

    var style = function style(n) {
      var _ref3;

      return is(n) ? (_ref3 = {}, _ref3[css] = transform(get(scale, n) || n), _ref3) : null;
    };

    return getStyles({
      props: props,
      style: style,
      value: value
    });
  };

  fn.propTypes = (_fn$propTypes = {}, _fn$propTypes[prop] = cloneFunc(propTypes.responsive), _fn$propTypes);
  fn.propTypes[prop].meta = {
    prop: prop,
    themeKey: key,
    styleType: 'responsive'
  };
  return fn;
};
export var getWidth = function getWidth(n) {
  return !num(n) || n > 1 ? px(n) : n * 100 + '%';
}; // variant

export var variant = function variant(_ref4) {
  var _fn$propTypes2;

  var key = _ref4.key,
      _ref4$prop = _ref4.prop,
      prop = _ref4$prop === void 0 ? 'variant' : _ref4$prop;

  var fn = function fn(props) {
    return get(props.theme, key, props[prop]) || null;
  };

  fn.propTypes = (_fn$propTypes2 = {}, _fn$propTypes2[prop] = propTypes.numberOrString, _fn$propTypes2);
  return fn;
};
export var util = {
  propTypes: propTypes,
  defaultBreakpoints: defaultBreakpoints,
  is: is,
  num: num,
  px: px,
  get: get,
  themeGet: themeGet,
  cloneFunc: cloneFunc,
  merge: merge,
  compose: compose,
  createMediaQuery: createMediaQuery,
  style: style // space

};

var isNegative = function isNegative(n) {
  return n < 0;
};

var REG = /^[mp][trblxy]?$/;
var properties = {
  m: 'margin',
  p: 'padding'
};
var directions = {
  t: 'Top',
  r: 'Right',
  b: 'Bottom',
  l: 'Left',
  x: ['Left', 'Right'],
  y: ['Top', 'Bottom']
};

var getProperties = function getProperties(key) {
  var _key$split = key.split(''),
      a = _key$split[0],
      b = _key$split[1];

  var property = properties[a];
  var direction = directions[b] || '';
  return Array.isArray(direction) ? direction.map(function (dir) {
    return property + dir;
  }) : [property + direction];
};

var getValue = function getValue(scale) {
  return function (n) {
    if (!num(n)) {
      return px(scale[n] || n);
    }

    var abs = Math.abs(n);
    var neg = isNegative(n);
    var value = scale[abs] || abs;

    if (!num(value)) {
      return neg ? '-' + value : value;
    }

    return px(value * (neg ? -1 : 1));
  };
};

var defaultScale = [0, 4, 8, 16, 32, 64, 128, 256, 512];
export var space = function space(props) {
  var keys = Object.keys(props).filter(function (key) {
    return REG.test(key);
  }).sort();
  var scale = get(props.theme, 'space') || defaultScale;
  var getStyle = getValue(scale);
  return keys.map(function (key) {
    var value = props[key];
    var properties = getProperties(key);

    var style = function style(n) {
      return is(n) ? properties.reduce(function (a, prop) {
        var _extends2;

        return _extends({}, a, (_extends2 = {}, _extends2[prop] = getStyle(n), _extends2));
      }, {}) : null;
    };

    return getStyles({
      props: props,
      style: style,
      value: value
    });
  }).reduce(merge, {});
};
space.propTypes = {
  m: cloneFunc(propTypes.responsive),
  mt: cloneFunc(propTypes.responsive),
  mr: cloneFunc(propTypes.responsive),
  mb: cloneFunc(propTypes.responsive),
  ml: cloneFunc(propTypes.responsive),
  mx: cloneFunc(propTypes.responsive),
  my: cloneFunc(propTypes.responsive),
  p: cloneFunc(propTypes.responsive),
  pt: cloneFunc(propTypes.responsive),
  pr: cloneFunc(propTypes.responsive),
  pb: cloneFunc(propTypes.responsive),
  pl: cloneFunc(propTypes.responsive),
  px: cloneFunc(propTypes.responsive),
  py: cloneFunc(propTypes.responsive)
};

var meta = function meta(prop) {
  return {
    prop: prop,
    themeKey: 'space',
    styleType: 'responsive'
  };
};

Object.keys(space.propTypes).forEach(function (prop) {
  space.propTypes[prop].meta = meta(prop);
}); // styles

export var width = style({
  prop: 'width',
  transformValue: getWidth
});
export var fontSize = style({
  prop: 'fontSize',
  key: 'fontSizes',
  transformValue: px,
  scale: [12, 14, 16, 20, 24, 32, 48, 64, 72]
});
export var textColor = style({
  prop: 'color',
  key: 'colors'
});
export var bgColor = style({
  prop: 'bg',
  cssProperty: 'backgroundColor',
  key: 'colors'
});
export var color = compose(textColor, bgColor); // typography

export var fontFamily = style({
  prop: 'fontFamily',
  key: 'fonts'
});
export var textAlign = style({
  prop: 'textAlign'
});
export var lineHeight = style({
  prop: 'lineHeight',
  key: 'lineHeights'
});
export var fontWeight = style({
  prop: 'fontWeight',
  key: 'fontWeights'
});
export var fontStyle = style({
  prop: 'fontStyle'
});
export var letterSpacing = style({
  prop: 'letterSpacing',
  key: 'letterSpacings',
  transformValue: px
}); // layout

export var display = style({
  prop: 'display'
});
export var maxWidth = style({
  prop: 'maxWidth',
  key: 'maxWidths',
  transformValue: px
});
export var minWidth = style({
  prop: 'minWidth',
  key: 'minWidths',
  transformValue: px
});
export var height = style({
  prop: 'height',
  key: 'heights',
  transformValue: px
});
export var maxHeight = style({
  prop: 'maxHeight',
  key: 'maxHeights',
  transformValue: px
});
export var minHeight = style({
  prop: 'minHeight',
  key: 'minHeights',
  transformValue: px
});
export var sizeWidth = style({
  prop: 'size',
  cssProperty: 'width',
  transformValue: px
});
export var sizeHeight = style({
  prop: 'size',
  cssProperty: 'height',
  transformValue: px
});
export var size = compose(sizeHeight, sizeWidth);
export var ratioPadding = style({
  prop: 'ratio',
  cssProperty: 'paddingBottom',
  transformValue: function transformValue(n) {
    return n * 100 + '%';
  }
});
export var ratio = function ratio(props) {
  return props.ratio ? _extends({
    height: 0
  }, ratioPadding(props)) : null;
};
ratio.propTypes = _extends({}, ratioPadding.propTypes);
export var verticalAlign = style({
  prop: 'verticalAlign'
}); // flexbox

export var alignItems = style({
  prop: 'alignItems'
});
export var alignContent = style({
  prop: 'alignContent'
});
export var justifyItems = style({
  prop: 'justifyItems'
});
export var justifyContent = style({
  prop: 'justifyContent'
});
export var flexWrap = style({
  prop: 'flexWrap'
});
export var flexBasis = style({
  prop: 'flexBasis',
  transformValue: getWidth
});
export var flexDirection = style({
  prop: 'flexDirection'
});
export var flex = style({
  prop: 'flex'
});
export var justifySelf = style({
  prop: 'justifySelf'
});
export var alignSelf = style({
  prop: 'alignSelf'
});
export var order = style({
  prop: 'order'
}); // grid

export var gridGap = style({
  prop: 'gridGap',
  transformValue: px,
  key: 'space'
});
export var gridColumnGap = style({
  prop: 'gridColumnGap',
  transformValue: px,
  key: 'space'
});
export var gridRowGap = style({
  prop: 'gridRowGap',
  transformValue: px,
  key: 'space'
});
export var gridColumn = style({
  prop: 'gridColumn'
});
export var gridRow = style({
  prop: 'gridRow'
});
export var gridAutoFlow = style({
  prop: 'gridAutoFlow'
});
export var gridAutoColumns = style({
  prop: 'gridAutoColumns'
});
export var gridAutoRows = style({
  prop: 'gridAutoRows'
});
export var gridTemplateColumns = style({
  prop: 'gridTemplateColumns'
});
export var gridTemplateRows = style({
  prop: 'gridTemplateRows'
});
export var gridTemplateAreas = style({
  prop: 'gridTemplateAreas'
});
export var gridArea = style({
  prop: 'gridArea'
}); // borders

var getBorder = function getBorder(n) {
  return num(n) && n > 0 ? n + 'px solid' : n;
};

export var border = style({
  prop: 'border',
  key: 'borders',
  transformValue: getBorder
});
export var borderTop = style({
  prop: 'borderTop',
  key: 'borders',
  transformValue: getBorder
});
export var borderRight = style({
  prop: 'borderRight',
  key: 'borders',
  transformValue: getBorder
});
export var borderBottom = style({
  prop: 'borderBottom',
  key: 'borders',
  transformValue: getBorder
});
export var borderLeft = style({
  prop: 'borderLeft',
  key: 'borders',
  transformValue: getBorder
});
export var borders = compose(border, borderTop, borderRight, borderBottom, borderLeft);
export var borderColor = style({
  prop: 'borderColor',
  key: 'colors'
});
export var borderRadius = style({
  prop: 'borderRadius',
  key: 'radii',
  transformValue: px
});
export var boxShadow = style({
  prop: 'boxShadow',
  key: 'shadows'
});
export var opacity = style({
  prop: 'opacity'
});
export var overflow = style({
  prop: 'overflow'
}); // backgrounds

export var background = style({
  prop: 'background'
});
export var backgroundImage = style({
  prop: 'backgroundImage'
});
export var backgroundSize = style({
  prop: 'backgroundSize'
});
export var backgroundPosition = style({
  prop: 'backgroundPosition'
});
export var backgroundRepeat = style({
  prop: 'backgroundRepeat'
}); // position

export var position = style({
  prop: 'position'
});
export var zIndex = style({
  prop: 'zIndex'
});
export var top = style({
  prop: 'top',
  transformValue: px
});
export var right = style({
  prop: 'right',
  transformValue: px
});
export var bottom = style({
  prop: 'bottom',
  transformValue: px
});
export var left = style({
  prop: 'left',
  transformValue: px
});
export var textStyle = variant({
  prop: 'textStyle',
  key: 'textStyles'
});
export var colorStyle = variant({
  prop: 'colors',
  key: 'colorStyles'
});
export var buttonStyle = variant({
  key: 'buttons'
});
export var styles = {
  space: space,
  width: width,
  fontSize: fontSize,
  textColor: textColor,
  bgColor: bgColor,
  color: color,
  fontFamily: fontFamily,
  textAlign: textAlign,
  lineHeight: lineHeight,
  fontWeight: fontWeight,
  fontStyle: fontStyle,
  letterSpacing: letterSpacing,
  display: display,
  maxWidth: maxWidth,
  minWidth: minWidth,
  height: height,
  maxHeight: maxHeight,
  minHeight: minHeight,
  sizeWidth: sizeWidth,
  sizeHeight: sizeHeight,
  size: size,
  ratioPadding: ratioPadding,
  ratio: ratio,
  verticalAlign: verticalAlign,
  alignItems: alignItems,
  alignContent: alignContent,
  justifyItems: justifyItems,
  justifyContent: justifyContent,
  flexWrap: flexWrap,
  flexBasis: flexBasis,
  flexDirection: flexDirection,
  flex: flex,
  justifySelf: justifySelf,
  alignSelf: alignSelf,
  order: order,
  gridGap: gridGap,
  gridColumnGap: gridColumnGap,
  gridRowGap: gridRowGap,
  gridColumn: gridColumn,
  gridRow: gridRow,
  gridAutoFlow: gridAutoFlow,
  gridAutoColumns: gridAutoColumns,
  gridAutoRows: gridAutoRows,
  gridTemplateColumns: gridTemplateColumns,
  gridTemplateRows: gridTemplateRows,
  gridTemplateAreas: gridTemplateAreas,
  gridArea: gridArea,
  // borders
  border: border,
  borderTop: borderTop,
  borderRight: borderRight,
  borderBottom: borderBottom,
  borderLeft: borderLeft,
  borders: borders,
  borderColor: borderColor,
  borderRadius: borderRadius,
  boxShadow: boxShadow,
  opacity: opacity,
  overflow: overflow,
  background: background,
  backgroundImage: backgroundImage,
  backgroundPosition: backgroundPosition,
  backgroundRepeat: backgroundRepeat,
  backgroundSize: backgroundSize,
  position: position,
  zIndex: zIndex,
  top: top,
  right: right,
  bottom: bottom,
  left: left,
  textStyle: textStyle,
  colorStyle: colorStyle,
  buttonStyle: buttonStyle // mixed

};

var omit = function omit(obj, blacklist) {
  var next = {};

  for (var key in obj) {
    if (blacklist.indexOf(key) > -1) continue;
    next[key] = obj[key];
  }

  return next;
};

var funcs = Object.keys(styles).map(function (key) {
  return styles[key];
}).filter(function (fn) {
  return typeof fn === 'function';
});
var blacklist = funcs.reduce(function (a, fn) {
  return [].concat(a, Object.keys(fn.propTypes || {}));
}, ['theme']);
export var mixed = function mixed(props) {
  return funcs.map(function (fn) {
    return fn(props);
  }).reduce(merge, omit(props, blacklist));
};
