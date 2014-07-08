/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window */

define(function (require, exports, module) {
    "use strict";

    // get access to needed singletons
    var CommandManager     = brackets.getModule("command/CommandManager"),
        EditorManager      = brackets.getModule("editor/EditorManager"),
        PanelManager       = brackets.getModule("view/PanelManager"),
        Menus              = brackets.getModule("command/Menus"),
        ExtensionUtils     = brackets.getModule("utils/ExtensionUtils"),
        DocumentManager    = brackets.getModule("document/DocumentManager"),
        PreferencesManager = brackets.getModule("preferences/PreferencesManager"),
        AppInit            = brackets.getModule("utils/AppInit");

    // files needed by regex-diagram
    var railRoad           = require('thirdparty/regex-to-railroad'),
        panelHtml          = require("text!html/panel.html");

    // some constants
    var SHOW_REGEX_DIAGRAM = "regexdiagram.show",   // package-style naming to avoid collisions
        EXTENSION_NAME = "regex-diagram";

    // the extension
    var myExtension = {
        init: function() {
            console.log('[regex-diagram] init');
            var that = this;

            this.panel = null;
            this.panelElement = null;

            this.state = null;

            // keep track of each editor we're listening too so that we do not listen twice for the same editor
            this.editors = [];

            this.active = false;

            this.word = '';

            AppInit.htmlReady(function () {
                ExtensionUtils.loadStyleSheet(module, "stylesheets/regex-railroad-diagram.css");
            });

            AppInit.appReady(function() {
                that.registerCommand();
                that.createDomElements();
                that.bindEvents();

                // get saved prefs
                that.getViewState();
                that.onStateChange();

                if (that.active) {
                    CommandManager.get(SHOW_REGEX_DIAGRAM).setChecked(true);
                } else {
                    CommandManager.get(SHOW_REGEX_DIAGRAM).setChecked(false);
                }

                console.log('[regex-diagram] initial DocumentChange');
                that.onCurrentDocumentChange(null, EditorManager.getFocusedEditor());
            });
        },
        registerCommand: function() {
            console.log('[regex-diagram] registerCommand');
            // TODO: check preferences, if not there, activate it, and add preference
            // if it's here, get pref
            CommandManager.register("Show RegExp Diagram", SHOW_REGEX_DIAGRAM, this.onToggleView.bind(this));
        },
        getViewState: function() {
            var stateManager = PreferencesManager.stateManager.getPrefixedSystem(EXTENSION_NAME),
                that = this;

            stateManager.definePreference('showDiagram', 'boolean', 'true').on('change', this.onStateChange.bind(this));
        },
        onStateChange: function() {
            var stateManager = PreferencesManager.stateManager.getPrefixedSystem(EXTENSION_NAME);

            console.log('[regex-diagram] onStateChange', stateManager.get('showDiagram'));

            this.active = stateManager.get('showDiagram');
        },
        createDomElements: function() {
            console.log('[regex-diagram] createDomElements');
            // Then create a menu item bound to the command
            // The label of the menu item is the name we gave the command (see above)
            var menu = Menus.getMenu(Menus.AppMenuBar.VIEW_MENU);

            menu.addMenuDivider();

            // We could also add a key binding at the same time:
            menu.addMenuItem(SHOW_REGEX_DIAGRAM, "Ctrl-Alt-D");

            this.panel = PanelManager.createBottomPanel(SHOW_REGEX_DIAGRAM, $(panelHtml), 200);

            this.panelElement = $('#regex_diagram');
        },
        bindEvents: function() {
            console.log('[regex-diagram] bindEvents');
            $(DocumentManager).on('currentDocumentChange', this.onCurrentDocumentChange.bind(this))
        },
        onToggleView: function() {
            console.log('[regex-diagram] onToggleView');
            var stateManager = PreferencesManager.stateManager.getPrefixedSystem(EXTENSION_NAME);

            this.active = !this.active;

            console.log('[regex-diagram] setting showDiagram to', this.active);
            stateManager.set('showDiagram', this.active);

            stateManager.save();

            if (this.active) {
                CommandManager.get(SHOW_REGEX_DIAGRAM).setChecked(true);
            } else {
                CommandManager.get(SHOW_REGEX_DIAGRAM).setChecked(false);
            }

            console.log('[regex-diagram] showDiagram set to', stateManager.get('showDiagram'));

            // call onCursorActivity() to enable & display panel with current regexp if one is found
            this.onCursorActivity();
        },
        onCurrentDocumentChange: function() {
            var activeEditor = EditorManager.getActiveEditor();

            this.panel.hide();

            console.log('[regex-diagram] currentDocumentChange', event, activeEditor);
            if (activeEditor && this.editors.indexOf(activeEditor) === -1) {
                this.editors.push(activeEditor);

                $(activeEditor).on('cursorActivity', this.onCursorActivity.bind(this));
            }

            this.onCursorActivity();
        },
        onCursorActivity: function() {
            console.log('[regex-diagram] onCursorActivity');
            var editor = EditorManager.getFocusedEditor(),
                previousWord = this.word;

            if (!editor || !this.active) {
                console.log('[regex-diagram] onCursorActivity => not', editor, this.active, this.word);
                this.panel.hide();
            } else {
                console.log('[regex-diagram] onCursorActivity => yes');
                // get word under cursor
                this.word = this.getCurrentWord(editor);

                // do not re-render the same diagram
                if (this.word && previousWord !== this.word) {
                    previousWord = this.word;

                    this.panelElement.empty();
                    railRoad.Regex2RailRoadDiagram(this.clean(this.word), $('#regex_diagram').get(0));
                    this.panel.show();
                } else if (!this.word) {
                    this.panel.hide();
                } else {
                    this.panel.show();
                }
            }
        },
        getCurrentWord: function(editor) {
            var regex = '';

            if (editor) {
                if (!editor.hasSelection()) {
                    // get token under cursor
                    regex = editor._codeMirror.getTokenAt(editor.getCursorPos());

                    if (regex && regex.type === "string-2") {
                        regex = regex.string;
                    } else {
                        regex = '';
                    }
                }
            }

            return regex;
        },
        clean: function(text) {
            var m;

                text = text.replace(/^\s+/, "").replace(/\s+$/, "");
                if (text.length === 1 && text === "/") {
                  return '';
                }

                m = /^r('''|"""|"|')(.*)\1$/.exec(text);
                if (m != null) {
                  text = m[2];
                }
                m = /^\/\/\/(.*)\/\/\/\w*$/.exec(text);
                if (m != null) {
                  text = m[1].replace(/\s+/, "");
                } else {
                  m = /^\/(.*)\/\w*$/.exec(text);
                  if (m != null) {
                    text = m[1];
                  }
              }
            return text;
        }
    };

    myExtension.init();
});
