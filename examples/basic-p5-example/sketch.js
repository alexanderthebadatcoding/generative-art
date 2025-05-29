// Initialize variables we'll need later
let plexMono;

/*
 * Preload
 * Load any assets we need for the sketch
 */

function getHexColorsFromAddress(address) {
  // Validate address format
  if (
    typeof address !== "string" ||
    !address.startsWith("0x") ||
    address.length !== 42
  ) {
    throw new Error("Invalid Ethereum address");
  }

  // Strip the "0x" prefix
  const hex = address.slice(2).toLowerCase();

  // Extract 3 color codes (6 hex characters each)
  const color1 = `#${hex.slice(4, 10)}`;
  const color2 = `#${hex.slice(13, 19)}`;
  const color3 = `#${hex.slice(24, 30)}`;
  const color4 = `#${hex.slice(34, 42)}`;

  return [color1, color2, color3, color4];
}

function preload() {
  plexMono = loadFont("fonts/IBMPlexMono-Regular.ttf");
}

const address = hl.tx.walletAddress; // Example: "0xabc1234567890def1234567890abcdef12345678"
const colors = getHexColorsFromAddress(address);
// console.log(colors);
/*
 * Setup
 */
function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noLoop();
  frameRate(60);
  pixelDensity(2);

  // Create an object defining the traits of our token
  let traits = {
    "Minting Wallet": hl.tx.walletAddress,
    "Color 1": colors[0],
    "Color 2": colors[1],
    "Color 3": colors[2],
    "Color 4": colors[3],
  };

  // Set these traits so Highlight can read them
  hl.token.setTraits(traits);
  console.log(traits);

  // Also set a name and description for this token
  hl.token.setName(`Example token #${hl.tx.tokenId}`);
  hl.token.setDescription(
    `This is an token generated as part of an example project for using hl-gen.js. It has 3 rectangles with colors based on the minting address. The first color is ${color[0]}, teh second color is ${color[1]} and the third color is ${color[2]}. The timestamp of the mint was ${hl.tx.timestamp}. The minting wallet address was ${hl.tx.walletAddress}`
  );
}

/*
 * Draw
 */
function draw() {
  noStroke();
  background("#393939");

  if (hl.context.studioMode === true) {
    // No need to do anything we just want the background color to show
    return;
  }

  let margin = width * 0.1;
  let gap = width * 0.02;
  let rectWidth = (width - margin * 2 - gap * (4 - 1)) / 4;

  // Draw the rectangles, using the numberOfRectangles we generated earlier
  for (let n = 0; n < 4; n++) {
    fill(colors[n]);
    rect(
      margin + rectWidth * n + gap * n,
      height * 0.1,
      rectWidth,
      height * 0.8,
      height * 0.01
    );
  }

  // Draw text
  let textColor = "white";
  fill(textColor);
  textFont(plexMono);
  textSize(width * 0.02);
  textAlign(CENTER, CENTER);

  // Reference the minting wallet address with hl.tx.mintingWalletAddress
  text(`Minted by ${hl.tx.walletAddress}`, 0, 0, width, height * 0.1);

  // Reference the token ID with hl.tx.tokenId
  text(
    `Colors: ${colors[0]}, ${colors[1]}, ${colors[2]}, ${colors[3]}`,
    0,
    height * 0.9,
    width,
    height * 0.1
  );

  // Now that we're done drawing all the rectangles, trigger the preview image
  hl.token.capturePreview();
}

/*
 * Window resize
 */
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

/*
 * Keyboard shortcuts for saving, redrawing, etc.
 */
function keyTyped() {
  switch (key) {
    case "s":
      saveCanvas();
      break;
    case "r":
      redraw();
      break;
  }
}
