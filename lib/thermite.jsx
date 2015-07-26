'use strict';

require('./thermite.scss');
require('vibrant');

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

        data.slides.forEach((slide) => {
          if (!slide.color && slide.img) {
            let img = document.createElement('img');
            img.setAttribute('src', slide.img);
            img.setAttribute('crossOrigin', 'anonymous');
            img.setAttribute('visibility', 'hidden');

            img.addEventListener('load', function() {
              let vibrant = new Vibrant(img);
              const swatches = vibrant.swatches();

              if (swatches.hasOwnProperty('Vibrant')) {
                slide.color = swatches.Vibrant.getHex();
              }
            });
          }
        });

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
    const mappedKeys = {
      'ArrowRight': () => {
        this.changeSlide(1);
      },
      'ArrowLeft': () => {
        this.changeSlide(-1);
      },
    };

    if (R.has(event.key)(mappedKeys)) {
      mappedKeys[event.key]();
    }
  },
  render: function() {
    let text = '';
    let props = {};
    if (this.state.slides.length) {
      let active = this.state.slides[this.state.active];
      if (active.text) {
        text = active.text;
      }
      if (active.img) {
        props.backgroundImage = active.img;
      }
      if (active.color) {
        props.backgroundColor = active.color;
      }
    }

    return (
      <div onClick={this.handleClick}>
        <Slide {...props}>
          {text}
        </Slide>
      </div>
    );
  },
});


const Slide = React.createClass({
  render: function() {
    const cx = React.addons.classSet;
    let classObj = {
      'slide': true,
      'imaged': false,
    };

    const str = this.props.children.toString();

    let divStyle = {
      height: '100%',
      width: '100%',
    };

    if (this.props.backgroundImage) {
      const img = this.props.backgroundImage;
      classObj.imaged = true;
      divStyle = R.merge(divStyle, {
        'backgroundImage': "url('" + img + "')",
        'backgroundRepeat': 'no-repeat',
        'backgroundSize': 'contain',
        'backgroundPosition': 'center',
      });
    }

    if (this.props.backgroundColor) {
      divStyle = R.merge(divStyle, {
        'backgroundColor': this.props.backgroundColor,
      });
    }

    const classes = cx(classObj);
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
