'use strict';

var http = require('http-browserify');
var React = require('react/addons');
var url = require('url');

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

    return (
      <div className={classes}>
        <span dangerouslySetInnerHTML={{__html: this.props.children.toString()}} />
      </div>
    );
  }
});


React.render(
  <Slideshow />,
  document.getElementById('slideshow')
);
