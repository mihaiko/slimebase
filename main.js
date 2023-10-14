/*
P1:
* optimize bedrock algorithm
* make honey stay on screen less
* add "by Wicked" in the title
* donate button + slime animation
* add page metadata
* make the page discoverable

Nice to have:
* run on the GPU
* touch controls for mobile
* do something on honey pixel clicked
* restrict canvas movement to left click
* make pages button not offset
* add tooltips
* fix paging issue -> on resize from small to big -> last pages bs
* profile
* try to optimize drawing
* try to separate the title a bit more from the rest of the page
* on result hover, highlight on map if in view
* add inertia
* make mouse tooltip on hover
* buffering (maybe? if done well)
* carry over checks from one khalooph to another, maybe?
*/

class Vector2
{
	constructor(x, y) {	this.x = x;	this.y = y; }
	add(value) { return new Vector2(this.x + value, this.y + value); }
	sub(value) { return new Vector2(this.x - value, this.y - value); }
	mul(value) { return new Vector2(this.x * value, this.y * value); }
	div(value) { return new Vector2(this.x / value, this.y / value); }
	mod(value) { return new Vector2(this.x % value, this.y % value); }
	floor() { return new Vector2(Math.floor(this.x), Math.floor(this.y)); }
	ceil() { return new Vector2(Math.ceil(this.x), Math.ceil(this.y)); }
	round() { return new Vector2(Math.round(this.x), Math.round(this.y)); }
	toInt() { return new Vector2(parseInt(this.x), parseInt(this.y)); }
	copy() { return new Vector2(this.x, this.y); }
	isZero() { return this.equals(new Vector2(0, 0)); }
	length() { return this.distance(new Vector2(0, 0)); }
	normalize() { return new Vector2( this.x / this.length(), this.y / this.length()); }
	equals(other) {return this.x == other.x && this.y == other.y; }
	addPos(other) { return new Vector2(this.x + other.x, this.y + other.y); }
	subPos(other) { return new Vector2(this.x - other.x, this.y - other.y); }
	min(other) { return new Vector2(Math.min(this.x, other.x), Math.min(this.y, other.y)); }
	max(other) { return new Vector2(Math.max(this.x, other.x), Math.max(this.y, other.y)); }
	clamp(minValue, maxValue) { return this.min(new Vector2(maxValue, maxValue)).max(new Vector2(minValue, minValue)); }
	distance(other) { return Math.sqrt((this.x - other.x)**2 + (this.y-other.y)**2); }
	distanceSquared(other) { return (this.x - other.x)**2 + (this.y-other.y)**2; }
	slope(other) { return (other.y - this.y) / (other.x - this.x); }

	rotate(degrees)
	{
        const radians = (degrees * Math.PI) / 180;
        const cosTheta = Math.cos(radians);
        const sinTheta = Math.sin(radians);

        const newX = this.x * cosTheta - this.y * sinTheta;
        const newY = this.x * sinTheta + this.y * cosTheta;

		return new Vector2(newX, newY);
    }
}

class Direction
{
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
	constructor()
	{
		this.start = new Vector2(0, 0);
		this.end = new Vector2(0, 0);
	}
}

class Cluster
{
	constructor(minPos, maxPos)
	{
		this.topLeft = minPos;
		this.bottomRight = maxPos;
		this.distanceFromOrigin = 0;
		this.center = (this.topLeft).addPos(this.bottomRight).div(2);
		this.distanceFromViewportSquared = 0;
	}
	
	equals(other) { return this.topLeft == other.topLeft && this.bottomRight == other.bottomRight; }
	setDistance(distance) { this.distanceFromOrigin = distance; }
	getCenter() { return this.center; }
}

class OOSResult
{
	constructor(oos, direction, position)
	{
		this.oos = oos;
		this.direction = direction;
		this.position = position;
	}
}

const INNER_SLIME_CHUNK_COLOR = "#44bb44";
const SLIME_CHUNK_BORDER_COLOR = "#226622";
const CROSSHAIR_COLOR = "#00509090";
const GRID_LINE_COLOR = "#00000045";
const ZOOM_BAR_COLOR = "#ffffff";
const CANVAS_BACKGROUND = "#405555";
const WORKABLE_BACKGROUND = "#bbbbbb";
const PIN_FILL_COLOR = "#ff3000";
const PIN_OUTLINE_COLOR = "black";

const CANVAS_INNER_SHADOW_STRENGTH = 8;

const CANVAS_PADDING_TOP = 30;
const CANVAS_PADDING_BOTTOM = 150;
const CANVAS_PADDING_SIDES = 70;
const PAGE_PADDING_SIDES = 50;
const CANVAS_MIN_WIDTH = 900;
const CANVAS_MAX_WIDTH = 1500;

const OOS_MAX_ARROWS = 20;
const OSS_DRAW_DISTANCE = 1000;
const OOS_ARROW_OFFSET = 20;
const OOS_ARROW_LENGTH = 20;
const OOS_ARROW_TIP_LENGHT = 12;
const OOS_ARROW_TIP_ANGLE = 35;
const OOS_ARROW_COLOR = "#dd2222aa";
const OOS_ARROW_CENTER_WIDTH = 3;
const OOS_ARROW_FLAPS_WIDTH = 2;

var CANVAS_TOTAL_SIZE = new Vector2(1200, 900);
var CANVAS_WORKABLE_SIZE = new Vector2(CANVAS_TOTAL_SIZE.x - CANVAS_PADDING_SIDES*2, CANVAS_TOTAL_SIZE.y - CANVAS_PADDING_TOP - CANVAS_PADDING_BOTTOM);

const CANVAS_WORKABLE_START_POS = new Vector2(CANVAS_PADDING_SIDES, CANVAS_PADDING_TOP);
var CANVAS_WORKABLE_END_POS = new Vector2(CANVAS_WORKABLE_START_POS.x + CANVAS_WORKABLE_SIZE.x, CANVAS_WORKABLE_START_POS.y + CANVAS_WORKABLE_SIZE.y);

const CANVAS_ZOOM_BAR_Y_OFFSET = 40;
const ZOOM_BAR_PADDING = new Vector2(5, 5);
var CANVAS_ZOOM_BAR_SIZE = new Vector2(CANVAS_WORKABLE_SIZE.x / 2, 10);
var ZOOM_BAR_START_POS = new Vector2(CANVAS_TOTAL_SIZE.x / 2 - CANVAS_ZOOM_BAR_SIZE.x / 2, CANVAS_TOTAL_SIZE.y - CANVAS_PADDING_BOTTOM + CANVAS_ZOOM_BAR_Y_OFFSET);
var ZOOM_BAR_END_POS = new Vector2(ZOOM_BAR_START_POS.x + CANVAS_ZOOM_BAR_SIZE.x, ZOOM_BAR_START_POS.y + CANVAS_ZOOM_BAR_SIZE.y);

const CANVAS_MIN_ZOOM_LEVEL = 8;
const CANVAS_MAX_ZOOM_LEVEL = 64;
const CANVAS_ZOOM_INCREMENT = 4;

const DRAW_CROSSHAIR = false;
const CROSSHAIR_SIZE = 26;

const CHUNK_SIZE = 16;
const GRID_BOLD = 16;
var GRID_SPACING = 16;

const PIN_SIZE = new Vector2(4, 6);
var PinPosition = new Vector2(0, 0);

const RESULT_CONTAINER_WIDTH = 145;
const RESULT_CONTAINER_SIZE_MARGIN = 7;
var ResultsPerPage = Math.floor(CANVAS_WORKABLE_SIZE.x / (RESULT_CONTAINER_WIDTH + RESULT_CONTAINER_SIZE_MARGIN * 2));
var CurrentPage = 0;

var ReverseSearch = false;

const DirectionUp = new Vector2(0, -1);
const DirectionRight = new Vector2(1, 0);
const DirectionDown = new Vector2(0, 1);
const DirectionLeft = new Vector2(-1, 0);

const KhaloophSizeJava = 200;
const KhaloophSizeBedrock = 120;
var KhaloophSearchMin = 0;
var CurrentKhalooph = new Khalooph();
var CurrentDirection = new Direction();

var CurrentKhaloophsSideDistance = 1;
var KhaloophsTillDirectionChange = CurrentKhaloophsSideDistance;
var ShouldIncreaseDistance = false;

var ResultsArray = [];
var TempResults = [];

var SearchResultLimit = 20;
var ShouldUpdateSearchResults = false;
var SearchDistance = 100000;
var ClusterSize = new Vector2(0, 0);
var ClusterSizeOverlap = 0;

var CanvasLastMousePos = new Vector2(0, 0);
var CanvasLastWorkablePos = new Vector2(0, 0);

var CanvasOffset = new Vector2(CANVAS_WORKABLE_SIZE.x / 2, CANVAS_WORKABLE_SIZE.y / 2);

var MousePressedInWorkableArea = false;
var MousePressedOnZoomBar = false;

var Seed = 0n;

var SearchOrigin = new Vector2(0, 0);

var SearchInProgress = false;
var StopSearchRequested = false;
var DrawCanvasRequested = false;

var StartSearchTimestamp = 0;
var LastUpdateTimestamp = 0;
var ShouldStopSearchTimer = false;
var UpdateSearchStatsIntervalId = 0;
var CurrentChunksChecked = 0;

var IsBedrock = false;

class Random {
    constructor(seed) {
        this.seed = (seed ^ 0x5DEECE66Dn) & 281474976710655n;
    }

    next() {
        this.seed = (this.seed * 0x5DEECE66Dn + 0xBn) & 281474976710655n;
        return this.seed >> 17n;
    }

    nextInt() {
        let r = this.next();
		for (let u = r; u - (r = u % 10n) < -9n; u = this.next());
        return r == 0;
    }
}

function getKhaloophSize()
{
	return IsBedrock ? KhaloophSizeBedrock : KhaloophSizeJava;
}

function isSlimeChunk(seed, x, z)
{
	if(IsBedrock)
		return isSlimeChunkBedrock(x, z);

	let rngGen = new Random(seed + BigInt(Math.imul(Math.imul(x, x), 4987142)) + BigInt(Math.imul(x, 5947611)) + BigInt(Math.imul(z, z)) * 4392871n + BigInt(Math.imul(z, 389711)) ^ 987234911n);
	return rngGen.nextInt();
}

function goToPosition()
{
	PinPosition.x = parseFloat(document.getElementById("xvalue").value);
	PinPosition.y = parseFloat(document.getElementById("zvalue").value);
	
	CanvasOffset = PinPosition.div(CHUNK_SIZE).mul(GRID_SPACING).subPos(CANVAS_WORKABLE_SIZE.div(2)).mul(-1);
	
	drawCanvas();
}

function createCanvas()
{
	try{
		Seed = BigInt(document.getElementById("seed").value);
	}
	catch{
		Seed = BigInt(document.getElementById("seed").value.hashCode());
	}
	
	onWindowResize(true);
	
	window.addEventListener('resize', function(event) {
		onWindowResize(false);
	}, true);

	setInputs();

	drawCanvas();
}

function setInputs()
{
	let seed = localStorage.getItem("seed");
	let xcluster = localStorage.getItem("xcluster");
	let ycluster = localStorage.getItem("ycluster");
	let searchdistance = localStorage.getItem("searchdistance");
	let searchlimit = localStorage.getItem("searchlimit");
	let invertedsearch = localStorage.getItem("invertedsearch");
	let isBedrock = localStorage.getItem("isBedrock");

	if(seed)
	{		
		try{
			Seed = BigInt(parseInt(seed));
		}
		catch{
			Seed = BigInt(seed.hashCode());
		}
		document.getElementById("seed").value = seed;
	}
	else
		setRandomSeed();
	if(xcluster)
		document.getElementById("xcluster").value = xcluster;
	if(ycluster)
		document.getElementById("ycluster").value = ycluster;
	if(searchdistance)
		document.getElementById("searchdistance").value = searchdistance;
	if(searchlimit)
		document.getElementById("searchlimit").value = searchlimit;
	if(invertedsearch)
		document.getElementById("reverseSearch").checked = invertedsearch == "true";
	if(isBedrock == "true")
		switchToBedrock();
}

function onSeedChanged()
{
	try{
		Seed = BigInt(document.getElementById("seed").value);
	}
	catch{
		Seed = BigInt(document.getElementById("seed").value.hashCode());
	}
	
	resetValues();

	onInputChanged();
}

function drawCanvas()
{	
	drawWorkableBackground();
	drawGrid();
	drawSlimeChunks();
	drawClusters();
	drawLocationPin();
	drawCrosshair();
	drawOOSArrows();
	drawInnerShadow();
	drawPerMovementElements();
}

function getYatX(point1, point2, x)
{
	let p1 = point1.mul(GRID_SPACING).div(CHUNK_SIZE);
	return p1.slope(point2) * (x - p1.x) + p1.y;
}

function getXatY(point1, point2, y)
{
	let p1 = point1.mul(GRID_SPACING).div(CHUNK_SIZE);
	return (y - p1.y) / p1.slope(point2) + p1.x;
}

function getOOSPosition(position)
{	
	let point1 = getCenter().div(GRID_SPACING).mul(CHUNK_SIZE);
	let point2 = position.copy().div(CHUNK_SIZE).mul(GRID_SPACING);

	let workablePos = globalPosToWorkable(point2);
	if(workablePos.x > CANVAS_WORKABLE_END_POS.x)
	{
		let xMargin = CANVAS_WORKABLE_SIZE.x - OOS_ARROW_OFFSET - CanvasOffset.x;
		let yFound = getYatX(point1, point2, xMargin);

		let minValue = OOS_ARROW_OFFSET - CanvasOffset.y;
		let maxValue = CANVAS_WORKABLE_SIZE.y - OOS_ARROW_OFFSET - CanvasOffset.y;

		if(yFound < maxValue && yFound > minValue)
			return new OOSResult(true, DirectionRight, new Vector2(xMargin, yFound));
	}

	if(workablePos.y > CANVAS_WORKABLE_END_POS.y)
	{
		let yMargin = CANVAS_WORKABLE_SIZE.y - OOS_ARROW_OFFSET - CanvasOffset.y;
		let xFound = getXatY(point1, point2, yMargin);

		let minValue = OOS_ARROW_OFFSET - CanvasOffset.x;
		let maxValue = CANVAS_WORKABLE_SIZE.x - OOS_ARROW_OFFSET - CanvasOffset.x;
		
		if(xFound < maxValue && xFound > minValue)
			return new OOSResult(true, DirectionDown, new Vector2(xFound, yMargin));
	}

	if(workablePos.x < CANVAS_WORKABLE_START_POS.x)
	{
		let xMargin = OOS_ARROW_OFFSET - CanvasOffset.x;
		let yFound = getYatX(point1, point2, xMargin);

		let minValue = OOS_ARROW_OFFSET - CanvasOffset.y;
		let maxValue = CANVAS_WORKABLE_SIZE.y - OOS_ARROW_OFFSET - CanvasOffset.y;
		
		if(yFound < maxValue && yFound > minValue)
			return new OOSResult(true, DirectionLeft, new Vector2(xMargin, yFound));
	}

	if(workablePos.y < CANVAS_WORKABLE_START_POS.y)
	{
		let yMargin = OOS_ARROW_OFFSET - CanvasOffset.y;
		let xFound = getXatY(point1, point2, yMargin);

		let minValue = OOS_ARROW_OFFSET - CanvasOffset.x;
		let maxValue = CANVAS_WORKABLE_SIZE.x - OOS_ARROW_OFFSET - CanvasOffset.x;
		
		if(xFound < maxValue && xFound > minValue)
			return new OOSResult(true, DirectionUp, new Vector2(xFound, yMargin));
	}

	return new Vector2(0, 0);
}

function drawOOSArrow(oosPosition)
{
	let direction = getCenter().subPos(oosPosition).normalize();
	let arrowStartPos = oosPosition.addPos(direction.mul(OOS_ARROW_LENGTH));

	direction = direction.rotate(OOS_ARROW_TIP_ANGLE);
	let arrowTipRight = oosPosition.addPos(direction.mul(OOS_ARROW_TIP_LENGHT));

	direction = direction.rotate(2*-OOS_ARROW_TIP_ANGLE);
	let arrowTipLeft = oosPosition.addPos(direction.mul(OOS_ARROW_TIP_LENGHT));

	drawLine(arrowStartPos, oosPosition, OOS_ARROW_COLOR, OOS_ARROW_CENTER_WIDTH);
	drawLine(arrowTipRight, oosPosition, OOS_ARROW_COLOR, OOS_ARROW_FLAPS_WIDTH);
	drawLine(arrowTipLeft, oosPosition, OOS_ARROW_COLOR, OOS_ARROW_FLAPS_WIDTH);
	
}

function drawOOSDistance(originalPosition, oosResult)
{
	let distance = originalPosition.distance(oosResult.position.div(GRID_SPACING).mul(CHUNK_SIZE));
	
	let textPosition = oosResult.position.copy();
	let textAlignment = "center";
	switch(oosResult.direction)
	{
		case DirectionUp:
		{
			textPosition = new Vector2(oosResult.position.x, oosResult.position.y + 35);
			break;
		}
		case DirectionDown:
		{
			textPosition = new Vector2(oosResult.position.x, oosResult.position.y - 25);
			break;
		}
		case DirectionRight:
		{
			textPosition = new Vector2(oosResult.position.x, oosResult.position.y + 22);
			textAlignment = "right";
			break;
		}
		case DirectionLeft:
		{
			textPosition = new Vector2(oosResult.position.x, oosResult.position.y + 22);
			textAlignment = "left";
			break;
		}
	}
	
	let workableTextPos = globalPosToWorkable(textPosition);
	
	let ctx = getCanvasContext();	
	ctx.fillStyle = OOS_ARROW_COLOR;
	ctx.textAlign = textAlignment;
	ctx.font = "bold 14px Arial";
	ctx.fillText(parseInt(distance), workableTextPos.x, workableTextPos.y);
}

function sortByDistanceToViewport()
{
	let OOSResults = Array.from(ResultsArray);
	let viewportCenter = getCenter().div(GRID_SPACING).mul(CHUNK_SIZE);

	for(let i = 0; i < OOSResults.length; ++i)
		OOSResults[i].distanceFromViewportSquared = OOSResults[i].center.distanceSquared(viewportCenter);

	OOSResults.sort((a, b) => a.distanceFromViewportSquared - b.distanceFromViewportSquared);

	return OOSResults;
}

function drawOOSArrowsInRange(OOSResults)
{
	for(let i = 0; i < Math.min(OOSResults.length, OOS_MAX_ARROWS); ++i)
	{
		let originalPos = OOSResults[i].getCenter();
		let oosResult = getOOSPosition(originalPos);
		if (oosResult.oos && originalPos.distanceSquared(oosResult.position.div(GRID_SPACING).mul(CHUNK_SIZE)) < OSS_DRAW_DISTANCE**2)
		{
			drawOOSArrow(oosResult.position);
			drawOOSDistance(originalPos, oosResult);
		}
	}
}

function drawOOSArrows()
{
	let OOSResults = sortByDistanceToViewport();
	drawOOSArrowsInRange(OOSResults);
}

function drawInnerShadow()
{
	ctx = getCanvasContext();
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowColor = "black";
    ctx.shadowBlur = 8;

	ctx.strokeStyle = "black";

	for(let i = 0; i < CANVAS_INNER_SHADOW_STRENGTH; ++i)
		ctx.strokeRect(CANVAS_WORKABLE_START_POS.x, CANVAS_WORKABLE_START_POS.y, CANVAS_WORKABLE_SIZE.x, CANVAS_WORKABLE_SIZE.y);

	ctx.shadowBlur = 0;
}

function drawLocationPin()
{
	if(PinPosition.x == 0 && PinPosition.y == 0)
		return;

	let top    = new Vector2(PinPosition.x / CHUNK_SIZE * GRID_SPACING, PinPosition.y / CHUNK_SIZE * GRID_SPACING - PIN_SIZE.y);
	let bottom = new Vector2(PinPosition.x / CHUNK_SIZE * GRID_SPACING, PinPosition.y / CHUNK_SIZE * GRID_SPACING + PIN_SIZE.y);
	let left   = new Vector2(PinPosition.x / CHUNK_SIZE * GRID_SPACING - PIN_SIZE.x, PinPosition.y / CHUNK_SIZE * GRID_SPACING);
	let right  = new Vector2(PinPosition.x / CHUNK_SIZE * GRID_SPACING + PIN_SIZE.x, PinPosition.y / CHUNK_SIZE * GRID_SPACING);
	
	let workableTop    = globalPosToWorkable(top);
	let workableBottom = globalPosToWorkable(bottom);
	let workableLeft   = globalPosToWorkable(left);
	let workableRight  = globalPosToWorkable(right);

	let ctx = getCanvasContext();
	ctx.beginPath();
	ctx.moveTo(workableTop.x, workableTop.y);
	ctx.lineTo(workableRight.x, workableRight.y);
	ctx.lineTo(workableBottom.x, workableBottom.y);
	ctx.lineTo(workableLeft.x, workableLeft.y);
	ctx.closePath();
	ctx.strokeStyle = PIN_OUTLINE_COLOR;
	ctx.fillStyle = PIN_FILL_COLOR;
	ctx.stroke();
	ctx.fill();
}

function drawCrosshair()
{	
	if(!DRAW_CROSSHAIR)
		return;

	let center = getCenter();
	
	//crosshair
	drawLine(new Vector2(center.x, center.y - CROSSHAIR_SIZE / 2), new Vector2(center.x, center.y + CROSSHAIR_SIZE / 2), CROSSHAIR_COLOR, 0.5);
	drawLine(new Vector2(center.x - CROSSHAIR_SIZE / 2, center.y), new Vector2(center.x + CROSSHAIR_SIZE / 2, center.y), CROSSHAIR_COLOR, 0.5);
}

function getCenter()
{
	return CANVAS_WORKABLE_SIZE.div(2).subPos(CanvasOffset);
}

function drawGrid()
{
	let gridBold = GRID_BOLD*GRID_SPACING;
	let center = getCenter();
	center = center.subPos(center.mod(GRID_SPACING));
	
	let verticalLines = Math.ceil(CANVAS_WORKABLE_SIZE.x / GRID_SPACING);
	let horizontalLines = Math.ceil(CANVAS_WORKABLE_SIZE.y / GRID_SPACING);
	
	for(let i = Math.floor(-verticalLines / 2); i <= Math.ceil(verticalLines / 2); ++i)
	{
		let Xcoord = (i * GRID_SPACING) + center.x;
		let width = 0.5;
		
		if(!(Xcoord % gridBold))
			width *= 2;
		
		if(Xcoord == 0)
			width *= 2;
		
		drawLine(new Vector2(Xcoord, -CanvasOffset.y), new Vector2(Xcoord, CANVAS_TOTAL_SIZE.y - CanvasOffset.y), GRID_LINE_COLOR, width);
	}
	
	for(let i = Math.floor(-horizontalLines / 2); i <= Math.ceil(horizontalLines / 2); ++i)
	{
		let Ycoord = (i * GRID_SPACING) + center.y;
		let width = 0.5;
		
		if(!(Ycoord % gridBold))
			width *= 2;
		
		if(Ycoord == 0)
			width *= 2;
		
		drawLine(new Vector2(-CanvasOffset.x, Ycoord), new Vector2(CANVAS_TOTAL_SIZE.x - CanvasOffset.x, Ycoord), GRID_LINE_COLOR, width);
	}
}

function drawSlimeChunks()
{
	let minPos = CanvasOffset.mul(-1).div(GRID_SPACING).floor();
	let maxPos = CanvasOffset.mul(-1).addPos(CANVAS_WORKABLE_SIZE).div(GRID_SPACING).ceil();

	for(let i = minPos.x; i <= maxPos.x; ++i)
	{
		for(let j = minPos.y; j <= maxPos.y; ++j)
		{
			if(isSlimeChunk(Seed,i,j))
				drawSlimeChunk(new Vector2(i, j));
		}
	}
}

function drawClusters()
{
	for(let i = 0; i < ResultsArray.length; ++i)
	{
		let cluster = ResultsArray[i];
		
		let startPos = cluster.topLeft.div(CHUNK_SIZE).mul(GRID_SPACING);
		let endPos = cluster.bottomRight.div(CHUNK_SIZE).mul(GRID_SPACING);

		drawRect(startPos, endPos.subPos(startPos), "red", false, 2);
	}
}

function globalPosToWorkable(pos)
{
	return CANVAS_WORKABLE_START_POS.addPos(CanvasOffset).addPos(pos);
}

function isPositionInWorkable(pos)
{
	if(pos.x < CANVAS_WORKABLE_START_POS.x || pos.y < CANVAS_WORKABLE_START_POS.y)
		return false;
	
	if(pos.x > CANVAS_WORKABLE_END_POS.x || pos.y > CANVAS_WORKABLE_END_POS.y)
		return false;
	
	return true;
}

function isRectInWorkable(start, size)
{
	let newPos = start.copy();
	if(isPositionInWorkable(newPos))
		return true;
	
	newPos.x += size.x;
	if(isPositionInWorkable(newPos))
		return true;
	
	newPos.y += size.y;
	if(isPositionInWorkable(newPos))
		return true;
	
	newPos.x -= size.x;	
	if(isPositionInWorkable(newPos))
		return true;
	
	return false;
}

function drawRect(position, size, color, fill, width)
{
	let workablePos = globalPosToWorkable(position);
	
	if(!isRectInWorkable(workablePos, size))
		return;

	let ctx = getCanvasContext();
	if(fill)
	{
		ctx.fillStyle = color;
		ctx.fillRect(workablePos.x, workablePos.y, size.x, size.y);
	}
	else
	{
		ctx.lineWidth = width;
		ctx.strokeStyle = color;
		ctx.strokeRect(workablePos.x, workablePos.y, size.x, size.y);
	}
	
	//return to default
	ctx.lineWidth = 1;
}

function drawArc(centerPos, radius, color, fill)
{
	let workablePos = globalPosToWorkable(centerPos);
	ctx.strokeStyle = color;
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(workablePos.x, workablePos.y, radius, 0, 2 * Math.PI);
	if(fill)
		ctx.fill();
	else
		ctx.stroke();
}

function drawLine(startPos, endPos, color, width)
{
	let workableStart = globalPosToWorkable(startPos);
	let workableEnd = globalPosToWorkable(endPos);
	
	let ctx = getCanvasContext();
	ctx.lineWidth = width;
	ctx.beginPath();
	ctx.moveTo(workableStart.x, workableStart.y);
	ctx.lineTo(workableEnd.x, workableEnd.y);
	ctx.strokeStyle = color;
	ctx.stroke();
	
	//return to default
	ctx.lineWidth = 1;
}

function drawSlimeChunk(pos)
{
	drawRect(pos.mul(GRID_SPACING), new Vector2(GRID_SPACING, GRID_SPACING), INNER_SLIME_CHUNK_COLOR, true, 0.5);
	drawRect(pos.mul(GRID_SPACING), new Vector2(GRID_SPACING, GRID_SPACING), SLIME_CHUNK_BORDER_COLOR, false, 0.5);
}

function getCanvasContext()
{
	return CachedCanvasContext;
}

function setCanvasPositions(position)
{
	CanvasLastMousePos = position;
	CanvasLastWorkablePos = position.subPos(CANVAS_WORKABLE_START_POS);
}

function isMouseInWorkableSpace()
{
	if(CanvasLastWorkablePos.x < 0 || CanvasLastWorkablePos.y < 0)
		return false;
	if(CanvasLastWorkablePos.x >= CANVAS_WORKABLE_SIZE.x || CanvasLastWorkablePos.y >= CANVAS_WORKABLE_SIZE.y)
		return false;
	
	return true;
}

function onMouseDown()
{
	if(isMouseInWorkableSpace())
		MousePressedInWorkableArea = true;
	if(mouseOverZoomBar())
	{
		MousePressedOnZoomBar = true;	
		changeZoomLevel();
	}
}

function onDblclick()
{
	if(isMouseInWorkableSpace())
	{
		PinPosition = CanvasLastWorkablePos.subPos(CanvasOffset).div(GRID_SPACING).mul(CHUNK_SIZE).toInt();
		document.getElementById("xvalue").value = PinPosition.x;
		document.getElementById("zvalue").value = PinPosition.y;
		drawCanvas();
	}
}

function onMouseUp()
{
	MousePressedInWorkableArea = false;
	MousePressedOnZoomBar = false;
}

function clamp(value, min, max)
{
	return Math.max(Math.min(max, value), min);
}

function onMouseScroll(event)
{
	let newGridSpacing = GRID_SPACING;
	newGridSpacing -= Math.sign(event.deltaY) * CANVAS_ZOOM_INCREMENT;
	newGridSpacing = clamp(newGridSpacing, CANVAS_MIN_ZOOM_LEVEL, CANVAS_MAX_ZOOM_LEVEL);

	if(isMouseInWorkableSpace())
		changeGridSpacing(newGridSpacing, CanvasLastWorkablePos);
	else
		changeGridSpacing(newGridSpacing, CANVAS_WORKABLE_SIZE.div(2));
}

function onCanvasMouseMove(position)
{	
	if(MousePressedInWorkableArea)
	{
		if(isMouseInWorkableSpace())
		{
			let currentOffset = position.subPos(CanvasLastMousePos);
			CanvasOffset = CanvasOffset.addPos(currentOffset);
		
			if(currentOffset.x != 0 || currentOffset.y != 0)
				drawCanvas();
		}
	}
	if(MousePressedOnZoomBar)
	{
		changeZoomLevel();
	}
	
	setCanvasPositions(position);
	drawPerMovementElements();
}

function changeZoomLevel()
{
	let zoomPercentage = (CanvasLastMousePos.x - ZOOM_BAR_START_POS.x) / CANVAS_ZOOM_BAR_SIZE.x;
	zoomPercentage = clamp(zoomPercentage, 0, 1);
	
	let interval = CANVAS_MAX_ZOOM_LEVEL - CANVAS_MIN_ZOOM_LEVEL;
	changeGridSpacing(zoomPercentage * interval + CANVAS_MIN_ZOOM_LEVEL, CANVAS_WORKABLE_SIZE.div(2)); //CANVAS_WORKABLE_SIZE.x/2, CANVAS_WORKABLE_SIZE.y/2);
}

function changeGridSpacing(newGridSpacing, referencePos)
{
	let originalDistance = referencePos.subPos(CanvasOffset);
	let calc = originalDistance.div(GRID_SPACING).mul(newGridSpacing).subPos(originalDistance);
	CanvasOffset = CanvasOffset.subPos(calc);
	GRID_SPACING = newGridSpacing;
	
	drawCanvas();
}

function mouseOverZoomBar()
{
	if(CanvasLastMousePos.x < ZOOM_BAR_START_POS.x - ZOOM_BAR_PADDING.x)
		return false;
	
	if(CanvasLastMousePos.x > ZOOM_BAR_END_POS.x + ZOOM_BAR_PADDING.x)
		return false;
	
	if(CanvasLastMousePos.y < ZOOM_BAR_START_POS.y - ZOOM_BAR_PADDING.y)
		return false;
	
	if(CanvasLastMousePos.y > ZOOM_BAR_END_POS.y + ZOOM_BAR_PADDING.y)
		return false;
	
	return true;
}

function drawPerMovementElements()
{
	drawFullBackground();
	drawCoordinates();
	drawMouseCoordinates();
	drawZoomBar();
}

function drawZoomBar()
{	
	let ctx = getCanvasContext();
	ctx.fillStyle = ZOOM_BAR_COLOR;
	ctx.strokeStyle = ZOOM_BAR_COLOR;
    ctx.shadowBlur = 8;
	ctx.beginPath();
	ctx.roundRect(ZOOM_BAR_START_POS.x, ZOOM_BAR_START_POS.y, CANVAS_ZOOM_BAR_SIZE.x, CANVAS_ZOOM_BAR_SIZE.y, [CANVAS_ZOOM_BAR_SIZE.y/2]);
	ctx.stroke();
	ctx.shadowBlur = 0
	ctx.fill();
	
	let interval = CANVAS_MAX_ZOOM_LEVEL - CANVAS_MIN_ZOOM_LEVEL;
	let currentInInterval = GRID_SPACING - CANVAS_MIN_ZOOM_LEVEL;
	let zoomPercentage = currentInInterval / interval;
	
	let zoomKnobX = CANVAS_ZOOM_BAR_SIZE.x * zoomPercentage + ZOOM_BAR_START_POS.x;
	let zoomKnobY = ZOOM_BAR_START_POS.y + CANVAS_ZOOM_BAR_SIZE.y / 2;
	
	ctx.strokeStyle = "black";
	ctx.beginPath();
	ctx.arc(zoomKnobX, zoomKnobY, CANVAS_ZOOM_BAR_SIZE.y * 1.2, 0, 2 * Math.PI);
	ctx.fill();
	ctx.stroke();
}

function addCanvasEventListeners()
{
	let canvas = document.getElementById("myCanvas");
	
	CachedCanvasContext = canvas.getContext("2d");
	
	canvas.onmousemove = function(e){
		let cRect = canvas.getBoundingClientRect();
		let canvasPos = (new Vector2(e.clientX - cRect.left, e.clientY - cRect.top)).round();		
		onCanvasMouseMove(canvasPos);
	}
	
	canvas.onmousedown = function(e){
		onMouseDown();
	}
	
	canvas.ondblclick = function(e){
		onDblclick();
	}
	
	document.onmouseup = function(e){
		onMouseUp();
	}

	canvas.addEventListener('wheel',function(event){
		if(isMouseInWorkableSpace() || mouseOverZoomBar())
		{	
			onMouseScroll(event);
			event.preventDefault();
			return false; 
		}
	}, false);
}

function onWindowResize(init)
{
	CANVAS_TOTAL_SIZE.x = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) - PAGE_PADDING_SIDES * 2;
	CANVAS_TOTAL_SIZE.x = clamp(CANVAS_TOTAL_SIZE.x, CANVAS_MIN_WIDTH, CANVAS_MAX_WIDTH);
	
	CANVAS_WORKABLE_SIZE = new Vector2(CANVAS_TOTAL_SIZE.x - CANVAS_PADDING_SIDES*2, CANVAS_TOTAL_SIZE.y - CANVAS_PADDING_TOP - CANVAS_PADDING_BOTTOM);
	CANVAS_WORKABLE_END_POS = new Vector2(CANVAS_WORKABLE_START_POS.x + CANVAS_WORKABLE_SIZE.x, CANVAS_WORKABLE_START_POS.y + CANVAS_WORKABLE_SIZE.y);

	CANVAS_ZOOM_BAR_SIZE = new Vector2(CANVAS_WORKABLE_SIZE.x / 2, 10);	
	ZOOM_BAR_START_POS = new Vector2(CANVAS_TOTAL_SIZE.x / 2 - CANVAS_ZOOM_BAR_SIZE.x / 2, CANVAS_TOTAL_SIZE.y - CANVAS_PADDING_BOTTOM + CANVAS_ZOOM_BAR_Y_OFFSET);
	ZOOM_BAR_END_POS = new Vector2(ZOOM_BAR_START_POS.x + CANVAS_ZOOM_BAR_SIZE.x, ZOOM_BAR_START_POS.y + CANVAS_ZOOM_BAR_SIZE.y);	
	
	document.getElementById("container").setAttribute("style", `width:${CANVAS_TOTAL_SIZE.x}px;`);
	
	ResultsPerPage = Math.floor(CANVAS_WORKABLE_SIZE.x / (RESULT_CONTAINER_WIDTH + RESULT_CONTAINER_SIZE_MARGIN * 2));
	let resultsWidth = ResultsPerPage * (RESULT_CONTAINER_WIDTH + RESULT_CONTAINER_SIZE_MARGIN * 2);
	document.getElementById("searchResults").setAttribute("style", `width:${resultsWidth}px;`);
	
	let	canvasDiv = document.getElementById("canvasDiv");
	canvasDiv.innerHTML = '<canvas id="myCanvas" width="' + CANVAS_TOTAL_SIZE.x + '" height="' + CANVAS_TOTAL_SIZE.y + '"></canvas>';

	if(init)
		CanvasOffset = new Vector2(CANVAS_WORKABLE_SIZE.x / 2, CANVAS_WORKABLE_SIZE.y / 2);
	
	addCanvasEventListeners();
	
	drawCanvas();

	ShouldUpdateSearchResults = true;
	updateSearchResults();
}

function drawFullBackground()
{
	let ctx = getCanvasContext();
	ctx.fillStyle = CANVAS_BACKGROUND;
	ctx.fillRect(0, 0, CANVAS_TOTAL_SIZE.x, CANVAS_PADDING_TOP);
	ctx.fillRect(0, 0, CANVAS_PADDING_SIDES, CANVAS_TOTAL_SIZE.y);
	ctx.fillRect(CANVAS_TOTAL_SIZE.x - CANVAS_PADDING_SIDES, 0, CANVAS_PADDING_SIDES, CANVAS_TOTAL_SIZE.y);
	ctx.fillRect(0, CANVAS_TOTAL_SIZE.y - CANVAS_PADDING_BOTTOM, CANVAS_TOTAL_SIZE.x, CANVAS_PADDING_BOTTOM);
}

function drawCoordinates()
{
	let minPos = CanvasOffset.div(-GRID_SPACING).ceil().add(1);
	let maxPos = CanvasOffset.mul(-1).addPos(CANVAS_WORKABLE_SIZE).div(GRID_SPACING);

	let ctx = getCanvasContext();
	ctx.fillStyle = "white";
	ctx.textAlign = "center";
	ctx.font = "12px Arial";

	let interval = GRID_BOLD;
	if(GRID_SPACING >= 24)
		interval /= 2;

	if(GRID_SPACING >= 44)
		interval /= 2;

	for(let i = minPos.x; i <= maxPos.x; ++i)
	{
		if(i % interval == 0)
		{
			ctx.fillText(i*CHUNK_SIZE, CANVAS_PADDING_SIDES + (i * GRID_SPACING) + CanvasOffset.x, CANVAS_WORKABLE_SIZE.y + CANVAS_PADDING_TOP + 20);
			ctx.fillText(i*CHUNK_SIZE, CANVAS_PADDING_SIDES + (i * GRID_SPACING) + CanvasOffset.x, CANVAS_PADDING_TOP - 10);
		}
	}
	
	for(let j = minPos.y; j <= maxPos.y; ++j)
	{
		if(j % (interval/2) == 0)
		{
			ctx.fillText(j*CHUNK_SIZE, CANVAS_PADDING_SIDES / 2, CANVAS_PADDING_TOP + (j * GRID_SPACING) + CanvasOffset.y + 3);
			ctx.fillText(j*CHUNK_SIZE, CANVAS_TOTAL_SIZE.x - CANVAS_PADDING_SIDES / 2, CANVAS_PADDING_TOP + (j * GRID_SPACING) + CanvasOffset.y + 3);
		}
	}
}

function drawMouseCoordinates()
{
	if (!isMouseInWorkableSpace())
		return;

	let ctx = getCanvasContext();
	ctx.fillStyle = "white";
	ctx.textAlign = "left";
	ctx.font = "16px Arial";

	let drawPosX = CANVAS_PADDING_SIDES;
	let drawPosY = CANVAS_TOTAL_SIZE.y - CANVAS_PADDING_BOTTOM + 50;

	let position = CanvasLastWorkablePos.subPos(CanvasOffset).div(GRID_SPACING).mul(CHUNK_SIZE);

	ctx.fillText("Position: X(" + parseInt(position.x) + ") Z(" + parseInt(position.y) +")", drawPosX, drawPosY);
	ctx.textAlign = "right";
	ctx.fillText("Chunk: X(" + parseInt(position.x/CHUNK_SIZE) + ") Z("+ parseInt(position.y/CHUNK_SIZE) + ")", drawPosX + CANVAS_WORKABLE_SIZE.x, drawPosY);
}

function drawWorkableBackground()
{
	let ctx = getCanvasContext();
	ctx.fillStyle = WORKABLE_BACKGROUND;
	ctx.fillRect(CANVAS_WORKABLE_START_POS.x, CANVAS_WORKABLE_START_POS.y, CANVAS_WORKABLE_SIZE.x, CANVAS_WORKABLE_SIZE.y);
}

function updateSearchResults()
{
	if(!ShouldUpdateSearchResults)
		return;
	
	ShouldUpdateSearchResults = false;
	
	let resultsDiv = document.getElementById("searchResults");
	let resultStrings = [];
	
	for(let i = CurrentPage*ResultsPerPage; i < Math.min(ResultsArray.length, (CurrentPage+1)*ResultsPerPage); ++i)
	{
		let center = ResultsArray[i].getCenter();
		let distance = parseInt(ResultsArray[i].distanceFromOrigin);
		let currentResultString = 
		`<div class="resultContainer" id="result${i}" onclick="goToResult(${i})" style="width:${RESULT_CONTAINER_WIDTH}px;">
			<div class="resultLine"> <span class="label">Dist</span> <span class="value">${distance}</span></div>
			<div class="resultLine"> <span class="label">X</span> <span class="value">${center.x}</span></div>
			<div class="resultLine"> <span class="label">Z</span> <span class="value">${center.y}</span></div>
		</div>`;
		resultStrings.push(currentResultString);
	}
	
	resultsDiv.innerHTML = resultStrings.join("");

	let resultsControlsDiv = document.getElementById("resultsControls");
	let controlsString = "";

	if(ResultsArray.length > ResultsPerPage)
	{
		if(CurrentPage > 0)
			controlsString += `<span class="resultPageControl" onclick="previousPage();">&#9664</span>`;
		controlsString += "  " + (CurrentPage + 1) + "  ";
		if(CurrentPage < ResultsArray.length / ResultsPerPage - 1)
			controlsString += `<span class="resultPageControl" onclick="nextPage();">&#9654</span>`;
	}

	resultsControlsDiv.innerHTML = controlsString;
	
	if(ResultsArray.length)
		document.getElementById("resultsFoundValue").innerHTML = ResultsArray.length;
}

function nextPage()
{
	CurrentPage++;

	ShouldUpdateSearchResults = true;
	updateSearchResults()
}

function previousPage()
{
	CurrentPage--;

	ShouldUpdateSearchResults = true;
	updateSearchResults()
}

function goToResult(index)
{
	let center = ResultsArray[index].getCenter();
	document.getElementById("xvalue").value = center.x;
	document.getElementById("zvalue").value = center.y;
	goToPosition();
}

function checkForClusters(chunksArray)
{
	for(let i = 0; i < KhaloophSearchMin; ++i)
	{
		for(let j = 0; j < KhaloophSearchMin; ++j)
		{
			if(checkClusterFromPosition(new Vector2(i, j), chunksArray))
				updateSearchResults();
		}
	}
}

function checkClusterFromPosition(position, chunksArray)
{
	return checkClusterWidthHeight(position, chunksArray) || (ClusterSize.x != ClusterSize.y && checkClusterHeightWidth(position, chunksArray));
}

function checkClusterWidthHeight(position, chunksArray)
{
	let xSearchHeight = position.x + ClusterSize.y;
	let ySearchWidth = position.y + ClusterSize.x;
	let khaloophSize = getKhaloophSize();

	for(i = position.x; i < xSearchHeight; ++i)
	{
		if(i >= khaloophSize)
			return false;

		for(j = position.y; j < ySearchWidth; ++j)
			if (j >= khaloophSize || !chunksArray[i][j])
				return false;
	}
	
	let chunksList = []

	let currentOffset = CurrentKhalooph.start;
	
	for(i = position.x; i < xSearchHeight; ++i)
		for(j = position.y; j < ySearchWidth; ++j)
			chunksList.push(currentOffset.addPos(new Vector2(i,j)));

	addSearchResult(getClusterFromChunksList(chunksList));

	return true;
}

function checkClusterHeightWidth(position, chunksArray)
{
	let xSearchWidth = position.x + ClusterSize.x;
	let ySearchHeight = position.y + ClusterSize.y;
	let khaloophSize = getKhaloophSize();

	for(i = position.x; i < xSearchWidth; ++i)
	{
		if(i >= khaloophSize)
			return false;

		for(j = position.y; j < ySearchHeight; ++j)
			if(j >= khaloophSize || !chunksArray[i][j])
				return false;
	}
	
	let chunksList = []
	
	let currentOffset = CurrentKhalooph.start;
	
	for(i = position.x; i < xSearchWidth; ++i)
		for(j = position.y; j < ySearchHeight; ++j)
			chunksList.push(currentOffset.addPos(new Vector2(i,j)));

	addSearchResult(getClusterFromChunksList(chunksList));

	return true;
}

function addSearchResult(cluster)
{
	cluster.setDistance(cluster.getCenter().distance(SearchOrigin));	
	TempResults.push(cluster);
}

function addPendingResults()
{
	if(TempResults.length)
	{
		ResultsArray = ResultsArray.concat(TempResults);
		TempResults.length = 0;
		ResultsArray.sort((a, b) => a.distanceFromOrigin - b.distanceFromOrigin);
		
		let duplicateIndices = [];
		for(let i = 0; i < ResultsArray.length - 1; ++i)
			if(ResultsArray[i].equals(ResultsArray[i+1]))
				duplicateIndices.push(i);
			
		for(let i = duplicateIndices.length-1; i >= 0; --i)
			ResultsArray.splice(duplicateIndices[i], 1);
		
		ShouldUpdateSearchResults = true;
		DrawCanvasRequested = true;
	}
}

function getClusterFromChunksList(chunks)
{	
	let minPos = new Vector2(0, 0);
	let maxPos = new Vector2(0, 0);
	
	for(let i = 0; i < chunks.length; ++i)
	{
		if(i == 0)
		{
			minPos = chunks[i];
			maxPos = chunks[i];
		}
		else
		{
			minPos = minPos.min(chunks[i]);
			maxPos = maxPos.max(chunks[i]);
		}
	}
	
	minPos = minPos.mul(CHUNK_SIZE);
	maxPos = maxPos.add(1).mul(CHUNK_SIZE);
	
	return new Cluster(minPos, maxPos);
}

function processCurrentKhalooph()
{
	if (Math.abs(CurrentKhalooph.start.x) + Math.abs(CurrentKhalooph.end.x) > (SearchDistance / CHUNK_SIZE)
	|| Math.abs(CurrentKhalooph.start.y) + Math.abs(CurrentKhalooph.end.y) > (SearchDistance / CHUNK_SIZE)
	|| ResultsArray.length >= SearchResultLimit
	|| StopSearchRequested)
	{
		onSearchStopped();
		return;
	}

	let chunksArray = [];
	let khaloophSize = getKhaloophSize();
	for(let i = 0; i < khaloophSize; i++)
		chunksArray[i] = [];

	let khaloophStart = CurrentKhalooph.start;
	for(let i = khaloophStart.x; i < CurrentKhalooph.end.x; ++i)
	{		
		let idx1 = i - khaloophStart.x;
		for(let j = khaloophStart.y; j < CurrentKhalooph.end.y; ++j)
		{
			if(isSlimeChunk(Seed, i, j) ^ ReverseSearch)
				chunksArray[idx1][j-khaloophStart.y] = true;
			else
				chunksArray[idx1][j-khaloophStart.y] = false;
		}
	}
	
	checkForClusters(chunksArray);
	addPendingResults();

	if(DrawCanvasRequested)
	{
		drawCanvas();
		DrawCanvasRequested = false;
	}
	
	CurrentChunksChecked += (khaloophSize - ClusterSizeOverlap) ** 2;
	document.getElementById("chunksCheckedValue").innerHTML = Intl.NumberFormat().format(CurrentChunksChecked);

	setNextKhalooph();
	setTimeout(processCurrentKhalooph, 0);
}

function setInitialKhalooph(startPosition)
{
	let khaloophSize = getKhaloophSize();
	CurrentKhalooph.start = startPosition.sub(Math.floor(khaloophSize / 2));
	CurrentKhalooph.end = CurrentKhalooph.start.add(khaloophSize);
}

function setNextKhalooph()
{
	let khaloophSize = getKhaloophSize();
	CurrentKhalooph.start = CurrentKhalooph.start.addPos(CurrentDirection.direction.mul(khaloophSize - ClusterSizeOverlap));
	CurrentKhalooph.end = CurrentKhalooph.start.add(khaloophSize);

	KhaloophsTillDirectionChange--;
	if(KhaloophsTillDirectionChange == 0)
	{
		CurrentDirection.setNextDirection();

		if(ShouldIncreaseDistance)
			CurrentKhaloophsSideDistance++;

		KhaloophsTillDirectionChange = CurrentKhaloophsSideDistance;
		ShouldIncreaseDistance = !ShouldIncreaseDistance;
	}
}

function resetValues()
{
	CurrentDirection = new Direction();
	CurrentKhaloophsSideDistance = 1;
	KhaloophsTillDirectionChange = CurrentKhaloophsSideDistance;
	ShouldIncreaseDistance = false;
	ResultsArray.length = 0;
	CurrentPage = 0;
	CurrentChunksChecked = 0;
	
	document.getElementById("searchStats").setAttribute("hidden", "");
	document.getElementById("timeElapsedValue").innerHTML = "00:00:00";
	document.getElementById("resultsFoundValue").innerHTML = "0";
	document.getElementById("chunksCheckedValue").innerHTML = "0";

	ShouldUpdateSearchResults = true;
	updateSearchResults();
	drawCanvas();
}

function searchButtonPressed()
{
	if(SearchInProgress)
		StopSearchRequested = true;
	else
		startSearch();
}

function startSearch()
{
	resetValues();
	SearchInProgress = true;
	
	document.getElementById("searchStats").removeAttribute("hidden");
	document.getElementById("searchInProgress").innerHTML = "Search in progress...";
	document.getElementById("resultsFoundValue").innerHTML = `0`;
	document.getElementById("chunksCheckedValue").innerHTML = `0`;
	
	ClusterSize.x = parseInt(document.getElementById("xcluster").value);
	ClusterSize.y = parseInt(document.getElementById("ycluster").value);
	ClusterSize = ClusterSize.clamp(1, 100);
	document.getElementById("xcluster").value = ClusterSize.x;
	document.getElementById("ycluster").value = ClusterSize.y;
	
	SearchResultLimit = parseInt(document.getElementById("searchlimit").value);
	SearchResultLimit = Math.min(1000, SearchResultLimit);
	document.getElementById("searchlimit").value = SearchResultLimit;
	
	SearchDistance = parseInt(document.getElementById("searchdistance").value);
	ReverseSearch = document.getElementById("reverseSearch").checked;

	let clusterSizeMin = Math.min(ClusterSize.x, ClusterSize.y);
	let clusterSizeMax = Math.max(ClusterSize.x, ClusterSize.y);

	ClusterSizeOverlap = clusterSizeMax - 1;
	KhaloophSearchMin = getKhaloophSize() - clusterSizeMin + 1;

	SearchOrigin = PinPosition;

	console.log("Start Search: Seed: " + Seed + " StartX: " + PinPosition.x + " StartY: " + PinPosition.y);
	setInitialKhalooph(PinPosition.div(CHUNK_SIZE).toInt());
	processCurrentKhalooph();

	updateInputs();
	
	const currentDate = new Date();
	StartSearchTimestamp = parseInt(currentDate.getTime() / 1000);
	LastUpdateTimestamp = StartSearchTimestamp;
	updateTimeElapsed();
	UpdateSearchStatsIntervalId = setInterval(updateSearchInfo, 0);
}

function updateSearchInfo()
{
	if(ShouldStopSearchTimer)
	{
		ShouldStopSearchTimer = false;
		clearInterval(UpdateSearchStatsIntervalId);
		return;
	}
	
	const currentDate = new Date();
	const timestamp = currentDate.getTime();
	
	let newTimeStamp = parseInt(currentDate.getTime() / 1000);
	if(LastUpdateTimestamp != newTimeStamp)
	{
		LastUpdateTimestamp = newTimeStamp;
		updateTimeElapsed();
	}
}

function updateTimeElapsed()
{
	let timeElapsed = LastUpdateTimestamp - StartSearchTimestamp;
	let hours = parseInt(timeElapsed / 3600);
	timeElapsed -= hours * 3600;
	let minutes = parseInt(timeElapsed / 60);
	timeElapsed -= minutes * 60;
	let timeElapsedString = (hours < 10 ? "0" : "") + hours + ":" + (minutes < 10 ? "0" : "") + minutes + ":" + (timeElapsed < 10 ? "0" : "") + timeElapsed;
	document.getElementById("timeElapsedValue").innerHTML = timeElapsedString;

	let searchInProgressText = "Search in progress";
	for(let i = 0; i < timeElapsed % 4; ++i)
		searchInProgressText += ".";

	document.getElementById("searchInProgress").innerHTML = searchInProgressText;
}

function onSearchStopped()
{	
	ResultsArray.length = Math.min(SearchResultLimit, ResultsArray.length);
	ShouldUpdateSearchResults = true;
	updateSearchResults();
	drawCanvas();
	
	SearchInProgress = false;
	StopSearchRequested = false;
	updateInputs();
	console.log("Search Stopped/Finished");

	document.getElementById("searchInProgress").innerHTML = "Search completed!";
	
	ShouldStopSearchTimer = true;
}

function updateInputs()
{
	let searchButton = document.getElementById("searchButton");
	let searchInputs = [];
	
	searchInputs.push(document.getElementById("xcluster"));
	searchInputs.push(document.getElementById("ycluster"));
	searchInputs.push(document.getElementById("searchlimit"));
	searchInputs.push(document.getElementById("searchdistance"));
	searchInputs.push(document.getElementById("reverseSearch"));
	searchInputs.push(document.getElementById("seed"));
	searchInputs.push(document.getElementById("randomSeed"));
	
	if(SearchInProgress)
	{
		searchButton.value = "STOP";
		searchInputs.forEach(element => element.setAttribute("disabled", ""));

		if(IsBedrock)
			document.getElementById("javaEdition").setAttribute("class", "alternateVersion");
		else
			document.getElementById("bedrockEdition").setAttribute("class", "alternateVersion");
	}
	else
	{
		searchButton.value = "GO";
		searchInputs.forEach(element => element.removeAttribute("disabled"));

		if(IsBedrock)
			document.getElementById("javaEdition").setAttribute("class", "alternateVersion selectable");
		else
			document.getElementById("bedrockEdition").setAttribute("class", "alternateVersion selectable");
	}

	onInputChanged();
}

function setRandomSeed()
{
	document.getElementById("seed").value = parseInt(Math.random() * Number.MAX_SAFE_INTEGER);
	onSeedChanged();
}

function onInputChanged()
{
	localStorage.setItem("seed", document.getElementById("seed").value);
	localStorage.setItem("xcluster", document.getElementById("xcluster").value);
	localStorage.setItem("ycluster", document.getElementById("ycluster").value);
	localStorage.setItem("searchdistance", document.getElementById("searchdistance").value);
	localStorage.setItem("searchlimit", document.getElementById("searchlimit").value);
	localStorage.setItem("invertedsearch", document.getElementById("reverseSearch").checked);
	localStorage.setItem("isBedrock", IsBedrock);
}

String.prototype.hashCode = function() 
{
	let hash = 0;

	if (this.length === 0)
		return hash;

    for (let i = 0; i < this.length; i++)
	{
		const char = this.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash |= 0; // Convert to 32bit integer
	}

	return hash;
};

function switchToJava()
{
	if(SearchInProgress)
		return;

	IsBedrock = false;

	document.getElementById("javaEdition").setAttribute("class", "selectedVersion");
	document.getElementById("bedrockEdition").setAttribute("class", "alternateVersion selectable");
	
	document.getElementById("seed").removeAttribute("disabled");
	document.getElementById("randomSeed").removeAttribute("disabled");

	resetValues();
	onInputChanged();
}

function switchToBedrock()
{
	if(SearchInProgress)
		return;

	IsBedrock = true;

	document.getElementById("javaEdition").setAttribute("class", "alternateVersion selectable");
	document.getElementById("bedrockEdition").setAttribute("class", "selectedVersion");
	
	document.getElementById("seed").setAttribute("disabled", "");
	document.getElementById("randomSeed").setAttribute("disabled", "");
	
	resetValues();
	onInputChanged();
}