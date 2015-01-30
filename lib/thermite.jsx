'use strict';

var http = require('http-browserify');
var React = require('react/addons');
var url = require('url');


// this part stole from https://github.com/gianu/react-fittext
// TODO: properly submit PRs and use npm version of react-fittext
//
//     - it had some confusingly broken dependencies at the time of writing
//
var ReactPropTypes = React.PropTypes;
var ReactFitText = React.createClass({
  displayName: 'ReactFitText',

  propTypes: {
    children: ReactPropTypes.element.isRequired,
    compressor: ReactPropTypes.number,
    minFontSize: ReactPropTypes.number,
    maxFontSize: ReactPropTypes.number
  },

  getDefaultProps: function() {
    return {
      compressor: 1.0,
      minFontSize: Number.NEGATIVE_INFINITY,
      maxFontSize: Number.POSITIVE_INFINITY
    };
  },

  componentDidMount: function() {
    window.addEventListener("resize", this._onBodyResize);
    this._onBodyResize();
  },

  componentWillUnmount: function() {
    window.removeEventListener("resize", this._onBodyResize);
  },

  _onBodyResize: function() {
    var element = this.getDOMNode();
    var width = element.offsetWidth;
    element.style.fontSize = Math.max(
                      Math.min((width / (this.props.compressor*10)),
                                parseFloat(this.props.maxFontSize)),
                      parseFloat(this.props.minFontSize)) + 'px';
  },

  render: function() {
    return this.props.children;
  }
});
//--------------------

var Slideshow = React.createClass({
  getInitialState: function() {
    return {
      slides: [],
      active: null
    };
  },
  componentDidMount: function() {
    var component = this;

    var dataUrl = this.getDOMNode().parentNode.getAttribute('data-url');
    var urlStr = url.resolve(window.location.href, dataUrl);
    var urlObj = url.parse(urlStr);

    http.get(urlObj, function (res) {
      var str = "";
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
          active: 0
        });
      });
    });
  },
  handleClick: function(event) {
    var next = this.state.active === this.state.slides.length - 1 ? 0 : this.state.active + 1;
    this.setState({active: next});
  },
  render: function() {
    return (
      <div onClick={this.handleClick}>
        <SlideList slides={this.state.slides} active={this.state.active} />
      </div>
    );
  }
});


var SlideList = React.createClass({
  render: function() {
    var slides = this.props.slides;
    var active = this.props.active;
    var slideNodes = slides.map(function (slide, i) {
      var key = 'react-' + i;
      var slideActive = active == i;
      return (
        <Slide key={key} active={slideActive}>
          {slide.text}
        </Slide>
      );
    });
    return (
      <div className="slides">
        {slideNodes}
      </div>
    );
  }
});


var Slide = React.createClass({
  render: function() {
    var cx = React.addons.classSet;
    var classes = cx({
      'slide': true,
      'hidden': !this.props.active
    });

    var str = this.props.children.toString();

    return (
      <div className={classes}>
        <ReactFitText>
          <div dangerouslySetInnerHTML={{__html: str}}></div>
        </ReactFitText>
      </div>
    );
  }
});


React.render(
  <Slideshow />,
  document.getElementById('slideshow')
);
