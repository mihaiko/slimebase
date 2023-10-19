const PADDING_PERCENTAGE = 20;

class ChunksCache
{
    head:Vector2;
    reference:Vector2;
    size:Vector2;
    matrix:boolean[][];

    constructor(minPos:Vector2, maxPos:Vector2)
    {
        this.matrix = [];
        this.recomputeFull(minPos, maxPos);
    }
    
    recomputeFull(minPos:Vector2, maxPos:Vector2)
    {
        this.size = this.getSizeFromBounds(minPos, maxPos);
        this.reference = this.getStartPointFromLowerBounds(minPos, maxPos);
        this.head = new Vector2(0, 0);
        this.recompute();
    }

    recompute()
    {
        this.matrix.length = 0;
        for(let i = this.reference.y; i < this.reference.y + this.size.y; ++i)
        {
            let row:boolean[] = [];
            for(let j = this.reference.x; j < this.reference.x + this.size.x; ++j)
                row.push(isSlimeChunk(j, i));
            this.matrix.push(row);
        }
    }

    getSizeFromBounds(minPos:Vector2, maxPos:Vector2)
    {
        let displayedSize:Vector2 = maxPos.subPos(minPos);
        return displayedSize.addPos(displayedSize.mul(PADDING_PERCENTAGE/100).floor());
    }

    getStartPointFromLowerBounds(minPos:Vector2, maxPos:Vector2)
    {
        let displayedSize:Vector2 = maxPos.subPos(minPos);
        return minPos.subPos(displayedSize.mul(PADDING_PERCENTAGE/200)).floor();
    }

    moveTo(minPos:Vector2, maxPos:Vector2)
    {
        if(!this.getSizeFromBounds(minPos, maxPos).equals(this.size))
        {
            this.recomputeFull(minPos, maxPos);
            return;
        }

        let newReferencePos:Vector2 = this.getStartPointFromLowerBounds(minPos, maxPos);
        let offset:Vector2 = newReferencePos.subPos(this.reference);

        if(offset.isZero())
            return;

        this.reference = newReferencePos;
        this.head = this.head.addPos(offset).modPos(this.size);

        let offsetToCheck = offset.mul(-1);

        for(let i = 0; i < this.size.x; ++i)
        {
            let xIndex = (i + this.head.x) % this.size.x;
            
            //let xInNoChangeZone:boolean = true;
            //if(offsetToCheck.x > 0 && i > this.size.x - offsetToCheck.x)
            //    xInNoChangeZone = false;
            //else if (offsetToCheck.x < 0 && i < offset.x)
            //    xInNoChangeZone = false;

            for(let j = 0; j < this.size.y; ++j)
            {
                let yIndex = (j + this.head.y) % this.size.y;

                //let yInNoChangeZone:boolean = true;
                //if(offsetToCheck.y > 0 && j > this.size.y - offsetToCheck.y)
                //    yInNoChangeZone = false;
                //else if (offsetToCheck.y < 0 && j < offset.y)
                //    yInNoChangeZone = false;

                    //if(xInNoChangeZone && yInNoChangeZone)
                        //continue;
                
                let point = (new Vector2(xIndex, yIndex)).subPos(this.head).modPos(this.size);
                this.matrix[yIndex][xIndex] = isSlimeChunk(point.x + this.reference.x, point.y + this.reference.y);
            }
        }
    }

    isSlimeChunk(x:number, y:number)
    {
        let index = (new Vector2(x, y)).subPos(this.reference).addPos(this.head).modPos(this.size);
        return this.matrix[index.y][index.x];
    }
}