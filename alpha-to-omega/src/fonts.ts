import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// All fonts ship in /public so renders work offline (all SIL OFL).
loadFont({ family: "Cinzel", url: staticFile("fonts/Cinzel-700.woff2"), weight: "700" });
loadFont({ family: "EB Garamond", url: staticFile("fonts/EBGaramond-greek.woff2"), weight: "400" });
loadFont({ family: "Cormorant Garamond", url: staticFile("fonts/CormorantGaramond-500-italic.woff2"), weight: "500", style: "italic" });
