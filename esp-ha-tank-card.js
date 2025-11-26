class LottieTankCard extends HTMLElement {

  setConfig(config) {
    if (!config.entity) {
      throw new Error("entity is required (water level %)");
    }
    if (!config.json_url) {
      throw new Error("json_url is required (path to Lottie file)");
    }

    this.config = config;
    this.attachShadow({ mode: "open" });

    const wrapper = document.createElement("div");
    wrapper.id = "lottie-wrapper";
    wrapper.style.width = "260px";
    wrapper.style.margin = "auto";
    wrapper.style.position = "relative";

    const label = document.createElement("div");
    label.id = "percent-label";
    label.style.position = "absolute";
    label.style.top = "50%";
    label.style.left = "50%";
    label.style.transform = "translate(-50%, -50%)";
    label.style.fontSize = "38px";
    label.style.fontWeight = "bold";
    label.style.color = "#ffffff";
    label.style.textShadow = "0px 0px 10px black";
    wrapper.appendChild(label);

    this.shadowRoot.appendChild(wrapper);

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.9.6/lottie.min.js";
    script.onload = () => {
      this.animation = lottie.loadAnimation({
        container: wrapper,
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: this.config.json_url,
      });
    };

    this.shadowRoot.appendChild(script);
  }

  set hass(hass) {
    const state = hass.states[this.config.entity];
    if (!state || !this.animation) return;

    const percent = parseFloat(state.state);
    const maxFrame = this.animation.totalFrames;
    const frame = (percent / 100) * maxFrame;

    this.animation.goToAndStop(frame, true);

    this.shadowRoot.getElementById("percent-label").textContent = `${percent}%`;
  }

  getCardSize() {
    return 4;
  }
}

customElements.define("lottie-tank-card", LottieTankCard);
