
// Core stats
Statistic.prototype.addMod = function() {
  this.mod = function() {
    return Math.floor( (this.value - 10) / 2 );
  }
  return this;
}

var STAT_STRENGTH = new Statistic( 'STR', 10 ).addMod();
var STAT_DEXTERITY = new Statistic( 'DEX', 10 ).addMod();
var STAT_CONSTITUTION = new Statistic( 'CON', 10 ).addMod();
var STAT_INTELLIGENCE = new Statistic( 'INT', 10 ).addMod();
var STAT_WISDOM = new Statistic( 'WIS', 10 ).addMod();
var STAT_CHARISMA = new Statistic( 'CHA', 10 ).addMod();

var CAT_CORE = new Quality( 'core', 'Your core statistics lay the foundation of your character\'s stats', function() {}, function() {} );

CAT_CORE.addStat( STAT_STRENGTH );
CAT_CORE.addStat( STAT_DEXTERITY );
CAT_CORE.addStat( STAT_CONSTITUTION );
CAT_CORE.addStat( STAT_INTELLIGENCE );
CAT_CORE.addStat( STAT_WISDOM );
CAT_CORE.addStat( STAT_CHARISMA );

// General stats
var STAT_CHARLEVEL = new Statistic( 'LVL', 1 );
var STAT_MAXHP = new Statistic( 'Max HP', function() {
  return (this.hitdice.sides + this.get('CON')) * this.get('LVL');
} );
var STAT_CURHP = new Statistic( 'Current HP', function() {
  return this.get('Max HP');
} );
var STAT_SPEED = new Statistic( 'Land Speed', 30 );

// meow :3
var CAT_GENERAL = new Quality( 'general', 'These are general statistics', function() {}, function() {} );

CAT_GENERAL.addStat( STAT_CHARLEVEL );
CAT_GENERAL.addStat( STAT_MAXHP );
CAT_GENERAL.addStat( STAT_CURHP );
CAT_GENERAL.addStat( STAT_SPEED );

// Character classes
function Class( name, hitdice, skillpoints, onapply, onremove ) {
  Quality.call( this, name, "", function() {
    this.cls = function() {
      return this.getQual( name );
    }
    this.hitdice = new Dice( hitdice );
    this.sp_per_level = skillpoints;

    onapply.call( this );
  }, function() {
    this.cls = undefined;
    this.hitdice = undefined;
    this.sp_per_level = undefined;

    onremove.call( this );
  } );
}

var CLASS_BARD = new Class( "Bard", "1d8", 8, function() {}, function() {} );

// Pathfinder character object
function PathfinderCharacter( name, cls ) {
  Character.call( this, name );

  console.dir( this );

  this.addQual( CAT_CORE );
  this.addQual( CAT_GENERAL );
  this.addQual( cls );
}

PathfinderCharacter.prototype = Object.create( Character.prototype );
PathfinderCharacter.prototype.constructor = PathfinderCharacter;
