import Ember from 'ember';

var Router = Ember.Router.extend({
  location: DummyENV.locationType
});

Router.map(function() {
  this.route('left-sidebar');
  this.route('two-sidebars');
  this.route('right-sidebar');
});

export default Router;
