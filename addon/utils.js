import Ember from 'ember';

/**
 * Computed property evaluates to jQuery object that matches selector
 * retrieved from value of specified property name.
 * @param selectorPropertyName
 * @returns {*}
 */
export function jQueryObject(selectorPropertyName) {
  return function () {
    var selector = this.get(selectorPropertyName);
    return Ember.$(selector === 'window' ? window : selector);
  }.property(selectorPropertyName);
}

/**
 * Given a numeric amount, append px to the number.
 * @param amount
 * @returns {*}
 */
export function px(amount) {
  if (typeof amount === 'string') {
    return amount;
  }
  return '%@px'.fmt(amount);
}