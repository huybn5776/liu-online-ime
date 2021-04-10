import React, { ForwardedRef, forwardRef, ReactNode, useImperativeHandle, useRef, useState } from 'react';

import { Point } from '../../interfaces/point';
import CaretPosition from '../CaretPosition/CaretPosition';
import './CaretFollowWrapper.scss';

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
      <CaretPosition ref={caretPositionComponent} textArea={textArea} passive={passive} onPositionChange={setCaretPosition} />
      <div
        className="caret-follow-container"
        style={{ left: `${caretPosition.x}px`, top: `${caretPosition.y}px`}}
      >
        {children}
      </div>
    </>
  );
};

export default forwardRef(CaretFollowWrapper);
