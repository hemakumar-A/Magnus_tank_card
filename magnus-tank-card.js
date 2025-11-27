class MagnusTankCard extends HTMLElement {

  setConfig(config) {
    if (!config.tank_entity || !config.battery_entity) {
      throw new Error("tank_entity & battery_entity are required");
    }

    this.config = config;
    this.attachShadow({ mode: "open" });

    const style = document.createElement("style");
    style.textContent = `
      .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 25px;
        padding: 10px;
      }

      .block {
        position: relative;
        width: 260px;
      }

      .block.battery {
        width: 200px;
      }

      .lottie-container {
        width: 100%;
      }

      .label {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 38px;
        font-weight: bold;
        color: white;
        text-shadow: 0px 0px 12px black;
        z-index: 9999;
        pointer-events: none;
      }

      .label.small {
        font-size: 28px;
      }
    `;
    this.shadowRoot.appendChild(style);

    const root = document.createElement("div");
    root.className = "container";

    // Tank block
    const tankBlock = document.createElement("div");
    tankBlock.className = "block";

    this.tankLabel = document.createElement("div");
    this.tankLabel.className = "label";
    this.tankLabel.textContent = "--%";

    this.tankContainer = document.createElement("div");
    this.tankContainer.className = "lottie-container";

    tankBlock.appendChild(this.tankContainer);
    tankBlock.appendChild(this.tankLabel);
    root.appendChild(tankBlock);

    // Battery block
    const batteryBlock = document.createElement("div");
    batteryBlock.className = "block battery";

    this.batteryLabel = document.createElement("div");
    this.batteryLabel.className = "label small";
    this.batteryLabel.textContent = "--%";

    this.batteryContainer = document.createElement("div");
    this.batteryContainer.className = "lottie-container";

    batteryBlock.appendChild(this.batteryContainer);
    batteryBlock.appendChild(this.batteryLabel);
    root.appendChild(batteryBlock);

    this.shadowRoot.appendChild(root);

    // Load Lottie script & animations
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.9.6/lottie.min.js";

    script.onload = () => {
      this.tankAnimation = lottie.loadAnimation({
        container: this.tankContainer,
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: "/hacsfiles/magnus-tank-card/animations/tank.json"   // Hardcoded JSON
      });

      this.batteryAnimation = lottie.loadAnimation({
        container: this.batteryContainer,
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: "/hacsfiles/magnus-tank-card/animations/battery.json" // Hardcoded JSON
      });
    };

    this.shadowRoot.appendChild(script);
  }

  set hass(hass) {
    const tankState = hass.states[this.config.tank_entity];
    if (tankState && this.tankAnimation) {
      const percent = parseFloat(tankState.state);
      const targetFrame = (percent / 100) * this.tankAnimation.totalFrames;
      this.tankAnimation.goToAndStop(targetFrame, true);
      this.tankLabel.textContent = `${percent}%`;
    }

    const batteryState = hass.states[this.config.battery_entity];
    if (batteryState && this.batteryAnimation) {
      const percent = parseInt(batteryState.state);
      const targetFrame = (percent / 100) * this.batteryAnimation.totalFrames;
      this.batteryAnimation.goToAndStop(targetFrame, true);
      this.batteryLabel.textContent = `${percent}%`;
    }
  }

  getCardSize() {
    return 6;
  }
}

customElements.define("magnus-tank-card", MagnusTankCard);
