class MyComponent extends HTMLElement {
  static get observedAttributes() {
    return ["something"];
  }

  constructor() {
    super();

    this._toggleMode = this._toggleMode.bind(this);

    this.modes = ["light", "dark"];
    this.currentMode = 0;
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }

        #container {
          padding: 1rem;
        }

        .light {
          background: #efefef;
          color: black;
        }

        .dark {
          background: black;
          color: white;
        }
      </style>
      <div id="container">
        <h2>My Component</h2>
        <slot></slot>
        <button>Toggle <span id="mode">${this.modes[this.currentMode + 1]}</span> mode</button>
      </div>
    `;

    this.container = this.shadowRoot.querySelector("#container");
    this.modeEl = this.shadowRoot.querySelector("#mode");
    this.button = this.shadowRoot.querySelector("button");
    this.button.addEventListener("click", this._toggleMode);
    this.container.classList.add(this.modes[this.currentMode]);
  }

  connectedCallback() {
    console.log("I'm connected");
  }

  disconnectedCallback() {
    console.log("I'm disconnected");
    this.button.removeEventListener("click", this._toggleMode);
  }

  attributeChangedCallback(attr, oldVal, newVal) {
    console.log(`attr: ${attr} and value: ${newVal}`);
  }

  _toggleMode() {
    this.modeEl.textContent = this.modes[this.currentMode];
    this.container.classList.remove(this.modes[this.currentMode]);
    
    this.currentMode = this.currentMode === 1 ? 0 : 1;
    this.container.classList.add(this.modes[this.currentMode]);
  }
}

customElements.define("my-component", MyComponent);