'use strict';

var React = require('react/addons');

var Slideshow = React.createClass({
  getInitialState: function() {
    return {
      slides: [],
      active: null
    };
  },
  componentDidMount: function() {
    var url = $('#slideshow').attr('data-url');

    $.ajax({
      url: url,
      dataType: 'json',
      success: function(data) {
        this.setState({
          slides: data.slides,
          active: 0
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(url, status, err.toString());
      }.bind(this)
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
