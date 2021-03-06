var View = function( m ) {
    this.model = m;
    this.stage = null;
    this.visible = true;
    this.setModel = function( m ) {
	this.model = m;
	m.addView( this );
    }
    this.register = function( s ) {
	this.stage = s;
	s.viewObjs.push( this );
    }
    this.setVisible = function( boolVal ) {
	this.visible = boolVal;
    }
    this.removeInstance = function() {
	this.stage.remove( this );
	this.requestUpdate();
    }
    /// virtual methods
    this.draw = function( ctx ) {
	return ;
    }
    this.requestUpdate = function() {
    }
    /// hitTest() returns true when (x,y) is within its 
    /// hitArea.
    this.hitTest = function( x, y ) {
	return false;
    }
    this.onLeftMouseDown = function( x, y ) {
	return ;
    }
    this.onLeftMouseUp = function( x, y ) {
	return ;
    }
    this.onRightMouseDown = function( x, y ) {
	return ;
    }
    this.onRightMouseUp = function( x, y ) {
	return ;
    }
    this.onMouseMove = function( x, y ) {
	return ;
    }
    this.onRollOut = function( x, y ) {
	return ;
    }
    this.onKeyDown = function( key ) {
	return ;
    }
    this.onKeyUp = function( key ) {
	return ;
    }
}
