/**
 * The H5P core that is present when H5P is used as a player.
 * Contains the definitions for these files:
 *  - jquery.js
 *  - h5p.js
 *  - h5p-event-dispatcher.js
 *  - h5p-x-api-event.js
 *  - h5p-x-api.js
 *  - h5p-content-type.js
 *  - h5p-confirmation-dialog.js
 *  - h5p-action-bar.js
 *  - request-queue.js
 * 
 * Interfaces starting with I like IIntegration are types that are not named in
 * H5P but only added for the typings.
 */
declare namespace H5P {
  /**
   * The base of the event system.
   * Inherit this class if you want your H5P to dispatch events.
   */
  class EventDispatcher {
    constructor();

    /**
     * Helper function to create event templates added to the EventDispatcher.
     *
     * Will in the future be used to add representations of the questions to the
     * statements.
     *
     * @param verb
     *   Verb id in short form
     * @param extra
     *   Extra values to be added to the statement
     * @returns
     *   Instance
     */
    createXAPIEventTemplate(verb: string, extra?: any): XAPIEvent;

    setActivityStarted(): void;

    /**
     * Helper function for triggering xAPI added to the EventDispatcher.
     *
     * @param verb
     *   The short id of the verb we want to trigger
     * @param extra
     *   Extra properties for the xAPI statement
     */
    triggerXAPI(verb: string, extra?: any): void;

    /**
     * Helper function to create xAPI completed events
     *
     * DEPRECATED - USE triggerXAPIScored instead
     *
     * @deprecated
     *   since 1.5, use triggerXAPIScored instead.
     * @param score
     *   Will be set as the 'raw' value of the score object
     * @param maxScore
     *   will be set as the "max" value of the score object
     * @param success
     *   will be set as the "success" value of the result object
     */
    triggerXAPICompleted(
      score: number,
      maxScore: number,
      success: boolean
    ): void;

    /**
     * Helper function to create scored xAPI events
     *
     * @param score
     *   Will be set as the 'raw' value of the score object
     * @param maxScore
     *   Will be set as the "max" value of the score object
     * @param verb
     *   Short form of adl verb
     * @param completion
     *   Is this a statement from a completed activity?
     * @param success
     *   Is this a statement from an activity that was done successfully?
     */
    triggerXAPIScored(
      score: number,
      maxScore: number,
      verb: string,
      completion: boolean,
      success: boolean
    ): void;

    /**
     * Add new event listener.
     *
     * @throws {TypeError}
     *   listener must be a function
     * @param type
     *   Event type
     * @param listener
     *   Event listener
     * @param that
     *   Optionally specify the this value when calling listener.
     */
    on(eventName: string, callback: (event: Event) => void, that?: any): void;

    /**
     * Remove event listener.
     * If no listener is specified, all listeners will be removed.
     *
     * @throws {TypeError}
     *   listener must be a function
     * @param type
     *   Event type
     * @param listener
     *   Event listener
     */
    off(eventName: string, callback: (event: Event) => void, that?: any): void;

    /**
     * Add new event listener that will be fired only once.
     *
     * @throws {TypeError}
     *   listener must be a function
     * @param type
     *   Event type
     * @param listener
     *   Event listener
     * @param thisArg
     *   Optionally specify the this value when calling listener.
     */
    once(eventName: string, callback: (event: Event) => void, that?: any): void;

    /**
     * Dispatch event.
     *
     * @param event
     *   Event object or event type as string
     * @param eventData
     *   Custom event data(used when event type as string is used as first
     *   argument).
     */
    trigger(
      event: string | Event,
      eventData?: any,
      extras?: { bubbles?: boolean; external?: boolean }
    ): void;

    attach?(wrapper: JQuery): void;
  }

  /**
   * Queue requests and handle them at your convenience

   */
  class RequestQueue {
    /**
     * A queue for requests, will be automatically processed when regaining connection
     *
     * @param [options.showToast] Show toast when losing or regaining connection
     * @constructor
     */
    constructor(options?: { showToast: boolean });

    /**
     * Add request to queue. Only supports posts currently.
     */
    add(url: string, data: any): boolean;

    /**
     * Clear stored requests
     *
     * @returns True if the storage was successfully cleared
     */
    clearQueue(): boolean;

    /**
     * Display toast message on the first content of current page
     *
     * @param msg Message to display
     * @param forceShow Force override showing the toast
     * @param configOverride Override toast message config
     */
    displayToastMessage(
      msg: string,
      forceShow?: boolean,
      configOverride?: any
    ): void;

    /**
     * Get stored requests
     *
     * @returns Stored requests
     */
    getStoredRequests(): boolean | any[];

    /**
     * Request fail handler
     *
     * @param request
     */
    onQueuedRequestFail(request: any): void;

    /**
     * An item in the queue was processed
     *
     * @param queue Queue that was processed
     */
    onQueuedRequestProcessed(queue: any[]): void;

    /**
     * Process first item in the request queue
     *
     * @param queue Request queue
     */
    processQueue(queue: any[]): void;

    /**
     * Start processing of requests queue
     *
     * @return Returns false if it was not possible to resume processing queue
     */
    resumeQueue(): boolean;
  }

  /**
   * Used for xAPI events.
   */
  class XAPIEvent extends Event {
    constructor();

    /**
     * Get content xAPI ID.
     *
     * @param instance
     *   The H5P instance
     */
    getContentXAPIId(instance: IH5PInstance): string;

    /**
     * Get the max value of the result - score part of the statement
     *
     * @returns
     *   The max score, or null if not defined
     */
    getMaxScore(): number | null;

    /**
     * Get the raw value of the result - score part of the statement
     *
     * @returns
     *   The score, or null if not defined
     */
    getScore(): number | null;

    /**
     * Get the statements verb id.
     *
     * @param full
     *   if true the full verb id prefixed by http://adlnet.gov/expapi/verbs/
     *   will be returned
     * @returns
     *   Verb or null if no verb with an id has been defined
     */
    getVerb(full: boolean): string;

    /**
     * Figure out if a property exists in the statement and return it
     *
     * @param keys
     *   List describing the property we're looking for. For instance
     *   ['result', 'score', 'raw'] for result.score.raw
     * @returns
     *   The value of the property if it is set, null otherwise.
     */
    getVerifiedStatementValue(keys: string[]): any | null;

    /**
     * Check if this event is sent from a child (i.e not from grandchild)
     *
     * @return
     */
    isFromChild(): boolean;

    /**
     * Set the actor. Email and name will be added automatically.
     */
    setActor(): void;

    /**
     * Set the context part of the statement.
     *
     * @param instance
     *   The H5P instance
     */
    setContext(instance: IH5PInstance): void;

    /**
     * Set the object part of the statement.
     *
     * The id is found automatically (the url to the content)
     *
     * @param instance
     *   The H5P instance
     */
    setObject(instance: IH5PInstance): void;

    /**
     * Set scored result statements.
     */
    setScoredResult(
      score: number,
      maxScore: number,
      instance: IH5PInstance,
      completion: boolean,
      success: boolean
    ): void;

    /**
     * Set a verb.
     *
     * @param verb
     *   Verb in short form, one of the verbs defined at
     *   {@link http://adlnet.gov/expapi/verbs/|ADL xAPI Vocabulary}
     *
     */
    setVerb(verb: string): void;

    /**
     * List of verbs defined at {@link http://adlnet.gov/expapi/verbs/|ADL xAPI Vocabulary}
     */
    static allowedXAPIVerbs: string[];
  }

  const jQuery: JQuery;

  /**
   * List over H5P instances on the current page.
   */
  const instances: IH5PInstance[];

  /**
   * Tells us if we're inside of an iframe.
   */
  const isFramed: boolean;

  /**
   * Keep track of when the H5Ps where started.
   */
  const opened: {
    [contentId: string | number]: Date;
  };

  class ActionBar extends EventDispatcher {
    /**
     * @param displayOptions.export Triggers the display of the 'Download' button
     * @param displayOptions.copyright Triggers the display of the 'Copyright' button
     * @param displayOptions.embed Triggers the display of the 'Embed' button
     * @param displayOptions.icon Triggers the display of the 'H5P icon' link
     */
    constructor(displayOptions: {
      export: boolean;
      copyright: boolean;
      embed: boolean;
      icon: boolean;
    });
  }

  class ClipboardItem {
    /**
     * Prepares the content parameters for storing in the clipboard.
     * @param parameters The parameters for the content to store
     * @param genericProperty If only part of the parameters are generic, which part
     * @param specificKey If the parameters are specific, what content type does it fit
     * @returns Ready for the clipboard
     */
    constructor(
      parameters: any,
      genericProperty?: string,
      specificKey?: string
    );
  }

  class ConfirmationDialog extends EventDispatcher {
    /**
     * Create a confirmation dialog
     *
     * @param options.instance Instance that uses confirmation dialog
     * @param options.headerText Header text
     * @param options.dialogText Dialog text
     * @param options.cancelText Cancel dialog button text
     * @param options.confirmText Confirm dialog button text
     * @param options.hideCancel Hide cancel button
     * @param options.hideExit Hide exit button
     * @param options.skipRestoreFocus Skip restoring focus when hiding the dialog
     * @param options.classes Extra classes for popup
     */
    constructor(options?: {
      instance?: IH5PInstance;
      headerText?: string;
      dialogText?: string;
      cancelText?: string;
      confirmText?: string;
      hideCancel?: boolean;
      hideExit?: boolean;
      skipRestoreFocus?: boolean;
      classes?: any;
    });

    /**
     * Set parent of confirmation dialog
     * @param wrapper
     */
    appendTo(wrapper: HTMLElement): ConfirmationDialog;

    /**
     * Show confirmation dialog
     * @params offsetTop Offset top
     */
    show(offsetTop: number): ConfirmationDialog;

    /**
     * Hide confirmation dialog
     */
    hide(): ConfirmationDialog;

    /**
     * Retrieve element
     */
    getElement(): HTMLElement;

    /**
     * Get previously focused element
     */
    getPreviouslyFocused(): HTMLElement;

    /**
     * Sets the minimum height of the view port
     *
     * @param minHeight
     */
    setViewPortMinimumHeight(minHeight: number | null): void;
  }

  /**
   * Copyrights for a H5P Content Library.
   */

  class ContentCopyrights {
    constructor();

    /**
     * Set label.
     *
     * @param newLabel
     */
    setLabel(newLabel: string): void;

    /**
     * Add sub content.
     *
     * @param newMedia
     */
    addMedia(newMedia: MediaCopyright): void;

    /**
     * Add sub content in front.
     *
     * @param newMedia
     */
    addMediaInFront(newMedia: MediaCopyright): void;

    /**
     * Add sub content.
     *
     * @param newContent
     */
    addContent(newContent: MediaCopyright): void;

    /**
     * Print content copyright.
     *
     * @returns HTML.
     */
    toString(): string;
  }

  /**
   * H5P.ContentType is a base class for all content types. Used by newRunnable()
   *
   * Functions here may be overridable by the libraries. In special cases,
   * it is also possible to override H5P.ContentType on a global level.
   *
   * NOTE that this doesn't actually 'extend' the event dispatcher but instead
   * it creates a single instance which all content types shares as their base
   * prototype. (in some cases this may be the root of strange event behavior)
   */
  interface IContentType extends EventDispatcher {
    new ();
    /**
     * Is library standalone or not? Not being standalone, means it is
     * included in another library
     */
    isRoot(): boolean;

    /**
     * Returns the file path of a file in the current library
     * @param filePath The path to the file relative to the library folder
     * @return The full path to the file
     */
    getLibraryFilePath(): string;
  }

  /**
   * Factory for ContentType.
   *
   * H5P.ContentType is a base class for all content types. Used by newRunnable()
   *
   * Functions here may be overridable by the libraries. In special cases,
   * it is also possible to override H5P.ContentType on a global level.
   *
   * NOTE that this doesn't actually 'extend' the event dispatcher but instead
   * it creates a single instance which all content types shares as their base
   * prototype. (in some cases this may be the root of strange event behavior)
   */
  function ContentType(isRootLibrary: boolean): IContentType;

  /**
   * THIS FUNCTION/CLASS IS DEPRECATED AND WILL BE REMOVED.
   *
   * Helper object for keeping coordinates in the same format all over.
   *
   * @deprecated
   *   Will be removed March 2016.
   */
  class Coords {
    constructor(x: number, y: number, w: number, h: number);
  }

  /**
   * Simple class for creating a definition list.
   */
  class DefinitionList {
    constructor();

    /**
     * Add field to list.
     *
     * @param field
     */
    add(field: Field): void;

    /**
     * Get Number of fields.
     *
     * @returns
     */
    size(): number;

    /**
     * Get field at given index.
     *
     * @param index
     */
    get(index: number): Field;

    /**
     * Print definition list.
     *
     * @returns HTML.
     */
    toString(): string;
  }

  class Dialog {
    /**
     * Creates a new popup dialog over the H5P content.
     * @param name
     *   Used for html class.
     * @param title
     *   Used for header.
     * @param content
     *   Displayed inside the dialog.
     * @param $element
     *   Which DOM element the dialog should be inserted after.
     */
    constructor(name: string, title: string, content: string, $element: JQuery);

    /**
     * Opens the dialog.
     */
    open(scrollbar: boolean): void;

    /**
     * Closes the dialog.
     */
    close(): void;
  }

  /**
   * The Event class for the EventDispatcher.
   */
  class Event {
    constructor(
      type: string,
      data: any,
      extras?: { bubbles: boolean; external: boolean }
    );
    type: string;
    data: any;
    /**
     * Prevent this event from bubbling up to parent
     */
    preventBubbling(): void;

    /**
     * Get bubbling status
     *
     * @returns
     *   true if bubbling false otherwise
     */
    getBubbles(): boolean;
    /**
     * Try to schedule an event for externalDispatcher
     *
     * @returns
     *   true if external and not already scheduled, otherwise false
     */
    scheduleForExternal(): boolean;
  }

  /**
   * Simple data structure class for storing a single field.
   */
  class Field {
    constructor(label: string, value: string);
    /**
     * Public. Get field label.
     *
     * @returns
     */
    getLabel(): string;
    /**
     * Public. Get field value.
     *
     * @returns
     */
    getValue(): string;
  }
  /**
   * A ordered list of copyright fields for media.
   */
  class MediaCopyright {
    /**
     * @param copyright
     *   Copyright information fields.
     * @param labels
     *   Translation of labels.
     * @param order
     *   Order of the fields.
     * @param extraFields
     *   Add extra copyright fields.
     */
    constructor(
      copyright: { [field: string]: string },
      labels?: { [field: string]: string },
      order?: string[],
      extraFields?: { [field: string]: string }
    );

    setThumbnail(newThumbnail: Thumbnail): void;
    /**
     * Checks if this copyright is undisclosed.
     * I.e. only has the license attribute set, and it's undisclosed.
     *
     * @returns
     */
    undisclosed(): boolean;
    /**
     * Print media copyright.
     *
     * @returns HTML.
     */
    toString(): string;
  }

  /**
   * Request queue for retrying failing requests, will automatically retry them when you come online
   */
  class OfflineRequestQueue {
    /**
     * Constructor
     *
     * @param options.instance The H5P instance which UI components are placed within
     */
    constructor(options: { instance: IH5PInstance });
    /**
     * Add request to offline request queue. Only supports posts for now.
     *
     * @param url The request url
     * @param data The request data
     */
    add(url: string, data: any): false | undefined;
  }

  /**
   * A simple and elegant class for creating thumbnails of images.
   */
  class Thumbnail {
    constructor(source: string, width: number, height: number);
    /**
     * Print thumbnail.
     *
     * @returns HTML.
     */
    toString(): string;
  }
  /**
   * Helper for adding a query parameter to an existing path that may already
   * contain one or a hash.
   */
  function addQueryParameter(path: string, parameter: string): string;

  /**
   * Show a toast message.
   *
   * The reference element could be dom elements the toast should be attached to,
   * or e.g. the document body for general toast messages.
   *
   * @param element Reference element to show toast message for.
   * @param message Message to show.
   * @param config Configuration.
   * @param config.style=h5p-toast Style name for the tooltip.
   * @param config.duration=3000 Toast message length in ms.
   * @param config.position Relative positioning of the toast.
   * @param config.position.horizontal=centered [before|left|centered|right|after].
   * @param config.position.vertical=below [above|top|centered|bottom|below].
   * @param config.position.offsetHorizontal=0 Extra horizontal offset.
   * @param config.position.offsetVertical=0 Extra vetical offset.
   * @param config.position.noOverflowLeft=false True to prevent overflow left.
   * @param config.position.noOverflowRight=false True to prevent overflow right.
   * @param config.position.noOverflowTop=false True to prevent overflow top.
   * @param config.position.noOverflowBottom=false True to prevent overflow bottom.
   * @param config.position.noOverflowX=false True to prevent overflow left and right.
   * @param config.position.noOverflowY=false True to prevent overflow top and bottom.
   * @param config.position.overflowReference=document.body DOM reference for overflow.
   */
  function attachToastTo(
    element: JQuery,
    message: string,
    config?: {
      style?: string;
      duration?: number;
      position?: {
        horizontal?: string;
        vertical?: string;
        offsetHorizontal?: number;
        offsetVertical?: number;
        noOverflowLeft?: boolean;
        noOverflowRight?: boolean;
        noOverflowTop?: boolean;
        noOverflowBottom?: boolean;
        noOverflowX?: boolean;
        noOverflowY?: boolean;
        overflowReference?: any;
      };
    }
  ): any;

  function buildMetadataCopyrights(metadata: ILicenseData): MediaCopyright;

  /**
   * Get library class constructor from H5P by classname.
   * Note that this class will only work for resolve "H5P.NameWithoutDot".
   * Also check out {@link H5P.newRunnable}
   *
   * Used from libraries to construct instances of other libraries' objects by name.
   *
   * @param name Name of library
   * @returns Class constructor
   */
  function classFromName(string: string): any;

  /**
   * Store item in the H5P Clipboard.
   *
   * @param clipboardItem
   */
  function clipboardify(clipboardItem: ClipboardItem | any): void;

  /**
   * Recursively clone the given object.
   *
   * @param object
   *   Object to clone.
   * @param recursive
   * @returns
   *   A clone of object.
   */
  function cloneObject(object: any | any[], recursive?: boolean): any | any[];

  /**
   * Create title
   *
   * @param rawTitle
   * @param maxLength
   * @returns
   */
  function createTitle(rawTitle: string, maxLength: number): string;

  /**
   * Generate random UUID
   *
   * @returns UUID
   */
  function createUUID(): string;

  /**
   * Check if styles path/key is loaded.
   *
   * @param path
   * @returns
   */
  function cssLoaded(path: string): boolean;

  /**
   * Delete user data for given content.
   *
   * @param contentId
   *   What content to remove data for.
   * @param dataId
   *   Identifies the set of data for this content.
   * @param subContentId
   *   Identifies which data belongs to sub content.
   */
  function deleteUserData(
    contentId: string | number,
    dataId: string,
    subContentId?: string
  ): void;

  /**
   * Used to print useful error messages. (to JavaScript error console)
   *
   * @param err Error to print.
   */
  function error(err: Error): void;

  /**
   * Gather a flat list of copyright information from the given parameters.
   *
   * @param info
   *   Used to collect all information in.
   * @param parameters
   *   To search for file objects in.
   * @param contentId
   *   Used to insert thumbnails for images.
   * @param extras - Extras.
   * @param extras.metadata - Metadata
   * @param extras.machineName - Library name of some kind.
   *   Metadata of the content instance.
   */
  function findCopyrights(
    info: ContentCopyrights,
    parameters: any | any[],
    contentId: number | string,
    extras?: { metadata: any; machineName: string }
  ): void;

  /**
   * Enter fullscreen for the given H5P instance.
   *
   * @param $element Content container.
   * @param instance
   * @param exitCallback Callback function called when user exits fullscreen.
   * @param $body For internal use. Gives the body of the iframe.
   * @param forceSemiFullScreen
   */
  function fullScreen(
    $element: JQuery,
    instance: IH5PInstance,
    exitCallback: () => void,
    body: JQuery,
    forceSemiFullScreen: boolean
  ): void;

  /**
   * Retrieve parsed clipboard data.
   *
   * @returns
   */
  function getClipboard(): any;

  /**
   * Function for getting content for a certain ID
   *
   * @param contentId
   * @returns
   */
  function getContentForInstance(contentId: string | number): IContentData;

  /**
   * THIS FUNCTION IS DEPRECATED, USE getPath INSTEAD
   * Will be remove march 2016.
   *
   * Find the path to the content files folder based on the id of the content
   *
   * @deprecated
   *   Will be removed march 2016.
   * @param contentId
   *   Id of the content requesting the path
   * @returns
   *   URL
   */
  function getContentPath(contentId: string | number): string;

  /**
   * Gather copyright information for the given content.
   *
   * @param instance
   *   H5P instance to get copyright information for.
   * @param parameters
   *   Parameters of the content instance.
   * @param contentId
   *   Identifies the H5P content
   * @param metadata
   *   Metadata of the content instance.
   * @returns Copyright information.
   */
  function getCopyrights(
    instance: IH5PInstance,
    parameters: any,
    contentId: string | number,
    metadata: ILicenseData
  ): string;

  /**
   * Get the crossOrigin policy to use for img, video and audio tags on the current site.
   *
   * @param source File object from parameters/json_content - Can also be URL(deprecated usage)
   * @returns crossOrigin attribute value required by the source
   */
  function getCrossOrigin(source: { path: string } | string): string | null;

  /**
   * Loop through assets for iframe content and create a set of tags for head.
   * @param contentId
   * @returns HTML
   */
  function getHeadTags(contentId: string | number): string;

  /**
   * Get config for a library
   *
   * @param string machineName
   * @return Object
   */
  function getLibraryConfig(machineName: string): any;

  /**
   * Get the path to the library
   *
   * @param library
   *   The library identifier in the format "machineName-majorVersion.minorVersion".
   * @returns
   *   The full path to the library.
   */
  function getLibraryPath(library: string): string;

  /**
   * Find the path to the content files based on the id of the content.
   * Also identifies and returns absolute paths.
   *
   * @param path
   *   Relative to content folder or absolute.
   * @param contentId
   *   ID of the content requesting the path.
   * @returns
   *   Complete URL to path.
   */
  function getPath(path: string, contentId: number | string): string;

  /**
   * Get user data for given content.
   *
   * @param contentId
   *   What content to get data for.
   * @param dataId
   *   Identifies the set of data for this content.
   * @param done
   *   Callback with error and data parameters.
   * @param subContentId
   *   Identifies which data belongs to sub content.
   */
  function getUserData(
    contentId: number | string,
    dataId: string,
    done: (error?: any, data?: any) => void,
    subContentId?: string
  ): void;

  /**
   * Initialize H5P content.
   * Scans for ".h5p-content" in the document and initializes H5P instances where found.
   *
   * @param target DOM Element
   */
  function init(target: JQuery): void;

  /**
   * Check if JavaScript path/key is loaded.
   *
   * @param path
   * @returns
   */
  function jsLoaded(path: string): boolean;

  /**
   * Parse library string into values.
   *
   * @param library
   *   library in the format "machineName majorVersion.minorVersion"
   * @returns
   *   library as an object with machineName, majorVersion and minorVersion properties
   *   return false if the library parameter is invalid
   */
  function libraryFromString(library: string):
    | {
        machineName: string;
        majorVersion: string;
        minorVersion: string;
      }
    | false;

  /**
   * A safe way of creating a new instance of a runnable H5P.
   *
   * @param library
   *   Library/action object form params.
   * @param contentId
   *   Identifies the content.
   * @param $attachTo
   *   Element to attach the instance to.
   * @param skipResize
   *   Skip triggering of the resize event after attaching.
   * @param extras
   *   Extra parameters for the H5P content constructor
   * @returns
   *   Instance.
   */
  function newRunnable(
    library: {
      library: string;
      params: any;
      subContentId?: string;
      userDatas?: { state: any };
      metadata: ILicenseData;
    },
    contentId: string | number,
    $attachTo?: JQuery,
    skipResize?: boolean,
    extras?: { standalone?: boolean; parent?: any; [key: string]: any }
  ): IH5PInstance;

  /**
   * Register an event handler
   *
   * Helper function that registers an event handler for an event type if
   * the instance supports event handling
   *
   * @param instance
   *   Instance of H5P content
   * @param eventType
   *   Type of event to listen for
   * @param handler
   *   Callback that gets triggered for events of the specified type
   */
  function on(
    instance: IH5PInstance,
    eventType: string,
    handler: (event: Event) => void
  ): void;

  /**
   * Display a dialog containing the embed code.
   *
   * @param $element
   *   Element to insert dialog after.
   * @param embedCode
   *   The embed code.
   * @param resizeCode
   *   The advanced resize code
   * @param size
   *   The content's size.
   * @param size.width
   * @param size.height
   */
  function openEmbedDialog(
    $element: JQuery,
    embedCode: string,
    resizeCode: string,
    size: { width: number; height: number },
    instance: IH5PInstance
  ): undefined | false;

  /**
   * Display a dialog containing the download button and copy button.
   */
  function openReuseDialog(
    $element: JQuery,
    contentData: IContentData,
    library: { library: string; params: any; metadata: ILicenseData },
    instance: IH5PInstance,
    contentId: number | string
  ): void;

  /**
   * Enter semi fullscreen for the given H5P instance
   *
   * @param $element Content container.
   * @param instance
   * @param exitCallback Callback function called when user exits fullscreen.
   * @param $body For internal use. Gives the body of the iframe.
   */
  function semiFullScreen(
    $element: JQuery,
    instance: IH5PInstance,
    exitCallback: () => void,
    body: JQuery
  ): void;

  /**
   * Set item in the H5P Clipboard.
   *
   * @param clipboardItem - Data to be set.
   */
  function setClipboard(clipboardItem: ClipboardItem | any): void;

  /**
   * Post finished results for user.
   *
   * @deprecated
   *   Do not use this function directly, trigger the finish event instead.
   *   Will be removed march 2016
   * @param contentId
   *   Identifies the content
   * @param score
   *   Achieved score/points
   * @param maxScore
   *   The maximum score/points that can be achieved
   * @param time
   *   Reported time consumption/usage
   */
  function setFinished(
    contentId: number | string,
    score: number,
    maxScore: number,
    time?: number
  ): void;

  /**
   * Helper for setting the crossOrigin attribute + the complete correct source.
   * Note: This will start loading the resource.
   *
   * @param element DOM element, typically img, video or audio
   * @param source File object from parameters/json_content (created by H5PEditor)
   * @param contentId Needed to determine the complete correct file path
   */
  function setSource(
    element: Element,
    source: { path: string },
    contentId: string | number
  ): void;

  /**
   * Set user data for given content.
   *
   * @param contentId
   *   What content to get data for.
   * @param dataId
   *   Identifies the set of data for this content.
   * @param data
   *   The data that is to be stored.
   * @param extras
   *   Extra properties
   * @param extras.subContentId
   *   Identifies which data belongs to sub content.
   * @param extras.preloaded=true
   *   If the data should be loaded when content is loaded.
   * @param extras.deleteOnChange=false
   *   If the data should be invalidated when the content changes.
   * @param extras.errorCallback
   *   Callback with error as parameters.
   * @param extras.async=true
   */
  function setUserData(
    contentId: string | number,
    dataId: string,
    data: any,
    extras?: {
      subContentId?: string;
      preloaded?: boolean;
      deleteOnChange?: boolean;
      errorCallback?: (error: any) => void;
      async?: boolean;
    }
  ): void;

  /**
   * Shuffle an array in place.
   *
   * @param array
   *   Array to shuffle
   * @returns
   *   The passed array is returned for chaining.
   */
  function shuffleArray(array: any[]): any[];

  /**
   * Translate text strings.
   *
   * @param key
   *   Translation identifier, may only contain a-zA-Z0-9. No spaces or special chars.
   * @param vars
   *   Data for placeholders.
   * @param ns
   *   Translation namespace. Defaults to H5P.
   * @returns
   *    Translated text
   */
  function t(
    key: string,
    vars?: { [placeholder: string]: string },
    ns?: string
  ): string;

  /**
   * Trigger an event on an instance
   *
   * Helper function that triggers an event if the instance supports event handling
   *
   * @param instance
   *   Instance of H5P content
   * @param eventType
   *   Type of event to trigger
   * @param data
   * @param extras
   */
  function trigger(
    instance: IH5PInstance,
    eventType: string,
    data?: any,
    extras?: { bubbles?: boolean; external?: boolean }
  ): void;

  /**
   * Remove all empty spaces before and after the value.
   *
   * @param value
   * @returns
   */
  function trim(value: string): string;

  /**
   * Internal H5P function listening for xAPI completed events and stores scores
   *
   * @param event
   */
  function xAPICompletedListener(event: XAPIEvent): void;

  /**
   * jQuery instance of current window.
   */
  const $window: JQuery;

  /**
   * When embedded the communicator helps talk to the parent page.
   */
  const communicator: ICommunicator;

  /**
   * The external event dispatcher. Others, outside of H5P may register and
   * listen for H5P Events here.
   */
  const externalDispatcher: EventDispatcher;

  interface ICommunicator {
    /**
     * Register action listener.
     *
     * @param action What you are waiting for
     * @param handler What you want done
     */
    on(action: string, handler: (data?: any) => void): void;

    /**
     * Send a message to the all mighty father.
     *
     * @param action
     * @param data payload
     */
    send(action: string, data?: any): void;
  }

  /**
   * This is an author inside content metadata.
   */
  interface IContentAuthor {
    name?: string;
    role?: string;
  }

  /**
   * This is a change inside content metadata.
   */
  interface IContentChange {
    author?: string;
    date?: string;
    log?: string;
  }

  /**
   * The non-technical copyright and license metadata of a content object. H5P
   * calls this "metadata" in the GUI (and in their code), but to avoid confusing
   * from our use of metadata, we call it license data.
   */
  interface ILicenseData {
    defaultLanguage: string;
    a11yTitle?: string;
    license: string;
    licenseVersion?: string;
    yearFrom?: string;
    yearTo?: string;
    source?: string;
    title: string;
    authors?: IContentAuthor[];
    licenseExtras?: string;
    changes?: IContentChange[];
    authorComments?: string;
    contentType?: string;
  }

  interface IContentData {
    /**
     * Can be used to override the URL used for getting content files.
     * It must be a URL to which the actual filenames can be appended.
     * Do not end it with a slash!
     * If it is a relative URL it will be appended to the hostname that
     * is in use (this is done in the H5P client).
     * If it is an absolute URL it will be used directly.
     */
    contentUrl?: string;
    contentUserData?: {
      /**
       * The state as a serialized JSON object.
       */
      state: string;
    }[];
    displayOptions: {
      copy: boolean;
      copyright: boolean;
      embed: boolean;
      export: boolean;
      frame: boolean;
      icon: boolean;
    };
    /**
     * The full embed code (<iframe>...</iframe> with absolute URLs).
     * Example: <iframe src=\"https://example.org/h5p/embed/XXX\" width=\":w\" height=\":h\" frameborder=\"0\" allowfullscreen=\"allowfullscreen\"></iframe>"
     */
    embedCode?: string;
    /**
     * The download URL (absolute URL).
     */
    exportUrl?: string;
    fullScreen: "0" | "1";
    jsonContent: string;
    /**
     * The ubername with whitespace as separator.
     */
    library: string;
    mainId?: string;
    metadata?: ILicenseData;
    /**
     * The parameters.
     */
    params?: any;
    /**
     * A script html tag which can be included alongside the embed code
     * to make the iframe size to the available width. Use absolute URLs.
     * Example: <script src=\"https://example.org/h5p/library/js/h5p-resizer.js\" charset=\"UTF-8\"></script>
     */
    resizeCode?: string;
    /**
     * A complete list of scripts required to display the content.
     * Includes core scripts and content type specific scripts.
     */
    scripts?: string[];
    /**
     * A complete list of styles required to display the content.
     * Includes core scripts and content type specific styles.
     */
    styles?: string[];
    /**
     * The absolute URL to the current content. Used when generating
     * xAPI ids. (Becomes the attribute statement.object.id of the xAPI
     * statement. If it is a content with subcontents, the subContentId
     * will be appended like this: URL?subContentId=XXX)
     */
    url?: string;
  }

  /**
   * The integration object is used to pass information to the H5P JavaScript
   * client running in the browser about certain settings and values of the
   * server.
   */
  interface IIntegration {
    ajax: {
      /**
       * The Ajax endpoint called when the user state has changed
       * Example: /h5p-ajax/content-user-data/:contentId/:dataType/:subContentId?token=XYZ
       * You can use these placeholders:
       * :contentId (can be null for editor)
       * :dataType (values: state or any string)
       * :subContentId (seems to obsolete, always 0)
       * The H5P client will replace them with the actual values.
       */
      contentUserData: string;
      /**
       * An Ajax endpoint called when the user has finished the content.
       * Example: /h5p-ajax/set-finished.json?token=XYZ
       * Only called when postUserStatistics is set to true.
       */
      setFinished: string;
    };
    ajaxPath: string;
    /**
     * The base URL, e.g. https://example.org
     */
    baseUrl?: string;
    /**
     * The key must be of the form "cid-XXX", where XXX is the id of the content
     */
    contents?: {
      [key: `cid-${number | string}`]: IContentData;
    };
    /**
     * The files in this list are references when creating iframes.
     */
    core?: {
      /**
       * A list of JavaScript files that make up the H5P core
       */
      scripts?: string[];
      /**
       * A list of CSS styles that make up the H5P core.
       */
      styles?: string[];
    };
    /**
     * Can be null.
     */
    crossorigin?: any;
    /**
     * Can be null.
     */
    crossoriginCacheBuster?: any;
    /**
     * We pass certain configuration values to the client with the editor
     * integration object. Note that the way to pass these values to the client
     * is NOT standardized and in the PHP implementation it is not the same in
     * the Drupal, Moodle and WordPress clients. For our NodeJS version
     * we've decided to put the values into the integration object. The page
     * created by the editor renderer has to extract these values and put
     * them into the corresponding properties of the H5PEditor object!
     * See /src/renderers/default.ts how this can be done!
     */
    editor?: IEditorIntegration;
    fullscreenDisabled?: 0 | 1;
    hubIsEnabled: boolean;
    /**
     * The localization strings. The namespace can for example be 'H5P'.
     */
    l10n: {
      [namespace: string]: any;
    };
    /**
     * Can be null. The server can customize library behavior by setting the
     * library config for certain machine names, as the H5P client allows it to
     * be called by executing H5P.getLibraryConfig(machineName). This means that
     * libraries can retrieve configuration values from the server that way.
     */
    libraryConfig?: {
      [machineName: string]: any;
    };
    /**
     * The URL at which the core **JavaScript** files are stored.
     */
    libraryUrl?: string;
    /**
     * The cache buster appended to JavaScript and CSS files.
     * Example: ?q8idru
     */
    pluginCacheBuster?: string;
    /**
     * If set the URL specified in ajax.setFinished is called when the user is
     * finished with a content object.
     */
    postUserStatistics: boolean;
    reportingIsEnabled?: boolean;
    /*
     * How often the user state of content is saved (in seconds). Set to false
     * to disable saving user state. Note that the user state is only saved if
     * the user object is passed into the render method of the player. You also
     * must set ajax.contentUserData for state saving to work.
     */
    saveFreq: number | boolean;
    /**
     * Used when generating xAPI statements.
     */
    siteUrl?: string;
    /**
     * The URL at which files can be accessed. Combined with the baseUrl by the
     * client.
     * Example. /h5p
     */
    url: string;
    /**
     * Used to override the auto-generated library URL (libraries means "content
     * types" here). If this is unset, the H5P client will assume '/libraries'.
     * Note that the URL is NOT appended to the url or baseUrl property!
     */
    urlLibraries?: string;
    user: {
      /**
       * Usage unknown.
       */
      canToggleViewOthersH5PContents?: 0 | 1;
      id?: any;
      mail: string;
      name: string;
    };
    Hub?: {
      contentSearchUrl: string;
    };
  }

  /**
   * This is the H5P standard editor integration interface.
   */
  interface IEditorIntegration {
    ajaxPath: string;
    apiVersion: { majorVersion: number; minorVersion: number };
    assets: {
      css: string[];
      js: string[];
    };
    basePath?: string;
    copyrightSemantics?: any;
    enableContentHub?: boolean;
    /**
     * This is a reference ot a generic binary file icon used in some content
     * types.
     */
    fileIcon?: {
      height: number;
      path: string;
      width: number;
    };
    /**
     * The path at which **temporary** files can be retrieved from.
     */
    filesPath: string;
    hub?: {
      contentSearchUrl: string;
    };
    language?: string;
    libraryUrl: string;
    metadataSemantics?: any;
    nodeVersionId: string;
    wysiwygButtons?: string[];
  }

  /**
   * This describes the Path of JavaScript and CSS files in a library.json file.
   * This single property interface exists because the library.json file expects
   * this format.
   */
  interface IPath {
    path: string;
  }

  interface IH5PInstance extends IContentType {
    contentId: string | number;
    subContentId?: string;
    contentData?: {
      metadata: ILicenseData;
      standalone: boolean;
    };
    params: any;
    parent?: any;
    getCurrentState?: () => any;
    $: JQuery;
    libraryInfo:
      | {
          versionedName: string;
          versionedNameNoSpaces: string;
          machineName: string;
          majorVersion: string;
          minorVersion: string;
        }
      | any;
  }
}

declare var H5PIntegration: H5P.IIntegration;
