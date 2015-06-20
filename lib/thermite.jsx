'use strict';

var http = require('http-browserify');
var hotkey = require('react-hotkey');
var R = require('ramda');
var React = require('react/addons');
var textFit = require('textFit');
var url = require('url');

hotkey.activate();

var ReactTextFit = React.createClass({
  displayName: 'ReactTextFit',

  componentDidMount: function() {
    window.addEventListener('resize', this._onBodyResize);
    this._onBodyResize();
  },

  componentWillUnmount: function() {
    window.removeEventListener('resize', this._onBodyResize);
  },

  componentDidUpdate: function() {
    this._onBodyResize();
  },

  _onBodyResize: function() {
    var element = this.getDOMNode();
    var settings = {
      alignVert: true,
      alignHoriz: true,
      maxFontSize: 1000,
      multiLine: true,
    };
    textFit(element, settings);
  },

  render: function() {
    return this.props.children;
  },
});
//--------------------

var Slideshow = React.createClass({
  mixins: [hotkey.Mixin('handleHotkey')],
  getInitialState: function() {
    return {
      slides: [],
      active: null,
    };
  },
  componentDidMount: function() {
    var component = this;

    var dataUrl = this.getDOMNode().parentNode.getAttribute('data-url');
    var urlStr = url.resolve(window.location.href, dataUrl);
    var urlObj = url.parse(urlStr);

    http.get(urlObj, function (res) {
      var str = '';
      res.on('data', function (buf) {
        str += buf;
      });
      res.on('error', function (err) {
        console.error(urlStr, res.status, err.toString());
      });
      res.on('end', function (buf) {
        var data = JSON.parse(str);

        component.setState({
          slides: data.slides,
          active: 0,
        });
      });
    });
  },
  changeSlide: function(n) {
    var next = this.state.active + n;
    if (next >= 0 && next < this.state.slides.length) {
      this.setState({active: next});
    }
  },
  handleClick: function(event) {
    this.changeSlide(1);
  },
  handleHotkey: function(event) {
    var that = this;
    var mappedKeys = {
      'ArrowRight': function () {
        that.changeSlide(1);
      },
      'ArrowLeft': function () {
        that.changeSlide(-1);
      },
    };

    if (R.has(event.key)(mappedKeys)) {
      mappedKeys[event.key]();
    }
  },
  render: function() {
    var text = '';
    if (this.state.slides.length) {
      text = this.state.slides[this.state.active].text;
    }
    return (
      <div onClick={this.handleClick}>
        <Slide>
          {text}
        </Slide>
      </div>
    );
  },
});


var Slide = React.createClass({
  render: function() {
    var cx = React.addons.classSet;
    var classes = cx({
      'slide': true,
    });

    var str = this.props.children.toString();

    var divStyle = {
      height: '100%',
      width: '100%',
    };

    return (
      <div className={classes}>
        <ReactTextFit>
          <div style={divStyle} dangerouslySetInnerHTML={{__html: str}}></div>
        </ReactTextFit>
      </div>
    );
  },
});


React.render(
  <Slideshow />,
  document.getElementById('slideshow')
);
