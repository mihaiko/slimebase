class ChunksCache
{
    head:Vector2;
    reference:Vector2;
    size:Vector2;
    matrix:boolean[][];
    constructor(size:Vector2, reference:Vector2)
    {
        this.size = size.copy();
        this.reference = reference.copy();
        this.head = new Vector2(0, 0);
        this.matrix = [];
        for(let i = 0; i < size.y; ++i)
        {
            let row:boolean[] = [];
            for(let j = 0; j < size.x; ++j)
            {
                row.push(false);
            }
            this.matrix.push(row);
        }
    }
}