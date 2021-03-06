import React, { ForwardedRef, forwardRef, ReactNode, useImperativeHandle, useRef, useState } from 'react';

import CaretPosition from '@components/CaretPosition/CaretPosition';
import { Point } from '@interfaces/point';

import styles from './CaretFollowWrapper.module.scss';

interface Props {
  textArea: HTMLTextAreaElement | null;
  children: ReactNode;
  passive?: boolean;
}

interface ForwardedProps {
  updatePosition: () => void;
}

const CaretFollowWrapper: React.ForwardRefRenderFunction<ForwardedProps, Props> = (
  { textArea, children, passive }: Props,
  ref: ForwardedRef<ForwardedProps>,
) => {
  const [caretPosition, setCaretPosition] = useState<Point>({ x: 0, y: 0 });

  const caretPositionComponent = useRef<React.ElementRef<typeof CaretPosition>>(null);

  useImperativeHandle(ref, () => ({
    updatePosition: () => {
      const position = caretPositionComponent.current?.getPosition();
      setCaretPosition(position || { x: 0, y: 0 });
    },
  }));

  return (
    <>
      <CaretPosition
        ref={caretPositionComponent}
        textArea={textArea}
        passive={passive}
        onPositionChange={setCaretPosition}
      />
      <div
        className={styles.caretFollowContainer}
        style={{ left: `${caretPosition.x}px`, top: `${caretPosition.y}px` }}
      >
        {children}
      </div>
    </>
  );
};

export default forwardRef(CaretFollowWrapper);
