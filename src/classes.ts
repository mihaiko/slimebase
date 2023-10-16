class Vector2
{
	x:number;
	y:number;

	constructor(x:number, y:number) { this.x = x;	this.y = y; }
	add(value:number) { return new Vector2(this.x + value, this.y + value); }
	sub(value:number) { return new Vector2(this.x - value, this.y - value); }
	mul(value:number) { return new Vector2(this.x * value, this.y * value); }
	div(value:number) { return new Vector2(this.x / value, this.y / value); }
	mod(value:number) { return new Vector2(this.x % value, this.y % value); }
	floor() { return new Vector2(Math.floor(this.x), Math.floor(this.y)); }
	ceil() { return new Vector2(Math.ceil(this.x), Math.ceil(this.y)); }
	round() { return new Vector2(Math.round(this.x), Math.round(this.y)); }
	copy() { return new Vector2(this.x, this.y); }
	isZero() { return this.equals(new Vector2(0, 0)); }
	length() { return this.distance(new Vector2(0, 0)); }
	normalize() { return new Vector2( this.x / this.length(), this.y / this.length()); }
	equals(other:Vector2) {return this.x == other.x && this.y == other.y; }
	addPos(other:Vector2) { return new Vector2(this.x + other.x, this.y + other.y); }
	subPos(other:Vector2) { return new Vector2(this.x - other.x, this.y - other.y); }
	min(other:Vector2) { return new Vector2(Math.min(this.x, other.x), Math.min(this.y, other.y)); }
	max(other:Vector2) { return new Vector2(Math.max(this.x, other.x), Math.max(this.y, other.y)); }
	clamp(minValue:number, maxValue:number) { return this.min(new Vector2(maxValue, maxValue)).max(new Vector2(minValue, minValue)); }
	distance(other:Vector2) { return Math.sqrt((this.x - other.x)**2 + (this.y-other.y)**2); }
	distanceSquared(other:Vector2) { return (this.x - other.x)**2 + (this.y-other.y)**2; }
	slope(other:Vector2) { return (other.y - this.y) / (other.x - this.x); }

	rotate(degrees:number)
	{
        const radians = (degrees * Math.PI) / 180;
        const cosTheta = Math.cos(radians);
        const sinTheta = Math.sin(radians);

        const newX = this.x * cosTheta - this.y * sinTheta;
        const newY = this.x * sinTheta + this.y * cosTheta;

		return new Vector2(newX, newY);
    }
}

const DirectionUp = new Vector2(0, -1);
const DirectionRight = new Vector2(1, 0);
const DirectionDown = new Vector2(0, 1);
const DirectionLeft = new Vector2(-1, 0);

class Direction
{
	direction:Vector2;

	constructor()
	{
		this.direction = DirectionUp;
	}

	setNextDirection()
	{
		if(this.direction == DirectionUp)
			this.direction = DirectionRight;
		else if(this.direction == DirectionRight)
			this.direction = DirectionDown;
		else if(this.direction == DirectionDown)
			this.direction = DirectionLeft;
		else if(this.direction == DirectionLeft)
			this.direction = DirectionUp;
	}
}

class Khalooph
{
	start:Vector2;
	end:Vector2;

	constructor()
	{
		this.start = new Vector2(0, 0);
		this.end = new Vector2(0, 0);
	}
}

class Cluster
{	
	topLeft:Vector2;
	bottomRight:Vector2;
	center:Vector2;
	distanceFromOrigin:number;
	distanceFromViewportSquared:number;

	constructor(minPos:Vector2, maxPos:Vector2)
	{
		this.topLeft = minPos;
		this.bottomRight = maxPos;
		this.distanceFromOrigin = 0;
		this.center = (this.topLeft).addPos(this.bottomRight).div(2);
		this.distanceFromViewportSquared = 0;
	}
	
	equals(other:Cluster):boolean { return this.topLeft == other.topLeft && this.bottomRight == other.bottomRight; }
	setDistance(distance:number):void { this.distanceFromOrigin = distance; }
	getCenter() { return this.center; }
}

class OOSResult
{	
	oos:boolean;
	direction:Vector2;
	position:Vector2;

	constructor(oos:boolean, direction:Vector2, position:Vector2)
	{
		this.oos = oos;
		this.direction = direction;
		this.position = position;
	}
}