# Accordion
Simple Accordion

## Dependencies
none


## How to include

```js
//= require module/accordion/2.1.2/module.js
```

## How to use

### HTML
```html
<div class="accordion">
  <h4 class="accordion-toggle">Accordion 1</h4>
  <div class="accordion-content default">
    <p>Cras malesuada ultrices augue molestie risus.</p>
  </div>
  <h4 class="accordion-toggle">Accordion 2</h4>
  <div class="accordion-content">
    <p>Lorem ipsum dolor sit amet mauris eu turpis.</p>
  </div>
  <h4 class="accordion-toggle">Accordion 3</h4>
  <div class="accordion-content">
    <p>Vivamus facilisisnibh scelerisque laoreet.</p>
  </div>
</div>
```

### WebAdministrator HTML template: accordion-item.html
```html
<h3 class="accordion-toggle" id="NC_TITLE_##PCID##" data-id="">Erweiterbarer Inhalt</h3>
<div class="accordion-content" id="NC_CONTENT_##PCID##">
    <p>Lorem ipsum dolor sit amet mauris eu turpis.</p>
</div>
```

### WebAdministrator WAXMLNT template: accordion-item.waxmlnt
```xml
<newstmpl>
  <dispcfg>
    <title>TITLE</title>
  </dispcfg>
  <requiredParent>accordion.waxmlnt#ACCORDION</requiredParent>
  <entries>
    <entry>
      <id>TITLE</id>
      <name>Titel</name>
      <type>textfield</type>
    </entry>
    <entry>
      <id>CONTENT</id>
      <name>Inhalt</name>
      <type>htmlarea</type>
    </entry>
    <entry>
      <id>TITLE@data-id</id>
      <name>Anker (optional)</name>
      <type>textfield</type>
    </entry>
    <entry>
      <id>TITLE@class</id>
      <name>Standardmässig geöffnet</name>
      <type>select</type>
      <options>
        <option value="accordion-toggle">Nein</option>
        <option value="accordion-toggle default">Ja</option>
      </options>
    </entry>
  </entries>
</newstmpl>
```

### WebAdministrator HTML template: accordion.html
```html
<div class="accordion" id="NC_ACCORDION_##PCID##" data-title="Accordion"></div>
```

### WebAdministrator WAXMLNT template: accordion.waxmlnt
```xml
<newstmpl>
  <dispcfg>
    <title>ACCORDION@data-title</title>
  </dispcfg>
  <entries>
    <entry>
      <id>ACCORDION@data-title</id>
      <name>Titel</name>
      <type>textfield</type>
    </entry>
    <entry>
      <id>ACCORDION</id>
      <name>Elemente</name>
      <type>subcontents</type>
      <allowedChild>accordion-item.waxmlnt</allowedChild>
    </entry>
  </entries>
</newstmpl>
```

### Initialization

Initializates itself automatically when included but can be initialized manually with custom options as following:

```javascript
itds.accordion.init(someCustomOptions);
```

#### Options
* `animationSpeed`: string/number ('fast') A string or number (in ms) determining how long the animation will run, available speeds are: fast|medium|slow
* `closeOtherElementsOnOpen`: boolean (true) If false, other accordion elements will stay open when toggling an accordion element
* `elementsOpenOnLoad`: boolean (false) If true, all accordion elements will be open when the page is loaded. Notice `closeOtherElementsOnOpen` gets disabled when active.
* `openById`: boolean (false) If true, the URLs hash will be read and the accordion whose toggle matches the ID will be opened on initialization
* `openFirstElement`: boolean (true) If false, the first accordion element will not be kept open when all others are closed on page load. Only works with elementsOpenOnLoad set to false
* `scrollOffset`: string/number (200) Number of pixels to add when scrolling. Can be used to counter fixed header heights. Can be set to "center" if the toggle should be centered on scroll. Only works with `scrollToAccordion` or `openById` set to true
* `scrollToAccordion`: boolean (true) If false, the view will not scroll to an accordion element when it is opened
* `accordionSelector`: string (".accordion") The main selector
* `accordionToggleSelector`: string (".accordion-toggle") The selector for the title-element
* `accordionContentSelector`: string (".accordion-content") The selector fot the content-lement
* `openClass`: string ("open") This class will be appended to the Toggle when opened
* `closedClass`: string ("collapsed") This class will be appended to the Toggle when closed
* `openByDefaultClass`: string ("default") Toggles using this class will be open on init
* `generateStyles`: boolean (true) Append some default stylings. This is essential for the scroll-behaviour and animations 
* `anchorTogglePrefix`: string ("toggle-") Set the prefix of the anchor for the toggles when using `openById`. This is required, otherwise the scroll-behaviour will not work properly


## Projects using the module
* 2018.kirche-wichtrach.ch

# Release Notes
## 2.1.2
* Removed jQuery
* Added possibility to configure classnames
* Init function can be called multiple times
* Default stylings are applied in JS, no CSS file required
* `openById` can work properly in a WA environment using a data-id tag instead of the actual ID
* Scrolloffset can be set to "center". When `scrollToAccordion` is enabled, the toggle will be in the middle of the screen
* Added HTML and WAXMLNT file-templates for WA in the README
## 2.1.0
Add ability to have an accordion open by ID on initialization
## 2.0.0
Added ability to set options on initialization: animationSpeed, closeOtherElementsOnOpen, elementsOpenOnLoad, openFirstElement
## 1.0.0
Initial Release
