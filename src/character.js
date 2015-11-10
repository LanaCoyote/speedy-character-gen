
function extend( obj1, obj2 ) {
  obj1.prototype = Object.create( obj2.prototype );
  obj1.prototype.constructor = function() {
    obj2.call( this );
    obj1.apply( this, arguments );
  };
  return obj1;
}
  
// QSContainer
// a quality/statistic container holds statistics and qualities and provides
// methods for adding new qualities and statistics.
function QSContainer() {
  this.statistics = {};
  this.qualities = {};
}

QSContainer.prototype.addStat = function ( stat ) {
  stat.parent = this;
  this.statistics[stat.name] = stat;
}

QSContainer.prototype.removeStat = function ( statName ) {
  this.statistics[statName] = undefined;
}

QSContainer.prototype.getStat = function( statName ) {
  return this.statistics[statName];
}

QSContainer.prototype.statArray = function () {
  var stats = [];
  for ( var k in this.statistics ) stats.push( this.statistics[k] );
  return stats;
}

QSContainer.prototype.addQual = function ( qual ) {
  qual.parent = this;
  this.qualities[qual.name] = qual;
  qual.onapply.call( this );
}

QSContainer.prototype.removeQual = function ( qualName ) {
  this.qualities[qualName].onremove.call( this );
  this.qualities[qualName] = undefined;
}

QSContainer.prototype.getQual = function( qualName ) {
  return this.qualities[qualName];
}

QSContainer.prototype.qualArray = function () {
  var quals = [];
  for ( var k in this.qualities ) quals.push( this.qualities[k] );
  return quals;
}

QSContainer.prototype.get = function( name ) {
  return this.statistics[name] ? 
    this.statistics[name]: 
    this.qualities[name];
}

// Character
// 
function Character( name ) {
  QSContainer.call( this );

  this.name = name;
}

Character = extend( Character, QSContainer );

// Statistic
// statistics are quantifiable values
function Statistic( name, value ) {
  this.name = name;
  this.setValue( value );

  Object.defineProperty( this, 'value', {
    enumerable: true,
    configurable: false,
    get: function() { return this.getValue(); },
    set: function( val ) { this.setValue( val ); }
  } );
  //this.dependents = [];
}

Statistic.prototype.getValue = function ( context ) {
  //if ( context === undefined ) {
    //console.warn( "Get value of " + this.name + " called with undefined context. Pass 'null' to getValue to supress this warning." );
    //console.info( "The context argument is used for determining a stat's dependents." );
  //}

  //if ( this.dependents.indexOf( context ) === -1 && context !== null ) {
    //this.dependents.push( context );
  //}

  return this.valueFn.call( this.parent );
}

Statistic.prototype.setValue = function ( value ) {
  if ( typeof value === 'function' ) {
    this.valueFn = value;
    this.independent = false;
  } else {
    this.valueFn = function() {
      return value;
    };
    this.independent = true;
  }
}

Statistic.prototype.valueOf = function() {
  return this.value;
}


// Quality
// qualities are quantitative values that can have effects when applied to a
// character, or even substatistics and qualities.
function Quality( name, text, onapply, onremove ) {
  QSContainer.call( this );

  this.name = name;
  this.text = text;
  this.onapply = onapply;
  this.onremove = onremove;
}

Quality = extend( Quality, QSContainer );
