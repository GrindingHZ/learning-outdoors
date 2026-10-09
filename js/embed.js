// Embeds every chart on the page. Each chart is a separate, human-readable
// Vega-Lite JSON file in js/, and all of them share the config in js/config.json.
(async function () {
  const charts = [
    "c01_isotype", "c02_choropleth", "c03_symbol_map", "c04_small_multiple_maps",
    "c05_ranked_bars", "c06_heatmap", "c07_butterfly", "c08_dumbbell_adults_children",
    "c09_bump", "c10_dumbbell_places", "c11_world_choropleth", "c12_parallel_coordinates",
    "c13_slope", "c14_arrows", "c15_scatter"
  ];

  const config = await fetch("js/config.json").then(r => r.json());
  const opts = { actions: false, renderer: "svg", config };

  const results = await Promise.all(charts.map(async name => {
    const el = document.getElementById(name.slice(0, 3));
    if (!el) return null;
    try {
      const res = await vegaEmbed(el, "js/" + name + ".json", opts);
      return res.view;
    } catch (err) {
      console.error("Could not render " + name, err);
      return null;
    }
  }));

  // Charts with width "container" follow the page width; re-run them when it changes.
  const views = results.filter(Boolean);
  let timer;
  window.addEventListener("resize", () => {
    clearTimeout(timer);
    timer = setTimeout(() => views.forEach(v => v.resize().runAsync()), 150);
  });
})();
