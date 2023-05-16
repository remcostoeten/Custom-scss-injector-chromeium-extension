import { basicSetup, EditorState, EditorView } from "@codemirror/basic-setup";
import { css } from "@codemirror/lang-css";
import { oneDark } from "@codemirror/theme-one-dark";
import { keymap } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";

const cssEditor = document.getElementById("cssEditor");

const startState = EditorState.create({
  extensions: [
    basicSetup,
    keymap(defaultKeymap),
    oneDark,
    css(),
  ],
});

const view = new EditorView({
  state: startState,
  parent: cssEditor,
});

// Luister naar wijzigingen in de editor en stuur de CSS naar de content script
view.updateListener.addHandler((update) => {
  if (update.docChanged) {
    const css = view.state.doc.toString();
    chrome.storage.sync.set({ savedCSS: css });
  }
});

// Haal opgeslagen CSS op en plaats het in de editor
chrome.storage.sync.get("savedCSS", ({ savedCSS }) => {
  view.dispatch({
    changes: { from: 0, to: view.state.doc.length, insert: savedCSS || "" },
  });
});
