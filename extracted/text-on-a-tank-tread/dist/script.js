import React, { createContext, StrictMode, useContext, useState } from "https://esm.sh/react";
import { createRoot } from "https://esm.sh/react-dom/client";
const TextOnTreadContext = createContext(undefined);
const TextOnTreadProvider = ({ children, value }) => {
    const [text] = useState(value);
    return (React.createElement(TextOnTreadContext.Provider, { value: { text } }, children));
};
createRoot(document.getElementById("root")).render(React.createElement(StrictMode, null,
    React.createElement(TextOnTreadProvider, { value: "RESILIENCE" },
        React.createElement(TextOnTread, null))));
function TextOnTread() {
    const duration = 8000; // in ms
    const treadLength = 44.57; // from "https://esm.sh/$treadLength" in SCSS
    const treadFragments = 80;
    const treadFragmentWidth = treadLength / treadFragments;
    const backTreadArray = [];
    const frontTreadArray = [];
    for (let f = 0; f < treadFragments; ++f) {
        const backKey = `back-${f}`;
        const frontKey = `front-${f}`;
        const percent = f / treadFragments;
        const moveX = f * treadFragmentWidth;
        backTreadArray.push(React.createElement(TextOnTreadFragment, { key: backKey, delay: -duration + (percent * duration), duration: duration, moveX: -moveX, width: treadFragmentWidth }));
        frontTreadArray.push(React.createElement(TextOnTreadFragment, { key: frontKey, delay: -duration + ((percent - 0.5) * duration), duration: duration, moveX: moveX, width: treadFragmentWidth }));
    }
    return (React.createElement("div", { className: "tot" },
        React.createElement(TextOnTreadLayer, { layerFragments: frontTreadArray }),
        React.createElement(TextOnTreadLayer, { layerFragments: backTreadArray, ariaHidden: true })));
}
function TextOnTreadFragment({ delay, duration, moveX, width }) {
    const context = useContext(TextOnTreadContext);
    if (!context) {
        throw new Error("`TextOnTreadFragment` must be used within `TextOnTreadProvider`");
    }
    const { text } = context;
    const treadStyle = {
        animationDuration: `${duration}ms`,
        animationDelay: `${delay}ms`,
        width: `calc(${width}rem + 1px)` // extra 1px for bleed
    };
    const windowStyle = {
        transform: `translateX(${moveX}rem)`
    };
    return (React.createElement("div", { className: "tot__tread", style: treadStyle },
        React.createElement("div", { className: "tot__tread-window", "aria-hidden": "true", "data-text": text, style: windowStyle })));
}
function TextOnTreadLayer({ layerFragments, ariaHidden }) {
    const context = useContext(TextOnTreadContext);
    if (!context) {
        throw new Error("`TextOnTreadLayer` must be used within `TextOnTreadProvider`");
    }
    const { text } = context;
    return (React.createElement("div", { className: "tot__layer", "aria-hidden": ariaHidden },
        text,
        layerFragments));
}