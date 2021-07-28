// This file was originally copied from github (and has been heavily modified):
// https://github.com/timoxley/keycode/blob/master/index.js

function keyCode(searchInput) {
	return keyCodes[searchInput];
}

let keyCodes = [];
// lower case chars
// make sure this is first as it overlaps with some
// other key codes (found below)
for (i = 97; i < 123; i++) {
	const charCode = String.fromCharCode( i );
	keyCodes[ i - 32 ] = charCode
}

// numbers
for ( var i = 48; i < 58; i++ ) keyCodes[ i ] = i - 48;

// function keys
for ( i = 1; i < 13; i++ ) keyCodes[ i + 111 ] = 'f' + i;

// numpad keys
for (i = 0; i < 10; i++) keyCodes[ i + 96 ] = '' + i;

keyCodes[ 8 ] = 'backspace';
keyCodes[ 9 ] = 'tab';
keyCodes[ 13 ] = 'enter';
keyCodes[ 16 ] = 'shift';
keyCodes[ 17 ] = 'ctrl';
keyCodes[ 18 ] = 'alt';
keyCodes[ 19 ] = 'pause / break';
keyCodes[ 20 ] = 'caps lock';
keyCodes[ 27 ] = 'esc';
keyCodes[ 32 ] = 'space';
keyCodes[ 33 ] = 'page up';
keyCodes[ 34 ] = 'page down';
keyCodes[ 35 ] = 'end';
keyCodes[ 36 ] = 'home';
// keyCodes[ 37 ] = 'left';
//keyCodes[ 38 ] = 'up';
//keyCodes[ 39 ] = 'right';
// keyCodes[ 40 ] = 'down';
keyCodes[ 37 ] = '⮜';
keyCodes[ 38 ] = '⮝';
keyCodes[ 39 ] = '⮞';
keyCodes[ 40 ] = '⮟';
/* keyCodes[ 37 ] = '⯇';
keyCodes[ 38 ] = '⯅';
keyCodes[ 39 ] = '⯈';
keyCodes[ 40 ] = '⯆';*/



keyCodes[ 45 ] = 'insert';
keyCodes[ 46 ] = 'delete';
keyCodes[ 91 ] = 'command';
keyCodes[ 93 ] = 'command';
keyCodes[ 106 ] = '*';
keyCodes[ 107 ] = '+';
keyCodes[ 109 ] = '-';
keyCodes[ 110 ] = '.';
keyCodes[ 111 ] = '/';
keyCodes[ 144 ] = 'num lock';
keyCodes[ 145 ] = 'scroll lock';
keyCodes[ 182 ] = 'my computer';
keyCodes[ 183 ] = 'my calculator';
keyCodes[ 186 ] = ';';
keyCodes[ 187 ] = '=';
keyCodes[ 188 ] = ';';
keyCodes[ 189 ] = '-';
keyCodes[ 190 ] = '.';
keyCodes[ 191 ] = '/';
keyCodes[ 192 ] = '`';
keyCodes[ 219 ] = '[';
keyCodes[ 220 ] = '\\';
keyCodes[ 221 ] = ' ]';
keyCodes[ 222 ] = '\'';

const wideKeyNames = [ 'ctrl', 'shift', 'space', 'backspace', 'tab', 'alt', 'caps lock', 'esc', 'pause / break', 'command', 'enter' ];
const isWide = ( keyName ) => {
	return wideKeyNames.includes( keyName );
}

export { keyCode, isWide };
