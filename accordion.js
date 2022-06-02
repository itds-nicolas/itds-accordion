'use strict';
var itds = itds || {};
itds.accordion = (function() {
  let accordions, opts = {
    animationSpeed: 'fast',
    closeOtherElementsOnOpen: true,
    elementsOpenOnLoad: false,
    openById: false,
    openFirstElement: true,
    scrollOffset: 200,
    scrollToAccordion: false,
    accordionSelector: ".accordion",
    accordionToggleSelector: ".accordion-toggle",
    accordionContentSelector: ".accordion-content",
    openClass: "open",
    closedClass: "collapsed",
    openByDefaultClass: "default",
    generateStyles: true,
    anchorTogglePrefix: "toggle-"
  };

  function autoInit() {
    delete itds.accordion.autoInit;
    setTimeout(() => !!itds.accordion.init && init(), 0);
  }

  function init(options = {}) {
    accordions = document.querySelectorAll(opts.accordionSelector);
    if(!accordions.length) return;

    opts = {...opts, ...options};
    opts.animationSpeed = opts.animationSpeed === "fast" ? 250 : opts.animationSpeed === "medium" ? 350 : opts.animationSpeed === "slow" ? 500 : 250;
    if (opts.closeOtherElementsOnOpen && opts.elementsOpenOnLoad) opts.closeOtherElementsOnOpen = false

    accordions?.forEach(e => {
      let toggles = e.querySelectorAll(opts.accordionToggleSelector);

      toggles?.forEach((toggle, i) => {
        toggle.addEventListener("click", onAccordionClicked);
        toggle.parentAccordion = e;

        toggle.nextElementSibling.originalHeight = toggle.nextElementSibling.getBoundingClientRect().height + "px";
        if ((i === 0 && !opts.elementsOpenOnLoad && opts.openFirstElement) || opts.elementsOpenOnLoad || toggle.classList.contains(opts.openByDefaultClass)) {
          toggle.nextElementSibling.style.maxHeight = toggle.nextElementSibling.originalHeight;
          toggle.classList.add(opts.openClass);
        } else {
          toggle.nextElementSibling.style.maxHeight = "0px";
          toggle.classList.add(opts.closedClass);
        }
      });

      if (!opts.elementsOpenOnLoad && opts.openById) {
        toggles?.forEach(toggle => {
          if ((toggle.dataset.id || toggle.id) === window.location.hash.substr(opts.anchorTogglePrefix.length + 1)){
            toggle.click();
            scrollToToggle(toggle, opts);
          }
        });
      }
    });

    if (opts.generateStyles) {
      let css = new CSSStyleSheet()
      css.addRule("html", "scroll-behavior: smooth");
      css.addRule(`${opts.accordionSelector} ${opts.accordionToggleSelector}`, "cursor: pointer");
      css.addRule(`${opts.accordionSelector} ${opts.accordionToggleSelector}`, opts.scrollOffset === "center" ? "scroll-margin: 40vh" : `scroll-margin: ${opts.scrollOffset}px`);
      css.addRule(`${opts.accordionSelector} ${opts.accordionToggleSelector} + ${opts.accordionContentSelector}`, "overflow: hidden");
      css.addRule(`${opts.accordionSelector} ${opts.accordionToggleSelector} + ${opts.accordionContentSelector}`, `transition: max-height ${opts.animationSpeed}ms ease-in-out, padding ${opts.animationSpeed}ms ease-in-out`);
      css.addRule(`${opts.accordionSelector} ${opts.accordionToggleSelector}.${opts.closedClass} + ${opts.accordionContentSelector}`, "padding-top: 0; padding-bottom: 0;");
      document.adoptedStyleSheets = [...document.adoptedStyleSheets, css];
    }

    let handleResize = debounce(onResize, 50);
    window.addEventListener("resize", handleResize);
  }


  function onAccordionClicked(ev) {
    let toggle = ev.currentTarget;
    if (!toggle) return;

    if (opts.closeOtherElementsOnOpen) {
      let currentTarget = toggle.parentAccordion.querySelector(opts.accordionToggleSelector + "." + opts.openClass)
      currentTarget !== toggle && onAccordionClicked({currentTarget});
    }

    if (toggle.classList.contains(opts.openClass)){
      toggle.classList.remove(opts.openClass);
      toggle.classList.add(opts.closedClass);
      toggle.nextElementSibling.style.maxHeight = "0px";
    } else if (toggle.classList.contains(opts.closedClass)) {
      toggle.classList.remove(opts.closedClass);
      toggle.classList.add(opts.openClass);
      toggle.nextElementSibling.style.maxHeight = toggle.nextElementSibling.originalHeight;

      if (opts.scrollToAccordion && !opts.openById) {
        scrollToToggle(toggle, opts);
      }

      if (opts.openById && !!(toggle.dataset.id || toggle.id)) {
        window.location.hash = `#${opts.anchorTogglePrefix}${(toggle.dataset.id || toggle.id)}`;
        scrollToToggle(toggle, opts);
      }
    }

  }

  function scrollToToggle(toggle, opts) {
    setTimeout((toggle, opts) => toggle.scrollIntoView(opts.scrollOffset !== "center" ? {  behavior: 'smooth' } : {  block: 'center', behavior: 'smooth' }), opts.closeOtherElementsOnOpen ? opts.animationSpeed : 0, toggle, opts);
  }

  function debounce(func, wait, immediate) {
    var timeout;

    return () => {
      var context = this, args = arguments, callNow = immediate && !timeout;

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        timeout = null;
        !immediate && func.apply(context, args);
      }, wait);
      callNow && func.apply(context, args);
    }
  }

  function onResize(e) {
    accordions.forEach(e => {
      let toggles = e.querySelectorAll(opts.accordionToggleSelector);
      toggles?.forEach((toggle, i) => {
        let toggleContent = toggle.nextElementSibling, initialHeight = toggleContent.style.maxHeight, newHeight;

        toggleContent.style.maxHeight = "";
        newHeight = toggleContent.getBoundingClientRect().height + "px";
        toggleContent.originalHeight = newHeight;
        toggleContent.style.maxHeight = initialHeight === "0px" ? "0px" : newHeight ;
      });
    })
  }

  return {
    autoInit,
    init,
  };
})();

(function() {
  itds.accordion.autoInit();
})();
