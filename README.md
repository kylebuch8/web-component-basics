# Web Component Basics

## 1. Create your first web component
Register a component called `my-component`.

```
class My Component extends HTMLElement {

}

customElements.define("my-component", MyComponent);
```

## 2. Learn about the different callbacks
### constructor
Do any initialization of your component here.
- Set up a shadow root
- Set initial values or state
- Add event listeners
- Fetch data

### connectedCallback
This is called any time a component is attached to the DOM. It is also called any time the component is moved in the DOM. Here we're free to read the inspect the light DOM and do anything we need to do with it


### disconnectedCallback
This is called any time a component is removed from the DOM. Use this callback to clean up anything that needs it. For example: disconnect event listeners, send an event, etc.

### attributeChangedCallback
This is called anytime an attribute that is being observed is added, removed or updates.

To observe an attribute, add this inside your class definition.

```
static get observedAttributes() {
  return [];
}
```

Any string you put inside of the array will be observed.

```
static get observedAttributes() {
  return ["something"];
}
```

In this case, the attribute `something` will be observed and any time this attribute is added, removed or updated, the `attributeChangedCallback` will be fired.

To see which attribute changed, what the old value was and what the new value is, you can add an `attributeChangedCallback` in your class definition.

```
attributeChangedCallback(attr, oldVal, newVal) {
  console.log(`attr: ${attr} and value: ${newVal}`);
}
```

## 2. Create a template for your component
Create a shadow root and populate it with a basic template. We do this inside the constructor.

```
this.attachShadow({ mode: "open" });
this.shadowRoot.innerHTML = `
  <h2>My Component</h2>
`;
```

### Create a style block to encapsulate the styles for the component

```
this.shadowRoot.innerHTML = `
  <style>
    :host {
      display: block;
      background: #efefef;
      color: black;
      padding: 1rem;
    }
  </style>
  <h2>My Component</h2>
`;
```

### Create a slot for content
Update your component to have a slot to allow light DOM content into it.

```
this.shadowRoot.innerHTML = `
  <style>
    :host {
      display: block;
      background: #efefef;
      color: black;
      padding: 1rem;
    }
  </style>
  <h2>My Component</h2>
  <slot></slot>
`;
```

## 3. Add some interactivity to the component
Let's add some functionality that allows the user to toggle between a light mode and a dark mode.

First we can add some state to our constructor.
```
this.modes = ["light", "dark"];
this.currentMode = 0;
```

Next we can update our template to include a few additional elements.
```
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
```

Note that since our template is a template literal, we can include information about our state in the template.

Now we need to add a few query selectors to our constructor so we can update our component when the toggle button is clicked.

```
this.container = this.shadowRoot.querySelector("#container");
this.modeEl = this.shadowRoot.querySelector("#mode");
this.button = this.shadowRoot.querySelector("button");
this.button.addEventListener("click", this._toggleMode);
this.container.classList.add(this.modes[this.currentMode]);
```

In this code, we select our container, the mode span and the button. Also, we add a click listener to our button that calls `this._toggleMode` and we need to make sure we set that up.

After all of the callback functions, we can add our `_toggleMode` function.

```
_toggleMode() {
  this.modeEl.textContent = this.modes[this.currentMode];
  this.container.classList.remove(this.modes[this.currentMode]);
  
  this.currentMode = this.currentMode === 1 ? 0 : 1;
  this.container.classList.add(this.modes[this.currentMode]);
}
```

All this does is update the mode from one mode to the other and we update our template to reflect the changes.

One last thing that we need to do to hook this up. We need to bind `this` to the `_toggleMode` function in our constructor function. The reason for this is that the click event takes the context of the element that is being clicked rather than the context of the entire component itself.

So in the constructor, we need to add this.
```
this._toggleMode = this._toggleMode.bind(this);
```

The very last thing that we need to do is clean up after ourselves. Since we add a click listener in our constructor, we need to remove the click event when our component's disconnectedCallback is called.

```
disconnectedCallback() {
  this.button.removeEventListener("click", this._toggleMode);
}
```
