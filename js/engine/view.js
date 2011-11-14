var View = function( m ) {
    this.model = m;
    this.stage = null;
    this.visible = true;
    this.setModel = function( m ) {
	this.model = m;
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
    }
    /// virtual methods
    this.draw = function() {
	return ;
    }
}