'use strict';
var itds = itds || {};
itds.accordion = (function() {
  let accordions, opts = {
    animationSpeed: 'fast',
    animationTimingFunction: 'ease-in-out',
    closeOtherElementsOnOpen: true,
    closeAllOtherElementsOnOpen: false,
    elementsOpenOnLoad: false,
    openById: false,
    openFirstElement: true,
    openFirstElementPerAccordion: true,
    scrollOffset: 200,
    scrollToAccordion: false,
    accordionSelector: ".accordion",
    accordionToggleSelector: ".accordion-toggle",
    accordionContentSelector: ".accordion-content",
    openClass: "active",
    closedClass: "collapsed",
    openByDefaultClass: "default",
    generateStyles: true,
    anchorTogglePrefix: "toggle-"
  };

  function autoInit() {
    delete itds.accordion.autoInit;
    setTimeout(() => itds && itds.accordion && itds.accordion.init && itds.accordion.init());
  }

  function init(options = {}) {
    delete itds.accordion.init;

    opts = {...opts, ...options};
    opts.animationSpeed = opts.animationSpeed === "fast" ? 250 : opts.animationSpeed === "medium" ? 350 : opts.animationSpeed === "slow" ? 500 : 250;
    if (opts.closeAllOtherElementsOnOpen && !opts.closeOtherElementsOnOpen) opts.closeOtherElementsOnOpen = true;
    if (opts.closeOtherElementsOnOpen && opts.elementsOpenOnLoad) opts.closeOtherElementsOnOpen = false;
    if (!opts.openFirstElement) opts.openFirstElementPerAccordion = false;

    accordions = document.querySelectorAll(opts.accordionSelector);
    if(!accordions.length) return;

    accordions.forEach((e, ei) => {
      let toggles = e.querySelectorAll(opts.accordionToggleSelector);

      toggles.length && toggles.forEach((toggle, i) => {
        toggle.addEventListener("click", onAccordionClicked);
        toggle.parentAccordion = e;

        if ((i === 0 && !opts.elementsOpenOnLoad && opts.openFirstElementPerAccordion)
          || (i === 0 && ei === 0 && !opts.elementsOpenOnLoad && opts.openFirstElement)
          || opts.elementsOpenOnLoad
          || toggle.classList.contains(opts.openByDefaultClass)) {
          toggle.classList.add(opts.openClass);
        } else {
          toggle.nextElementSibling.style.maxHeight = "0px";
          toggle.classList.add(opts.closedClass);
        }
      });

      if (!opts.elementsOpenOnLoad && opts.openById) {
        toggles.length && toggles.forEach(toggle => {
          if ((toggle.dataset.id || toggle.id) === window.location.hash.substr(opts.anchorTogglePrefix.length + 1)){
            toggle.click();
            scrollToToggle(toggle, opts);
          }
        });
      }
    });

    if (opts.generateStyles) {
      let styles = [
        {
          selector: "html",
          value: "scroll-behavior: smooth"
        },
        {
          selector: `${opts.accordionSelector} ${opts.accordionToggleSelector}`,
          value: "cursor: pointer"
        },
        {
          selector: `${opts.accordionSelector} ${opts.accordionToggleSelector}`,
          value: opts.scrollOffset === "center" ? "scroll-margin: 40vh" : `scroll-margin: ${opts.scrollOffset}px`
        },
        {
          selector: `${opts.accordionSelector} ${opts.accordionToggleSelector} + ${opts.accordionContentSelector}:not(.measurement)`,
          value: `transition: max-height ${opts.animationSpeed}ms ${opts.animationTimingFunction}, padding ${opts.animationSpeed}ms ${opts.animationTimingFunction}; overflow: hidden`
        },
        {
          selector: `${opts.accordionSelector} ${opts.accordionToggleSelector}.${opts.closedClass} + ${opts.accordionContentSelector}:not(.measurement)`,
          value: "padding-top: 0; padding-bottom: 0;"
        }
      ];

      try {
        let css = new CSSStyleSheet()
        styles.forEach(s => css.addRule(s.selector, s.value));
        document.adoptedStyleSheets = [...document.adoptedStyleSheets, css];
      } catch (e) {
        let css = document.createElement("style");
        styles.forEach(s => css.innerHTML+=`${s.selector} {${s.value}}\n`);
        document.head.append(css);
      }
    }

    let handleResize = debounce(onResize, 100);
    window.addEventListener("resize", handleResize);
    onResize();
  }

  function onAccordionClicked(ev) {
    let toggle = ev.currentTarget;
    if (!(toggle && toggle.parentAccordion)) return;

    if (opts.closeOtherElementsOnOpen) {
      let currentTarget = (opts.closeAllOtherElementsOnOpen ? document : toggle.parentAccordion).querySelector(`${opts.accordionToggleSelector}.${opts.openClass}`)
      currentTarget !== toggle && onAccordionClicked({currentTarget});
    }

    if (!toggle.classList.toggle(opts.openClass)){
      toggle.classList.add(opts.closedClass);
      toggle.nextElementSibling.style.maxHeight = "0px";
    } else if (!toggle.classList.toggle(opts.closedClass)) {
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
      toggles.length && toggles.forEach((toggle, i) => {
        let toggleContent = toggle.nextElementSibling, initialHeight = toggleContent.style.maxHeight, newHeight;
        toggleContent.classList.toggle("measurement");
        toggleContent.style.maxHeight = "";
        newHeight = `${toggleContent.getBoundingClientRect().height+30}px`;
        toggleContent.originalHeight = newHeight;
        toggleContent.style.maxHeight = initialHeight === "0px" ? "0px" : newHeight ;
        toggleContent.classList.toggle("measurement");
      });
    })
  }

  return {autoInit, init};
})();

(function() {
  itds.accordion.autoInit();
})();
