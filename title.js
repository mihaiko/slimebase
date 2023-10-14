const TEXT_ARRAY = [
    [0,1,1,1, 0, 1,0,0, 0, 1, 0, 1,0,0,0,1, 0, 1,1,1,1, 0,0,0,0, 1,1,1,0, 0, 0,1,1,0, 0, 0,1,1,1, 0, 1,1,1,1],
    [1,0,0,0, 0, 1,0,0, 0, 1, 0, 1,1,0,1,1, 0, 1,0,0,0, 0,0,0,0, 1,0,0,1, 0, 1,0,0,1, 0, 1,0,0,0, 0, 1,0,0,0],
    [0,1,1,0, 0, 1,0,0, 0, 1, 0, 1,0,1,0,1, 0, 1,1,1,0, 0,0,0,0, 1,1,1,0, 0, 1,1,1,1, 0, 0,1,1,0, 0, 1,1,1,0],
    [0,0,0,1, 0, 1,0,0, 0, 1, 0, 1,0,0,0,1, 0, 1,0,0,0, 0,0,0,0, 1,0,0,1, 0, 1,0,0,1, 0, 0,0,0,1, 0, 1,0,0,0],
    [1,1,1,0, 0, 1,1,1, 0, 1, 0, 1,0,0,0,1, 0, 1,1,1,1, 0,0,0,0, 1,1,1,0, 0, 1,0,0,1, 0, 1,1,1,0, 0, 1,1,1,1]
]

const SLIME_PIXEL_ART = [
	[
	[0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
	[0,0,0,1,1,1,0,0,0,0,1,1,1,0,0,0],
	[0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0],
	[0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0],
	[1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
	[1,0,0,0,0,1,1,0,0,1,1,0,0,0,0,1],
	[1,0,0,0,0,1,1,0,0,1,1,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
	[0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0],
	[0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0],
	[0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0]
	],
	[
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
	[0,0,0,1,1,1,0,0,0,0,1,1,1,0,0,0],
	[0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0],
	[0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0],
	[1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
	[1,0,0,0,0,1,1,0,0,1,1,0,0,0,0,1],
	[1,0,0,0,0,1,1,0,0,1,1,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
	[0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0],
	[0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0],
	[0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0]
	],
	[
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
	[0,0,0,1,1,1,0,0,0,0,1,1,1,0,0,0],
	[0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0],
	[0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0],
	[1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,1,1,0,0,1,1,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
	[0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0],
	[0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0],
	[0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0]
	]
]

const ROLLING_TEXT = false;
const SLIME_ANIM = false;

const COLORS_ARRAY = ["#44bb33", "#33aa33", "#229933"];
const BORDER_COLORS_ARRAY = ["#338833", "#227722", "#115522"];
const HONEY_COLOR = "#EBA937";
const ANIM_COLORS = ["#55dd44", "#44cc44"];

var TITLE_TOTAL_SIZE = new Vector2(CANVAS_TOTAL_SIZE.x, 182);
const Y_TITLE_OFFSET = 10;
const PIXEL_SIZE = 20;
const PIXEL_SPACING = 4;
const INNER_PIXEL = PIXEL_SIZE - PIXEL_SPACING;
var LOOP_INTERVAL = TITLE_TOTAL_SIZE.x / PIXEL_SIZE;
const UPDATE_INTERVAL = 1200;
const HONEY_CHANCE = 1000;

const SLIME_ART_PIXEL_SIZE = 5;
const SLIME_ART_SMALL = SLIME_PIXEL_ART[2];
const SLIME_ART_MID = SLIME_PIXEL_ART[1];
const SLIME_ART_LARGE = SLIME_PIXEL_ART[0];
const AINIMATION_FRAMES = 4;
const ANIM_UPDATE_INTERVAL = 600;

var CurrentAnimation = 0;
var TITLE_OFFSET = 0;
var TEXT_WIDTH = 0;
var TEXT_OFFSET = 0;

function getTitleContext()
{
	return document.getElementById("myTitle").getContext("2d");
}

function createTitle()
{
	onWindowResizeTitle();
    setInterval(drawTitle, UPDATE_INTERVAL);

    if(SLIME_ANIM)
    {
        drawSlimeAnimation();
        setInterval(drawSlimeAnimation, ANIM_UPDATE_INTERVAL);
    }
	
	window.addEventListener('resize', function(event) {
		onWindowResizeTitle();
	}, true);
}

function onWindowResizeTitle()
{
	TITLE_TOTAL_SIZE = new Vector2(CANVAS_TOTAL_SIZE.x, 182);
	LOOP_INTERVAL = TITLE_TOTAL_SIZE.x / PIXEL_SIZE;
	TEXT_WIDTH = TEXT_ARRAY[0].length * PIXEL_SIZE;
	TEXT_OFFSET = (TITLE_TOTAL_SIZE.x - TEXT_WIDTH) / 2;
	
	let	canvasDiv = document.getElementById("title_div");
	canvasDiv.innerHTML = '<canvas id="myTitle" width="' + TITLE_TOTAL_SIZE.x + '" height="' + TITLE_TOTAL_SIZE.y + '"></canvas>';
	
	let ctx = getTitleContext();
    ctx.fillStyle = CANVAS_BACKGROUND;
    ctx.fillRect(0, 0, TITLE_TOTAL_SIZE.x, TITLE_TOTAL_SIZE.y);
	
    drawTitleShadow();
	drawAuthor();
}

function drawAuthor()
{
	const AUTHOR_OFFSET = new Vector2(250, 160);
	let ctx = getTitleContext();
	ctx.fillStyle = COLORS_ARRAY[1];
	let position = new Vector2(TITLE_TOTAL_SIZE.x / 2 + AUTHOR_OFFSET.x, AUTHOR_OFFSET.y);
	ctx.shadowColor = "black";
    ctx.shadowBlur = 4;
	ctx.textAlign = "left";
	ctx.font = "64px Freestyle Script";
	ctx.fillText("by Wicked", position.x, position.y);
	ctx.lineWidth = 0.5;
	ctx.strokeStyle = "#33885599";
	ctx.strokeText("by Wicked", position.x, position.y);

	ctx.shadowBlur = 0;
}

function getSlimeColor()
{
    if((Math.floor(Math.random()*HONEY_CHANCE)) % HONEY_CHANCE == 0)
        return HONEY_COLOR;

    return COLORS_ARRAY[Math.abs(Math.floor(Math.random()*COLORS_ARRAY.length)) % COLORS_ARRAY.length];
}

function getBorderColor()
{
    return BORDER_COLORS_ARRAY[Math.abs(Math.floor(Math.random()*BORDER_COLORS_ARRAY.length)) % BORDER_COLORS_ARRAY.length];
}

function getAnimColor()
{
	return ANIM_COLORS[Math.abs(Math.floor(Math.random()*ANIM_COLORS.length)) % ANIM_COLORS.length];
}

function getNextAnimation()
{
	CurrentAnimation++;
	CurrentAnimation %= AINIMATION_FRAMES;
	
	switch(CurrentAnimation)
	{
		case 0:
			return SLIME_ART_SMALL;
		case 1:
		case 3:
			return SLIME_ART_MID;
		case 2:
			return SLIME_ART_LARGE;
	}
}

function drawTitleShadow()
{
    let ctx = getTitleContext();
    ctx.shadowColor = "black";
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    for(let i = 0; i < TEXT_ARRAY[0].length; ++i)
    {
        for(let j = 0; j < TEXT_ARRAY.length; ++j)
        {
            ctx.fillStyle = getSlimeColor();
            ctx.strokeStyle = getBorderColor();

            let position = new Vector2((i + TITLE_OFFSET) * PIXEL_SIZE + TEXT_OFFSET, j * PIXEL_SIZE + Y_TITLE_OFFSET);
			if(ROLLING_TEXT)
				position.x %= TITLE_TOTAL_SIZE.x;

            if(TEXT_ARRAY[j][i])
            {
                ctx.fillRect(position.x, position.y, INNER_PIXEL, INNER_PIXEL);
                ctx.strokeRect(position.x, position.y, INNER_PIXEL, INNER_PIXEL);
            }
        }
    }
    
    ctx.shadowColor = "black";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
}

function drawTitle()
{
    let ctx = getTitleContext();
    for(let i = 0; i < TEXT_ARRAY[0].length; ++i)
    {
        for(let j = 0; j < TEXT_ARRAY.length; ++j)
        {
            ctx.fillStyle = getSlimeColor();
            ctx.strokeStyle = getBorderColor();

            let position = new Vector2((i + TITLE_OFFSET) * PIXEL_SIZE + TEXT_OFFSET, j * PIXEL_SIZE + Y_TITLE_OFFSET);
			if(ROLLING_TEXT)
				position.x %= TITLE_TOTAL_SIZE.x;

            if(TEXT_ARRAY[j][i])
            {
                ctx.fillRect(position.x, position.y, INNER_PIXEL, INNER_PIXEL);
                ctx.strokeRect(position.x, position.y, INNER_PIXEL, INNER_PIXEL);
            }
        }
    }
	if(ROLLING_TEXT)
	{
		TITLE_OFFSET++;
		TITLE_OFFSET %= LOOP_INTERVAL;
	}
}

function drawSlimeAnimation()
{	
	let ctx = getTitleContext();
	let currentAnimation = getNextAnimation();
	
	let xOffset = TITLE_TOTAL_SIZE.x /2  + TEXT_WIDTH /2 + 20;
	let yOffset = TITLE_TOTAL_SIZE.y - currentAnimation.length * SLIME_ART_PIXEL_SIZE;
	
	
    ctx.fillStyle = CANVAS_BACKGROUND;
    ctx.fillRect(xOffset-1, yOffset-1, currentAnimation[0].length* SLIME_ART_PIXEL_SIZE +2, currentAnimation.length* SLIME_ART_PIXEL_SIZE +2);
	
	for(let currentColumn = 0; currentColumn < currentAnimation.length; ++currentColumn)
	{
		for(let currentLine = 0; currentLine < currentAnimation[currentColumn].length; ++currentLine)
		{
			ctx.fillStyle = getAnimColor();
			
			let position = new Vector2(currentLine * SLIME_ART_PIXEL_SIZE, currentColumn * SLIME_ART_PIXEL_SIZE);
			if(currentAnimation[currentColumn][currentLine])
            {
                ctx.fillRect(position.x + xOffset, position.y + yOffset, SLIME_ART_PIXEL_SIZE, SLIME_ART_PIXEL_SIZE);
            }
		}
	}
}