// start and end are the decimal values that the interpolation should start and end out
// steps is the number of values to calculate in between start and end
// func is the callback function
// step() steps t forward and executes the callback function
var Bezier = function(start, end, steps)
{
	this.t = 0;
	this.i = 0;
	this.currentValue = start;
	
	this.step = function()
	{
		if(this.i < steps)
		{
			this.currentValue =
			(-2.0 * end + 2.0 * start) * this.t * this.t * this.t +
			(3.0 * end - 3.0 * start) * this.t * this.t +
			start;
			this.i += 1;
			this.t = this.i / steps;
			return 0;
		}
		else
		{
			this.currentValue = end;
			return 1;
		}
	}
}