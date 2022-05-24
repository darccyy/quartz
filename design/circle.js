const chars = " .*rvoqkXQ#&%$@M";
const w = 32;
const h = Math.floor(w / 2);
const r = 0.6;

for (var y = 0; y < h; y++) {
  for (var x = 0; x < w; x++) {
    process.stdout.write(
      chars[
        Math.round(
          Math.min(
            1,
            1 -
              Math.sqrt(
                ((x / (w / 2 - 1) - 1) ** 2 + (y / (h / 2 - 1) - 1) ** 2) / 2,
              ) /
                r,
          ) *
            (chars.length - 1),
        )
      ] || " ",
    );
  }
  process.stdout.write("\n");
}
