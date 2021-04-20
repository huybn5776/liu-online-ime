import React, {
  CSSProperties,
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import * as R from 'ramda';
import { fromEvent, merge, Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { Point } from '../../interfaces/point';
import styles from './CaretPosition.module.scss';

const propertiesToCopy: (keyof CSSStyleDeclaration)[] = [
  'boxSizing',
  'width',
  'height',
  'overflowX',
  'overflowY',

  'borderTopWidth',
  'borderRightWidth',
  'borderBottomWidth',
  'borderLeftWidth',

  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',

  'fontStyle',
  'fontVariant',
  'fontWeight',
  'fontStretch',
  'fontSize',
  'lineHeight',
  'fontFamily',

  'textAlign',
  'textTransform',
  'textIndent',
  'textDecoration',

  'letterSpacing',
  'wordSpacing',
];

interface Props {
  textArea: HTMLTextAreaElement | null;
  passive?: boolean;
  onPositionChange?: (position: Point) => void;
}

interface ForwardedProps {
  getPosition: () => Point;
}

const CaretPosition: React.ForwardRefRenderFunction<ForwardedProps, Props> = (
  { textArea, onPositionChange, passive }: Props,
  ref: ForwardedRef<ForwardedProps>,
) => {
  const [mirrorStyle, setMirrorStyle] = useState<CSSProperties>({});

  const mirrorDiv = useRef<HTMLDivElement>(null);
  const trackerSpan = useRef<HTMLSpanElement>(null);

  useImperativeHandle(ref, () => ({
    getPosition: () => getCaretPosition(textArea),
  }));

  useEffect(() => {
    if (!textArea) {
      return () => {};
    }

    let subscription: Subscription | null = null;
    if (!passive) {
      subscription = merge(...['focus', 'click', 'keyup'].map((eventName) => fromEvent<Event>(textArea, eventName)))
        .pipe(distinctUntilChanged(R.equals, (event) => (event.target as HTMLTextAreaElement).selectionEnd))
        .subscribe(onSelectionChange);
      onSelectionChange();
    }

    return () => subscription?.unsubscribe();

    function onSelectionChange(): void {
      const position = getCaretPosition(textArea);
      onPositionChange?.(position);
    }
  }, [textArea, passive, onPositionChange]);

  useEffect(() => {
    const computedStyle = (textArea && getComputedStyle(textArea)) || {};
    const style = R.pick(propertiesToCopy, computedStyle) as CSSProperties;
    setMirrorStyle(style);
  }, [textArea]);

  return (
    <div className={styles.CaretPosition} ref={mirrorDiv} style={mirrorStyle}>
      <span ref={trackerSpan}>.</span>
    </div>
  );

  function getCaretPosition(textAreaElement: HTMLTextAreaElement | null): Point {
    const { mirrorElement, trackerElement } = {
      mirrorElement: mirrorDiv.current,
      trackerElement: trackerSpan.current,
    };
    if (!mirrorElement || !trackerElement || !textAreaElement) {
      return { x: 0, y: 0 };
    }

    const { value, selectionEnd } = textAreaElement;
    mirrorElement.innerText = value.substring(0, selectionEnd);
    mirrorElement.appendChild(trackerElement);

    return {
      x: trackerElement.offsetLeft,
      y: trackerElement.offsetTop + trackerElement.offsetHeight,
    };
  }
};

export default forwardRef(CaretPosition);
