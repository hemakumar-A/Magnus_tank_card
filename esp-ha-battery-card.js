class LottieBatteryCard extends HTMLElement {

  setConfig(config) {
    if (!config.entity) {
      throw new Error("entity is required (battery %)");
    }
    if (!config.json_url) {
      throw new Error("json_url is required (path to Lottie file)");
    }

    this.config = config;
    this.attachShadow({ mode: "open" });

    const container = document.createElement("div");
    container.id = "battery-wrapper";
    container.style.width = "200px";
    container.style.margin = "auto";
    container.style.position = "relative";

    const text = document.createElement("div");
    text.id = "battery-label";
    text.style.position = "absolute";
    text.style.top = "50%";
    text.style.left = "50%";
    text.style.transform = "translate(-50%, -50%)";
    text.style.fontSize = "30px";
    text.style.fontWeight = "bold";
    text.style.color = "#ffffff";
    text.style.textShadow = "2px 2px 8px black";
    container.appendChild(text);

    this.shadowRoot.appendChild(container);

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.9.6/lottie.min.js";
    script.onload = () => {
      this.animation = lottie.loadAnimation({
        container,
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: this.config.json_url,
      });
    };

    this.shadowRoot.appendChild(script);
  }

  set hass(hass) {
    const stateObj = hass.states[this.config.entity];
    if (!stateObj || !this.animation) return;

    const percent = parseInt(stateObj.state);
    const maxFrame = this.animation.totalFrames;
    const targetFrame = (percent / 100) * maxFrame;

    this.animation.goToAndStop(targetFrame, true);

    this.shadowRoot.getElementById("battery-label").textContent = `${percent}%`;
  }

  getCardSize() {
    return 2;
  }
}

customElements.define("lottie-battery-card", LottieBatteryCard);
