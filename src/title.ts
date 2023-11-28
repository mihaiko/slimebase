const myFont = new FontFace('freestyleScript', 'url(FREESCPT.TTF)');

myFont.load().then((font) => {
  document.fonts.add(font);
});

const TEXT_ARRAY = [
    [0,1,1,1, 0, 1,0,0, 0, 1, 0, 1,0,0,0,1, 0, 1,1,1,1, 0,0,0,0, 1,1,1,0, 0, 0,1,1,0, 0, 0,1,1,1, 0, 1,1,1,1],
    [1,0,0,0, 0, 1,0,0, 0, 1, 0, 1,1,0,1,1, 0, 1,0,0,0, 0,0,0,0, 1,0,0,1, 0, 1,0,0,1, 0, 1,0,0,0, 0, 1,0,0,0],
    [0,1,1,0, 0, 1,0,0, 0, 1, 0, 1,0,1,0,1, 0, 1,1,1,0, 0,0,0,0, 1,1,1,0, 0, 1,1,1,1, 0, 0,1,1,0, 0, 1,1,1,0],
    [0,0,0,1, 0, 1,0,0, 0, 1, 0, 1,0,0,0,1, 0, 1,0,0,0, 0,0,0,0, 1,0,0,1, 0, 1,0,0,1, 0, 0,0,0,1, 0, 1,0,0,0],
    [1,1,1,0, 0, 1,1,1, 0, 1, 0, 1,0,0,0,1, 0, 1,1,1,1, 0,0,0,0, 1,1,1,0, 0, 1,0,0,1, 0, 1,1,1,0, 0, 1,1,1,1]
]

const COLORS_ARRAY = ["#44bb33", "#33aa33", "#229933"];
const BORDER_COLORS_ARRAY = ["#338833", "#227722", "#115522"];
const HONEY_COLOR = "#EBA937";

var TITLE_TOTAL_SIZE = new Vector2(CANVAS_TOTAL_SIZE.x, 182);
const Y_TITLE_OFFSET = 10;
const PIXEL_SIZE = 20;
const PIXEL_SPACING = 4;
const INNER_PIXEL = PIXEL_SIZE - PIXEL_SPACING;
const UPDATE_INTERVAL = 1200;
const HONEY_CHANCE = 1000;

var TEXT_WIDTH = 0;
var TEXT_OFFSET = 0;

function getTitleContext()
{
	return  (<HTMLCanvasElement>document.getElementById("myTitle")).getContext("2d");
}

function createTitle()
{
	onWindowResizeTitle();
    setInterval(drawTitle, UPDATE_INTERVAL);

	window.addEventListener('resize', function(event) {
		onWindowResizeTitle();
	}, true);
}

function onWindowResizeTitle()
{
	TITLE_TOTAL_SIZE = new Vector2(CANVAS_TOTAL_SIZE.x, 182);
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
    if(document.fonts.check("64px freestyleScript"))
    {
        const AUTHOR_OFFSET = new Vector2(250, 160);
        let ctx = getTitleContext();
        ctx.fillStyle = COLORS_ARRAY[1];
        let position = new Vector2(TITLE_TOTAL_SIZE.x / 2 + AUTHOR_OFFSET.x, AUTHOR_OFFSET.y);
        ctx.shadowColor = "black";
        ctx.shadowBlur = 4;
        ctx.textAlign = "left";
        ctx.font = "64px freestyleScript";
        ctx.fillText("by Wicked", position.x, position.y);
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = "#33885599";
        ctx.strokeText("by Wicked", position.x, position.y);

        ctx.shadowBlur = 0;
    }
    else
    {
        setTimeout(drawAuthor, 0);
    }
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

            let position = new Vector2(i * PIXEL_SIZE + TEXT_OFFSET, j * PIXEL_SIZE + Y_TITLE_OFFSET);

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

            let position = new Vector2(i * PIXEL_SIZE + TEXT_OFFSET, j * PIXEL_SIZE + Y_TITLE_OFFSET);

            if(TEXT_ARRAY[j][i])
            {
                ctx.fillRect(position.x, position.y, INNER_PIXEL, INNER_PIXEL);
                ctx.strokeRect(position.x, position.y, INNER_PIXEL, INNER_PIXEL);
            }
        }
    }
}