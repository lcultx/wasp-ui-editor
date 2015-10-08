WaspUiEditorView = require './wasp-ui-editor-view'
{CompositeDisposable} = require 'atom'

module.exports = WaspUiEditor =
  waspUiEditorView: null
  modalPanel: null
  subscriptions: null

  activate: (state) ->
    @waspUiEditorView = new WaspUiEditorView(state.waspUiEditorViewState)
    @modalPanel = atom.workspace.addModalPanel(item: @waspUiEditorView.getElement(), visible: false)

    # Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    @subscriptions = new CompositeDisposable

    # Register command that toggles this view
    @subscriptions.add atom.commands.add 'atom-workspace', 'wasp-ui-editor:toggle': => @toggle()

  deactivate: ->
    @modalPanel.destroy()
    @subscriptions.dispose()
    @waspUiEditorView.destroy()

  serialize: ->
    waspUiEditorViewState: @waspUiEditorView.serialize()

  toggle: ->
    console.log 'WaspUiEditor was toggled!'

    if @modalPanel.isVisible()
      @modalPanel.hide()
    else
      @modalPanel.show()
