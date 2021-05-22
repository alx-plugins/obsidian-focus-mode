import { Plugin } from "obsidian";
import { ALxFocusModeSettingTab } from "settings";
import "./style/main.css";
import "./style/left-ribbon.css";
interface ALxFocusModeSettings {
  hideLeftRibbonEntirely: boolean;
}

const DEFAULT_SETTINGS: ALxFocusModeSettings = {
  hideLeftRibbonEntirely: true,
};

export default class ALxFocusMode extends Plugin {
  settings: ALxFocusModeSettings;

  focusModeActive = false;

  maximisedClass = "maximised";
  focusModeClass = "focus-mode";
  hideLeftRibbonEntirelyClass = "hide-ribbon";

  enableSuperFocusMode() {
    // @ts-ignore
    this.app.workspace.rootSplit.containerEl.toggleClass(
      this.maximisedClass,
      // @ts-ignore
      !this.app.workspace.rootSplit.containerEl.hasClass(this.maximisedClass),
    );

    // @ts-ignore
    this.app.workspace.onLayoutChange();

    if (!document.body.classList.contains(this.focusModeClass)) {
      document.body.classList.add(this.focusModeClass);
    }

    // @ts-ignore
    this.app.workspace.leftSplit.collapse();
    // @ts-ignore
    this.app.workspace.rightSplit.collapse();

    this.focusModeActive = true;
  }
  enableFocusMode() {
    if (
      // @ts-ignore
      this.app.workspace.rootSplit.containerEl.hasClass(this.maximisedClass)
    ) {
      // @ts-ignore
      this.app.workspace.rootSplit.containerEl.removeClass(this.maximisedClass);
      // @ts-ignore
      this.app.workspace.onLayoutChange();
    }

    document.body.classList.toggle(
      this.focusModeClass,
      !document.body.classList.contains(this.focusModeClass),
    );

    // @ts-ignore
    this.app.workspace.leftSplit.collapse();
    // @ts-ignore
    this.app.workspace.rightSplit.collapse();

    this.focusModeActive = true;
  }
  disableFocusMode() {
    if (
      // @ts-ignore
      this.app.workspace.rootSplit.containerEl.hasClass(this.maximisedClass)
    ) {
      // @ts-ignore
      this.app.workspace.rootSplit.containerEl.removeClass(this.maximisedClass);
      // @ts-ignore
      this.app.workspace.onLayoutChange();
    }

    if (document.body.classList.contains(this.focusModeClass)) {
      document.body.classList.remove(this.focusModeClass);
    }

    this.focusModeActive = false;
  }

  toggleFocusMode(superFocus: boolean = false) {
    if (superFocus) {
      this.enableSuperFocusMode();
    } else if (this.focusModeActive) {
      this.disableFocusMode();
    } else {
      this.enableFocusMode();
    }
  }

  async onload() {
    console.log("Loading Focus Mode plugin ...");

    await this.loadSettings();

    if (
      this.settings.hideLeftRibbonEntirely &&
      !document.body.classList.contains(this.focusModeClass)
    ) {
      document.body.classList.add(this.hideLeftRibbonEntirelyClass);
    }

    this.addSettingTab(new ALxFocusModeSettingTab(this.app, this));

    this.addRibbonIcon(
      "enter",
      "Toggle Focus Mode (Shift + Click to show active pane only)",
      (event): void => {
        this.toggleFocusMode(event.shiftKey);
      },
    );

    this.addCommand({
      id: "toggle-focus-mode",
      name: "Toggle Focus Mode",
      callback: () => {
        this.toggleFocusMode();
      },
      hotkeys: [{ modifiers: ["Alt", "Mod"], key: "Z" }],
    });

    this.addCommand({
      id: "toggle-super-focus-mode",
      name: "Toggle Super Focus Mode (Active pane only)",
      callback: () => {
        this.toggleFocusMode(true);
      },
      hotkeys: [{ modifiers: ["Alt", "Mod", "Shift"], key: "Z" }],
    });
  }

  onunload() {
    console.log("Unloading Focus Mode plugin ...");
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}