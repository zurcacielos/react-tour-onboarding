import React, { useState, useReducer, useEffect, useRef, memo } from 'react'
import cn from 'classnames'
import scrollSmooth from 'scroll-smooth'
import Scrollparent from 'scrollparent'
import debounce from 'lodash.debounce'
import useMutationObserver from '@rooks/use-mutation-observer'
import FocusLock from 'react-focus-lock'
import { GlobalStyle } from './style'
import Portal from './Portal'
import {
  SvgMask,
  Guide,
  Badge,
  Controls,
  Arrow,
  Navigation,
  Dot,
} from './components/index'
import { getNodeRect, getWindow, inView, isBody } from './helpers'
import { propTypes, defaultProps } from './propTypes'
import CN from './classNames'

/**
 * if fn is a function runs it with , if not returns a void function
 * @param fn
 * @returns {Function|(function(...[*]): *)}
 */
function checkFnAndRun(fn = null) {
  if (fn && typeof fn === 'function') {
    return function(...args) {
      return fn(...args)
    }
  }

  return function() {} // to do nothing with the second parameters
}

function DefaultCallout({
  current,
  prevStep,
  nextStep,
  stepContent,
  children,
  steps,
  showNumber,
  showButtons,
  showNavigation,
  prevButton,
  showNavigationNumber,
  disableDotsNavigation,
  lastStepNextButton,
  nextButton,
}) {

  console.log('DefaultCallout.nextStep', nextStep)

  function nextArrowClick() {
    if (lastStepNextButton && close) {
      // TODO verify v1 doingnothing
    } else if (typeof nextStep === 'function') {
      nextStep()
    }
  }

  return (
    <>
      {children}
      {stepContent}
      {showNumber && (
        <Badge data-tour-elem="badge">
          {typeof badgeContent === 'function'
            ? badgeContent(current + 1, steps.length)
            : current + 1}
        </Badge>
      )}

      {(showButtons || showNavigation) && (
        <Controls data-tour-elem="controls">
          {showButtons && (
            <Arrow
              onClick={prevStep}
              disabled={current === 0}
              label={prevButton ? prevButton : null}
            />
          )}

          {showNavigation && (
            <Navigation data-tour-elem="navigation">
              {steps.maps &&
                steps.map((s, i) => (
                  <Dot
                    key={`${s.selector ? s.selector : 'undef'}_${i}`}
                    onClick={() => goToStep(i)}
                    current={current}
                    index={i}
                    disabled={current === i || disableDotsNavigation}
                    showNumber={showNavigationNumber}
                    data-tour-elem="dot"
                    className={cn(CN.dot.base, {
                      [CN.dot.active]: current === i,
                    })}
                  />
                ))}
            </Navigation>
          )}

          {showButtons && (
            <Arrow
              onClick={nextArrowClick}
              disabled={!lastStepNextButton && current === steps.length - 1}
              inverted
              label={
                lastStepNextButton && current === steps.length - 1
                  ? lastStepNextButton
                  : nextButton
                  ? nextButton
                  : null
              }
            />
          )}
        </Controls>
      )}
    </>
  )
}

export default memo(DefaultCallout)
