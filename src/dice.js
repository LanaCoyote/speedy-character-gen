
function Dice( notation ) {
  this.notation = notation;

  var spl = notation.split('d');
  this.count = Number( spl[0] );
  
  if ( notation.indexOf( '+' ) > -1 ) {
    var equ = spl[1].split( '+' );
    var sides = Number( equ[0] );
    var constant = Number( equ[1] );
  } else if ( notation.indexOf( '-' ) > -1 ) {
    var equ = spl[1].split( '-' );
    var sides = Number( equ[0] );
    var constant = -Number( equ[1] )
  } else {
    this.sides = spl[1];
  }
}

Dice.prototype.rollArray = function() {
  var results = [];
  for ( var i = 0; i < this.count; ++i ) {
    results.push( 1 + Math.floor( Math.random() * this.sides ) );
  }
  return results;
}

Dice.prototype.roll = function() {
  return this.rollArray().reduce( function( a,b ) {
    return a + b;
  }, 0 );
}

