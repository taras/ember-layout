import Ember from 'ember';

import ResizeMixin from 'ember-resize-mixin/main';
import VelocityMixin from 'ember-velocity-mixin/mixin';
import {px, jQueryObject} from 'ember-layout/utils';

var isNone = isNone;

export default Ember.Component.extend(VelocityMixin, {
  tagName: 'layout-sidebar',
  classNameBindings: ['positionClass'],
  /**
   * Sidebar position relative to target element
   * Values: left or right
   * @type {string}
   */
  position: 'left', // or 'right'
  /**
   * Selector of the element that this is a sidebar to
   */
  "target-selector": null,
  /**
   * Whether it should match the height of the target element
   */
  "match-target-height": true,
  /**
   * Width of the sidebar
   * @type {int}
   */
  width: null,
  /**
   * jQuery instance matching target selector
   * @type {jQuery}
   */
  targetElement: jQueryObject('target-selector'),
  positionClass: function() {
    return '%@-sidebar'.fmt(this.get('position'))
  }.property('position'),
  /**
   * Schedule DOM changes afterRender on Ember Run loop
   */
  scheduleAfterRender: function() {
    if (this.get('match-target-height')) {
      this.bindTargetHeight();
    }
    Ember.run.scheduleOnce('afterRender', this, this.changeDOM);
  }.on('didInsertElement'),
  /**
   * Perform all of the DOM changes
   */
  changeDOM: function() {
    this.setTargetClass();
    this.setWidth();
    this.setZIndex();
  },
  bindTargetHeight: function() {
    var id = this.get('targetElement').attr('id');
    Ember.View.views[id].on('heightChange', this, this.setHeight);
  },
  /**
   * Set class of the target element
   */
  setTargetClass: function () {
    this.get('targetElement').addClass('target-to-%@-sidebar'.fmt(this.get('position')));
  },
  setHeight: function(height) {
    this.css('height', px(height));
  },
  /**
   * Set the width of the sidebar and padding on corresponding
   */
  setWidth: function (width) {
    if (typeof width === 'undefined') {
      width = this.get('width');
    }
    this.css('width', px(width));
    this.setCSSPropertyValue(this.get('targetElement'), 'padding%@'.fmt(this.get('position').capitalize()), px(width))
  }.on('widthChange'),
  /**
   * Set z-index of the sidebar, based on z-index of target element
   */
  setZIndex: function(){
    var zIndex = this.getCSSPropertyValue(this.get('targetElement'), 'zIndex');
    this.css('zIndex', zIndex + 1);
  },
  /**
   * When width change, schedule
   */
  widthObserver: function () {
    Ember.run.scheduleOnce('afterRender', this, this.trigger, ['widthChange', this.get('width')]);
  }.observes('width')
});