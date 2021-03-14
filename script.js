const colorThief = new ColorThief();
const img = document.getElementById('output');

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
  
function rgbToHex(arr) {
    return "#" + componentToHex(arr[0]) + componentToHex(arr[1]) + componentToHex(arr[2]);
}

const BASE62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
var BASE_MAP = new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 255, 255, 255, 255, 255, 255, 255, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 255, 255, 255, 255, 255, 255, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]);
function base62Encode(source) {
    if (source.length === 0) {
        return "";
    }
    let zeroes = 0;
    let length = 0;
    let pbegin = 0;
    let pend = source.length;
    while (pbegin !== pend && source[pbegin] === 0) {
        pbegin++;
        zeroes++;
    }
    let size = ((pend - pbegin) * 1.3435902316563355 + 1) >>> 0;
    let b58 = new Uint8Array(size);
    while (pbegin !== pend) {
        let carry = source[pbegin];
        let i = 0;
        for (let it1 = size - 1; (carry !== 0 || i < length) && (it1 !== -1); it1--,
        i++) {
            carry += (256 * b58[it1]) >>> 0;
            b58[it1] = (carry % 62) >>> 0;
            carry = (carry / 62) >>> 0;
        }
        if (carry !== 0) {
            throw new Error("Non-zero carry");
        }
        length = i;
        pbegin++;
    }
    let it2 = size - length;
    while (it2 !== size && b58[it2] === 0) {
        it2++;
    }
    let str = BASE62.charAt(0).repeat(zeroes);
    for (; it2 < size; ++it2) {
        str += BASE62.charAt(b58[it2]);
    }
    return str;
}

const PaletteFlags = {
    Index: 1,
    GridCoords: 2,
    Rotation: 4
};

function stringifyPalette(palette) {
    const hasRotation = palette.pans.some(item=>item.rotation > 0);
    const hasGridCoords = palette.pans.some(item=>item.gridOffsetX > 0 || item.gridOffsetY > 0);
    const hasIndex = palette.pans.some(item=>item.slotIndex > 0);
    let flags = 0;
    if (hasIndex) {
        flags |= PaletteFlags.Index;
    }
    if (hasRotation) {
        flags |= PaletteFlags.Rotation;
    }
    if (hasGridCoords) {
        flags |= PaletteFlags.GridCoords;
    }
    const values = [flags, palette.palette].concat(palette.pans.map(pan=>{
        const data = [pan.id];
        if (hasIndex) {
            data.push(pan.slotIndex);
        }
        if (hasGridCoords) {
            data.push(pan.gridOffsetX);
            data.push(pan.gridOffsetY);
        }
        if (hasRotation) {
            data.push(pan.rotation);
        }
        return data;
    }
    ));
    const bytes = values.flat().flatMap(value=>encodeNumber(value));
    return base62Encode(bytes);
}

function encodeNumber(value) {
    let bytes = [];
    if (value === 0) {
        return [0];
    }
    while (value > 0) {
        let byte = value & 0x7f;
        value >>= 7;
        if (value > 0) {
            byte |= 0x80;
        }
        bytes.push(byte);
    }
    return bytes;
}

funnylist = [
    {name: "Aerial", id: "11864"},
    {name: "Aether", id: "7033"},
    {name: "Afterglow", id: "65"},
    {name: "Altitude", id: "14810"},
    {name: "Arcade", id: "29178"},
    {name: "Arsenic", id: "7071"},
    {name: "Ascension", id: "76"},
    {name: "Backdraft", id: "77"},
    {name: "Calcination", id: "7072"},
    {name: "Capslock", id: "29175"},
    {name: "Cascade", id: "11851"},
    {name: "Catatonic", id: "7073"},
    {name: "Celestial", id: "14850"},
    {name: "Corrosion", id: "35389"},
    {name: "Covet", id: "35379"},
    {name: "Crossroads", id: "14849"},
    {name: "Cryptic", id: "35387"},
    {name: "Cycle", id: "9065"},
    {name: "Daybreak", id: "17423"},
    {name: "Deceit", id: "35381"},
    {name: "Defiance", id: "7074"},
    {name: "Delirium", id: "7075"},
    {name: "Descent", id: "14858"},
    {name: "Echo", id: "11861"},
    {name: "Eden", id: "14848"},
    {name: "Enigma", id: "11863"},
    {name: "Ephemeral", id: "9070"},
    {name: "Equilibrium", id: "9068"},
    {name: "Equinox", id: "11862"},
    {name: "Esteem", id: "35384"},
    {name: "Euphoria", id: "7076"},
    {name: "Fahrenheit", id: "78"},
    {name: "Frantic", id: "7078"},
    {name: "Frequency", id: "29169"},
    {name: "Habitat", id: "9073"},
    {name: "Helios", id: "11866"},
    {name: "Hollow", id: "35382"},
    {name: "Imago", id: "9069"},
    {name: "Inertia", id: "35383"},
    {name: "Insomnia", id: "17420"},
    {name: "Kindlewood", id: "79"},
    {name: "Limbo", id: "35378"},
    {name: "Lithium", id: "35386"},
    {name: "Loom", id: "17419"},
    {name: "Lucid", id: "17425"},
    {name: "Mainframe", id: "29179"},
    {name: "Midway", id: "14852"},
    {name: "Mirage", id: "14859"},
    {name: "Nightcall", id: "29176"},
    {name: "Nocturnal", id: "9077"},
    {name: "Numb", id: "17421"},
    {name: "Nymph", id: "9052"},
    {name: "Outrun", id: "29171"},
    {name: "Overdrive", id: "29177"},
    {name: "Petrichor", id: "11865"},
    {name: "Pilgrim", id: "14853"},
    {name: "Proxy", id: "29173"},
    {name: "Quicksave", id: "29174"},
    {name: "Rebirth", id: "9066"},
    {name: "Recluse", id: "9071"},
    {name: "Relapse", id: "3769"},
    {name: "Release", id: "3755"},
    {name: "Remedy", id: "3756"},
    {name: "Remission", id: "3754"},
    {name: "Replica", id: "29170"},
    {name: "Revolve", id: "35385"},
    {name: "Rise from the Ashes", id: "80"},
    {name: "Rocket Fuel", id: "81"},
    {name: "Runaway", id: "35380"},
    {name: "Sequence", id: "29172"},
    {name: "Serene", id: "7079"},
    {name: "Spawn", id: "9067"},
    {name: "Spirit", id: "7080"},
    {name: "Stargaze", id: "17424"},
    {name: "Surge", id: "14855"},
    {name: "Symbiosis", id: "9074"},
    {name: "Syncope", id: "17418"},
    {name: "Synth", id: "29180"},
    {name: "Terminus", id: "14856"},
    {name: "Torment", id: "17422"},
    {name: "Transmutation", id: "7081"},
    {name: "Trespass", id: "14847"},
    {name: "Undone", id: "35388"},
    {name: "Unearthed", id: "82"},
    {name: "Unity", id: "7077"},
    {name: "Venom", id: "83"},
    {name: "Vertex", id: "9072"},
    {name: "Vertigo", id: "17426"},
    {name: "Void", id: "11860"},
    {name: "Yonder", id: "14857"}
]

img.addEventListener('load', (event) => {
  onLoad();
});

function onLoad() {
    imageRGB = colorThief.getPalette(img);
    mainPalette = {palette: 7084, pans: []}
    x = 0
    y = 0
    for (const i in imageRGB) {
        if (x < 6) {
            if (i != 0) {
                x += 2
            }
        } else {
            y += 2
            x = 0
        }
        imageHex = rgbToHex(imageRGB[i])
        var names = colornamer(imageHex, {pick: ['lethal']})
        var obj = funnylist.find(o => o.name == names.lethal[0]['name']);
        mainPalette.pans.push({id: parseInt(obj['id'], 10), slotIndex: 0, gridOffsetX: x, gridOffsetY: y, rotation: 0})
        
    }
    finalResult = stringifyPalette(mainPalette)
    finalResult = "https://www.lethalcosmetics.com/palette-designer/?pd=" + finalResult
    document.getElementById('link')
    link.href = finalResult
    link.innerHTML = finalResult
}
