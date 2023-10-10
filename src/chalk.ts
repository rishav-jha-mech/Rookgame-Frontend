const colours = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underscore: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",
    
    fg: {
        black: "\x1b[30m",
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        white: "\x1b[37m",
        crimson: "\x1b[38m" // Scarlet
    },
    bg: {
        black: "\x1b[40m",
        red: "\x1b[41m",
        green: "\x1b[42m",
        yellow: "\x1b[43m",
        blue: "\x1b[44m",
        magenta: "\x1b[45m",
        cyan: "\x1b[46m",
        white: "\x1b[47m",
        crimson: "\x1b[48m"
    }
};
const Prettify  = (data: any) => JSON.stringify(data, null, 4);

// 🟠 LOGS WITH BACKGROUND COLOURS
export const PrintWarning = (data: any) => console.log(colours.bg.blue, colours.fg.white, Prettify(data), colours.reset);
export const PrintError = (data: any) => console.log(colours.bg.red, colours.fg.white, Prettify(data), colours.reset);
export const PrintSuccess = (data: any) => console.log(colours.bg.green, colours.fg.white, Prettify(data), colours.reset);
export const PrintInfo = (data: any) => console.log(colours.bg.cyan, colours.fg.white, Prettify(data), colours.reset);

// ⚪ LOGS WITH NO BACKGROUND COLOURS
export const kPrint = (input: any) => console.log(input);
export const kWarn = (input: any) => console.warn(input);
export const kError = (input: any) => console.error(input);
export const kPrettyPrint = (input: any) => console.log(JSON.stringify(input,null,4));

// 🟢 LOGS WITH FONT COLORS BUT NO BACKGROUND COLOURS
export const kRed = (data: any) => console.log(colours.bg.black, colours.fg.red, Prettify(data), colours.reset);
export const kGreen = (data: any) => console.log(colours.bg.black, colours.fg.green, Prettify(data), colours.reset);
export const kYellow = (data: any) => console.log(colours.bg.black, colours.fg.yellow, Prettify(data), colours.reset);
export const kBlue = (data: any) => console.log(colours.bg.black, colours.fg.blue, Prettify(data), colours.reset);
export const kMagenta = (data: any) => console.log(colours.bg.black, colours.fg.magenta, Prettify(data), colours.reset);
export const kCyan = (data: any) => console.log(colours.bg.black, colours.fg.cyan, Prettify(data), colours.reset);
export const kWhite = (data: any) => console.log(colours.bg.black, colours.fg.white, Prettify(data), colours.reset);
export const kCrimson = (data: any) => console.log(colours.bg.black, colours.fg.crimson, Prettify(data), colours.reset);

// 🟣 LOGS FOR SPECIFIC PURPOSES
export const PrintRedux = (data: any) => console.log(colours.bg.black, colours.fg.yellow,'REDUX ' + Prettify(data) + '\n', colours.reset);
export const PrintBg = (data: any) => console.log(colours.bg.black, colours.fg.cyan, Prettify(data), colours.reset);