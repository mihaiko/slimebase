const MERSENNE_MAX_CACHE_VALUE = 10000000;
var MersenneCache: { [key: number]: number } = {};
var MersenneCacheSize = 0;
class MersenneChopped
{
    mt: Uint32Array;
    mti: number;
    mag01: Uint32Array;

    constructor()
    {
        this.mt = new Uint32Array(624);
        this.mti = 625;
        this.mag01 = new Uint32Array([0x0, 0x9908b0df]);
    }

    random_int(seed:number):number
    {
      const cached = MersenneCache[seed];
  
      if (cached !== undefined)
        return cached;

        this.mt[0] = seed >>> 0;
        for (this.mti = 1; this.mti < 398; this.mti++) 
        {
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

function umul32_lo(a:number, b:number):number
{
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
function isSlimeChunkBedrock(x:number, y:number)
{
    let x_uint = x >>> 0;
    let z_uint = y >>> 0;
    let seed = umul32_lo(x_uint, 0x1f1f1f1f) ^ z_uint;
    let n = mt.random_int(seed);
    return n % 10 == 0;
}