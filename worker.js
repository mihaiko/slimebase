class Vector2 {
    constructor(x, y) { this.x = x; this.y = y; }
    add(value) { return new Vector2(this.x + value, this.y + value); }
    sub(value) { return new Vector2(this.x - value, this.y - value); }
    mul(value) { return new Vector2(this.x * value, this.y * value); }
    div(value) { return new Vector2(this.x / value, this.y / value); }
    mod(value) { return new Vector2(this.x % value, this.y % value); }
    abs() { return new Vector2(Math.abs(this.x), Math.abs(this.y)); }
    floor() { return new Vector2(Math.floor(this.x), Math.floor(this.y)); }
    ceil() { return new Vector2(Math.ceil(this.x), Math.ceil(this.y)); }
    round() { return new Vector2(Math.round(this.x), Math.round(this.y)); }
    copy() { return new Vector2(this.x, this.y); }
    isZero() { return this.equals(new Vector2(0, 0)); }
    length() { return this.distance(new Vector2(0, 0)); }
    normalize() { return new Vector2(this.x / this.length(), this.y / this.length()); }
    equals(other) { return this.x == other.x && this.y == other.y; }
    addPos(other) { return new Vector2(this.x + other.x, this.y + other.y); }
    subPos(other) { return new Vector2(this.x - other.x, this.y - other.y); }
    modPos(other) { return new Vector2(this.x.mod(other.x), this.y.mod(other.y)); }
    min(other) { return new Vector2(Math.min(this.x, other.x), Math.min(this.y, other.y)); }
    max(other) { return new Vector2(Math.max(this.x, other.x), Math.max(this.y, other.y)); }
    clamp(minValue, maxValue) { return this.min(new Vector2(maxValue, maxValue)).max(new Vector2(minValue, minValue)); }
    distance(other) { return Math.sqrt((this.x - other.x) ** 2 + (this.y - other.y) ** 2); }
    distanceSquared(other) { return (this.x - other.x) ** 2 + (this.y - other.y) ** 2; }
    slope(other) { return (other.y - this.y) / (other.x - this.x); }
    rotate(degrees) {
        const radians = (degrees * Math.PI) / 180;
        const cosTheta = Math.cos(radians);
        const sinTheta = Math.sin(radians);
        const newX = this.x * cosTheta - this.y * sinTheta;
        const newY = this.x * sinTheta + this.y * cosTheta;
        return new Vector2(newX, newY);
    }
}

class Khalooph {
    constructor() {
        this.start = new Vector2(0, 0);
        this.end = new Vector2(0, 0);
    }
}

class Cluster {
    constructor(minPos, maxPos) {
        this.topLeft = minPos;
        this.bottomRight = maxPos;
        this.distanceFromOrigin = 0;
        this.center = (this.topLeft).addPos(this.bottomRight).div(2);
        this.distanceFromViewportSquared = 0;
    }
    equals(other) { return this.topLeft == other.topLeft && this.bottomRight == other.bottomRight; }
    setDistance(distance) { this.distanceFromOrigin = distance; }
    getCenter() { return this.center.copy(); }
}

class Random {
    constructor(seed) {
        this.seed = (seed ^ 0x5deece66dn) & 281474976710655n;
    }
    next() {
        this.seed = (this.seed * 0x5deece66dn + 0xbn) & 281474976710655n;
        return this.seed >> 17n;
    }
    nextInt() {
        let r = this.next();
        for (let u = r; u - (r = u % 10n) < -9n; u = this.next())
            ;
        return r == 0n;
    }
}

const MERSENNE_MAX_CACHE_VALUE = 1000000;
var MersenneCache = {};
var MersenneCacheSize = 0;
class MersenneChopped {
    constructor() {
        this.mt = new Uint32Array(624);
        this.mti = 625;
        this.mag01 = new Uint32Array([0x0, 0x9908b0df]);
    }
    random_int(seed) {
        const cached = MersenneCache[seed];
        if (cached !== undefined)
            return cached;
        this.mt[0] = seed >>> 0;
        for (this.mti = 1; this.mti < 398; this.mti++) {
            var s = this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30);
            this.mt[this.mti] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253) + this.mti;
            this.mt[this.mti] >>>= 0;
        }
        var y;
        var kk;
        y = (this.mt[0] & 0x80000000) | (this.mt[0 + 1] & 0x7fffffff);
        y = this.mt[397] ^ (y >>> 1) ^ this.mag01[y & 0x1];
        y ^= (y >>> 11);
        y ^= (y << 7) & 0x9d2c5680;
        y ^= (y << 15) & 0xefc60000;
        y ^= (y >>> 18);
        const result = y >>> 0;
        MersenneCache[seed] = result;
        MersenneCacheSize++;
        if (MersenneCacheSize > MERSENNE_MAX_CACHE_VALUE)
        {
            MersenneCache = {};
            MersenneCacheSize = 0;
        }
        return result;
    }
}
function umul32_lo(a, b) {
    let a00 = a & 0xFFFF;
    let a16 = a >>> 16;
    let b00 = b & 0xFFFF;
    let b16 = b >>> 16;
    let c00 = a00 * b00;
    let c16 = c00 >>> 16;
    c16 += a16 * b00;
    c16 &= 0xFFFF;
    c16 += a00 * b16;
    let lo = c00 & 0xFFFF;
    let hi = c16 & 0xFFFF;
    return ((hi << 16) | lo) >>> 0;
}
var mt = new MersenneChopped();
function isSlimeChunkBedrock(x, y) {
    let x_uint = x >>> 0;
    let z_uint = y >>> 0;
    let seed = umul32_lo(x_uint, 0x1f1f1f1f) ^ z_uint;
    let n = mt.random_int(seed);
    return n % 10 == 0;
}

var KhaloophSize = 0;
var CurrentKhalooph = new Khalooph();
var ReverseSearch = false;
var Seed = 0n;
var IsBedrock = false;
var KhaloophSearchMin = 0;
var ClusterSize = new Vector2(0, 0);
var ChunkSize = 0;
var SearchOrigin = new Vector2(0, 0);

var Results = [];

function isSlimeChunk(x, z)
{
	if(IsBedrock)
		return isSlimeChunkBedrock(x, z);

	let rngGen = new Random(Seed + BigInt(Math.imul(Math.imul(x, x), 4987142)) + BigInt(Math.imul(x, 5947611)) + BigInt(Math.imul(z, z)) * 4392871n + BigInt(Math.imul(z, 389711)) ^ 987234911n);
	return rngGen.nextInt();
}

function checkForClusters(chunksArray)
{
	for(let i = 0; i < KhaloophSearchMin; ++i)
	{
		for(let j = 0; j < KhaloophSearchMin; ++j)
		{
			checkClusterFromPosition(new Vector2(i, j), chunksArray);
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

	for(let i = position.x; i < xSearchHeight; ++i)
	{
		if(i >= KhaloophSize)
			return false;

		for(let j = position.y; j < ySearchWidth; ++j)
			if (j >= KhaloophSize || !chunksArray[i][j])
				return false;
	}
	
	let chunksList = []

	let currentOffset = new Vector2(CurrentKhalooph.start.x, CurrentKhalooph.start.y);
	
	for(let i = position.x; i < xSearchHeight; ++i)
		for(let j = position.y; j < ySearchWidth; ++j)
			chunksList.push(currentOffset.addPos(new Vector2(i,j)));

	addSearchResult(getClusterFromChunksList(chunksList));

	return true;
}

function checkClusterHeightWidth(position, chunksArray)
{
	let xSearchWidth = position.x + ClusterSize.x;
	let ySearchHeight = position.y + ClusterSize.y;

	for(let i = position.x; i < xSearchWidth; ++i)
	{
		if(i >= KhaloophSize)
			return false;

		for(let j = position.y; j < ySearchHeight; ++j)
			if(j >= KhaloophSize || !chunksArray[i][j])
				return false;
	}
	
	let chunksList = []
	
	let currentOffset = new Vector2(CurrentKhalooph.start.x, CurrentKhalooph.start.y);
	
	for(let i = position.x; i < xSearchWidth; ++i)
		for(let j = position.y; j < ySearchHeight; ++j)
			chunksList.push(currentOffset.addPos(new Vector2(i,j)));

	addSearchResult(getClusterFromChunksList(chunksList));

	return true;
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
	
	minPos = minPos.mul(ChunkSize);
	maxPos = maxPos.add(1).mul(ChunkSize);
	
	return new Cluster(minPos, maxPos);
}

function addSearchResult(cluster)
{
	cluster.setDistance(cluster.getCenter().distance(SearchOrigin));	
	Results.push(cluster);
}

function workKhalooph()
{
    let chunksArray = [];
	for(let i = 0; i < KhaloophSize; i++)
		chunksArray[i] = [];

	let khaloophStart = CurrentKhalooph.start;
	for(let i = khaloophStart.x; i < CurrentKhalooph.end.x; ++i)
	{		
		let idx1 = i - khaloophStart.x;
		for(let j = khaloophStart.y; j < CurrentKhalooph.end.y; ++j)
		{
			if(isSlimeChunk(i, j) !== ReverseSearch)
				chunksArray[idx1][j-khaloophStart.y] = true;
			else
				chunksArray[idx1][j-khaloophStart.y] = false;
		}
	}
    
	checkForClusters(chunksArray);
}

self.onmessage = (e) => {
    CurrentKhalooph = e.data.khalooph;
    KhaloophSize = e.data.khaloopSize;
    ReverseSearch = e.data.reverseSearch;
    Seed = e.data.seed;
    IsBedrock = e.data.isBedrock;
    KhaloophSearchMin = e.data.khaloophSearchMin;
    ClusterSize = e.data.clusterSize;
    ChunkSize = e.data.chunkSize;
    SearchOrigin = e.data.searchOrigin;
    Results.length = 0;

    workKhalooph();

    this.postMessage({ id: e.data.id, results: Results });
};