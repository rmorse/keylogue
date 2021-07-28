import { keyCode, isWide } from './codes';

const showAllKeyDown = false;

class Keylogue {
	constructor( initSettings ) {
		this.addKey = this.addKey.bind( this );
		this.keyDown = this.keyDown.bind( this );
		this.keyUp = this.keyUp.bind( this );
		this.onDrag = this.onDrag.bind( this );
		this.onDragOver = this.onDragOver.bind( this );
		this.onDragStart = this.onDragStart.bind( this );
		this.onDragEnd = this.onDragEnd.bind( this );
		this.addEvents = this.addEvents.bind( this );
		this.rotateList = this.rotateList.bind( this );
		this.showSettingsPanel = this.showSettingsPanel.bind( this );
		this.hideSettingsPanel = this.hideSettingsPanel.bind( this );
		this.toggleSettingsPanel = this.toggleSettingsPanel.bind( this );
		this.onTransitionEnd = this.onTransitionEnd.bind( this );

		// keeps a record of the active keys
		this.keysActive = [];
		this.drag = {
			isDragging: false,
			offsetX: 0,
			offsetY: 0,
		}
		this.rotateOptions = [ 'top', 'right', 'bottom', 'left' ];

		this.settings = {
			/*color: 'white',
			backgroundColor: 'rgba( 0, 0, 0, 0.7)',
			scale: 2.8,
			fontScale: 2.8,*/
			showStyles: false,
			styles: 
`.kl-key {
	background-color: rgba( 0, 0, 0, 0.7);
	color: white;
	margin: 4px;
	padding: 8px;
	width: 56px;
	height: 56px;
	font-size: 17px;
	line-height: 18px;
}
.kl-key--wide{
	width: 110px;
}`,
			position: { top: '5px', left: '5px' },
			rotateIndex: 3,
		}
		this.settings = { ...this.settings, ...initSettings };

		// Init
		this.initContainer();
		this.initContainerUI();
		this.initStyles();
		this.initSettings();
		this.addEvents();
	}
	// Init container CSS and append
	initContainer() {
		this.container = document.createElement( 'div' );
		this.container.classList.add( 'kl-container' );

		this.keysList = document.createElement( 'div' );
		this.keysList.classList.add( 'kl-container__keys-list' );
		this.container.appendChild( this.keysList );

		document.addEventListener( 'dragover', this.onDragOver )
		this.container.addEventListener( 'dragstart', this.onDragStart );
		this.container.addEventListener( 'dragend', this.onDragEnd );
		
		this.container.draggable = true;
		document.body.appendChild( this.container );
	}
	initContainerUI() {
		this.containerUI = document.createElement( 'div' );
		this.containerUI.classList.add( 'kl-container__ui' );
		this.container.prepend( this.containerUI );

		// Init the button
		this.settingsButton = document.createElement( 'button' );
		this.settingsButton.classList.add( 'kl-container__settings-button' );
		this.settingsButton.appendChild( document.createTextNode( "Styles" ) );
		this.settingsButton.addEventListener( 'click', this.toggleSettingsPanel );
		this.containerUI.appendChild( this.settingsButton );

		// Add a rotate option
		this.rotateButton = document.createElement( 'div' );
		this.rotateButton.classList.add( 'kl-container__rotate-button' );
		this.rotateButton.appendChild( document.createTextNode( "Rotate" ) );
		this.rotateButton.addEventListener( 'click', this.rotateList );
		this.containerUI.appendChild( this.rotateButton );
		
		// Init the drag handle
		this.dragHandle = document.createElement( 'div' );
		this.dragHandle.classList.add( 'kl-container__drag-handle' );
		this.dragHandle.appendChild( document.createTextNode( "Move" ) );
		this.dragHandle.addEventListener( 'click', this.showSettingsPanel );
		this.containerUI.appendChild( this.dragHandle );

	}
	toggleSettingsPanel() {
		if ( this.settingsPanel.style.display === 'block' ) {
			this.hideSettingsPanel();
		} else {
			this.showSettingsPanel();
		}
	}
	showSettingsPanel() {
		this.settings.showStyles = true;
		this.settingsPanel.style.display = 'block';
	}
	hideSettingsPanel() {
		this.settings.showStyles = false;
		this.settingsPanel.style.display = 'none';
	}
	rotateList() {
		this.settings.rotateIndex++;
		if ( this.settings.rotateIndex >= this.rotateOptions.length ) {
			this.settings.rotateIndex = 0;
		}
		this.refreshStyles();
	}
	getRotation() {
		return this.rotateOptions[ this.settings.rotateIndex ];
	}
	onDrag( e ) {

	}
	onDragStart( e ) {
		// Hide the drag element, because we'll be moving the source div directlly
		const dragElement = document.createElement( 'div' ); 
		e.dataTransfer.setDragImage( dragElement, 0, 0);
		this.drag.isDragging = true;
		this.drag.offsetX = e.offsetX;
		this.drag.offsetY = e.offsetY;
		this.container.classList.add( 'kl-container--dragging' );

	}
	onDragEnd( e ) {
		this.drag.isDragging = false;
		this.drag.offsetX = 0;
		this.drag.offsetY = 0;
		this.container.classList.remove( 'kl-container--dragging' );
	}
	onDragOver( e ) {
		if ( this.drag.isDragging === true ) {
			const offsetX = parseInt( this.drag.offsetX );
			const offsetY = parseInt( this.drag.offsetY );
			this.container.style.top =  ( parseInt( e.clientY ) - offsetY ) + 'px';
			this.container.style.left = ( parseInt( e.clientX) - offsetX ) + 'px';
		}
	}
	// Init the settings panel
	initSettings() {
		this.settingsPanel = document.createElement( 'div' );
		this.settingsPanel.classList.add( 'kl-settings' );
		document.body.appendChild( this.settingsPanel );

		// add heading
		const row = this.getSettingRow();
		row.appendChild( document.createTextNode( "CSS Styles" ) );
		row.classList.add( 'kl-row__heading' )
		this.settingsPanel.append( row );

		// add CSS box
		const cssRow = this.getSettingRow();
		const stylesTextArea = document.createElement( 'textarea' );
		const parent = this;
		stylesTextArea.addEventListener( 'input', ( e ) => {
			const value = e.target.value;
			parent.settings.styles = value;
			parent.refreshStyles();
		} );
		stylesTextArea.value = this.settings.styles;
		cssRow.appendChild( stylesTextArea );
		cssRow.classList.add( 'kl-row__styles' )
		this.settingsPanel.append( cssRow );
		

		// Init the close button
		const closeButtonRow = this.getSettingRow();
		closeButtonRow.style.flexDirection = 'row-reverse';
		const closeButton = document.createElement( 'button' );
		closeButton.classList.add( 'kl-container__settings-button' );
		closeButton.style.margin = 0;
		closeButton.appendChild( document.createTextNode( "Close" ) );
		closeButton.addEventListener( 'click', this.hideSettingsPanel );
		closeButtonRow.append( closeButton );
		this.settingsPanel.append( closeButtonRow );
	}
	onUpdateSetting( settingName, settingValue ) {
		this.settings[ settingName ] = settingValue;
		this.refreshStyles();
	}
	// Init the `<style>` tags and add our animation
	// We probably should move all CSS here, and use
	// classes instead of inline styles
	getStyles() {
		const rotation = this.getRotation();
		let keysPosition = '';
		let flexDirection = 'row';
		if ( rotation === 'top' ) {
			flexDirection = 'column';
			keysPosition = `top: 65px; left: 0;`
		}
		else if ( rotation === 'right' ) {
			flexDirection = 'row-reverse';
			keysPosition = `top: 65px; right: 0;`
		}
		else if ( rotation === 'bottom' ) {
			flexDirection = 'column-reverse';
			keysPosition = `bottom: 65px; left: 0;`
		}
		else if ( rotation === 'left' ) {
			flexDirection = 'row';
			keysPosition = `top: 65px; left: 0;`
		}
		return `
		.kl-container {
			opacity: 1;
			position: fixed;
			z-index: 2000;
			top: ${ this.settings.position.top };
			left: ${ this.settings.position.top };
			border-radius: 10px;
			color: white;
			display: inline-flex;
			flex-direction: column;
		}
		.kl-container * {
			box-sizing: border-box;
		}
		.kl-container__keys-list {
			display: inline-flex;
			flex-direction: ${ flexDirection };
			position: absolute;
			${ keysPosition }
		}
		
		.kl-container__ui {
			cursor: move;
			display:block;
			opacity: 0;
			flex: 0;
			align-self: flex-start;
			display: flex;
			flex-direction: row;
			padding: 10px;
			border-radius: 10px;

			transition-property: opacity;
			transition-duration: 0.15s;
			transition-timing-function: ease-in;

		}
		.kl-container__settings-button, .kl-container__rotate-button, .kl-container__drag-handle {
			display: block;
			height: inherit;
			align-self: center;
			border: none;
			background: #666;
			color: #fff;
			padding: 10px 15px;
			margin: 4px;
			color: #fff;
			text-shadow: rgba( 0, 0, 0, 0.8 ) 0px 0 6px;
			font-size: 13px;
			line-height: 13px;

			transition-property: all;
			transition-duration: 0.15s;
			transition-timing-function: ease-in;

		}
		.kl-container__settings-button:hover, .kl-container__rotate-button:hover {
			background-color: rgba( 150, 143, 252, 0.5 );
		}
		.kl-container__settings-button, .kl-container__rotate-button {
			border-radius: 5px;
			background-color: rgba( 150, 143, 252, 1 );
			cursor: pointer;
		}
		.kl-container__drag-handle {
			background: transparent;
			border: 0;
			cursor: move;
		}
		.kl-container__ui:hover, .kl-container--dragging .kl-container__ui {
			background-color: rgba( 0, 0, 0, 0.7 );
		}
		.kl-container:hover .kl-container__ui,
		.kl-container--dragging .kl-container__ui {
			background-color: rgba( 0, 0, 0, 0.7 );
			opacity: 1;
		}
		.kl-settings {
			margin: 10px auto;
			width: 500px;
			overflow-y: auto;
			padding: 20px;
			background-color: rgba( 0, 0, 0, 0.7 );
			border-radius: 10px;
			color: #fff;
			z-index: 2001;
			position: absolute;
			top: 10px;
			right: 10px;
			display: none;
		}
		.kl-settings:hover {
			opacity: 1;
		}
		/* .kl-settings input {
			opacity: 1;
			color: #fff;
			background: transparent;
			border: none;
			outline: none;
			drop:shadow: none;
			border: 1px solid #fff;
		} */
		.kl-row {
			flex: 1;
			flex-direction: row;
			display: flex;
			/* padding: 5px 0; */
		}
		
		.kl-settings .kl-row textarea {
			padding: 10px;
			font-size: 16px;
			margin: 10px 0;
			width: 100%;
			min-height: 400px;
		}
		.kl-row__heading {
			font-size: 14px;
			font-weight: bold;
		}
		.kl-col {
			flex: 1;
			font-size: 14px;
			display: flex;
		}
		.kl-col--right {
			flex-direction: row-reverse;
		}
		.kl-fade-out {
			transition-property: opacity;
			transition-duration: 1.2s;
			transition-delay: 0.1s;
			transition-timing-function: ease-in-out;
			opacity: 0;
		}

	` + this.getKeyStyles();
	}
	initStyles() {
		this.styleElement = document.createElement('style');
		this.styleElement.appendChild( document.createTextNode( this.getStyles() ) );
		document.body.appendChild( this.styleElement );
	}
	// Reload the styles with the updated settings	
	refreshStyles() {
		this.styleElement.replaceChildren( document.createTextNode( this.getStyles() ) );
	}
	getKeyStyles() {
		return `
			.kl-key {
				display: flex;
				flex-grow: 0;
				flex-shrink: 0;
				align-content: center;
				align-items: center;
				text-align: center;
				border-radius: 10px;
				align-items: center;
				justify-content: center;
				text-transform: capitalize;
			}
		` + this.getKeyUserStyles();
	}

	getKeyUserStyles() {
		return this.settings.styles;

	}	
	addEvents() {
		// Key up / down
		document.addEventListener('keydown', this.keyDown );
		document.addEventListener('keyup', this.keyUp );

		// also detect when the page is refocussed - so we can unset anything visible.
		const parent = this;
		document.addEventListener( 'visibilitychange', function() {
			if (document?.visibilityState === 'visible') {
				// so remove anything that got stuck active
				parent.keysActive.forEach( ( key ) => {
					key.dom?.remove();
				} );
				parent.keysActive = [];
			}
		});
	}
	
	// Lookup first instance by key code
	findKey( whichKey ) {
		return this.keysActive.findIndex( ( key ) => key.which === whichKey && key.isLeaving === false );
	}
	
	// Lookup last instance by key code
	findLastKey( whichKey ) {
		return  this.keysActive.map( e => e.which ).lastIndexOf( whichKey );
	}

	// Add the key to the internal list - we'll still need to add it to the DOM
	addKey( whichKey ) {
		if ( showAllKeyDown === true ) {
			this.keysActive.push( this.createKeyObject( whichKey ) );
			return this.keysActive[ this.keysActive.length - 1 ];
		} else {
			// don't add if its already in the list
			const hasKey = this.findKey( whichKey );
			if ( hasKey === -1 ) {
				this.keysActive.push( this.createKeyObject( whichKey ) );
				return this.keysActive[ this.keysActive.length - 1 ];
			} else {
				// actually, only don't add if it's not being removed? (key up has not started on it)
				this.keysActive[ hasKey ].dom.classList.remove('kl-fade-out');
			}
			
		}
		return null;
	}

	// Try add the key to the container
	keyDown( e ) {
		const newKey = this.addKey( e.which );
		if ( newKey ) {
			this.keysList.prepend( newKey.dom );
		}
	}

	// Creates a simple object referencing the keycode,
	// the dom element and if it is scheduled to be removed
	createKeyObject( which ) {
		const keyEl = document.createElement( 'div' );
		keyEl.classList.add( 'kl-key' )
		const keyName = keyCode( which );
		if ( isWide( keyName ) ) {
			keyEl.classList.add( 'kl-key--wide' )
		}

		keyEl.textContent = keyName ? keyName : '';
		const parent = this;
		keyEl.addEventListener( 'transitionend', this.onTransitionEnd );

		return {
			which,
			isLeaving: false,
			dom: keyEl,
		}
	}
	onTransitionEnd( e )  {
		this.keysActive = this.removeByDom( this.keysActive, e.target );
	}

	// We only remove elements after keyup - so set the removal
	// class, and the transition event listener will pickup 
	// when its ready to be removed
	keyUp( e ) {
		const whichKey = e.which;
		const index = this.findLastKey( whichKey );
		if ( index !== -1 ) {
			this.setLeaving( this.keysActive[ index ] );
		}
	}
	setLeaving( key ) {
		key.dom.classList.add( 'kl-fade-out' );
		key.isLeaving = true;
	}

	// Find in array by DOM element - should be fast as it should be a 
	// shallow comparison
	removeByDom( array, domElement ) {
		const index = array.findIndex( ( key ) => key.dom === domElement );
		if ( index !== -1 ) {
			array[ index ].dom.removeEventListener( 'transitionend', this.onTransitionEnd );
			this.keysList.removeChild( array[ index ].dom );
			array.splice( index, 1 );
		}
		return array;
	}


	// settings
	// Add a setting to the settings panel, and take a callback for the new value
	addSetting( setting, callback ) {
		// 
		const input = document.createElement( 'input' );
		input.type = setting?.type ?? 'text';
		
		input.addEventListener( 'input', ( e ) => {
			const value = e.target.value;
			callback( value );
		} );
		if ( input.type === 'number' ) {
			input.step = 0.1;
			input.min = 0.1;
			input.max = 10;
		}
		input.value = setting.value;
		//input.placeholder = `Enter a ${ setting?.name }`;
		//this.keysList.classList.add( 'kl-container' );
		const row = this.getSettingRow();

		const leftCol = this.getSettingColumn();
		leftCol.appendChild( document.createTextNode( setting.label ) );
		row.appendChild( leftCol );

		const rightCol = this.getSettingColumn();
		rightCol.classList.add( 'kl-col--right' );
		rightCol.appendChild( input );
		row.appendChild( rightCol );

		this.settingsPanel.appendChild( row );
		
	}
	getSettingRow() {
		const row = document.createElement( 'label' );
		row.classList.add( 'kl-row' );
		return row;
	}
	getSettingColumn() {
		const row = document.createElement( 'div' );
		row.classList.add( 'kl-col' );
		return row;
	}
}

const init = ( initSettings = {} ) => {
	
	const keyLog = new Keylogue( initSettings );
}

const settings = {

	
}
if ( document.readyState !== 'loading' ) {
    init();
} else {
	window.addEventListener( 'DOMContentLoaded', ( event ) => {
		init();
	} );
}
