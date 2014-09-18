import Ember from 'ember';

import ResizeMixin from 'ember-resize-mixin/main';
import VelocityMixin from 'ember-velocity-mixin/mixin';
import {px, jQueryObject} from 'ember-layout/utils';

var isNone = Ember.isNone;

export default Ember.Component.extend(ResizeMixin, VelocityMixin, {
  tagName: 'layout-content',
  /**
   * CSS Selector for top limit element
   */
  "top-selector": null,
  /**
   * CSS Selector for bottom limit element
   */
  "bottom-selector": null,
  /**
   * CSS Selector for left limit element
   */
  "left-selector": null,
  /**
   * CSS Selector for right limit element
   */
  "right-selector": null,
  /**
   * CSS Selector for target element
   */
  "target-selector": null,
  /**
   * Use target element's width ( target-selector has to be set for this to work )
   */
  "target-width": false,
  /**
   * Use target element's height ( target-selector has to be set for this to work )
   */
  "target-height": false,
  topElement: jQueryObject('top-selector'),
  bottomElement: jQueryObject('bottom-selector'),
  leftElement: jQueryObject('left-selector'),
  rightElement: jQueryObject('right-selector'),
  targetElement: jQueryObject('target-selector'),
  hasBottomElement: Ember.computed.gt('bottomElement.length', 0),
  hasTopElement: Ember.computed.gt('topElement.length', 0),
  hasLeftElement: Ember.computed.gt('leftElement.length', 0),
  hasRightElement: Ember.computed.gt('rightElement.length', 0),
  hasTargetElement: Ember.computed.gt('targetElement.length', 0),
  resizeHandler: function (event, promise) {
    if (promise) {
      promise
        .then(function () {
          this.resize();
        }.bind(this));
    } else {
      Ember.run.scheduleOnce('afterRender', this, this.resize);
    }
  }.on('didInsertElement', 'resize'),
  resize: function () {
    var height = this.getHeight();
    var width = this.getWidth();
    if (!isNone(height)) {
      this.trigger('heightChange', height);
    }
    if (!isNone(width)) {
      this.trigger('widthChange', width);
    }
  },
  setHeight: function(height) {
    this.css('height', px(height));
    if (this.get('height') !== height) {
      this.set('height', height);
    }
  }.on('heightChange'),
  setWidth: function(width) {
    this.css('width', px(width));
    if (this.get('width') !== width) {
      this.set('width', width);
    }
  }.on('widthChange'),
  getHeight: function () {
    var height;
    var targetElement = this.get('targetElement');
    if (this.get('hasBottomElement') && this.get('hasTopElement')) {
      height = this.calculateHeight();
    } else if (this.get('hasTargetElement') && this.get('target-height')) {
      height = targetElement.height();
    } else if (!isNone(this.get('height'))) {
      height = this.get('height');
    }
    return height;
  },
  getWidth: function () {
    var width;
    var targetElement = this.get('targetElement');
    if (this.get('hasLeftElement') && this.get('hasRightElement')) {
      width = this.calculateWidth();
    } else if (this.get('hasTargetElement') && this.get('target-width')) {
      width = targetElement.width();
    } else if (!isNone(this.get('width'))) {
      width = this.get('width');
    }
    return width;
  },
  calculateHeight: function () {
    var offsetTop, offsetBottom;
    if (this.get('top-selector') === 'window') {
      offsetTop = 0;
    } else {
      var topElement = this.get('topElement');
      offsetTop = topElement.offset().top + topElement.outerHeight();
    }
    var bottomElement = this.get('bottomElement');
    if (this.get('bottom-selector') === 'window') {
      offsetBottom = bottomElement.height();
    } else {
      offsetBottom = bottomElement.offset().top;
    }
    return offsetBottom - offsetTop;
  },
  calculateWidth: function () {
    var offsetLeft, offsetRight;
    if (this.get('left-selector') === 'window') {
      offsetLeft = 0;
    } else {
      var leftElement = this.get('leftElement');
      offsetLeft = leftElement.offset().left + leftElement.outerWidth();
    }
    if (this.get('right-selector') === 'window') {
      offsetRight = this.get('rightElement').width();
    } else {
      var rightElement = this.get('rightElement');
      offsetRight = rightElement.offset().left;
    }
    return offsetRight - offsetLeft;
  }
});