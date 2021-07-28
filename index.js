import { keyCode, isWide } from './codes';

const showAllKeyDown = false;

class Keylogue {
	constructor() {
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
			color: 'white',
			backgroundColor: 'rgba( 0, 0, 0, 0.5)',
			scale: 2.8,
			fontScale: 2.8,
			position: { top: '80px', left: '553px' },
			rotateIndex: 3,
		}
		
		// Init
		this.initContainer();
		this.initContainerUI();
		this.initStyles();
		this.initSettings();
		this.refreshKeyStyles();
		this.addEvents();
	}
	// Init container CSS and append
	initContainer() {
		this.container = document.createElement( 'div' );
		this.container.classList.add( 'kl-container' );

		this.keysList = document.createElement( 'div' );
		this.keysList.classList.add( 'kl-container__keys-list' );
		this.container.appendChild( this.keysList );


		//this.container.addEventListener( 'drag', this.onDrag )
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
		this.settingsButton.appendChild( document.createTextNode( "Settings" ) );
		this.settingsButton.addEventListener( 'click', this.showSettingsPanel );
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
	rotateList() {
		this.settings.rotateIndex++;
		if ( this.settings.rotateIndex >= this.rotateOptions.length ) {
			this.settings.rotateIndex = 0;
		}
		this.refreshStyles();
		console.log("updating rotation: ", this.settings.rotateIndex );
	}
	getRotation() {
		return this.rotateOptions[ this.settings.rotateIndex ];
	}
	onDrag( e ) {
		console.log("on drag", { x: e.clientX, y: e.clientY } );
		//this.container.style.top = e.clientY + 'px';
		//this.container.style.left = e.clientX + 'px';
	}
	onDragStart( e ) {
		//e.dataTransfer.dropEffect = "move";
		// Hide the drag element, because we'll be moving the source div directlly
		const dragElement = document.createElement( 'div' ); 
		e.dataTransfer.setDragImage( dragElement, 0, 0);
		this.drag.isDragging = true;
		this.drag.offsetX = e.offsetX;
		this.drag.offsetY = e.offsetY;
		this.container.classList.add( 'kl-container--dragging' );

		console.log("on drag start", e, { x: e.clientX, y: e.clientY } );
		console.log(this);
		//this.container.style.top = e.clientY + 'px';
		//this.container.style.left = e.clientX + 'px';
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
		// e.dataTransfer.dropEffect = "move";
		// console.log("on drag", { x: e.pageX, y: e.pageY } );
	}
	// Init the settings panel
	initSettings() {
		this.settingsPanel = document.createElement( 'div' );
		this.settingsPanel.classList.add( 'kl-settings' );
		document.body.appendChild( this.settingsPanel );

		// add heading
		const row = this.getSettingRow();
		row.appendChild( document.createTextNode( "Settings" ) );
		row.classList.add( 'kl-row__heading' )
		this.settingsPanel.append( row );

		const settings = [
			{
				type: 'number',
				name: 'scale',
				label: 'Scale',
				value: this.settings.scale,
			},
			{
				type: 'number',
				name: 'fontScale',
				label: 'Font Scale',
				value: this.settings.fontScale
			},
			{
				type: 'text',
				name: 'color',
				label: 'Color',
				value: this.settings.color,
			},
			{
				type: 'text',
				name: 'backgroundColor',
				label: 'Background Color',
				value: this.settings.backgroundColor,
			}
		];
		
		console.log("INIT SETTINGS: ", this.settings, settings);
		const parent = this;
		settings.forEach( ( setting ) => {
			this.addSetting( setting, ( value ) => {
				parent.onUpdateSetting( setting.name, value );
			} );
		} );
	}
	onUpdateSetting( settingName, settingValue ) {
		this.settings[ settingName ] = settingValue;
		// this.refreshStyles();
		console.log("onUpdateSetting, ", settingName, settingValue)
		console.log("refresh key styles")
		this.refreshKeyStyles();
	}
	showSettingsPanel() {

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
			keysPosition = `top: 80px; left: 15px;`
		}
		else if ( rotation === 'right' ) {

			
			flexDirection = 'row-reverse';
			keysPosition = `top: 80px; right: 15px;`
			
		}
		else if ( rotation === 'bottom' ) {
			flexDirection = 'column-reverse';
			keysPosition = `bottom: 80px; left: 15px;`
		}
		else if ( rotation === 'left' ) {
			flexDirection = 'row';
			keysPosition = `top: 80px; left: 15px;`
		}
		console.log("git fkex durectuib: " + flexDirection, rotation)
		return `
		.kl-container {
			opacity: 1;
			position: fixed;
			/* cursor: move; */
			z-index: 2000;
			top: 80px;
			left: 553px;
			border-radius: 10px;
			padding: 15px;
			color: white;
			display: inline-flex;
			flex-direction: column;
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
			margin-left: -10px;

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
		}
		.kl-container__settings-button, .kl-container__rotate-button {
			border-radius: 5px;
			background-color: #968ffc;
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
			/* backdrop-filter: blur( 13.0px );
			-webkit-backdrop-filter: blur( 13.0px ); */
			opacity: 1;
		}
		.kl-settings {
			margin: 10px auto;
			height: 300px;
			width: 600px;
			overflow-y: auto;
			padding: 20px;
			background: rgba(60, 60, 60, 0.7);
			border-radius: 3px;
			color: #fff;
			z-index: 2000;
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

	`;
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
	getSizeCss( scale, fontScale ) {
		const fontSize = 6 * ( fontScale ? fontScale : scale );
		const sizeCss = `
			margin: ${ scale * 1.2 }px;
			padding: ${ scale * 3 }px;
			width: ${ 20 * scale}px;
			height: ${ 20 * scale}px;
			font-size: ${ fontSize }px;
			line-height: ${ fontSize + ( fontSize * 0.1 ) }px;
		`;
		return sizeCss;
	}

	getKeyStyles() {
		return `
			display: flex;
			flex-grow: 0;
			flex-shrink: 0;
			align-content: center;
			align-items: center;
			text-align: center;
			border-radius: 10px;
			background-color: ${ this.settings.backgroundColor };
			color: ${ this.settings.color };
			align-items: center;
			justify-content: center;
			text-transform: capitalize;
		`;

	}
	refreshKeyStyles() {
		console.log("refresh key styles: ")
		this.wideWidth = `${ this.settings.scale * 40 }px`;
		this.keyStyles = this.getKeyStyles() + this.getSizeCss( this.settings.scale );
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
		keyEl.style.cssText = this.keyStyles;
		const keyName = keyCode( which );
		if ( isWide( keyName ) ) {
			keyEl.style.width = this.wideWidth;
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

const init = () => {
	const keyLog = new Keylogue();
	// setup styles
}

window.addEventListener( 'DOMContentLoaded', init );

