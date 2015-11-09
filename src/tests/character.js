// init our fake test suite
var testsuite_style = document.createElement( "style" );
testsuite_style.innerHTML = ".pass { color: green; }\n\n.fail { color: red; }"
var testsuite_div = document.createElement( "ul" );
var tests_passed = tests_run = 0;
var test_queue = [];

function test_assert( text, fn ) {
  var test_obj = {};
  test_obj.li = document.createElement( "li" );
  test_obj.li.innerHTML = text;
  test_obj.fn = fn;

  test_queue.push( test_obj );

  testsuite_div.appendChild( test_obj.li );
}

// here's my tests
var chara, stat, stat2, qual;
test_assert( "Characters have a name, stats, and qualities", function() {
  chara = new Character( "Bill" );
  return chara.name === "Bill" && chara.statistics && chara.qualities;
} );

test_assert( "Statistics have a name and value", function() {
  stat = new Statistic( "max hp", 1000 );
  return stat.name === "max hp" && stat.value === 1000;
} );

test_assert( "Statistics can take a function value", function() {
  stat2 = new Statistic( "hp", function() { return stat.value; } );
  return stat2.name === "hp" && stat2.value === 1000;
} );

test_assert( "Statistics always store their value as a function", function() {
  return stat.valueFn && typeof stat.valueFn === 'function';
} );

test_assert( "Can change statistic values", function() {
  stat.value = 500;
  return stat.valueFn && stat.value === 500;
} );

test_assert( "Dynamic statistics update their values properly", function() {
  return stat2.value === 500;
} );

test_assert( "Can change statistic values to a new function", function() {
  stat2.setValue( function() { return stat.value * 0.5; } );
  return stat2.valueFn && typeof stat2.valueFn === 'function' &&
    stat2.value === 250;
} );

test_assert( "Qualities have a name, text, stats, and qualities", function() {
  qual = new Quality( "toughness", "Makes you tuff" );
  return qual.name === "toughness" && qual.text === "Makes you tuff" &&
    qual.statistics && qual.qualities;
} );

test_assert( "Qualities can also have an onapply and onremove methods", function() {
  qual = new Quality( "toughness", "Makes you tuff", function() {
    this.get('max hp').value = this.get('max hp').value + 250;
  }, function() {
    this.get('max hp').value = this.get('max hp').value - 250;
  } );
  return qual.onapply && typeof qual.onapply === 'function' &&
    qual.onremove && typeof qual.onremove === 'function';
} );

test_assert( "Can store and retrieve statistics on a character", function() {
  chara.addStat( stat );
  return chara.getStat('max hp') && chara.getStat('max hp').value === 500;
} );

test_assert( "Can store and retrieve dynamically set statistics", function() {
  stat2.setValue( function() { return this.getStat('max hp').value * 0.5; } );
  chara.addStat( stat2 );
  return chara.getStat('hp') && chara.getStat('hp').value === 250;
} );

test_assert( "Can remove statistics from a character", function() {
  chara.removeStat( 'hp' );
  return chara.getStat('hp') === undefined;
} );

test_assert( "Can access stats via the get() shortcut", function() {
  return chara.get('max hp').value === 500 && chara.get('hp') === undefined;
} );

test_assert( "Can store and retrieve qualities on a character", function() {
  chara.addQual( qual );
  return chara.getQual('toughness') && chara.getQual('toughness').text === "Makes you tuff";
} );

test_assert( "onapply is called when a quality is added to a character", function() {
  return chara.getStat('max hp').value === 750;
} );

test_assert( "Can remove qualities from a character", function() {
  chara.removeQual('toughness');
  return chara.getQual('toughness') === undefined;
} );

test_assert( "onremove is called when a quality is removed", function() {
  return chara.getStat('max hp').value === 500;
} );

test_assert( "Can access qualities via the get() shortcut", function() {
  chara.addQual( qual );
  return chara.get('toughness') && chara.get('toughness').text === "Makes you tuff";
} );

test_assert( "Statistics are accessed before qualities using get()", function() {
  chara.addStat( new Statistic( 'toughness', 500 ) );
  return chara.get('toughness') && chara.get('toughness').value === 500;
} );

test_assert( "Removing statistics prevents them from blocking qualities via get()", function() {
  chara.removeStat( 'toughness' );
  return chara.get('toughness') && chara.get('toughness').text === "Makes you tuff";
} );


// finalize our tests and show the results
window.onload = function() {
  document.head.appendChild( testsuite_style );
  document.body.appendChild( testsuite_div );

  test_queue.forEach( function( test_obj ) {
    var timestart = new Date();
    if ( test_obj.fn() ) {
      test_obj.li.className = "pass";
      test_obj.li.innerHTML += " (Passing in " + (new Date() - timestart) + "ms)";
      tests_passed++;
    } else {
      test_obj.li.className = "fail";
      test_obj.li.innerHTML += " (FAILED!)";
    }
  } );

  var passing = document.createElement( "li" );
  passing.innerHTML = "Passed " + tests_passed + "/" + test_queue.length;
  testsuite_div.appendChild( passing );
};
