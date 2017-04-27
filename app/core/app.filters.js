/**
 * HTML to Plain Text filter
 */
app.filter('htmlToPlainText', function () {
    return function (input) {
        return input ? String(input).replace(/<[^>]+>/gm, '') : '';
    };
});

/**
 * ArrayBuffer to UTF-8 String
 * https://gist.github.com/pascaldekloe/62546103a1576803dade9269ccf76330
 */
app.filter('arrayBufferToUTF8String', function () {
    return function (array) {
        var bytes = new Uint8Array(array);
        var s = '';
        var i = 0;
        while (i < bytes.length) {
            var c = bytes[i++];
            if (c > 127) {
                if (c > 191 && c < 224) {
                    if (i >= bytes.length) throw 'UTF-8 decode: incomplete 2-byte sequence';
                    c = (c & 31) << 6 | bytes[i] & 63;
                } else if (c > 223 && c < 240) {
                    if (i + 1 >= bytes.length) throw 'UTF-8 decode: incomplete 3-byte sequence';
                    c = (c & 15) << 12 | (bytes[i] & 63) << 6 | bytes[++i] & 63;
                } else if (c > 239 && c < 248) {
                    if (i+2 >= bytes.length) throw 'UTF-8 decode: incomplete 4-byte sequence';
                    c = (c & 7) << 18 | (bytes[i] & 63) << 12 | (bytes[++i] & 63) << 6 | bytes[++i] & 63;
                } else throw 'UTF-8 decode: unknown multibyte start 0x' + c.toString(16) + ' at index ' + (i - 1);
                ++i;
            }

            if (c <= 0xffff) s += String.fromCharCode(c);
            else if (c <= 0x10ffff) {
                c -= 0x10000;
                s += String.fromCharCode(c >> 10 | 0xd800);
                s += String.fromCharCode(c & 0x3FF | 0xdc00);
            } else throw 'UTF-8 decode: code point 0x' + c.toString(16) + ' exceeds UTF-16 reach';
        }
        return s;
    };
});