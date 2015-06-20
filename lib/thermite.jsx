'use strict';

const http = require('http-browserify');
const hotkey = require('react-hotkey');
const R = require('ramda');
const React = require('react/addons');
const textFit = require('textFit');
const url = require('url');

hotkey.activate();

const ReactTextFit = React.createClass({
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
    const element = this.getDOMNode();
    const settings = {
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

const Slideshow = React.createClass({
  mixins: [hotkey.Mixin('handleHotkey')],
  getInitialState: function() {
    return {
      slides: [],
      active: null,
    };
  },
  componentDidMount: function() {
    const component = this;

    const dataUrl = this.getDOMNode().parentNode.getAttribute('data-url');
    const urlStr = url.resolve(window.location.href, dataUrl);
    const urlObj = url.parse(urlStr);

    http.get(urlObj, function (res) {
      let str = '';
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
    const next = this.state.active + n;
    if (next >= 0 && next < this.state.slides.length) {
      this.setState({active: next});
    }
  },
  handleClick: function(event) {
    this.changeSlide(1);
  },
  handleHotkey: function(event) {
    const that = this;
    const mappedKeys = {
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
    let text = '';
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


const Slide = React.createClass({
  render: function() {
    const cx = React.addons.classSet;
    const classes = cx({
      'slide': true,
    });

    const str = this.props.children.toString();

    const divStyle = {
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
