'use strict';

var http = require('http-browserify');
var React = require('react/addons');
var textFit = require('textFit');
var url = require('url');


var ReactTextFit = React.createClass({
  displayName: 'ReactTextFit',

  componentDidMount: function() {
    window.addEventListener("resize", this._onBodyResize);
    this._onBodyResize();
  },

  componentWillUnmount: function() {
    window.removeEventListener("resize", this._onBodyResize);
  },

  componentDidUpdate: function() {
    this._onBodyResize();
  },

  _onBodyResize: function() {
    var element = this.getDOMNode();
    var settings = {
      alignVert: true,
      alignHoriz: true,
      maxFontSize: 1000
    };
    textFit(element, settings);
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
    var text = "";
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
  }
});


var Slide = React.createClass({
  render: function() {
    var cx = React.addons.classSet;
    var classes = cx({
      'slide': true
    });

    var str = this.props.children.toString();

    var divStyle = {
      height: "100%",
      width: "100%"
    };

    return (
      <div className={classes}>
        <ReactTextFit>
          <div style={divStyle} dangerouslySetInnerHTML={{__html: str}}></div>
        </ReactTextFit>
      </div>
    );
  }
});


React.render(
  <Slideshow />,
  document.getElementById('slideshow')
);
